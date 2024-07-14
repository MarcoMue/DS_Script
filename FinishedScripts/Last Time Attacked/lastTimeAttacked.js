/*
 * Script Name: Show Last Time Attacked
 * Version: v1.0
 * Last Updated: 2021-05-23
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: N/A
 * Approved Date: 2021-05-24
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
        prefix: 'showLastTimeAttack',
        name: 'Show Last Time Attacked',
        version: 'v1.0',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/show-last-time-attacked.287161/',
    },
    translations: {
        en_DK: {
            'Show Last Time Attacked': 'Show Last Time Attacked',
            Help: 'Help',
            'Redirecting...': 'Redirecting...',
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
        const isValidScreen = twSDK.checkValidLocation('screen');

        // check if we are on a valid screen
        if (!isValidScreen) {
            UI.InfoMessage(twSDK.tt('Redirecting...'));
            twSDK.redirectTo('map');
            return;
        }

        // Main script logic
        updateMap();
        twSDK.renderFixedWidget(
            '',
            'raLastVillageGrowth',
            'ra-last-village-growth'
        );

        // Update map layers
        function updateMap() {
            let chainedFunc = null;

            function showLastTimeAttacked(sector, data) {
                const serverDateTime = twSDK.getServerDateTimeObject();
                const localTime = new Date().getTime();
                const timeDiff = parseInt(
                    Math.ceil(Math.abs(localTime - serverDateTime)) / 1000
                );

                for (let x in data.tiles) {
                    x = parseInt(x, 10);

                    for (let y in data.tiles[x]) {
                        y = parseInt(y, 10);
                        let village =
                            TWMap.villages[(data.x + x) * 1000 + data.y + y];

                        if (
                            village &&
                            jQuery('#dsm' + village.id).length <= 0 &&
                            TWMap.popup._cache[village.id] &&
                            village.owner == 0
                        ) {
                            village = TWMap.popup._cache[village.id];

                            if (village.attack) {
                                let reportLastAttackedTime = parseInt(
                                    village.attack.utime
                                );
                                let diffInSeconds =
                                    serverDateTime.getTime() / 1000 -
                                    reportLastAttackedTime +
                                    timeDiff; // add local time difference

                                let lastTimeAttackedEl = jQuery('<div></div>')
                                    .css({
                                        border: '1px coral solid',
                                        position: 'absolute',
                                        backgroundColor:
                                            village.attack.max_loot == 1
                                                ? '#00ff00'
                                                : '#eee',
                                        width: '50px',
                                        height: '15px',
                                        marginTop: '25px',
                                        display: 'block',
                                        color: 'black',
                                        zIndex: '10',
                                        fontWeight: 'normal',
                                        textAlign: 'center',
                                    })
                                    .attr('id', 'dsm' + village.id)
                                    .html(twSDK.timeAgo(diffInSeconds));

                                sector.appendElement(
                                    lastTimeAttackedEl[0],
                                    data.x + x - sector.x,
                                    data.y + y - sector.y
                                );
                            }
                        }
                    }
                }
            }

            function fnSpawnSectorHook(data, sector) {
                if (chainedFunc) {
                    chainedFunc.call(this, data, sector);
                }

                jQuery(document).ajaxStop(function () {
                    showLastTimeAttacked(sector, data);
                });
            }

            if (!TWMap.dsmHook) {
                TWMap.dsmHook = true;

                chainedFunc = TWMap.mapHandler.spawnSector;
                TWMap.mapHandler.spawnSector = fnSpawnSectorHook;
                TWMap.map.handler.spawnSector = fnSpawnSectorHook;

                TWMap.scriptMode = true;
                TWMap.map._loadedSectors = {};
                TWMap.reload();
            }
        }
    }
);
