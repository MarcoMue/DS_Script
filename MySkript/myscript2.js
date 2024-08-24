if (typeof DEBUG !== "boolean") DEBUG = false;
DEBUG = true;

// TODO init and load DB for villages and players / tribes

// User Input
// Script Config
let scriptConfig = {
  baseScriptUrl: "https://marcomue.github.io/DS_Script/MySkript",
  scriptData: {
    prefix: "getIncsForPlayer",
    name: "Get Incs for Player",
    version: "v1.0.0",
    author: "",
    authorUrl: "",
    helpLink: "",
  },
  translations: {
    en_DK: {
      "Get Incs for Player": "Get Incs for Player",
      Help: "Help",
      "There was an error!": "There was an error!",
      "Script must be executed from Player Info screen!":
        "Script must be executed from Player Info screen!",
      Fetching: "Fetching",
      "Fetching incomings for each village...":
        "Fetching incomings for each village...",
      "Error fetching village incomings!": "Error fetching village incomings!",
      "Total Attacks:": "Total Attacks:",
      "Total Large Attacks:": "Total Large Attacks:",
      "Total Noble Attacks:": "Total Noble Attacks:",
      "Total Villages:": "Total Villages:",
      "Average attacks per village:": "Average attacks per village:",
      "Could not find villages being attacked!":
        "Could not find villages being attacked!",
      "Player:": "Player:",
      Village: "Village",
      Coords: "Coords",
      "Total Medium Attacks:": "Total Medium Attacks:",
      "Total Small Attacks:": "Total Small Attacks:",
      Players: "Players",
      "You can't sort elements if any one is a descendant of another.":
        "You can't sort elements if any one is a descendant of another.",
      "sort this column": "sort this column",
    },
    fr_FR: {
      "Get Incs for Player": "Récupérer les attaques entrantes pour le Joueur",
      Help: "Aide",
      "There was an error!": "There was an error!",
      "Script must be executed from Player Info screen!":
        "Le script doit être executé depuis le profil d'un joueur!",
      Fetching: "Chargement",
      "Fetching incomings for each village...":
        "Chargement des ordres pour chaque village ...",
      "Error fetching village incomings!":
        "Erreur dans le chargement des ordres!",
      "Total Attacks:": "Total - Attaque envoyées:",
      "Total Large Attacks:": "Total - Attaque de grande envergure:",
      "Total Noble Attacks:": "Total - Attaque de noble:",
      "Total Villages:": "Total - Villages:",
      "Average attacks per village:": "Moyenne - Attaque par village:",
      "Could not find villages being attacked!":
        "Impossible de trouver les villages attaqués!",
      "Player:": "Joueur:",
      Village: "Village",
      Coords: "Coordonnées",
      "Total Medium Attacks:": "Total - Attaque de moyenne envergure:",
      "Total Small Attacks:": "Total - Attaque de petite envergure::",
      Players: "Joueurs",
      "You can't sort elements if any one is a descendant of another.":
        "You can't sort elements if any one is a descendant of another.",
      "sort this column": "sort this column",
    },
  },
  allowedMarkets: [],
  allowedScreens: [],
  allowedModes: [],
  isDebug: DEBUG,
  enableCountApi: true,
};

let scriptInfo = `${scriptConfig.scriptData.prefix} ${scriptConfig.scriptData.name} ${scriptConfig.scriptData.version}`;

