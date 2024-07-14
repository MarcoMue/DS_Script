/*
 * Script Name: Find Frontline Villages
 * Version: v1.1.3
 * Last Updated: 2023-10-25
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: N/A
 * Approved Date: 2021-09-20
 * Mod: JawJaw
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'findFrontlineVillages',
        name: 'Find Frontline Villages',
        version: 'v1.1.3',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/find-frontline-villages.287751/',
    },
    translations: {
        en_DK: {
            'Find Frontline Villages': 'Find Frontline Villages',
            Help: 'Help',
            'Redirecting...': 'Redirecting...',
            'There was an error!': 'There was an error!',
            Radius: 'Radius',
            Player: 'Player',
            Tribe: 'Tribe',
            'Excluded Players': 'Excluded Players',
            'Start typing and suggestions will show ...':
                'Start typing and suggestions will show ...',
            'You must select at least one player or one tribe!':
                'You must select at least one player or one tribe!',
            'You have no frontline villages!':
                'You have no frontline villages!',
            Coordinates: 'Coordinates',
            'Import to Group': 'Import to Group',
            'Add to Group': 'Add to Group',
            'Choose Group': 'Choose Group',
            'Travel Times': 'Travel Times',
            'No groups found!': 'No groups found!',
            'This functionality requires Premium Account!':
                'This functionality requires Premium Account!',
            Automatic: 'Automatic',
            Manually: 'Manually',
            'Input Coordinates': 'Input Coordinates',
            'Coordinates Input': 'Coordinates Input',
        },
    },
    allowedMarkets: [],
    allowedScreens: ['map'],
    allowedModes: [],
    isDebug: DEBUG,
    enableCountApi: true,
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Initialize Library
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const { isPA } = twSDK.getGameFeatures();

        // Fetch world data
        const { villages, players, tribes } = await fetchWorldData();

        // Entry Point
        if (isValidScreen) {
            initMain();
        } else {
            UI.InfoMessage(twSDK.tt('Redirecting...'));
            twSDK.redirectTo('map');
        }

        // Initialize main script logic
        async function initMain() {
            try {
                // render UI
                buildUI();

                // register action handlers
                handleFindFrontlineVillages();
                handleImportToGroup();
                handleTravelTimes();

                // register event handlers
                onChangeCoordinatesFillMethod();
                onBlurInputCoordinatesField();
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
            }
        }

        // Action Handler: Here is where all the magic stuff happens
        function handleFindFrontlineVillages() {
            jQuery('#raFindFrontlineVillagesBtn').on('click', function (e) {
                e.preventDefault();

                const {
                    playersInput,
                    tribesInput,
                    excludedPlayersInput,
                    radius,
                    coordinatesInputMethod,
                    inputCoordinates,
                } = collectUserInput();

                let coordinatesArray = '';

                if (coordinatesInputMethod === 'automatic') {
                    const chosenPlayers = playersInput.split(',');
                    const chosenTribes = tribesInput.split(',');
                    const chosenExcludedPlayers =
                        excludedPlayersInput.split(',');

                    const chosenPlayerIds = twSDK.getEntityIdsByArrayIndex(
                        chosenPlayers,
                        players,
                        1
                    );
                    const chosenTribeIds = twSDK.getEntityIdsByArrayIndex(
                        chosenTribes,
                        tribes,
                        2
                    );

                    const tribePlayers = getTribeMembersById(chosenTribeIds);

                    const mergedPlayersList = [
                        ...tribePlayers,
                        ...chosenPlayerIds,
                    ];
                    let uniquePlayersList = [...new Set(mergedPlayersList)];

                    const excludedPlayersIds = twSDK.getEntityIdsByArrayIndex(
                        chosenExcludedPlayers,
                        players,
                        1
                    );
                    excludedPlayersIds.forEach((item) => {
                        uniquePlayersList = uniquePlayersList.filter(
                            (player) => player !== item
                        );
                    });

                    // coordinates of villages based on user input
                    coordinatesArray =
                        filterVillagesByPlayerIds(uniquePlayersList);
                } else {
                    coordinatesArray = inputCoordinates.split(' ');
                }

                // own villages coordinates
                const playerId = parseInt(game_data.player.id);
                const ownVillagesCoordinates = filterVillagesByPlayerIds([
                    playerId,
                ]);

                // find the frontline villages
                const frontlineVillages = [];
                coordinatesArray.forEach((enemyVillage) => {
                    ownVillagesCoordinates.forEach((ownVillage) => {
                        const distance = twSDK.calculateDistance(
                            enemyVillage,
                            ownVillage
                        );
                        if (distance <= radius) {
                            frontlineVillages.push(ownVillage);
                        }
                    });
                });

                const uniqueFrontlineVillages = [...new Set(frontlineVillages)];

                if (uniqueFrontlineVillages.length) {
                    jQuery('#raCoordinatesBox').show();
                    jQuery('#raCoordinatesFrontlineVillages').val(
                        uniqueFrontlineVillages.join(' ')
                    );
                    jQuery('#raCoordinatesCount').text(
                        uniqueFrontlineVillages.length
                    );
                    jQuery('#raImportGroupBtn').show();
                } else {
                    UI.ErrorMessage(
                        twSDK.tt('You have no frontline villages!')
                    );
                    jQuery('#raCoordinatesBox').hide();
                    jQuery('#raCoordinatesFrontlineVillages').val('');
                    jQuery('#raCoordinatesCount').text('');
                    jQuery('#raImportGroupBtn').hide();
                }
            });
        }

        // Action Handler: Import frontline villages to group
        function handleImportToGroup() {
            jQuery('#raImportGroupBtn').on('click', async function (e) {
                e.preventDefault();

                // check that Premium Account is active
                if (!isPA) {
                    UI.ErrorMessage(
                        twSDK.tt('This functionality requires Premium Account!')
                    );
                    return;
                }

                const frontlineVillages = jQuery(
                    '#raCoordinatesFrontlineVillages'
                ).val();
                const frontlineVillagesData = villages.filter((village) => {
                    return frontlineVillages.includes(
                        village[2] + '|' + village[3]
                    );
                });

                const frontlineVillagesRows = buildFrontlineVillagesTableRows(
                    frontlineVillagesData
                );
                const groupSelectOptions = await buildGroupSelectOptions();

                let groupSelect = ``;
                if (groupSelectOptions.length) {
                    groupSelect = `
                        <label for="raSelectedGroup">
                            ${twSDK.tt('Choose Group')}
                        </label>
                        <select id="raSelectedGroup" name="selected_group" class="ra-input">
                            ${groupSelectOptions}
                        </select>
                    `;
                } else {
                    groupSelect = `<b>${twSDK.tt('No groups found!')}</b>`;
                }

                const btnStatus =
                    groupSelectOptions.length === 0 ? 'disabled' : '';

                const dialogContent = `
                    <div class="ra-popup-content">
                        <form action="/game.php?screen=overview_villages&action=bulk_edit_villages&mode=groups&type=static&partial" method="post">
                            <div class="ra-mb15">
                                ${groupSelect}
                            </div>
                            <div class="ra-mb15 ra-mh-310">
                                <table class="ra-table" width="100%">
                                    <tbody>
                                        ${frontlineVillagesRows}
                                    </tbody>
                                </table>
                            </div>
                            <div class="ra-mb15">
                                <input class="btn" type="submit" name="add_to_group" value="${twSDK.tt(
                                    'Add to Group'
                                )}" ${btnStatus} />
                                <input type="hidden" name="h" value="${csrf_token}">
                            </div>
                        </form>
                    </div>
                `;

                twSDK.renderFixedWidget(
                    dialogContent,
                    'raFindFrontlineVillagesAddToGroup',
                    'ra-find-frontline-villages-add-to-group',
                    ``,
                    '480px'
                );
            });
        }

        // Action Handler: Show dialog with travel times table
        function handleTravelTimes() {
            jQuery('#raTravelTimesBtn').on('click', async function (e) {
                e.preventDefault();

                const { radius } = collectUserInput();

                // calculate travel times
                const travelTimes = [];
                for (let r = 1; r <= radius; r++) {
                    let times = await twSDK.calculateTimesByDistance(r);
                    times.pop(); // remove militia time
                    travelTimes.push(times);
                }

                // build table header
                let tableHead = ``;
                tableHead += `<th width="40px">#</th>`;
                game_data.units.forEach((unit) => {
                    if (unit !== 'militia') {
                        tableHead += `
						<th>
							<img src="/graphic/unit/unit_${unit}.png">
						</th>
					`;
                    }
                });

                // build table rows
                let tableRows = ``;
                travelTimes.forEach((times, index) => {
                    index++;
                    tableRows += `<tr>`;
                    tableRows += `<td width="40px"><b>${index}</b></td>`;
                    times.forEach((time) => {
                        tableRows += `<td>${time}</td>`;
                    });
                    tableRows += `</tr>`;
                });

                const dialogContent = `
                    <div class="ra-popup-content ra-mb15 ra-mh-310">
                        <table class="ra-table vis overview_table" width="100%">
                            <thead>
                                <tr>
                                    ${tableHead}
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                `;

                twSDK.renderFixedWidget(
                    dialogContent,
                    'raFindFrontlineVillagesPopup',
                    'ra-find-frontline-villages-popup',
                    ``,
                    '750px'
                );
            });
        }

        // Event Handler: Show or hide player/tribe choser
        function onChangeCoordinatesFillMethod() {
            jQuery('#raCoordinatesFillMethod').change(function () {
                if (this.value === 'automatic') {
                    jQuery('#raInputCoordinatesBox').hide();
                    jQuery('#raPlayers').prop('disabled', false);
                    jQuery('#raTribes').prop('disabled', false);
                    jQuery('#raExcludedPlayers').prop('disabled', false);
                } else {
                    jQuery('#raInputCoordinatesBox').show();
                    jQuery('#raPlayers').prop('disabled', true);
                    jQuery('#raTribes').prop('disabled', true);
                    jQuery('#raExcludedPlayers').prop('disabled', true);
                }
            });
        }

        // Event Handler: Clean coordinates field from incorrect user input
        function onBlurInputCoordinatesField() {
            jQuery('#raInputCoordinates').blur(function () {
                const coordinates = this.value.match(twSDK.coordsRegex);
                if (coordinates) {
                    this.value = coordinates.join(' ');
                    jQuery('#raInputCoordinatesCount').text(coordinates.length);
                } else {
                    this.value = '';
                    jQuery('#raInputCoordinatesCount').text(0);
                }
            });
        }

        // Render: Build user interface
        function buildUI() {
            const sortedPlayersByRanking = players.sort((a, b) => a[5] - b[5]);
            const sortedTribesByRanking = tribes.sort((a, b) => a[7] - b[7]);

            const playersDropdown = buildDropDown(
                sortedPlayersByRanking,
                'Players'
            );
            const tribesDropdown = buildDropDown(
                sortedTribesByRanking,
                'Tribes'
            );
            const excludedPlayersDropdown = buildDropDown(
                sortedPlayersByRanking,
                'ExcludedPlayers'
            );

            const contentBody = `
                <div class="ra-mb15">
                    <div class="ra-grid ra-mb15 ra-grid-4">
                        <fieldset class="ra-fieldset">
                            <legend>${twSDK.tt('Coordinates Input')}</legend>
                            <select id="raCoordinatesFillMethod">
                                <option value="automatic">${twSDK.tt(
                                    'Automatic'
                                )}</option>
                                <option value="manual">${twSDK.tt(
                                    'Manually'
                                )}</option>
                            </select>
                        </fieldset>
                        <fieldset class="ra-fieldset">
                            <legend>${twSDK.tt('Radius')}</legend>
                            <input class="ra-input" name="ra_radius" id="raRadius" type="text" value="5">
                        </fieldset>
                        <fieldset class="ra-fieldset">
                            <legend>${twSDK.tt('Player')}</legend>
                            ${playersDropdown}
                        </fieldset>
                        <fieldset class="ra-fieldset">
                            <legend>${twSDK.tt('Tribe')}</legend>
                            ${tribesDropdown}
                        </fieldset>
                        <fieldset class="ra-fieldset">
                            <legend>${twSDK.tt('Excluded Players')}</legend>
                            ${excludedPlayersDropdown}
                        </fieldset>
                    </div>
                </div>
                <div class="ra-mb15" id="raInputCoordinatesBox" style="display: none;">
                    <label for="raInputCoordinates">
                        ${twSDK.tt(
                            'Input Coordinates'
                        )} <span id="raInputCoordinatesCount"></span>
                    </label>
                    <textarea id="raInputCoordinates" class="ra-textarea"></textarea>
                </div>
                <div class="ra-mb15" id="raCoordinatesBox" style="display: none;">
                    <label for="raCoordinatesFrontlineVillages">
                        ${twSDK.tt(
                            'Coordinates'
                        )} <span id="raCoordinatesCount"></span>
                    </label>
                    <textarea id="raCoordinatesFrontlineVillages" class="ra-textarea"></textarea>
                </div>
                <div>
                    <a href="javascript:void(0);" class="btn btn-confirm-yes" id="raFindFrontlineVillagesBtn">
                        ${twSDK.tt('Find Frontline Villages')}
                    </a>
                    <a href="javascript:void(0);" class="btn" id="raTravelTimesBtn">
                        ${twSDK.tt('Travel Times')}
                    </a>
                    <a href="javascript:void(0);" style="display:none;" class="btn" id="raImportGroupBtn">
                        ${twSDK.tt('Import to Group')}
                    </a>
                </div>
            `;

            const customStyle = `
                .ra-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; grid-gap: 15px; }

                .ra-fieldset { border-color: #c1a264; border-width: 1px; }
                .ra-fieldset legend { font-weight: 600; padding: 0 10px; font-size: 13px; margin-bottom: 5px; }
                .ra-fieldset select { width: 100%; padding: 3px 5px; font-size: 14px; line-height: 1; }

                .ra-input { width: 100% !important; padding: 3px 5px; font-size: 14px; line-height: 1; text-align: left !important; }

                .ra-popup-content { width: 100% !important; }
                .ra-popup-content label { display: inline-block !important; }
                
                .ra-mh-310 { max-height: 310px; overflow-y: auto; overflow-x: hidden; }

                .ra-table { border-spacing: 2px !important; border-collapse: separate !important; width: 100% !important; font-size: 10px; }
                .ra-table tr:nth-of-type(2n) td { background-color: #f0e2be }
                .ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
            `;

            twSDK.renderBoxWidget(
                contentBody,
                'raFindFrontlineVillages',
                'ra-find-frontline-villages',
                customStyle
            );
        }

        // Helper: Build frontline villages table rows
        function buildFrontlineVillagesTableRows(villages) {
            let tableRows = ``;
            villages.forEach((village) => {
                const villageName = twSDK.cleanString(village[1]);
                tableRows += `
                    <tr>
                        <td width="50px">
                            <input type="checkbox" name="village_ids[]" value="${village[0]}" checked>
                        </td>
                        <td class="ra-tal">
                            <a href="javascript:TWMap.focus(${village[2]}, ${village[3]});">
                                <span class="icon header village"></span> ${villageName}
                            </a>
                        </td>
                        <td class="ra-tac">
                            <a href="/game.php?screen=info_village&id=${village[0]}" target="_blank" rel="noreferrer noopener">
                                ${village[2]}|${village[3]}
                            </a>
                        </td>
                    </tr>
                `;
            });
            return tableRows;
        }

        // Helper: Build group select options
        async function buildGroupSelectOptions() {
            let groups = [];

            // Fetch static groups
            await jQuery.get(
                '/game.php?&screen=groups&mode=overview&ajax=load_group_menu',
                function (data) {
                    data.result.forEach((element) => {
                        // we only want to store the manual groups
                        if (
                            element.group_id != 0 &&
                            element.type != 'group_dynamic' &&
                            element.type != 'separator'
                        ) {
                            groups.push({
                                group_id: element.group_id,
                                group_name: element.name,
                            });
                        }
                    });
                }
            );

            // Build group options
            let groupSelectOptions = ``;
            groups.forEach((element) => {
                groupSelectOptions += `<option value='${element.group_id}'>${element.group_name}</option>`;
            });

            return groupSelectOptions;
        }

        // Helper: Build datalist player/tribe selector
        function buildDropDown(array, entity) {
            let dropdown = `<input type="email" class="ra-input" multiple list="raSelect${entity}" placeholder="${twSDK.tt(
                'Start typing and suggestions will show ...'
            )}" id="ra${entity}"><datalist id="raSelect${entity}">`;
            array.forEach((item) => {
                if (item[0].length !== 0) {
                    if (entity === 'Tribes') {
                        const [id, _, tag] = item;
                        const cleanTribeTag = twSDK.cleanString(tag);
                        dropdown += `<option value="${cleanTribeTag}">`;
                    }
                    if (entity === 'Players' || entity === 'ExcludedPlayers') {
                        const [id, name] = item;
                        const cleanPlayerName = twSDK.cleanString(name);
                        dropdown += `<option value="${cleanPlayerName}">`;
                    }
                }
            });
            dropdown += '</datalist>';
            return dropdown;
        }

        // Helper: Get tribe members by tribe ids
        function getTribeMembersById(tribeIds) {
            const tribeMemberIds = [];
            players.forEach((player) => {
                if (tribeIds.includes(parseInt(player[2]))) {
                    tribeMemberIds.push(parseInt(player[0]));
                }
            });
            return tribeMemberIds;
        }

        // Helper: Filter villages by player ids
        function filterVillagesByPlayerIds(playerIds) {
            const playerVillages = [];
            villages.forEach((village) => {
                if (playerIds.includes(parseInt(village[4]))) {
                    const coordinate = village[2] + '|' + village[3];
                    playerVillages.push(coordinate);
                }
            });
            return playerVillages;
        }

        // Helper: Collect all user input
        function collectUserInput() {
            let coordinatesInputMethod = jQuery(
                '#raCoordinatesFillMethod'
            ).val();
            let radius = jQuery('#raRadius').val();
            let playersInput = jQuery('#raPlayers').val();
            let tribesInput = jQuery('#raTribes').val();
            let excludedPlayersInput = jQuery('#raExcludedPlayers').val();
            let inputCoordinates = jQuery('#raInputCoordinates').val().trim();

            // check that the radius field is filled with correct values
            if (!$.isNumeric(radius)) {
                jQuery('#raRadius').val(5);
                radius = 5;
            }

            if (radius > 30) {
                jQuery('#raRadius').val(5);
                jQuery('#raFindFrontlineVillagesBtn').trigger('click');
                return;
            }

            // check that the user has filled the required fields
            if (coordinatesInputMethod === 'automatic') {
                if (playersInput.length === 0 && tribesInput.length === 0) {
                    UI.ErrorMessage(
                        twSDK.tt(
                            'You must select at least one player or one tribe!'
                        )
                    );
                    return;
                }
            }

            return {
                coordinatesInputMethod,
                playersInput,
                tribesInput,
                excludedPlayersInput,
                radius,
                inputCoordinates,
            };
        }

        // Helper: Fetch all required world data
        async function fetchWorldData() {
            try {
                const villages = await twSDK.worldDataAPI('village');
                const players = await twSDK.worldDataAPI('player');
                const tribes = await twSDK.worldDataAPI('ally');
                return { villages, players, tribes };
            } catch (error) {
                UI.ErrorMessage(error);
                console.error(`${scriptInfo} Error:`, error);
            }
        }
    }
);
