ScriptAPI.register('Devils Mass Report Analyser', true, 'ixfuryanix (Devilicious#9733)', 'nl.tribalwars@coma.innogames.de');

if (window.location.href.indexOf('screen=report&mode=defense') < 0) {
    window.location.assign(game_data.link_base_pure + "report&mode=defense");
}

if (typeof window.twLib === 'undefined') {
    window.twLib = {
        queues: null,
        init: function () {
            if (this.queues === null) {
                this.queues = this.queueLib.createQueues(5);
            }
        },
        queueLib: {
            maxAttempts: 3,
            Item: function (action, arg, promise = null) {
                this.action = action;
                this.arguments = arg;
                this.promise = promise;
                this.attempts = 0;
            },
            Queue: function () {
                this.list = [];
                this.working = false;
                this.length = 0;

                this.doNext = function () {
                    let item = this.dequeue();
                    let self = this;

                    if (item.action === 'openWindow') {
                        window.open(...item.arguments).addEventListener('DOMContentLoaded', function () {
                            self.start();
                        });
                    } else {
                        $[item.action](...item.arguments).done(function () {
                            item.promise.resolve.apply(null, arguments);
                            self.start();
                        }).fail(function () {
                            item.attempts += 1;
                            if (item.attempts < twLib.queueLib.maxAttempts) {
                                self.enqueue(item, true);
                            } else {
                                item.promise.reject.apply(null, arguments);
                            }

                            self.start();
                        });
                    }
                };

                this.start = function () {
                    if (this.length) {
                        this.working = true;
                        this.doNext();
                    } else {
                        this.working = false;
                    }
                };

                this.dequeue = function () {
                    this.length -= 1;
                    return this.list.shift();
                };

                this.enqueue = function (item, front = false) {
                    (front) ? this.list.unshift(item) : this.list.push(item);
                    this.length += 1;

                    if (!this.working) {
                        this.start();
                    }
                };
            },
            createQueues: function (amount) {
                let arr = [];

                for (let i = 0; i < amount; i++) {
                    arr[i] = new twLib.queueLib.Queue();
                }

                return arr;
            },
            addItem: function (item) {
                let leastBusyQueue = twLib.queues.map(q => q.length).reduce((next, curr) => (curr < next) ? curr : next, 0);
                twLib.queues[leastBusyQueue].enqueue(item);
            },
            orchestrator: function (type, arg) {
                let promise = $.Deferred();
                let item = new twLib.queueLib.Item(type, arg, promise);

                twLib.queueLib.addItem(item);

                return promise;
            }
        },
        ajax: function () {
            return twLib.queueLib.orchestrator('ajax', arguments);
        },
        get: function () {
            return twLib.queueLib.orchestrator('get', arguments);
        },
        post: function () {
            return twLib.queueLib.orchestrator('post', arguments);
        },
        openWindow: function () {
            let item = new twLib.queueLib.Item('openWindow', arguments);

            twLib.queueLib.addItem(item);
        }
    };

    twLib.init();
}

String.prototype.toCoord = function (objectified) {
    let c = this.match(/\d{1,3}\|\d{1,3}/g).pop();
    return (objectified) ? {x: c.split('|')[0], y: c.split('|')[1]} : c;
};

let attackingUnitsSeen = {};
let unitsLost = {};
let unitsDefeated = {};
let offUnits = ["axe", "light"];

// Init
game_data.units.forEach((unit) => {
    attackingUnitsSeen[unit] = 0;
    unitsLost[unit] = 0
});

const waitForTimeout = (timeToWait = 1000)  => new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, timeToWait);
});


if (game_data.mode === 'defense') {
    $('.report_filter:first').before(`
    <tr id="defPack_massAnalyseContent">
        <td colspan="1"><input type="button" class="btn" value="Analyse Reports"/></td>
        <td colspan="3">
            <div id="defPack_progressBar" class="progress-bar live-progress-bar progress-bar-alive" style="display: none">
                <div></div>
                <span class="label"></span>
            </div>
        </td>
    </tr>`);
    $('#defPack_massAnalyseContent input').click(async () => {
        await processDefenseReports();
    });
}

