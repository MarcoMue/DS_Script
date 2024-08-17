if (typeof DEBUG !== "boolean") DEBUG = false;
DEBUG = true;

// TODO fix timer
// TODO expand Table
// TODO add more Player Info
// TODO add more Village Info
// TODO fix Icon Tooltip

// User Input
// Script Config
let scriptConfig = {
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
  allowedScreens: ["info_player"],
  allowedModes: [],
  isDebug: DEBUG,
  enableCountApi: true,
};
let intervalId;
let results = [];
let commands = [];
let villiges = [""];

(function () {
  console.log("IIFE called.");
  fetchWorldData();
  openUI();

  function openUI() {
    const html = `   
        <h1>All Incs</h1>
        <div>
        <form>
          <fieldset>
            <legend>Settings</legend>
            <p>
              <input type="radio" name="mode" id="of" value="Read troops of the village">
              Read troops of the village
            </p>
            <p>
              <input type="radio" name="mode" id="in" value="Read defenses in the village">
              Read defenses in the village
            </p>
          </fieldset>
          <fieldset>
            <legend>Filters</legend>
            <input type="text" id="urlvalue">
            <input type="button" class="btn evt-confirm-btn btn-confirm-yes" id="loadPlannerBtn" value="Load Planner">
            <p>
              <table id="myTable">
                <tr>
                  <th>First</th>
                  <th>Two</th>
                  <th>Three</th>
                  <th>Last</th>
                </tr>
              </table>
            </p>
          </fieldset>
          <div>
            <p>
              <input type="button" class="btn evt-confirm-btn btn-confirm-yes" id="run" value="Read data">
            </p>
          </div>
        </form>
      </div>
    `;
    // Dialog.show("Troop counter", html);

    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);
    Timing.tickHandlers.timers.init();

    document
      .getElementById("of")
      .addEventListener("change", () => setMode("members_troops"));
    document
      .getElementById("in")
      .addEventListener("change", () => setMode("members_defense"));
    document
      .getElementById("loadPlannerBtn")
      .addEventListener("click", loadWBCode);
    document.getElementById("run").addEventListener("click", readData);
  }

  function addRow(row) {
    // if (results.length === 0) {
    //   clearInterval(intervalId);
    //   return;
    // }

    // const rowData = results.shift(); // Get the first element and remove it from the array
    // const newRow = `
    //       <tr>
    //         <td>${rowData.commandId}</td>
    //         <td>${rowData.originVillageId}</td>
    //         <td>${rowData.targetVillageId}</td>
    //         <td><button class="removeRow">Remove</button></td>
    //       </tr>
    //       `;

    $("#myTable").append(row);
  }

  function loadWBCode() {
    let data = document.getElementById("urlvalue").value;

    if (data) {
      results = convertWBPlanToArray(data);
      addRow(results);
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

  function readData() {
    console.log("readData called.");
    let items = []; // Example items

    $.get(
      // $(".village_anchor").first().find("a").first().attr("href"),
      "/game.php?screen=info_village&id=2087",
      function (html) {
        let $cc = $(html).find(".commands-container");
        if ($cc.length > 0) {
          // <form id="command-data-form" action="/game.php?village=6963&amp;screen=place&amp;action=command" method="post" onsubmit="this.submit.disabled=true;" style="min-width: 800px">
          // $('form[action*="action=command"]')
          //   .find("table")
          //   .first()
          //   .css("float", "left")
          //   .find("tr")
          //   .last()
          //   .after($cc.find("table").parent().html());

          $cc
            .find("table")
            .first()
            .find(".quickedit-out")
            .each(function () {
              // console.log($(this).attr("data-id"));
              let commandID = $(this).attr("data-id");
              console.log(commandID);
              items.push(commandID);
            });

          $cc
            .find("table")
            .first()
            .find(".command-row")
            .each(function () {
              commands.push($(this));
              addRow($(this));
            });

          let timerId = setInterval(function () {
            // Step 3: Fetch and process the item
            if (items.length > 0) {
              let item = items.shift(); // Fetch the first item
              console.log("Processing:", item); // Process the item (example: log it)
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
                    // addRow(response);
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
        } else {
          UI.ErrorMessage("No commands found", $cc);
        }
      }
    );
  }

  async function worldDataAPI(entity) {
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
      const dbConnect = indexedDB.open(dbName);

      dbConnect.onupgradeneeded = function () {
        const db = dbConnect.result;
        if (keyId.length) {
          db.createObjectStore(table, {
            keyPath: keyId,
          });
        } else {
          db.createObjectStore(table, {
            autoIncrement: true,
          });
        }
      };

      dbConnect.onsuccess = function () {
        const db = dbConnect.result;
        const transaction = db.transaction(table, "readwrite");
        const store = transaction.objectStore(table);
        store.clear(); // clean store from items before adding new ones

        data.forEach((item) => {
          store.put(item);
        });

        UI.SuccessMessage("Database updated!");
      };
    }

    // Helpers: Read all villages from indexedDB
    function getAllData(dbName, table) {
      return new Promise((resolve, reject) => {
        const dbConnect = indexedDB.open(dbName);

        dbConnect.onsuccess = () => {
          const db = dbConnect.result;

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

        dbConnect.onerror = (event) => {
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
  }

  async function fetchWorldData() {
    try {
      const villages = await worldDataAPI("village");
      return { villages };
    } catch (error) {
      UI.ErrorMessage(error);
      console.error(`${scriptInfo} Error:`, error);
    }
  }
})();
