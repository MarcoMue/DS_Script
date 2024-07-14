/*
 * Script Name: Barbs Finder
 * Version: v2.0.1
 * Last Updated: 2023-05-11
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t13981993
 * Approved Date: 2020-05-27
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
        prefix: 'barbsFinder',
        name: 'Barbs Finder',
        version: 'v2.0.1',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/barb-finder-with-filtering.285289/',
    },
    translations: {
        en_DK: {
            'Barbs Finder': 'Barbs Finder',
            'Min Points:': 'Min Points:',
            'Max Points:': 'Max Points:',
            'Radius:': 'Radius:',
            'Barbs found:': 'Barbs found:',
            'Coordinates:': 'Coordinates:',
            'Error while fetching "village.txt"!':
                'Error while fetching "village.txt"!',
            Coords: 'Coords',
            Points: 'Points',
            'Dist.': 'Dist.',
            Attack: 'Attack',
            Filter: 'Filter',
            Reset: 'Reset',
            'No barbarian villages found!': 'No barbarian villages found!',
            'Current Village:': 'Current Village:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Help',
            'There was an error!': 'There was an error!',
        },
        sk_SK: {
            'Barbs Finder': 'Hľadač barbariek',
            'Min Points:': 'Min bodov:',
            'Max Points:': 'Max bodov:',
            'Radius:': 'Vzdialenosť:',
            'Barbs found:': 'Nájdené barbarky:',
            'Coordinates:': 'Súradnice:',
            'Error while fetching "village.txt"!':
                'Chyba pri načítaní "village.txt"!',
            Coords: 'Súradnice',
            Points: 'Body',
            'Dist.': 'Vzdial.',
            Attack: 'Útok',
            Filter: 'Filter',
            Reset: 'Reset',
            'No barbarian villages found!':
                'Neboli nájdené žiadne dediny barbarov!',
            'Current Village:': 'Súčasná dedina:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Pomoc',
            'There was an error!': 'There was an error!',
        },
        fr_FR: {
            'Barbs Finder': 'Recherche de Barbares',
            'Min Points:': 'Points Min.:',
            'Max Points:': 'Points Max.:',
            'Radius:': 'Radius:',
            'Barbs found:': 'Barbs found:',
            'Coordinates:': 'Coordinates:',
            'Error while fetching "village.txt"!':
                'Error while fetching "village.txt"!',
            Coords: 'Coords',
            Points: 'Points',
            'Dist.': 'Dist.',
            Attack: 'Attaquer',
            Filter: 'Filtrer',
            Reset: 'Réinitialiser',
            'No barbarian villages found!': 'No barbarian villages found!',
            'Current Village:': 'Village Actuel:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Help',
            'There was an error!': 'There was an error!',
        },
        pt_PT: {
            'Barbs Finder': 'Procurador de Bárbaras',
            'Min Points:': 'Pontos mínimos:',
            'Max Points:': 'Pontos máximos:',
            'Radius:': 'Raio:',
            'Barbs found:': 'Bárbaras encontradas:',
            'Coordinates:': 'Coordenadas:',
            'Error while fetching "village.txt"!':
                'Erro ao procurar "village.txt"!',
            Coords: 'Coords',
            Points: 'Pontos',
            'Dist.': 'Dist.',
            Attack: 'Attack',
            Filter: 'Filtro',
            Reset: 'Reset',
            'No barbarian villages found!': 'Não foram encontradas bárbaras!',
            'Current Village:': 'Aldeia Atual:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Ajuda',
            'There was an error!': 'There was an error!',
        },
        pt_BR: {
            'Barbs Finder': 'Procurador de Bárbaras',
            'Min Points:': 'Pontos mínimos:',
            'Max Points:': 'Pontos máximos:',
            'Radius:': 'Campo:',
            'Barbs found:': 'Bárbaras encontradas:',
            'Coordinates:': 'Coordenadas:',
            'Error while fetching "village.txt"!':
                'Erro ao procurar "village.txt"!',
            Coords: 'Coords',
            Points: 'Pontos',
            'Dist.': 'Dist.',
            Attack: 'Attack',
            Filter: 'Filtro',
            Reset: 'Reset',
            'No barbarian villages found!': 'Não foram encontradas bárbaras!',
            'Current Village:': 'Aldeia Atual:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Ajuda',
            'There was an error!': 'There was an error!',
        },
        hu_HU: {
            'Barbs Finder': 'Barbi kereső',
            'Min Points:': 'Min pontszám:',
            'Max Points:': 'Max pontszám:',
            'Radius:': 'Hatókör:',
            'Barbs found:': 'Megtalált barbik:',
            'Coordinates:': 'Koordináták:',
            'Error while fetching "village.txt"!':
                'Hiba a "village.txt" beolvasása során!',
            Coords: 'Koordináták',
            Points: 'Pontszám',
            'Dist.': 'Távolság',
            Attack: 'Támadás',
            Filter: 'Szűrés',
            Reset: 'Reset',
            'No barbarian villages found!': 'Nem találtam barbit!',
            'Current Village:': 'Jelenlegi falu:',
            'Sequential Scout Script:': 'Teljes script a kikémleléshez:',
            Help: 'Segítség',
            'There was an error!': 'There was an error!',
        },
        hr_HR: {
            'Barbs Finder': 'Barbari Koordinati',
            'Min Points:': 'Minimalno Poena:',
            'Max Points:': 'Maksimalno Poena:',
            'Radius:': 'Radius:',
            'Barbs found:': 'Barbara pronađeno:',
            'Coordinates:': 'Koordinati:',
            'Error while fetching "village.txt"!':
                'Greška u dohvaćanju podataka "village.txt"!',
            Coords: 'Koordinati',
            Points: 'Poeni',
            'Dist.': 'Distanca.',
            Attack: 'Napad',
            Filter: 'Filter',
            Reset: 'Reset',
            'No barbarian villages found!': 'Nisu pronađena barbarska sela!',
            'Current Village:': 'Trenutno Selo:',
            'Sequential Scout Script:': 'Sekvencijalna izviđačka skripta:',
            Help: 'Pomoć',
            'There was an error!': 'There was an error!',
        },
        pl_PL: {
            'Barbs Finder': 'Znajdz wioski opuszczone',
            'Min Points:': 'Minimalna ilość punktów:',
            'Max Points:': 'Maksymalna ilość punktów:',
            'Radius:': 'Promień:',
            'Barbs found:': 'Znaleziono wiosek:',
            'Coordinates:': 'Kordynaty:',
            'Error while fetching "village.txt"!':
                'Błąd podczas wyszukiwania pliku„ village.txt ”!',
            Coords: 'Koordy',
            Points: 'Punkty',
            'Dist.': 'Odległość',
            Attack: 'Atak',
            Filter: 'Znajdź',
            Reset: 'Reset',
            'No barbarian villages found!':
                'Nie znaleziono wiosek barbarzyńskich',
            'Current Village:': 'Obecna wioska:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Pomoc',
            'There was an error!': 'There was an error!',
        },
        sv_SE: {
            'Barbs Finder': 'Hitta Barbarby',
            'Min Points:': 'Min Poäng:',
            'Max Points:': 'Max Poäng:',
            'Radius:': 'Radius:',
            'Barbs found:': 'Barbarby hittade:',
            'Coordinates:': 'Koordinater:',
            'Error while fetching "village.txt"!':
                'Fel vid hämtning av "village.txt”!',
            Coords: 'Kords',
            Points: 'Poäng',
            'Dist.': 'Avstånd',
            Attack: 'Attackera',
            Filter: 'Filter',
            Reset: 'Återställ',
            'No barbarian villages found!': 'Inga barbarbyar hittade!',
            'Current Village:': 'Nuvarande by:',
            'Sequential Scout Script:': 'Sequential Scout Script:',
            Help: 'Hjälp',
            'There was an error!': 'There was an error!',
        },
        tr_TR: {
            'Barbs Finder': 'Barbar Bulucu',
            'Min Points:': 'Minimum Puan:',
            'Max Points:': 'Maksimum Puan:',
            'Radius:': 'Alan:',
            'Barbs found:': 'Bulunan barbarlar:',
            'Coordinates:': 'Koordinatlar:',
            'Error while fetching "village.txt"!':
                'Arama hatası oluştu "village.txt"!',
            Coords: 'Koordinatlar',
            Points: 'Puanlar',
            'Dist.': 'Uzaklık',
            Attack: 'Saldır',
            Filter: 'Filtre',
            Reset: 'Reset',
            'No barbarian villages found!': 'Barbar bulunamadı!',
            'Current Village:': 'Geçerli Köy',
            'Sequential Scout Script:': 'Sıralı Casus Scripti',
            Help: 'Yardım',
            'There was an error!': 'There was an error!',
        },
        cs_CZ: {
            'Barbs Finder': 'Barbs Finder',
            'Min Points:': 'Min body:',
            'Max Points:': 'Max body:',
            'Radius:': 'Radius:',
            'Barbs found:': 'Nalezené barbarské vesnice:',
            'Coordinates:': 'Souřadnice:',
            'Error while fetching "village.txt"!':
                'Error while fetching "village.txt"!',
            Coords: 'Souřadnice',
            Points: 'Body',
            'Dist.': 'Vzdálenost',
            Attack: 'Útok',
            Filter: 'Filter',
            Reset: 'Reset',
            'No barbarian villages found!':
                'Žádné barbarské vesnice nenalezeny!',
            'Current Village:': 'Aktuální vesnice:',
            'Sequential Scout Script:': 'Skript na špehy:',
            Help: 'Pomoc',
            'There was an error!': 'There was an error!',
        },
    },
    allowedMarkets: [],
    allowedScreens: [],
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

        const { villages } = await fetchWorldData();

        // Entry point
        try {
            // build user interface
            buildUI();

            // register action handler
            handleFilterBarbs();
            handleResetFilters();
        } catch (error) {
            UI.ErrorMessage(twSDK.tt('There was an error!'));
            console.error(`${scriptInfo} Error:`, error);
        }

        // Render: Build the user interface
        function buildUI() {
            const content = `
                <div class="ra-grid ra-grid-4">
                    <div class="ra-mb15">
                        <label for="raCurrentVillage" class="ra-label">${twSDK.tt(
                            'Current Village:'
                        )}</label>
                        <input type="text" id="raCurrentVillage" value="${
                            game_data.village.coord
                        }" class="ra-input">
                    </div>
                    <div class="ra-mb15">
                        <label for="radius" class="ra-label">${twSDK.tt(
                            'Radius:'
                        )}</label>
                        <select id="radius_choser" class="ra-input">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50" selected>50</option>
                            <option value="60">60</option>
                            <option value="70">70</option>
                            <option value="80">80</option>
                            <option value="90">90</option>
                            <option value="100">100</option>
                            <option value="110">110</option>
                            <option value="120">120</option>
                            <option value="130">130</option>
                            <option value="140">140</option>
                            <option value="150">150</option>
                            <option value="999">999</option>
                        </select>
                    </div>
                    <div class="ra-mb15">
                        <label for="minPoints" class="ra-label">${twSDK.tt(
                            'Min Points:'
                        )}</label>
                        <input type="text" id="minPoints" value="26" class="ra-input">
                    </div>
                    <div class="ra-mb15">
                        <label for="maxPoints" class="ra-label">${twSDK.tt(
                            'Max Points:'
                        )}</label>
                        <input type="text" id="maxPoints" value="12154" class="ra-input">
                    </div>
                </div>
                <div class="ra-mb15">
                    <a href="javascript:void(0);" id="btnFilterBarbs" class="btn btn-confirm-yes">
                        ${twSDK.tt('Filter')}
                    </a>
                    <a href="javascript:void(0);" id="btnResetFilters" class="btn btn-confirm-no">
                        ${twSDK.tt('Reset')}
                    </a>
                </div>
                <div class="ra-mb15">
                    <strong>${twSDK.tt('Barbs found:')}</strong>
                    <span id="barbsCount">0</span>
                </div>
                <div class="ra-grid ra-grid-2">
                    <div>
                        <label for="barbCoordsList" class="ra-label">${twSDK.tt(
                            'Coordinates:'
                        )}</label>
                        <textarea id="barbCoordsList" class="ra-textarea" readonly></textarea>
                    </div>
                    <div>
                        <label for="barbScoutScript" class="ra-label">${twSDK.tt(
                            'Sequential Scout Script:'
                        )}</label>
                        <textarea id="barbScoutScript" class="ra-textarea" readonly></textarea>
                    </div>
                </div>
                <div id="barbariansTable" style="display:none;" class="ra-table-container ra-mt15"></div>
            `;

            const customStyle = `
                .ra-label { display: block; font-weight: 600; margin-bottom: 5px; }
                .ra-input { padding: 5px; width: 100%; display: block; line-height: 1; font-size: 14px; }
                .ra-grid { display: grid; gap: 15px; }
                .ra-grid-2 { grid-template-columns: 1fr 1fr; }
                .ra-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
                .btn-already-sent { padding: 3px; }
                .already-sent-command { opacity: 0.6; }
            `;

            twSDK.renderBoxWidget(
                content,
                scriptConfig.scriptData.prefix,
                'ra-barbs-finder',
                customStyle
            );
        }

        // Action Handler: Handle filter barbs event
        function handleFilterBarbs() {
            jQuery('#btnFilterBarbs').on('click', function (e) {
                e.preventDefault();

                const currentVillage = $('#raCurrentVillage').val().trim();
                const minPoints = parseInt($('#minPoints').val().trim());
                const maxPoints = parseInt($('#maxPoints').val().trim());
                const radius = parseInt($('#radius_choser').val());

                const barbarians = villages.filter(
                    (village) => parseInt(village[4]) === 0
                );

                // Filter by min and max points
                const filteredBarbs = barbarians.filter((barbarian) => {
                    return (
                        parseInt(barbarian[5]) >= minPoints &&
                        parseInt(barbarian[5]) <= maxPoints
                    );
                });

                // Filter by radius
                const filteredByRadiusBarbs = filteredBarbs.filter(
                    (barbarian) => {
                        let barbCoord = barbarian[2] + '|' + barbarian[3];
                        let distance = twSDK.calculateDistance(
                            currentVillage,
                            barbCoord
                        );
                        if (distance <= radius) {
                            return barbarian;
                        }
                    }
                );

                if (filteredByRadiusBarbs.length > 0) {
                    let barbariansCoordsArray = filteredByRadiusBarbs.map(
                        (village) => village[2] + '|' + village[3]
                    );
                    let barbariansCount = barbariansCoordsArray.length;
                    let barbariansCoordsList = barbariansCoordsArray.join(' ');
                    let scoutScript = `javascript:coords='${barbariansCoordsList}';var doc=document;if(window.frames.length>0 && window.main!=null)doc=window.main.document;url=doc.URL;if(url.indexOf('screen=place')==-1)alert('Use the script in the rally point page!');coords=coords.split(' ');index=0;farmcookie=document.cookie.match('(^|;) ?farm=([^;]*)(;|$)');if(farmcookie!=null)index=parseInt(farmcookie[2]);if(index>=coords.length)alert('All villages were extracted, now start from the first!');if(index>=coords.length)index=0;coords=coords[index];coords=coords.split('|');index=index+1;cookie_date=new Date(2030,1,1);document.cookie ='farm='+index+';expires='+cookie_date.toGMTString();doc.forms[0].x.value=coords[0];doc.forms[0].y.value=coords[1];$('#place_target').find('input').val(coords[0]+'|'+coords[1]);doc.forms[0].spy.value=1;`;
                    let tableContent = generateBarbariansTable(
                        filteredByRadiusBarbs,
                        currentVillage
                    );

                    jQuery('#barbsCount').text(barbariansCount);
                    jQuery('#barbCoordsList').text(barbariansCoordsList);
                    jQuery('#barbScoutScript').val(scoutScript);
                    jQuery('#barbariansTable').show();
                    jQuery('#barbariansTable').html(tableContent);

                    jQuery('.btn-send-attack').on('click', function (e) {
                        jQuery(this).addClass(
                            'btn-confirm-yes btn-already-sent'
                        );
                        jQuery(this)
                            .parent()
                            .parent()
                            .addClass('already-sent-command');
                    });
                } else {
                    jQuery('#btnResetFilters').trigger('click');
                    UI.InfoMessage(twSDK.tt('No barbarian villages found!'));
                }
            });
        }

        // Action Handler: Handle reset Filters
        function handleResetFilters() {
            jQuery('#btnResetFilters').on('click', function (e) {
                e.preventDefault();

                jQuery('#raCurrentVillage').val(game_data.village.coord);
                jQuery('#minPoints').val(26);
                jQuery('#maxPoints').val(12154);
                jQuery('#radius_choser').val('20');
                jQuery('#barbsCount').text('0');
                jQuery('#barbCoordsList').text('');
                jQuery('#barbScoutScript').val('');
                jQuery('#barbariansTable').hide();
                jQuery('#barbariansTable').html('');
            });
        }

        // Generate Table
        function generateBarbariansTable(barbs, currentVillage) {
            if (barbs.length < 1) return;

            let barbariansWithDistance = [];

            barbs.forEach((barb) => {
                let barbCoord = barb[2] + '|' + barb[3];
                let distance = twSDK.calculateDistance(
                    currentVillage,
                    barbCoord
                );
                barbariansWithDistance.push([...barb, distance]);
            });

            barbariansWithDistance.sort((a, b) => {
                return a[7] - b[7];
            });

            let tableRows = generateTableRows(barbariansWithDistance);

            let tableContent = `
                <table class="vis overview_table ra-table" width="100%">
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>
                                K
                            </th>
                            <th>
                                ${twSDK.tt('Coords')}
                            </th>
                            <th>
                                ${twSDK.tt('Points')}
                            </td>
                            <th>
                                ${twSDK.tt('Dist.')}
                            </th>
                            <th>
                                ${twSDK.tt('Attack')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;

            return tableContent;
        }

        // Generate Table Rows
        function generateTableRows(barbs) {
            let renderTableRows = '';

            barbs.forEach((barb, index) => {
                index++;
                let continent = barb[3].charAt(0) + barb[2].charAt(0);
                renderTableRows += `
                    <tr>
                        <td class="ra-tac">
                            ${index}
                        </td>
                        <td class="ra-tac">
                            ${continent}
                        </td>
                        <td class="ra-tac">
                            <a href="game.php?screen=info_village&id=${
                                barb[0]
                            }" target="_blank" rel="noopener noreferrer">
                                ${barb[2]}|${barb[3]}
                            </a>
                        </td>
                        <td>${twSDK.formatAsNumber(barb[5])}</td>
                        <td class="ra-tac">${barb[7].toFixed(2)}</td>
                        <td class="ra-tac">
                            <a href="/game.php?screen=place&target=${
                                barb[0]
                            }&spy=1" target="_blank" rel="noopener noreferrer" class="btn btn-send-attack">
                                ${twSDK.tt('Attack')}
                            </a>
                        </td>
                    </tr>
                `;
            });

            return renderTableRows;
        }

        // Helper: Fetch all required world data
        async function fetchWorldData() {
            try {
                const villages = await twSDK.worldDataAPI('village');
                return { villages };
            } catch (error) {
                UI.ErrorMessage(error);
                console.error(`${scriptInfo} Error:`, error);
            }
        }
    }
);