async function processDefenseReports() {
    $('#defPack_massAnalyseContent input').prop('disabled', true);
    let reports = await getAllReports();
    console.log('checking ' + reports.length + ' reports');
    let uniqueAttackingVillages = [];
    let arrivalTimesPerVillage = {};

    const progressBar = $('#defPack_progressBar');
    progressBar.show();
    UI.InitProgressBars();
    UI.updateProgressBar(progressBar, 0, reports.length);

    for (const [index, report] of reports.entries()) {
        console.log(index, report)
        const reportHtml = await getHtmlFromUrl(report, '.nopad');
        const playerName = $(reportHtml).find('#attack_info_att tr:first a').text().trim();
        const villageData = $(reportHtml).find('#attack_info_att tr:eq(1) a:first');

        const totalUnitsSeen = $(reportHtml).find('#attack_info_att_units tr:eq(1)');
        const totalOffUnitsLossesRow = $(reportHtml).find('#attack_info_att_units tr:eq(2)');
        const totalDefUnitsLossesRow = $(reportHtml).find('#attack_info_def_units tr:eq(2)');
        let totalOffTroops = 0;
        totalUnitsSeen.find('td:not(:first)').not('.hidden').each((index, element) => {
            const unit = $(element).attr('class').split(' ')[1].split('-')[2];
            const amount = parseInt($(element).text());
            attackingUnitsSeen[unit] += amount;
            if (offUnits.includes(unit)) {
                totalOffTroops += amount;
            }
        });

        totalOffUnitsLossesRow.find('td:not(:first)').not('.hidden').each((index, element) => {
            const unit = $(element).attr('class').split(' ')[1].split('-')[2];
            if (unitsDefeated[playerName] === undefined) {
                unitsDefeated[playerName] = {};
                game_data.units.forEach((unit) => unitsDefeated[playerName][unit] = 0);
            }
            let amount = parseInt($(element).text());
            unitsDefeated[playerName][unit] += amount;
        });

        if (totalOffTroops >= 200) {
            uniqueAttackingVillages.push({
                villageId: villageData.parent().data('id'),
                coordinates: villageData.text().toCoord(),
                player: playerName,
                world: game_data.world
            })
        }

        totalDefUnitsLossesRow.find('td:not(:first)').not('.hidden').each((index, element) => {
            const unit = $(element).attr('class').split(' ')[1].split('-')[2];
            unitsLost[unit] += parseInt($(element).text());
        });
        const arrivalTimeRow = $(reportHtml).find('table:eq(1) tr:eq(1) td:eq(1)').text().trim();
        const targetVillageHtml = $(reportHtml).find('.village_anchor, .contexted').eq(1);
        if (targetVillageHtml.text()) {
            const targetCoords = targetVillageHtml.text().match(/\d{1,3}\|\d{1,3}/g).pop();
            if (arrivalTimesPerVillage[targetCoords] === undefined) {
                arrivalTimesPerVillage[targetCoords] = [];
            }
            arrivalTimesPerVillage[targetCoords].push(arrivalTimeRow)
        }
        UI.updateProgressBar(progressBar, index + 1, reports.length);
        $(progressBar).find('span:last').css('color', index / reports.length > 0.6 ? 'white' : 'black');
        if (game_data.locale !== 'nl_NL') await waitForTimeout(200);
    }
    const unitsDefeatedArray = Object.values($.extend(true, {}, unitsDefeated)).reduce((a, b) => {
        Object.keys(a).forEach((unit) => {
            a[unit] += b[unit];
        });
        return a;
    });

    $('#defPack_massAnalyseContent').after(`
                <tr>
                    <td colspan="4">
                        <table id="defPack_massAnalyseTotalTable" class="vis overview_table" width="100%" style="text-align: center;">
                            <thead>
                                ${addUnitHeaderRow('Totals')}
                            </thead>
                            <tbody>
                                ${addRow('row_a', 'Seen', attackingUnitsSeen)}
                                ${addRow('row_b', 'Killed', unitsDefeatedArray)}
                                ${addRow('row_a', 'Lost', unitsLost)}
                            </tbody>
                        </table>
                    </td>
                </tr>
            `);
    Object.keys(unitsDefeated).forEach((key) => {
        $('.report_filter:first').before(`
                <tr class="defPack_massAnalysePlayerTable">
                    <td colspan="4">
                        <table class="vis overview_table" width="100%" style="text-align: center;">
                            <thead>
                                ${addUnitHeaderRow(key)}
                            </thead>
                            <tbody>
                                ${addRow(null, null, unitsDefeated[key])}
                            </tbody>
                        </table>
                    </td>
                </tr>
            `);

        console.log('Troops defeated of ' + key + ' ' + Intl.NumberFormat().format(Object.values(unitsDefeated[key]).reduce((a, b) => a + b)))
    });

    console.log('total', attackingUnitsSeen);
    console.log('lost', unitsLost);
    console.log('defeated', unitsDefeated);

    console.log('lost total', Object.values(unitsLost).reduce((a, b) => a + b));
    console.log('Unique Attacking Coords with over 200 off units found', [...new Set(uniqueAttackingVillages.map(village => village.coordinates))]);
    console.log(arrivalTimesPerVillage);
    console.table(arrivalTimesPerVillage);
}

