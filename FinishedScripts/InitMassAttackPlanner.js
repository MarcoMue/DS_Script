"use strict";
/*
 *  Author: TheAHouse
 *  Version: 1.0.0
 *  Last updated: 2021/02/14
 *  Description: Mass Attack Planner tool for Tribalwars
 */
function init() {
    // Get village IDs mapped to coords (24 hour check)
    // @ts-ignore
    let world = game_data.world;
    let now = Date.parse(new Date().toISOString());
    let prev = parseInt(localStorage.getItem(`coordsToID_${world}_time`));
    if (isNaN(prev) || now > prev + 60 * 60 * 24 * 1000) {
        // 24 hours have passed or JSON doesn't exist
        $.ajax({
            url: location.origin + '/map/village.txt',
            success: (villages) => {
                let coordsToID = {};
                villages.match(/[^\r\n]+/g).forEach(villageData => {
                    const [id, _name, x, y, _player_id] = villageData.split(',');
                    coordsToID[`${x}|${y}`] = id;
                });
                $.ajax({
                    url: '/interface.php?func=get_unit_info',
                    success: (response) => {
                        let unitInfo = xml2json($(response));
                        localStorage.setItem('activeTW', JSON.stringify({
                            world: world,
                            origin: location.origin,
                            unitInfo: unitInfo
                        }));
                        localStorage.setItem(`coordsToID_${world}`, JSON.stringify(coordsToID));
                        localStorage.setItem(`coordsToID_${world}_time`, now.toString());
                        openWindow();
                    }
                });
            }
        });
    }
    else {
        openWindow();
    }
}
// Open pop-up window with mass-attack-planner opened
function openWindow() {
    let win = window.open('', '', 'width=475, height=500');
    if (win != null) {
        win.document.title = 'Mass Attack Planner';
        let jquery = win.document.createElement('script');
        jquery.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js');
        win.document.head.appendChild(jquery);
        let script = win.document.createElement('script');
        script.setAttribute('src', 'https://dl.dropboxusercontent.com/s/d5d6jaj5zssg39j/MassAttackPlanner.js');
        win.document.head.appendChild(script);
    }
}
// XML to JSON converter
function xml2json($xml) {
    let data = {};
    $.each($xml.children(), function (i) {
        let $this = $(this);
        if ($this.children().length > 0) {
            data[$this.prop('tagName')] = xml2json($this);
        }
        else {
            data[$this.prop('tagName')] = $.trim($this.text());
        }
    });
    return data;
}
;
init();