window.twSDK = {
  // variables
  database: {
    db: null,
    DB_NAME: "mdn-demo-indexeddb-epublications",
    DB_VERSION: 1,
    DB_STORE_NAME: "publications",
  },
  scriptData: {},
  translations: {},
  allowedMarkets: [],
  allowedScreens: [],
  allowedModes: [],
  enableCountApi: true,
  isDebug: false,
  isMobile: jQuery("#mobileHeader").length > 0,
  delayBetweenRequests: 200,
  // helper variables
  market: game_data.market,
  units: game_data.units,
  village: game_data.village,
  buildings: game_data.village.buildings,
  sitterId: game_data.player.sitter > 0 ? `&t=${game_data.player.id}` : "",
  coordsRegex: /\d{1,3}\|\d{1,3}/g,
  dateTimeMatch:
    /(?:[A-Z][a-z]{2}\s+\d{1,2},\s*\d{0,4}\s+|today\s+at\s+|tomorrow\s+at\s+)\d{1,2}:\d{2}:\d{2}:?\.?\d{0,3}/,
  // https://forum.die-staemme.de/index.php?threads/weltdaten-und-configs.183996/#post-4378479
  worldInfoInterface: "/interface.php?func=get_config",
  unitInfoInterface: "/interface.php?func=get_unit_info",
  buildingInfoInterface: "/interface.php?func=get_building_info",
  worldDataVillages: "/map/village.txt",
  worldDataPlayers: "/map/player.txt",
  worldDataTribes: "/map/ally.txt",
  worldDataConquests: "/map/conquer_extended.txt",
  lastUpdated: localStorage.getItem("village_last_updated"),

  csvToArray: function (strData, strDelimiter = ",") {
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
  },
  cleanString: function (string) {
    try {
      return decodeURIComponent(string).replace(/\+/g, " ");
    } catch (error) {
      console.error(error, string);
      return string;
    }
  },
  getVillageIDByCoords: function (x, y) {
    const xy = parseInt(`${x}${y}`, 10);

    const village = TWMap.villages[xy];

    if (!village) {
      return NaN;
    }
    return village.id;
  },
  worldDataAPI: async function (entity) {
    console.log("worldDataAPI called with entity:", entity);

    const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
    const LAST_UPDATED_TIME = localStorage.getItem(`${entity}_last_updated`);

    // check if entity is allowed and can be fetched
    const allowedEntities = ["village", "player", "ally", "conquer"];
    if (!allowedEntities.includes(entity)) {
      throw new Error(`Entity ${entity} does not exist!`);
    }

    // initial world data
    const worldData = {};

    const dbConfig = {
      village: {
        dbName: "villagesDb",
        dbTable: "villages",
        key: "villageId",
        url: twSDK.worldDataVillages,
      },
      player: {
        dbName: "playersDb",
        dbTable: "players",
        key: "playerId",
        url: twSDK.worldDataPlayers,
      },
      ally: {
        dbName: "tribesDb",
        dbTable: "tribes",
        key: "tribeId",
        url: twSDK.worldDataTribes,
      },
      conquer: {
        dbName: "conquerDb",
        dbTable: "conquer",
        key: "",
        url: twSDK.worldDataConquests,
      },
    };

    // Helpers: Fetch entity data and save to localStorage
    const fetchDataAndSave = async () => {
      const DATA_URL = dbConfig[entity].url;

      try {
        // fetch data
        const response = await jQuery.ajax(DATA_URL);
        const data = twSDK.csvToArray(response);
        let responseData = [];

        // prepare data to be saved in db
        switch (entity) {
          case "village":
            responseData = data
              .filter((item) => {
                if (item[0] != "") {
                  return item;
                }
              })
              .map((item) => {
                return {
                  villageId: parseInt(item[0]),
                  villageName: twSDK.cleanString(item[1]),
                  villageX: item[2],
                  villageY: item[3],
                  coords: `${item[2]}|${item[3]}`,
                  playerId: parseInt(item[4]),
                  villagePoints: parseInt(item[5]),
                  villageType: parseInt(item[6]),
                };
              });

            break;
          case "player":
            responseData = data
              .filter((item) => {
                if (item[0] != "") {
                  return item;
                }
              })
              .map((item) => {
                return {
                  playerId: parseInt(item[0]),
                  playerName: twSDK.cleanString(item[1]),
                  tribeId: parseInt(item[2]),
                  villages: parseInt(item[3]),
                  points: parseInt(item[4]),
                  rank: parseInt(item[5]),
                };
              });
            break;
          case "ally":
            responseData = data
              .filter((item) => {
                if (item[0] != "") {
                  return item;
                }
              })
              .map((item) => {
                return {
                  tribeId: parseInt(item[0]),
                  tribeName: twSDK.cleanString(item[1]),
                  tribeTag: twSDK.cleanString(item[2]),
                  players: parseInt(item[3]),
                  villages: parseInt(item[4]),
                  points: parseInt(item[5]),
                  allPoints: parseInt(item[6]),
                  rank: parseInt(item[7]),
                };
              });
            break;
          case "conquer":
            responseData = data
              .filter((item) => {
                if (item[0] != "") {
                  return item;
                }
              })
              .map((item) => {
                return {
                  villageId: parseInt(item[0]),
                  unixTimestamp: parseInt(item[1]),
                  newPlayerId: parseInt(item[2]),
                  newPlayerId: parseInt(item[3]),
                  oldTribeId: parseInt(item[4]),
                  newTribeId: parseInt(item[5]),
                  villagePoints: parseInt(item[6]),
                };
              });
            break;
          default:
            return [];
        }

        // save data in db
        saveToIndexedDbStorage(
          dbConfig[entity].dbName,
          dbConfig[entity].dbTable,
          dbConfig[entity].key,
          responseData
        );

        // update last updated localStorage item
        localStorage.setItem(`${entity}_last_updated`, Date.parse(new Date()));

        return responseData;
      } catch (error) {
        throw Error(`Error fetching ${DATA_URL}`);
      }
    };

    // Helpers: Save to IndexedDb storage
    async function saveToIndexedDbStorage(dbName, table, keyId, data) {
      const req = indexedDB.open(dbName);

      req.onupgradeneeded = function (event) {
        const db = this.result;
        let objectStore;
        if (keyId.length) {
          objectStore = db.createObjectStore(table, {
            keyPath: keyId,
          });

          // TODO: add indexes for each entity
          // playerId: 0
          // villageId: 1
          // villageName: "Barbarendorf"
          // villagePoints: 433
          // villageType: 0
          // villageX: "506"
          // villageY: "478"
          objectStore.createIndex("coords", "coords", { unique: true });
        } else {
          db.createObjectStore(table, {
            autoIncrement: true,
          });
        }
      };

      req.onsuccess = function () {
        const db = this.result;
        const transaction = db.transaction(table, "readwrite");
        const store = transaction.objectStore(table);
        store.clear(); // clean store from items before adding new ones

        data.forEach((item) => {
          store.put(item);
        });

        UI.SuccessMessage("Database updated!");
      };

      req.onerror = function (event) {
        console.error("saveToIndexedDbStorage:", event.target.errorCode);
      };
    }

    // Helpers: Read all villages from indexedDB
    function getAllData(dbName, table) {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName);

        req.onsuccess = () => {
          const db = req.result;

          const dbQuery = db
            .transaction(table, "readwrite")
            .objectStore(table)
            .getAll();

          dbQuery.onsuccess = (event) => {
            resolve(event.target.result);
          };

          dbQuery.onerror = (event) => {
            reject(event.target.error);
          };
        };

        req.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }

    // Helpers: Transform an array of objects into an array of arrays
    function objectToArray(arrayOfObjects, entity) {
      switch (entity) {
        case "village":
          return arrayOfObjects.map((item) => [
            item.villageId,
            item.villageName,
            item.villageX,
            item.villageY,
            item.playerId,
            item.villagePoints,
            item.villageType,
          ]);
        case "player":
          return arrayOfObjects.map((item) => [
            item.playerId,
            item.playerName,
            item.tribeId,
            item.villages,
            item.points,
            item.rank,
          ]);
        case "ally":
          return arrayOfObjects.map((item) => [
            item.tribeId,
            item.tribeName,
            item.tribeTag,
            item.players,
            item.villages,
            item.points,
            item.allPoints,
            item.rank,
          ]);
        case "conquer":
          return arrayOfObjects.map((item) => [
            item.villageId,
            item.unixTimestamp,
            item.newPlayerId,
            item.newPlayerId,
            item.oldTribeId,
            item.newTribeId,
            item.villagePoints,
          ]);
        default:
          return [];
      }
    }

    // decide what to do based on current time and last updated entity time
    if (LAST_UPDATED_TIME !== null) {
      if (
        Date.parse(new Date()) >=
        parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL
      ) {
        worldData[entity] = await fetchDataAndSave();
      } else {
        worldData[entity] = await getAllData(
          dbConfig[entity].dbName,
          dbConfig[entity].dbTable
        );
      }
    } else {
      worldData[entity] = await fetchDataAndSave();
    }

    // transform the data so at the end an array of array is returned
    worldData[entity] = objectToArray(worldData[entity], entity);

    return worldData[entity];
  },
  startProgressBar: function (total) {
    const width = jQuery("#content_value")[0].clientWidth;
    const preloaderContent = `
        <div id="progressbar" class="progress-bar" style="margin-bottom:12px;">
            <span class="count label">0/${total}</span>
            <div id="progress">
                <span class="count label" style="width: ${width}px;">
                    0/${total}
                </span>
            </div>
        </div>
    `;

    if (this.isMobile) {
      jQuery("#content_value").eq(0).prepend(preloaderContent);
    } else {
      jQuery("#contentContainer").eq(0).prepend(preloaderContent);
    }
  },
  updateProgress: function (elementToUpate, itemsLength, index) {
    jQuery(elementToUpate).text(`${index}/${itemsLength}`);
  },
  updateProgressBar: function (index, total) {
    jQuery("#progress").css("width", `${((index + 1) / total) * 100}%`);
    jQuery(".count").text(`${index + 1}/${total}`);
    if (index + 1 == total) {
      jQuery("#progressbar").fadeOut(1000);
    }
  },
  getAll: function (
    urls, // array of URLs
    onLoad, // called when any URL is loaded, params (index, data)
    onDone, // called when all URLs successfully loaded, no params
    onError // called when a URL load fails or if onLoad throws an exception, params (error)
  ) {
    var numDone = 0;
    var lastRequestTime = 0;
    var minWaitTime = this.delayBetweenRequests; // ms between requests
    loadNext();
    function loadNext() {
      if (numDone == urls.length) {
        onDone();
        return;
      }

      let now = Date.now();
      let timeElapsed = now - lastRequestTime;
      if (timeElapsed < minWaitTime) {
        let timeRemaining = minWaitTime - timeElapsed;
        setTimeout(loadNext, timeRemaining);
        return;
      }
      lastRequestTime = now;
      jQuery
        .get(urls[numDone])
        .done((data) => {
          try {
            onLoad(numDone, data);
            ++numDone;
            loadNext();
          } catch (e) {
            onError(e);
          }
        })
        .fail((xhr) => {
          onError(xhr);
        });
    }
  },
  findVillageInDB: function (x, y) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("villagesDb");

      req.onerror = function (event) {
        console.error("findVillageInDB:", event.target.errorCode);
        reject(event.target.errorCode);
      };

      req.onsuccess = function () {
        const db = this.result;
        const transaction = db.transaction(["villages"], "readonly");

        const index = objectStore.index("name");
        index.get("coords").onsuccess = (event) => {
          console.log(`Result is ${event.target.result}`);
        };

        const objectStore = transaction.objectStore("villages");
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.villageX === x && cursor.value.villageY === y) {
              console.log(
                `ID for Village ${x}|${y} is ${cursor.value.villageId}`
              );
              resolve(cursor.value); // Resolve the promise with the found value
            } else {
              cursor.continue();
            }
          } else {
            console.log("No more entries!");
            resolve(null); // Resolve the promise with null if no match is found
          }
        };
      };
    });
  },
};