async function processAttackReports() {
    $('#defPack_massAnalyseContent input').prop('disabled', true);
    let reports = await getAllReports();
    console.log('checking ' + reports.length + ' reports');
    for (const report of reports) {
        const reportHtml = await getHtmlFromUrl(report, '.nopad');
        let wallDamage = $(reportHtml).find('#attack_results th:contains("Schade door rammen:")').next().find('b').map((_,el) => Number($(el).text())).get();
        console.log($(reportHtml).find('#attack_info_def tr:eq(1) a:first').text().toCoord() + " Muur: " + wallDamage[0] + " -> " + wallDamage[1]);
    }
}

async function getAllReports() {
    let allReports = $('.report-link').map((index, el) => {
        return $(el).attr('href')
    }).get();

    const allPages = $('.paged-nav-item').map((index, el) => {
        return $(el).attr('href')
    });

    allReports.push.apply(allReports, await getReportsAllPages(allPages));

    return allReports;
}

async function getReportsAllPages(allPages) {
    let reports = [];

    for (const page of allPages.get()) {
        const html = await getHtmlFromUrl(page, '#report_list');
        const reportLinks = $(html).find('.report-link').map((index, el) => {
            return $(el).attr('href');
        });
        reports.push.apply(reports, reportLinks);
    }
    return reports;
}

async function getHtmlFromUrl(url, htmlContentToFind) {
    return new Promise((resolve, reject) => {
        twLib.get({
            url: url,
            dataType: 'html',
            success: function (html) {
                resolve($(html).find(htmlContentToFind));
            }, error: function (error) {
                reject(error);
            }
        })
    });
}

function addUnitHeaderRow(playerName) {
    return `<tr>
        <th width="15%">${playerName}</th>
        ${Object.keys(game_data.units).map(unit =>
        `<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="${game_data.units[unit]}"><img src="/graphic/unit/unit_${game_data.units[unit]}.png"></a></th>`
    ).join('')}
    </tr>`;
}

function addRow(className, title, array) {
    return `<tr class="${className}">
        <td style="text-align: left;">${addTitle(title)}<span class="icon header population"></span> ${Format.number(Object.values(array).reduce((a, b) => a + b))}</td>
    ${Object.keys(array).map(unit =>
        `<td data-unit="${unit}">${Format.number(array[unit])}</td>`
    ).join('')}
</tr>`;
}

function addTitle(title) {
    return title != null ? `<b>${title} </b><br>` : '';
}