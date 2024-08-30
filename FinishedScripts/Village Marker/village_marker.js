/*
 * Script Name: Village Marker
 * Version: v1.2
 * Last Updated: 2023-04-20
 * Author: IcarusRises
 * Approved: N/A
 * Approved Date: N/A
 * Mod: N/A
 */

var scriptData = {
  name: "Village Marker",
  version: "v1.2",
  author: "IcarusRises",
  helpLink: "#",
};

// User Input
if (typeof DEBUG !== "boolean") DEBUG = false;

// Constants
var VILLAGE_TIME = "ICmapVillageTime"; // localStorage key name
var VILLAGES_LIST = "ICmapVillagesList"; // localStorage key name
var TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour

// Globals
var allowedGameScreens = ["map"];
var villages = [];
var markedVillages = [];
var markedVillagesIds = [];

// Translations
var translations = {
  en_DK: {
    "Village Marker": "Village Marker",
    Help: "Help",
    "This script can only be run on the map screen!":
      "This script can only be run on the map screen!",
    'Error while fetching "village.txt"!':
      'Error while fetching "village.txt"!',
    "There is no village with coordinates:":
      "There is no village with coordinates:",
    "Input Coordinates": "Input Coordinates",
    Submit: "Submit",
  },
  el_GR: {
    "Village Marker": "Μαρκάρισμα χωριών",
    Help: "Βοήθεια",
    "This script can only be run on the map screen!":
      "Το συγκεκριμένο script ενεργοποιείται μόνο από το Χάρτη!",
    'Error while fetching "village.txt"!':
      'Σφάλμα κατά την ανάγνωση του "village.txt"!',
    "There is no village with coordinates:":
      "Δεν υπάρχει χωριό με συντεταγμένες:",
    "Input Coordinates": "Εισαγωγή Συντεταγμένων",
    Submit: "Επιβεβαίωση",
  },
};

// Init Debug
initDebug();

// Init Translations Notice
initTranslationsNotice();

// Init Script
function initScript() {
  // Auto-update localStorage villages list
  if (localStorage.getItem(VILLAGE_TIME) != null) {
    var mapVillageTime = parseInt(localStorage.getItem(VILLAGE_TIME));
    if (Date.parse(new Date()) >= mapVillageTime + TIME_INTERVAL) {
      // hour has passed, refetch village.txt
      fetchVillagesData();
    } else {
      // hour has not passed, work with village list from localStorage
      var data = localStorage.getItem(VILLAGES_LIST);
      villages = CSVToArray(data);
      if (!$("#IC_input_coords").length) {
        TWMap.mapHandler.integratedSpawnSector = TWMap.mapHandler.spawnSector;
        TWMap.mapHandler.spawnSector = spawnSector;
        TWMap.reload();
        showUi();
      }
    }
  } else {
    // Fetch village.txt
    fetchVillagesData();
  }
}

// Fetch 'village.txt' file
function fetchVillagesData() {
  $.get("map/village.txt", function (data) {
    villages = CSVToArray(data);
    localStorage.setItem(VILLAGE_TIME, Date.parse(new Date()));
    localStorage.setItem(VILLAGES_LIST, data);
  })
    .done(function () {
      if (!$("#IC_input_coords").length) {
        TWMap.mapHandler.integratedSpawnSector = TWMap.mapHandler.spawnSector;
        TWMap.mapHandler.spawnSector = spawnSector;
        TWMap.reload();
        showUi();
      }
    })
    .fail(function (error) {
      console.error(`${scriptInfo()} Error:`, error);
      UI.ErrorMessage(`${tt('Error while fetching "village.txt"!')}`, 4000);
    });
}

// Show the user interface
function showUi() {
  $("#map_config").prepend(
    '<table id="IC_input_coords" class="vis" style="border-spacing:0px;border-collapse:collapse;margin-top:15px;" width="100%"><tbody>' +
      '<tr><th colspan="3">' +
      tt("Input Coordinates") +
      "</th></tr>" +
      "<tr><td></td>" +
      "	<td>" +
      '		<textarea id="IC_input_coords_textarea" rows="5" style="width:95%; margin-top:7px;"></textarea>' +
      "	</td>" +
      "</tr>" +
      "<tr><td></td>" +
      "	<td>" +
      '		<button id="IC_overlay_villages" class="btn" type="button" style="padding: 5px 10px; margin: 3px">' +
      tt("Submit") +
      "</button>" +
      "	</td>" +
      "</tr>" +
      "</tr><td></td><td><strong>" +
      tt("Village Marker") +
      " " +
      scriptData.version +
      " - " +
      scriptData.author +
      "</strong></td></tr>" +
      "</tbody></table>"
  );
  var overlayButton = $("#IC_overlay_villages");
  overlayButton.click(function () {
    inputCoords();
  });
}