let intervalId;
let results = [];
let commands = [];
let targetVillages = [
  "458|446",
  "485|457",
  "456|471",
  "435|443",
  "434|434",
  "438|427",
  "438|426",
  "437|425",
  "427|433",
  "437|423",
  "436|423",
  "426|432",
  "434|424",
  "431|425",
  "432|423",
  "431|423",
  "425|430",
  "426|431",
  "437|426",
  "427|422",
  "431|426",
  "432|418",
  "434|420",
  "426|429",
  "424|424",
  "423|424",
  "427|423",
  "428|421",
  "421|428",
  "418|425",
  "423|423",
  "414|429",
  "416|426",
  "419|425",
  "422|421",
  "417|424",
  "451|401",
  "417|426",
  "419|419",
  "416|427",
  "417|419",
  "412|424",
  "415|421",
  "416|419",
  "417|420",
  "414|420",
  "423|427",
  "411|417",
  "427|417",
];

(async function () {
  console.log("IIFE called.");
  // const villages = await twSDK.worldDataAPI("village");
  openUI();

  async function loadHTML(url) {
    let fullurl = `${scriptConfig.baseScriptUrl}/${url}`;
    try {
      const response = await fetch(fullurl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const htmlContent = await response.text();
      document.getElementById("content").innerHTML = htmlContent;
    } catch (error) {
      console.error("Error loading HTML:", error);
    }
  }

  function showLastUpdatedDb() {
    const lastUpdatedDate = new Date(Number(window.twSDK.lastUpdated));
    const now = new Date();
    const timeDifference = now - lastUpdatedDate;
    const formattedDate = lastUpdatedDate.toLocaleString();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeAgo;
    if (days > 0) {
      timeAgo = `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      timeAgo = `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      timeAgo = `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    // Update the HTML
    document.getElementById("lastUpdatedDate").textContent = formattedDate;
    document.getElementById("timeAgo").textContent = timeAgo;
  }

  function addRowToTable(row) {
    $("#myTable").append(row);
  }

  function readWorkbenchExport() {
    let text = document.getElementById("urlvalue");

    console.log(text.value);

    if (text.value !== "") {
      results = convertWBPlanToArray(text.value);
      addRowToTable(results);
    }

    // Set an interval to add a new row every second
    // intervalId = setInterval(addRow, 250);

    // Event delegation to handle row removal
    $(document).on("click", ".removeRow", function () {
      $(this).closest("tr").remove();
    });
  }

  function parseBool(input) {
    if (typeof input === "string") {
      return input.toLowerCase() === "true";
    } else if (typeof input === "boolean") {
      return input;
    } else {
      console.error(
        `${scriptInfo}: Invalid input: needs to be a string or boolean.`
      );
      return false;
    }
  }

  function readVillageCoords() {
    console.log("Read Village Coords function executed");

    const matches = inputString.match(twSDK.coordsRegex);
    console.log("Matches:", matches);

    return matches || [];
  }

  function convertWBPlanToArray(plan) {
    console.log("convertWBPlanToArray called.");

    const pattern = /==(?=[^\/])/g;
    // Using the pattern to split and keep the delimiter
    const planArray = plan
      .replace(/\s+/g, "") // Remove all spaces
      .split(pattern)
      .map((part, index, array) =>
        index < array.length - 1 ? part + "==" : part
      );

    let planObjects = [];

    for (let i = 0; i < planArray.length; i++) {
      let planParts = planArray[i].split("&");
      let units = planParts[7].split("/").reduce((obj, str) => {
        if (!str) {
          return obj;
        }
        const [unit, value] = str.split("=");
        if (unit === undefined || value === undefined) {
          return obj;
        }
        obj[unit] = parseInt(atob(value));
        return obj;
      }, {});

      let planObject = {
        commandId: i.toString(),
        originVillageId: parseInt(planParts[0]),
        targetVillageId: parseInt(planParts[1]),
        slowestUnit: planParts[2],
        arrivalTimestamp: parseInt(planParts[3]),
        type: parseInt(planParts[4]),
        drawIn: parseBool(planParts[5]),
        sent: parseBool(planParts[6]),
        units: units,
      };

      planObjects.push(planObject);
      if (DEBUG) console.debug(`Plan object ${i} created: `, planObject);
    }

    if (DEBUG) console.debug(`Plan objects created: `, planObjects);
    return planObjects;
  }

  async function addRadioControls() {
    document
      .getElementById("loadPlannerBtn")
      .addEventListener("click", function () {
        const coordRadio = document.getElementById("coord");
        const wbRadio = document.getElementById("wb");

        if (coordRadio.checked) {
          readVillageCoords();
        } else if (wbRadio.checked) {
          readWorkbenchExport();
        } else {
          alert("Please select a mode.");
        }
      });
  }

  async function readIncs() {
    console.log("readIncs called.");
    let commandIDs = [];

    const start = performance.now();
    async function fetchPages(targetVillages) {
      let pages = await Promise.all(
        targetVillages.map(async (village) => {
          try {
            const villageData = await twSDK.findVillageInDB(
              village.split("|")[0],
              village.split("|")[1]
            );
            if (villageData) {
              console.log("Found village:", villageData);
              if (villageData.villageId) {
                return `/game.php?screen=info_village&id=${villageData.villageId}`;
              }
            } else {
              console.log("Village not found");
            }
          } catch (error) {
            console.error("Error:", error);
          }
          return null;
        })
      );

      pages = pages.filter((url) => url !== null);
      return pages;
    }
    const pagesToFetch = await fetchPages(targetVillages);
    const end = performance.now();
    console.log(`loadWBCode took ${end - start} milliseconds`);

    if (pagesToFetch.length) {
      twSDK.startProgressBar(pagesToFetch.length);
      await twSDK.getAll(
        pagesToFetch,
        function (index, data) {
          twSDK.updateProgressBar(index, pagesToFetch.length);
          console.log("Fetching data for village:", pagesToFetch[index]);
          // console.log("Index:", index);
          // console.log("Data:", data);

          // const htmlDoc = jQuery.parseHTML(data);
          let $cc = jQuery(data).find(".commands-container");
          if ($cc.length > 0) {
            $cc
              .find("table")
              .first()
              .find(".quickedit-out")
              .each(function () {
                let commandID = $(this).attr("data-id");
                console.log(commandID);
                commandIDs.push(commandID);
              });

            $cc
              .find("table")
              .first()
              .find(".command-row")
              .each(function () {
                commands.push($(this));
                addRowToTable($(this));
              });

            $(".widget-command-timer").addClass("timer");
            Timing.tickHandlers.timers.initTimers("widget-command-timer");

            //#region read Troop Details
            const troopDetailsCheckbox =
              document.getElementById("troop_details");
            const isChecked = troopDetailsCheckbox.checked;

            if (isChecked) {
              let timerId = setInterval(function () {
                if (commandIDs.length > 0) {
                  let item = commandIDs.shift();
                  console.log("Processing:", item);
                  jQuery
                    .ajax({
                      url: `/game.php?screen=info_command&ajax=details&id=${item}`,
                      dataType: "json",
                    })
                    .done((response) => {
                      const { no_authorization } = response;
                      if (no_authorization) {
                        console.error(`Error:`, data);
                      } else {
                        console.log(response);
                        results.push(response);
                      }
                    })
                    .fail((textStatus, errorThrown) => {
                      console.error(
                        `Request failed: ${textStatus}, ${errorThrown}`
                      );
                    });
                } else {
                  // Step 4: Clear the interval when the array is empty
                  clearInterval(timerId);
                  console.log("All items processed.");
                }
              }, 400);
            }
            //#endregion
          }
          // const incomingRows = jQuery(htmlDoc).find(
          //   "#incomings_table tbody tr.nowrap"
          // );
          // jQuery("#incomings_table tbody:last-child").append(incomingRows);
          // jQuery('#incomings_table tbody tr:not(".nowrap"):eq(1)')
          //   .detach()
          //   .appendTo("#incomings_table tbody:last-child");
        },

        function () {
          // initIncomingsOverview();
          UI.SuccessMessage("All villages fetched!");
        },
        function (error) {
          UI.ErrorMessage("Error fetching incomings page!");
          console.error(`${scriptInfo} Error:`, error);
        }
      );
    } else {
      UI.ErrorMessage("No villages to fetch!");
    }
  }

  async function readDatabase() {
    const villages = await twSDK.worldDataAPI("village");

    const request = indexedDB.open("villagesDb", 1);
    request.onerror = function (event) {
      console.error("Database error:", event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["villages"], "readonly");
      const objectStore = transaction.objectStore("villages");

      const myIndex = objectStore.index("coords");
      myIndex.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log("Key:", cursor);
          cursor.continue();
        } else {
          console.log("Entries all displayed.");
        }
      };

      const key = 16831;
      const getRequest = objectStore.get(key);

      getRequest.onerror = function (event) {
        console.error("Get request error:", event.target.errorCode);
      };

      getRequest.onsuccess = function (event) {
        if (getRequest.result) {
          console.log("Value:", getRequest.result);
        } else {
          console.log("No matching record found");
        }
      };
    };
  }

  async function openUI() {
    const html = `<div id="content"></div>`;
    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);

    await loadHTML("ui.html", "content");
    Timing.tickHandlers.timers.init();

    // document
    //   .getElementById("of")
    //   .addEventListener("change", () => setMode("members_troops"));
    // document
    //   .getElementById("in")
    //   .addEventListener("change", () => setMode("members_defense"));
    document.getElementById("run").addEventListener("click", readIncs);
    document.getElementById("update").addEventListener("click", readDatabase);
    // document.getElementById('troop_details').addEventListener('click', readCheckboxValue);

    showLastUpdatedDb();
    addRadioControls();
  }
})();
