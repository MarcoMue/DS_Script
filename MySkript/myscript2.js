if (typeof DEBUG !== "boolean") DEBUG = false;
// TODO init and load DB for villages and players / tribes
// TODO: use Bundler to load all files

// Function to dynamically load a script
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

(async function () {
  console.log("IIFE called.");

  if (typeof jQuery === "undefined") {
    throw new Error("jQuery is required for this script to work.");
  }

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
        "Error fetching village incomings!":
          "Error fetching village incomings!",
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
        "Get Incs for Player":
          "Récupérer les attaques entrantes pour le Joueur",
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
  let twSDK = {
    // variables
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
    dbConfig: {
      village: {
        dbName: "villagesDb",
        dbVersion: 1,
        dbTable: "villages",
        key: "villageId",
        indexes: [{ name: "coordIndex", key: "coords", unique: true }],
        url: this.worldDataVillages,
      },
      player: {
        dbName: "playersDb",
        dbVersion: 1,
        dbTable: "players",
        key: "playerId",
        indexes: [],
        url: this.worldDataPlayers,
      },
      ally: {
        dbName: "tribesDb",
        dbVersion: 1,
        dbTable: "tribes",
        key: "tribeId",
        indexes: [],
        url: this.worldDataTribes,
      },
      conquer: {
        dbName: "conquerDb",
        dbVersion: 1,
        dbTable: "conquer",
        key: "",
        indexes: [],
        url: this.worldDataConquests,
      },
    },
    // functions
    csvToArray: function (strData, strDelimiter = ",") {
      let objPattern = new RegExp(
        "(\\" +
          strDelimiter +
          "|\\r?\\n|\\r|^)" +
          '(?:"([^"]*(?:""[^"]*)*)"|' +
          '([^"\\' +
          strDelimiter +
          "\\r\\n]*))",
        "gi"
      );
      let arrData = [[]];
      let arrMatches = null;
      while ((arrMatches = objPattern.exec(strData))) {
        let strMatchedDelimiter = arrMatches[1];
        if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
        ) {
          arrData.push([]);
        }
        let strMatchedValue;

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
    worldDataAPI: async function (entity) {
      console.log("worldDataAPI called with entity:", entity);

      const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
      const LAST_UPDATED_TIME = localStorage.getItem(`${entity}_last_updated`);

      // check if entity is allowed and can be fetched
      const allowedEntities = ["village", "player", "ally", "conquer"];
      if (!allowedEntities.includes(entity)) {
        throw new Error(`Entity ${entity} does not exist!`);
      }

      const dbName = twSDK.dbConfig[entity].dbName;
      const dbTable = twSDK.dbConfig[entity].dbTable;
      const dbVersion = twSDK.dbConfig[entity].dbVersion;
      const dbKey = twSDK.dbConfig[entity].key;
      const dbIndexes = twSDK.dbConfig[entity].indexes;

      // initial world data
      const worldData = {};

      // Helpers: Fetch entity data and save to localStorage
      const fetchDataAndSave = async () => {
        // const DATA_URL = twSDK.dbConfig[entity].url;

        console.log("Replacing URL:", twSDK.dbConfig[entity].url);
        const DATA_URL = `https://marcomue.github.io/DS_Script/rawData/${entity}.txt`;

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

          try {
            // save data in db
            saveToIndexedDbStorage(responseData);

            // update last updated localStorage item
            localStorage.setItem(
              `${entity}_last_updated`,
              Date.parse(new Date())
            );
          } catch (error) {
            // delete Database if an error occurs
            console.error("Error saving data to indexedDB:", error);
            // indexedDB.deleteDatabase(dbConfig[entity].dbName);
          }

          return responseData;
        } catch (error) {
          throw Error(`Error fetching ${DATA_URL}`);
        }
      };

      // Helpers: Save to IndexedDb storage
      async function saveToIndexedDbStorage(data) {
        const DBOpenRequest = indexedDB.open(dbName, dbVersion);

        DBOpenRequest.onupgradeneeded = function (event) {
          const db = event.target.result;

          let objectStore;
          if (dbKey.length) {
            objectStore = db.createObjectStore(dbTable, {
              keyPath: dbKey,
            });

            if (dbIndexes.length > 0) {
              objectStore.createIndex(dbIndexes[0].name, dbIndexes[0].key, {
                unique: dbIndexes[0].unique,
              });
            }
          } else {
            objectStore = db.createObjectStore(dbTable, {
              autoIncrement: true,
            });
          }

          const indexNames = objectStore.indexNames;
          for (let i = 0; i < indexNames.length; i++) {
            console.log(indexNames[i]);
          }
        };

        DBOpenRequest.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction(dbTable, "readwrite");
          const store = transaction.objectStore(dbTable);
          store.clear(); // clean store from items before adding new ones

          data.forEach((item) => {
            store.put(item);
          });

          UI.SuccessMessage("Database updated!");
        };

        DBOpenRequest.onerror = function (event) {
          console.error(
            "onerror saveToIndexedDbStorage:",
            event.target.errorCode
          );
        };
      }

      // Helpers: Read all data from indexedDB
      function getAllData() {
        return new Promise((resolve, reject) => {
          const DBOpenRequest = indexedDB.open(dbName, dbVersion);

          DBOpenRequest.onsuccess = (event) => {
            const db = event.target.result;

            const dbQuery = db
              .transaction(dbTable, "readwrite")
              .objectStore(dbTable)
              .getAll();

            dbQuery.onsuccess = (event) => {
              resolve(event.target.result);
            };

            dbQuery.onerror = (event) => {
              reject(event.target.error);
            };
          };

          DBOpenRequest.onerror = (event) => {
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
            twSDK.dbConfig[entity].dbName,
            twSDK.dbConfig[entity].dbTable
          );
        }
      } else {
        worldData[entity] = await fetchDataAndSave();
      }

      // transform the data so at the end an array of array is returned
      return objectToArray(worldData[entity], entity);
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
    villages: [],
    _getVillageIDByCoords: async function (x, y) {
      if (twSDK.villages.length === 0) {
        console.log("Villages not loaded yet.");
        twSDK.villages = await twSDK.worldDataAPI("village");
        showLastUpdatedDb();
      }
      return twSDK.villages.find((v) => v[2] === x && v[3] === y);
    },
    _getVillageById: async function (villageId) {
      if (twSDK.villages.length === 0) {
        console.log("Villages not loaded yet.");
        twSDK.villages = await twSDK.worldDataAPI("village");
        showLastUpdatedDb();
      }
      return twSDK.villages.find((v) => v[0] === villageId);
    },
    getAll: function (
      urls, // array of URLs
      onLoad, // called when any URL is loaded, params (index, data)
      onDone, // called when all URLs successfully loaded, no params
      onError // called when a URL load fails or if onLoad throws an exception, params (error)
    ) {
      let numDone = 0;
      let lastRequestTime = 0;
      let minWaitTime = this.delayBetweenRequests; // ms between requests
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
  };
  window.allIncs = twSDK;

  // Load the library script
  let scriptName = "localStorageAPI.js";
  await loadScript(
    `${scriptConfig.baseScriptUrl}/${scriptName}?` + new Date().getTime()
  )
    .then(() => {
      console.log(`${scriptName} loaded successfully`);
    })
    .catch((error) => {
      console.error("Error loading script:", error);
    });

  if (typeof c_sdk === "undefined") {
    throw new Error("c_sdk is required for this script to work.");
  }

  let results = [];
  let commands = [];
  let targetVillages = [];
  openUI();

  async function loadHTML(url, elementId) {
    let fullurl = `${scriptConfig.baseScriptUrl}/${url}`;
    try {
      const response = await fetch(fullurl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const htmlContent = await response.text();
      document.getElementById(elementId).innerHTML = htmlContent;
    } catch (error) {
      console.error("Error loading HTML:", error);
    }
  }

  function showLastUpdatedDb() {
    const lastUpdatedDate = new Date(Number(twSDK.lastUpdated));
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

  function convertWBPlanToArray(plan) {
    console.log("convertWBPlanToArray executed");

    const pattern = /==(?=[^\/])/g;
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

  function readWorkbenchExport() {
    let text = document.getElementById("urlvalue");
    console.log("ReadWorkbenchExport Text: ", text.value);

    if (text.value !== "") {
      return convertWBPlanToArray(text.value);
    }

    // let intervalId;

    // Set an interval to add a new row every second
    // intervalId = setInterval(addRow, 250);

    // Event delegation to handle row removal
    // $(document).on("click", ".removeRow", function () {
    //   $(this).closest("tr").remove();
    // });
  }

  function readVillageCoords() {
    console.log("readVillageCoords executed");

    let text = document.getElementById("urlvalue").value;
    const matches = text.match(twSDK.coordsRegex);
    console.log("readVillageCoords Matches:", matches);

    return matches || [];
  }

  function extractVillages(results) {
    console.log("extractVillages called.");
    let villages = [];
    results.forEach(async (result) => {
      let v1 = await twSDK._getVillageById(result.targetVillageId);
      let v2 = await twSDK._getVillageIDByCoords(v1[2], v1[3]);

      //ID 0: 4941
      //NAME 1: "006"
      //X 2: "499"
      //Y 3: "489"
      //? 4: 1577266935
      //? 5: 4172
      //Bonustype 6: 6
      // console.log("Village 1:", v1, v2);
      villages.push(v1);
    });
    return villages;
  }

  async function addRadioControls() {
    document
      .getElementById("loadPlannerBtn")
      .addEventListener("click", async function () {
        const coordRadio = document.getElementById("coord");
        const wbRadio = document.getElementById("wb");

        if (coordRadio.checked) {
          targetVillages = readVillageCoords();
        } else if (wbRadio.checked) {
          let results = readWorkbenchExport();
          targetVillages = extractVillages(results);
        } else {
          alert("Please select a mode.");
        }
      });
  }

  async function readIncs() {
    console.log("readIncs called.");
    let commandIDs = [];

    async function fetchPages(targetVillages) {
      let pages = await Promise.all(
        targetVillages.map(async (village) => {
          console.log("Fetching village:", village);
          return `/game.php?screen=info_village&id=${village[0]}`;
        })
      );

      pages = pages.filter((url) => url !== null);
      return pages;
    }
    const pagesToFetch = await fetchPages(targetVillages);

    if (pagesToFetch.length) {
      twSDK.startProgressBar(pagesToFetch.length);
      twSDK.getAll(
        pagesToFetch,
        async function (index, data) {
          twSDK.updateProgressBar(index, pagesToFetch.length);
          // console.log("Fetching data for village:", pagesToFetch[index]);
          // console.log("Data:", data);

          let $cc = jQuery(data).find(".commands-container");
          if ($cc.length > 0) {
            $cc
              .find("table")
              .first()
              .find(".quickedit-out")
              .each(function () {
                let commandID = $(this).attr("data-id");
                commandIDs.push(commandID);
              });

            $cc
              .find("table")
              .first()
              .find(".command-row")
              .each(function () {
                // Select the current row
                let $row = $(this);

                $row.append(
                  `<td class="command-cell">Command ID: ${$row.attr(
                    "data-id"
                  )}</td>`
                );

                // Create a new element to insert before the row
                let $newElement = $(
                  `<td class="command-cell">Village: ${targetVillages[index]}</td>`
                );
                // Insert the new element before the row
                $row.before($newElement);

                // Push the modified row to the commands array
                commands.push($row);

                // Append the modified row to #myTable
                $("#myTable").append($row);
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

  async function TestButton1() {
    try {
      console.log(await c_sdk.getVillageByCoordinates(452, 479));
      console.log(await c_sdk.getVillageById(42));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function TestButton2() {
    try {
      console.log(await c_sdk.getVillageById(42));
      console.log(await c_sdk.getVillageByCoordinates(452, 479));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function openUI() {
    const html = `<div id="content"></div>`;
    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);

    await loadHTML("ui.html", "content");
    Timing.tickHandlers.timers.init();

    document.getElementById("run").addEventListener("click", readIncs);
    document.getElementById("test1").addEventListener("click", TestButton1);
    document.getElementById("test2").addEventListener("click", TestButton2);

    showLastUpdatedDb();
    setInterval(showLastUpdatedDb, 5000);
    addRadioControls();

    let vv = await c_sdk.fetchAndUpdateDB("village");
    console.log("Villages:", vv);

    Lib.loggy("UI loaded.");
  }
})();