// Get input and mark the villages on the map
function inputCoords() {
  var villagesTextsArray = $.trim($("#IC_input_coords_textarea").val()).match(
    /\d+\|\d+/g
  );
  markedVillages = [];
  markedVillagesIds = [];
  for (var i = 0; i < villagesTextsArray.length; ++i) {
    var coord = villagesTextsArray[i];
    var index = markedVillages.indexOf(coord);
    var [x, y] = villagesTextsArray[i].split("|");
    var village = findVillageId(x, y);
    if (!village) {
      UI.ErrorMessage(
        tt("There is no village with coordinates:") + ` <b>${coord}</b>.`,
        4000
      );
      return;
    }
    if (index === -1) {
      markedVillages.push(coord);
      markedVillagesIds.push(parseInt(village));
      markVillageAsSelected(parseInt(village));
      TWMap.reload();
    }
  }
}

// Helper: returns village ID for village with coordinates x, y
function findVillageId(x, y) {
  var village = villages.find(function (element) {
    return element[2] === x && element[3] === y;
  });
  return village ? village[0] : undefined;
}

// SpawnSector
function spawnSector(data, sector) {
  TWMap.mapHandler.integratedSpawnSector(data, sector);
  for (var i = 0; i < markedVillagesIds.length; i++) {
    var villageId = markedVillagesIds[i];
    if (villageId === null) {
      continue;
    }
    var v = $("#map_village_" + villageId);
    $(
      '<div class="ICSelectVillagesOverlay" id="ICSelectVillages_overlay_' +
        villageId +
        '" style="width:52px; height:37px; border-radius: 50%; position: absolute; z-index: 50; left:' +
        $(v).css("left") +
        "; top: " +
        $(v).css("top") +
        ';"></div>'
    ).appendTo(v.parent());
    $("#ICSelectVillages_overlay_" + villageId)
      .css("outline", "rgba(51, 255, 0, 0.7) solid 2px")
      .css("background-color", "rgba(155, 252, 10, 0.14)");
  }
}

// Mark village with ID on the map
function markVillageAsSelected(id) {
  $("#ICSelectVillages_overlay_" + id)
    .css("outline", "rgba(51, 255, 0, 0.7) solid 2px")
    .css("background-color", "rgba(155, 252, 10, 0.14)");
}

// Demark village with ID on the map
function demarkVillageAsSelected(id) {
  $("#ICSelectVillages_overlay_" + id)
    .css("outline", "")
    .css("background-color", "");
}

//Helper: Convert CSV data into Array
function CSVToArray(strData, strDelimiter) {
  strDelimiter = strDelimiter || ",";
  var objPattern = new RegExp(
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );
  var arrData = [[]];
  var arrMatches = null;
  while ((arrMatches = objPattern.exec(strData))) {
    var strMatchedDelimiter = arrMatches[1];
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      arrData.push([]);
    }
    var strMatchedValue;

    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  return arrData;
}

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
  return new URL(url).searchParams.get(name);
}

// Helper: Generates script info
function scriptInfo() {
  return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
  console.debug(`${scriptInfo()} It works !`);
  console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
  if (DEBUG) {
    console.debug(`${scriptInfo()} Market:`, game_data.market);
    console.debug(`${scriptInfo()} World:`, game_data.world);
    console.debug(`${scriptInfo()} Screen:`, game_data.screen);
    console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
    console.debug(`${scriptInfo()} Game Build:`, game_data.version);
    console.debug(`${scriptInfo()} Locale:`, game_data.locale);
    console.debug(
      `${scriptInfo()} Premium:`,
      game_data.features.Premium.active
    );
  }
}

// Helper: Text Translator
function tt(string) {
  var gameLocale = game_data.locale;

  if (translations[gameLocale] !== undefined) {
    return translations[gameLocale][string];
  } else {
    return translations["en_DK"][string];
  }
}

// Helper: Translations Notice
function initTranslationsNotice() {
  const gameLocale = game_data.locale;

  if (translations[gameLocale] === undefined) {
    UI.ErrorMessage(`No translation found for <b>${gameLocale}</b>.`, 4000);
  }
}

// Initialize Script
(function () {
  const gameScreen = getParameterByName("screen");

  if (allowedGameScreens.includes(gameScreen)) {
    initScript();
  } else {
    UI.InfoMessage(tt("This script can only be run on the map screen!"));
    setTimeout(function () {
      window.location.assign(game_data.link_base_pure + "map");
    }, 500);
  }
})();
