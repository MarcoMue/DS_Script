/*
 * Script Name: Command Timer
 * Version: v1.1.1
 * Last Updated: 2024-06-04
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t14018890
 * Approved Date: 2020-06-16
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
        prefix: 'commandTimer',
        name: 'Command Timer',
        version: 'v1.1.1',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/command-launch-timer.285377/',
    },
    translations: {
        en_DK: {
            'Command Timer': 'Command Timer',
            Help: 'Help',
            'Script must be executed from a Command Confirm screen!':
                'Script must be executed from a Command Confirm screen!',
            'Already loaded!': 'Already loaded!',
            'Launching Time must not be empty!':
                'Launching Time must not be empty!',
            'Invalid Launching Time!': 'Invalid Launching Time!',
            "It's time!": "It's time!",
            'Send in:': 'Send in:',
            'Launch Time': 'Launch Time',
            'Start Timer': 'Start Timer',
        },
        sk_SK: {
            'Command Timer': 'Časovač príkazov',
            Help: 'Pomoc',
            'Script must be executed from a Command Confirm screen!':
                'Skript musí byť spustený z potvrdzovacej obrazovky príkazu!',
            'Already loaded!': 'Už načítané!',
            'Launching Time must not be empty!':
                'Čas poslania nesmie byť prázdny!',
            'Invalid Launching Time!': 'Neplatný čas poslania!',
            "It's time!": 'Je čas!',
            'Send in:': 'Pošli o:',
            'Launch Time': 'Čas poslania',
            'Start Timer': 'Spustiť časovač',
        },
    },
    allowedMarkets: [],
    allowedScreens: ['place'],
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
        const isTry = twSDK.getParameterByName('try');

        var commandTimerInterval;

        // Entry point
        if (isValidScreen && isTry === 'confirm') {
            // build user interface
            buildUI();

            // register action handlers
            handleInitCommandTimer();
        } else {
            UI.ErrorMessage(
                twSDK.tt(
                    'Script must be executed from a Command Confirm screen!'
                )
            );
        }

        // Build the user interface
        function buildUI() {
            const [serverTime, serverDate] = getServerTime();
            const serverDateTime = serverTime + ' ' + serverDate;

            const content = `
                <div class="ra-mb15">
                    <label for="launching_time" class="ra-label">
                        ${twSDK.tt('Launch Time')}
                    </label>
                    <input type="text" class="ra-input" id="launching_time" value="${serverDateTime}" />
                </div>
                <div class="ra-mb15">
                    <a href="javascript:void(0);" class="btn" id="raCommandTimerBtn">
                        ${twSDK.tt('Start Timer')}
                    </a>
                </div>
                <div class="ra-mb15 ra-remaining-time">
                    <strong>${twSDK.tt('Send in:')}</strong>
                    <span id="remainingTime">0</span>
                </div>
            `;

            const customStyle = `
                .ra-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px; }
                .ra-input { display: block; line-height: 1; font-size: 14px; padding: 5px; }
                .ra-remaining-time { display:none; font-size: 14px; font-weight: 600; }
                #remainingTime { font-size: 20px; }
                .launch-time-approaching { color: #ff0000; }
            `;

            twSDK.renderFixedWidget(
                content,
                scriptConfig.scriptData.prefix,
                'ra-command-timer',
                customStyle
            );
        }

        // Action Handler: Init command timer
        function handleInitCommandTimer() {
            jQuery('#raCommandTimerBtn').on('click', function (e) {
                e.preventDefault();

                const launchingTime = jQuery('#launching_time').val();
                if (launchingTime !== '') {
                    const [launchingTimeFormatted, serverDateTimeFormatted] =
                        getTimes(launchingTime);

                    if (launchingTimeFormatted <= serverDateTimeFormatted) {
                        UI.ErrorMessage(twSDK.tt('Invalid Launching Time!'));
                        clearInterval(commandTimerInterval);
                    } else {
                        initTimeCalculations(launchingTime);
                    }
                } else {
                    UI.ErrorMessage(
                        twSDK.tt('Launching Time must not be empty!')
                    );
                }
            });
        }

        // Helper: Get server time
        function getServerTime() {
            const serverTime = jQuery('#serverTime').text();
            const serverDate = jQuery('#serverDate').text();
            return [serverTime, serverDate];
        }

        // Helper: Parse string as date
        function parseAsDate(string) {
            let [time, date] = string.split(' ');
            let [hours, minutes, seconds] = time.split(':');
            let [day, month, year] = date.split('/');

            const parsedDate = Date.parse(
                `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            );

            return parsedDate;
        }

        // Helper: Get times
        function getTimes(launchingTime) {
            const [serverTime, serverDate] = getServerTime();
            const serverDateTime = serverTime + ' ' + serverDate;

            const launchingTimeTimestamp = parseAsDate(launchingTime);
            const serverDateTimeTimestamp = parseAsDate(serverDateTime);

            return [launchingTimeTimestamp, serverDateTimeTimestamp];
        }

        // Initialize Timer Calculations
        function initTimeCalculations(launchingTime) {
            commandTimerInterval = setInterval(function () {
                const [launchingTimeFormatted, serverDateTimeFormatted] =
                    getTimes(launchingTime);

                const timeDiff =
                    launchingTimeFormatted - serverDateTimeFormatted;
                const timeDiffSeconds = timeDiff / 1000;

                if (timeDiffSeconds <= 10) {
                    jQuery('#remainingTime').addClass(
                        'launch-time-approaching'
                    );
                }

                if (timeDiffSeconds == 0) {
                    jQuery('.ra-remaining-time').text(`${tt("It's time!")}`);
                    clearInterval(commandTimerInterval);
                }

                jQuery('.ra-remaining-time').show();
                jQuery('#remainingTime').text(timeDiffSeconds + ' seconds');
            }, 1000);
        }
    }
);
