/*
 * Script Name: Extended Player Info
 * Version: v1.1.1
 * Last Updated: 2023-05-03
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t14036346
 * Approved Date: 2020-06-14
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
        prefix: 'extendedPlayerInfo',
        name: 'Extended Player Info',
        version: 'v1.1.1',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/extended-player-info.285361/',
    },
    translations: {
        en_DK: {
            'Extended Player Info': 'Extended Player Info',
            Help: 'Help',
            'Script must be executed from Player Info screen!':
                'Script must be executed from Player Info screen!',
            'Points:': 'Points:',
            'Rank:': 'Rank:',
            'Player:': 'Player:',
            'All Villages Coords:': 'All Villages Coords:',
            'Villages:': 'Villages:',
            'TWStats Player Profile': 'TWStats Player Profile',
            'Show Player on Global Map': 'Show Player on Global Map',
            'TribalWars Maps Player Profile': 'TribalWars Maps Player Profile',
            'Village Coords for Continent': 'Village Coords for Continent',
            'village/s': 'village/s',
            'There was an error!': 'There was an error!',
        },
        sk_SK: {
            'Extended Player Info': 'Rozšírený profil hráča',
            Help: 'Pomoc',
            'Script must be executed from Player Info screen!':
                'Skript musí byť spustený z profilu hráča!',
            'Points:': 'Body:',
            'Rank:': 'Umiestnenie:',
            'Player:': 'Hráč:',
            'All Villages Coords:': 'Súradnice všetkých dedín:',
            'Villages:': 'Dediny:',
            'TWStats Player Profile': 'Profil hráča na TW Stats',
            'Show Player on Global Map': 'Zobraziť hráča na mape sveta',
            'TribalWars Maps Player Profile': 'Profil hráča na TribalWars Maps',
            'Village Coords for Continent': 'Súradnice dedín na kontinent',
            'village/s': 'dedina/-y',
            'There was an error!': 'There was an error!',
        },
        pt_PT: {
            'Extended Player Info': 'Mais informação do jogador',
            Help: 'Ajuda',
            'Script must be executed from Player Info screen!':
                'O script deve ser executado no perfil de um jogador!',
            'Points:': 'Pontos:',
            'Rank:': 'Rank:',
            'Player:': 'Jogador:',
            'All Villages Coords:': 'Coordenadas de todas as aldeias:',
            'Villages:': 'Aldeias:',
            'TWStats Player Profile': 'Perfil do jogador no TWStats',
            'Show Player on Global Map': 'Mostrar jogador no mapa mundo',
            'TribalWars Maps Player Profile':
                'Perfil do jogador no  TribalWars Maps',
            'Village Coords for Continent':
                'Coordenadas das aldeias no Continente',
            'village/s': 'aldeia/s',
            'There was an error!': 'There was an error!',
        },
        pt_BR: {
            'Extended Player Info': 'Mais informação do jogador',
            Help: 'Ajuda',
            'Script must be executed from Player Info screen!':
                'O script deve ser executado no perfil de um jogador!',
            'Points:': 'Pontos:',
            'Rank:': 'Rank:',
            'Player:': 'Jogador:',
            'All Villages Coords:': 'Coordenadas de todas as aldeias:',
            'Villages:': 'Aldeias:',
            'TWStats Player Profile': 'Perfil do jogador no TWStats',
            'Show Player on Global Map': 'Mostrar jogador no mapa mundo',
            'TribalWars Maps Player Profile':
                'Perfil do jogador no  TribalWars Maps',
            'Village Coords for Continent':
                'Coordenadas das aldeias no Continente',
            'village/s': 'aldeia/s',
            'There was an error!': 'There was an error!',
        },
        fr_FR: {
            'Extended Player Info': 'Informations étendues sur le joueur',
            Help: 'Aide',
            'Script must be executed from Player Info screen!':
                "Le script doit être exécuté sur le profil d'un joueur!",
            'Points:': 'Points:',
            'Rank:': 'Rang:',
            'Player:': 'Joueur:',
            'All Villages Coords:': 'Toutes les coord.:',
            'Villages:': 'Villages:',
            'TWStats Player Profile': 'TWStats Profil du joueur',
            'Show Player on Global Map':
                'Montrer le joueur sur la carte du monde',
            'TribalWars Maps Player Profile':
                'TribalWars Maps profil du joueur',
            'Village Coords for Continent':
                'Coordonnées du villages pour le continent',
            'village/s': 'village/s',
            'There was an error!': 'There was an error!',
        },
    },
    allowedMarkets: [],
    allowedScreens: ['info_player'],
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
        const playerId = twSDK.getParameterByName('id') ?? game_data.player.id;

        // Globals
        const { villages } = await fetchWorldData();
        const playerVillages = [];

        if (isValidScreen) {
            try {
                initExtendedPlayerInfo(playerId);
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
            }
        } else {
            UI.ErrorMessage(
                twSDK.tt('Script must be executed from Player Info screen!')
            );
        }

        // Prepare all player info
        function initExtendedPlayerInfo(playerId) {
            let pointsGraph = buildGraphImageUrl(
                playerId,
                'playergraph',
                'points'
            );
            let villagesGraph = buildGraphImageUrl(
                playerId,
                'playergraph',
                'villages'
            );
            let odGraph = buildGraphImageUrl(playerId, 'playergraph', 'od');
            let odaGraph = buildGraphImageUrl(playerId, 'playergraph', 'oda');
            let oddGraph = buildGraphImageUrl(playerId, 'playergraph', 'odd');

            let continents = [];

            villages.forEach((village) => {
                if (village[4] == playerId) {
                    playerVillages.push(village);
                }
            });

            let playerVillageCoords = playerVillages.map(
                (village) => village[2] + '|' + village[3]
            );
            let playerVillageCoordsString = playerVillageCoords.join(' ');

            // get continents
            playerVillageCoords.forEach((coord) => {
                let continent = getContinentFromCoord(coord);
                continents.push(continent);
            });

            // remove duplicates from continents array
            continents = [...new Set(continents)];

            let filteredVillagesByContinent = getFilteredVillagesByContinent(
                playerVillageCoords,
                continents
            );

            let renderVillageCoordsForContinents = '';

            for (let key in filteredVillagesByContinent) {
                if (filteredVillagesByContinent.hasOwnProperty(key)) {
                    var coordsList = filteredVillagesByContinent[key].join(' ');
                    var villagesCount = filteredVillagesByContinent[key].length;
                    renderVillageCoordsForContinents += `
                        <div class="ra-mb15">
                            <label class="ra-label" for="villagesForContinentK${key}">
                                ${twSDK.tt(
                                    'Village Coords for Continent'
                                )} K${key}
                                (${villagesCount} ${twSDK.tt('village/s')})
                            </label>
                            <textarea class="ra-textarea" readonly id="villagesForContinentK${key}">${coordsList}</textarea>
                        </div>
                    `;
                }
            }

            let regex = '/\\d+/';

            let randomOnlyScouts = `javascript:coords='${playerVillageCoordsString}';var doc=document;url=doc.URL; if (url.indexOf('screen=place') == -1) alert('This script needs to be run from the rally point'); coords = coords.split(' '); index = Math.round(Math.random() * (coords.length - 1));coords = coords[index];coords = coords.split('|'); doc.forms.units.x.value = coords[0]; doc.forms.units.y.value = coords[1]; if (doc.getElementsByName('spy')[0].parentNode.textContent.match(${regex})[0] * 1 >= 1) { insertUnit(doc.forms.units.spy, 0); insertUnit(doc.forms.units.spy, 1); } void (0);`;
            let randomOnlyRams = `javascript:coords='${playerVillageCoordsString}';var doc=document;url=doc.URL;if (url.indexOf('screen=place') == -1) alert('This script needs to be run from the rally point');coords = coords.split(' ');index = Math.round(Math.random() * (coords.length - 1));coords = coords[index];coords = coords.split('|');doc.forms.units.x.value = coords[0];doc.forms.units.y.value = coords[1];if (doc.getElementsByName('spy')[0].parentNode.textContent.match(${regex})[0] * 1 >= 1) {insertUnit(doc.forms.units.spy, 0);insertUnit(doc.forms.units.spy, 1);}if (doc.getElementsByName('ram')[0].parentNode.textContent.match(${regex})[0] * 1 > 0) {insertUnit(doc.forms.units.ram, 0);insertUnit(doc.forms.units.ram, 1);}void (0);`;
            let randomOnlyCats = `javascript:coords='${playerVillageCoordsString}';var doc=document;url=doc.URL;if (url.indexOf('screen=place') == -1) alert('This script needs to be run from the rally point');coords = coords.split(' ');index = Math.round(Math.random() * (coords.length - 1));coords = coords[index];coords = coords.split('|');doc.forms.units.x.value = coords[0];doc.forms.units.y.value = coords[1];if (doc.getElementsByName('spy')[0].parentNode.textContent.match(${regex})[0] * 1 >= 1) {insertUnit(doc.forms.units.spy, 0);insertUnit(doc.forms.units.spy, 1);}if (doc.getElementsByName('catapult')[0].parentNode.textContent.match(${regex})[0] * 1 > 0) {insertUnit(doc.forms.units.catapult, 0);insertUnit(doc.forms.units.catapult, 1);}void (0);`;

            let sequentialOnlyScouts = `javascript:coords='${playerVillageCoordsString}';var doc=document,index=0;url=doc.URL,Timing.pause();var cookieparams=doc.cookie.match(/GenFakeScript0=index([0-9]*)/);if(null!=cookieparams&&(index=1*cookieparams[1]),-1==url.indexOf("screen=place")){var r=confirm("This script needs to be run from the rally point Press OK to reset index.");1==r&&(index=0)}coords=coords.split(" ");var restart=!1;index>=coords.length&&(index=0,restart=!0);var d=new Date;d.setDate(d.getDate()+5),doc.cookie="GenFakeScript0=index"+(index+1)+";expires="+d.toGMTString(),restart&&alert("End of coord list is reached. Starting over"),coords=coords[index],coords=coords.split("|"),doc.forms.units.x.value=coords[0],doc.forms.units.y.value=coords[1],1*doc.getElementsByName("spy")[0].parentNode.textContent.match(${regex})[0]>=1&&(insertUnit(doc.forms.units.spy,0),insertUnit(doc.forms.units.spy,1));`;
            let sequentialOnlyRams = `javascript:coords='${playerVillageCoordsString}';var doc=document,index=0;url=doc.URL,Timing.pause();var cookieparams=doc.cookie.match(/GenFakeScript0=index([0-9]*)/);if(null!=cookieparams&&(index=1*cookieparams[1]),-1==url.indexOf("screen=place")){var r=confirm("This script needs to be run from the rally point Press OK to reset index.");1==r&&(index=0)}coords=coords.split(" ");var restart=!1;index>=coords.length&&(index=0,restart=!0);var d=new Date;d.setDate(d.getDate()+5),doc.cookie="GenFakeScript0=index"+(index+1)+";expires="+d.toGMTString(),restart&&alert("End of coord list is reached. Starting over"),coords=coords[index],coords=coords.split("|"),doc.forms.units.x.value=coords[0],doc.forms.units.y.value=coords[1],1*doc.getElementsByName("spy")[0].parentNode.textContent.match(${regex})[0]>=1&&(insertUnit(doc.forms.units.spy,0),insertUnit(doc.forms.units.spy,1)),1*doc.getElementsByName("ram")[0].parentNode.textContent.match(${regex})[0]>0&&(insertUnit(doc.forms.units.ram,0),insertUnit(doc.forms.units.ram,1));`;
            let sequentialOnlyCats = `javascript:coords='${playerVillageCoordsString}';var doc=document,index=0;url=doc.URL,Timing.pause();var cookieparams=doc.cookie.match(/GenFakeScript0=index([0-9]*)/);if(null!=cookieparams&&(index=1*cookieparams[1]),-1==url.indexOf("screen=place")){var r=confirm("This script needs to be run from the rally point Press OK to reset index.");1==r&&(index=0)}coords=coords.split(" ");var restart=!1;index>=coords.length&&(index=0,restart=!0);var d=new Date;d.setDate(d.getDate()+5),doc.cookie="GenFakeScript0=index"+(index+1)+";expires="+d.toGMTString(),restart&&alert("End of coord list is reached. Starting over"),coords=coords[index],coords=coords.split("|"),doc.forms.units.x.value=coords[0],doc.forms.units.y.value=coords[1],1*doc.getElementsByName("spy")[0].parentNode.textContent.match(${regex})[0]>=1&&(insertUnit(doc.forms.units.spy,0),insertUnit(doc.forms.units.spy,1)),1*doc.getElementsByName("catapult")[0].parentNode.textContent.match(${regex})[0]>0&&(insertUnit(doc.forms.units.catapult,0),insertUnit(doc.forms.units.catapult,1));`;

            let twStatusProfile = buildTWStatsProfileUrl(playerId);
            let mapPlayerUrl = buildMapPlayerUrl(playerId);
            let twMapPlayerUrl = buildTWMapPlayerUrl(playerId);

            let playerName = jQuery('#player_info tbody tr:eq(0) th')
                .text()
                .trim();
            let playerPoints = jQuery('#player_info tbody tr:eq(2) td:eq(1)')
                .text()
                .trim();
            let playerRank = jQuery('#player_info tbody tr:eq(3) td:eq(1)')
                .text()
                .trim();

            const content = `
                <div class="ra-mb15">
                        <strong>${twSDK.tt(
                            'Player:'
                        )}</strong> ${playerName}<br>
                        <strong>${twSDK.tt(
                            'Points:'
                        )}</strong> ${playerPoints}<br>
                        <strong>${twSDK.tt('Rank:')}</strong> ${playerRank}<br>
                        <strong>${twSDK.tt('Villages:')}</strong> ${
                playerVillageCoords.length
            }
            </div>
                <div class="ra-mb15">
                    <a href="${twStatusProfile}" class="btn" target="_blank" rel="noopener noreferrer">
                        ${twSDK.tt('TWStats Player Profile')}
                    </a>
                    <a href="${twMapPlayerUrl}" class="btn" target="_blank" rel="noopener noreferrer">
                        ${twSDK.tt('TribalWars Maps Player Profile')}
                    </a>
                    <a href="${mapPlayerUrl}" class="btn" target="_blank" rel="noopener noreferrer">
                        ${twSDK.tt('Show Player on Global Map')}
                    </a>
                </div>
                <div class="ra-mb15">
                    <img src="${pointsGraph}" />
                    <img src="${villagesGraph}" />
                    <img src="${odGraph}" />
                    <img src="${odaGraph}" />
                    <img src="${oddGraph}" />
                </div>
                <div class="ra-mb15">
                    <label class="ra-label" for="allVillagesCoords" class="ra-label">
                        ${twSDK.tt('All Villages Coords:')}
                        (${playerVillageCoords.length} ${twSDK.tt('village/s')})
                    </label>
                    <textarea class="ra-textarea" readonly id="allVillagesCoords">${playerVillageCoordsString.trim()}</textarea>
                </div>
                ${renderVillageCoordsForContinents}
                <div class="ra-grid ra-mb15">
                    <div>
                        <label class="ra-label" for="randomOnlyScouts">Random Only Scouts</label>
                        <textarea class="ra-textarea" readonly id="randomOnlyScouts">${randomOnlyScouts}</textarea>
                    </div>
                    <div>
                        <label class="ra-label" for="randomOnlyRams">Random Only Rams</label>
                        <textarea class="ra-textarea" readonly id="randomOnlyRams">${randomOnlyRams}</textarea>
                    </div>
                    <div>
                        <label class="ra-label" for="randomOnlyCats">Random Only Cats</label>
                        <textarea class="ra-textarea" readonly id="randomOnlyCats">${randomOnlyCats}</textarea>
                    </div>
                </div>
                <div class="ra-grid">
                    <div>
                        <label class="ra-label" for="sequentialOnlyScouts">Sequential Only Scouts</label>
                        <textarea class="ra-textarea" readonly id="sequentialOnlyScouts">${sequentialOnlyScouts}</textarea>
                    </div>
                    <div>
                        <label class="ra-label" for="sequentialOnlyRams">Sequential Only Rams</label>
                        <textarea class="ra-textarea" readonly id="sequentialOnlyRams">${sequentialOnlyRams}</textarea>
                    </div>
                    <div>
                        <label class="ra-label" for="sequentialOnlyCats">Sequential Only Cats</label>
                        <textarea class="ra-textarea" readonly id="sequentialOnlyCats">${sequentialOnlyCats}</textarea>
                    </div>
                </div>
            `;

            const customStyle = `
                .ra-label { display: block; font-weight: 600; margin-bottom: 5px; }
                .ra-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 15px; }
            `;

            twSDK.renderBoxWidget(
                content,
                scriptConfig.scriptData.prefix,
                'ra-extended-player-info',
                customStyle
            );
        }

        // Helper: Get Continent from Coord
        function getContinentFromCoord(coord) {
            var coords = coord.split('|');
            var xx = twSDK.zeroPad(coords[0], 3);
            var yy = twSDK.zeroPad(coords[1], 3);
            return yy[0] + xx[0];
        }

        // Helper: Filter Villages by Continent
        function getFilteredVillagesByContinent(
            playerVillagesCoords,
            continents
        ) {
            var coords = [...playerVillagesCoords];
            var filteredVillagesByContinent = [];

            coords.forEach((coord) => {
                continents.forEach((continent) => {
                    var currentVillageContinent = getContinentFromCoord(coord);
                    if (currentVillageContinent === continent) {
                        filteredVillagesByContinent.push({
                            continent: continent,
                            coords: coord,
                        });
                    }
                });
            });

            var result = groupArrayByProperty(
                filteredVillagesByContinent,
                'continent',
                'coords'
            );

            return result;
        }

        // Helper: Group array items by object project and filter by another object property
        function groupArrayByProperty(array, property, filter) {
            return array.reduce(function (accumulator, object) {
                // get the value of our object(age in our case) to use for group    the array as the array key
                const key = object[property];
                // if the current value is similar to the key(age) don't accumulate the transformed array and leave it empty
                if (!accumulator[key]) {
                    accumulator[key] = [];
                }
                // add the value to the array
                accumulator[key].push(object[filter]);
                // return the transformed array
                return accumulator;
                // Also we also set the initial value of reduce() to an empty object
            }, {});
        }

        // Helper: Build map player URL
        function buildMapPlayerUrl(playerId) {
            return `//${
                game_data.market === 'en' ? '' : game_data.market + '.'
            }twstats.com/${
                game_data.world
            }/index.php?page=map&pi0=${playerId}&pc0=002bff&zoom=300&centrex=500&centrey=500&nocache=1&fill=000000`;
        }

        // Helper: Build TW Stats Player Profile Url
        function buildTWStatsProfileUrl(playerId) {
            return `//www.twstats.com/in/${game_data.world}/player/${playerId}`;
        }

        // Helper: Build TribalWars Maps player url
        function buildTWMapPlayerUrl(playerId) {
            return `http://${game_data.world}.tribalwarsmap.com/${
                game_data.market === 'en' ? '' : game_data.market
            }/history/player/${playerId}#general`;
        }

        // Helper: Build graph image URL
        function buildGraphImageUrl(id, type, graph) {
            return `//${
                game_data.market === 'en' ? '' : game_data.market + '.'
            }twstats.com/${
                game_data.world
            }/image.php?type=${type}&graph=${graph}&id=${id}`;
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
