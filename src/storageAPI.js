// Check if the UI library is loaded
if (typeof UI === "undefined") {
  console.error("UI library is not loaded.");

  // Define a placeholder UI object
  var UI = {
    SuccessMessage: function (message) {
      console.log("Placeholder SuccessMessage: " + message);
    },
    // Add other placeholder methods as needed
  };
}

const Lib = {
  // https://forum.die-staemme.de/index.php?threads/weltdaten-und-configs.183996/
  Village: class {
    constructor(id, name, x, y, player_id, points, bonus_id) {
      this.id = id;
      this.name = name;
      this.x = x;
      this.y = y;
      this.coord = `${x}|${y}`;
      this.player_id = player_id;
      this.points = points;
      this.bonus_id = bonus_id;
    }
  },
  Player: class {
    constructor(id, name, ally_id, villages, points, rank) {
      this.id = id;
      this.name = name;
      this.ally_id = ally_id;
      this.villages = villages;
      this.points = points;
      this.rank = rank;
    }
  },
  Tribe: class {
    constructor(id, name, tag, members, villages, points, allPoints, rank) {
      this.id = id;
      this.name = name;
      this.tag = tag;
      this.members = members;
      this.villages = villages;
      this.points = points;
      this.allPoints = allPoints;
      this.rank = rank;
    }
  },
  Conquer: class {
    constructor(
      villageId,
      unixTimestamp,
      newPlayerId,
      oldPlayerId,
      oldTribeId,
      newTribeId,
      villagePoints
    ) {
      this.villageId = villageId;
      this.unixTimestamp = unixTimestamp;
      this.newPlayerId = newPlayerId;
      this.oldPlayerId = oldPlayerId;
      this.oldTribeId = oldTribeId;
      this.newTribeId = newTribeId;
      this.villagePoints = villagePoints;
    }
  },
  PlayerTotalTroops: class {
    constructor(
      timestamp,
      playerId,
      spear,
      sword,
      axe,
      spy,
      light,
      heavy,
      ram,
      catapult,
      snob,
      outgoing,
      incoming
    ) {
      this.createdAt = timestamp;
      this.playerId = playerId;
      this.spear = spear;
      this.sword = sword;
      this.axe = axe;
      this.spy = spy;
      this.light = light;
      this.heavy = heavy;
      this.ram = ram;
      this.catapult = catapult;
      this.snob = snob;
      this.outgoing = outgoing;
      this.incoming = incoming;
    }
  },
  WorkbenchCommands: class {
    constructor(
      timestamp,
      playerId,
      spear,
      sword,
      axe,
      spy,
      light,
      heavy,
      ram,
      catapult,
      snob,
      outgoing,
      incoming
    ) {
      this.createdAt = timestamp;
      this.playerId = playerId;
      this.spear = spear;
      this.sword = sword;
      this.axe = axe;
      this.spy = spy;
      this.light = light;
      this.heavy = heavy;
      this.ram = ram;
      this.catapult = catapult;
      this.snob = snob;
      this.outgoing = outgoing;
      this.incoming = incoming;
    }
  },
  config: {
    basePath: "https://de228.die-staemme.de",
    worldInfoInterface: "/interface.php?func=get_config",
    unitInfoInterface: "/interface.php?func=get_unit_info",
    buildingInfoInterface: "/interface.php?func=get_building_info",
    worldDataVillages: "/map/village.txt",
    worldDataPlayers: "/map/player.txt",
    worldDataTribes: "/map/ally.txt",
    worldDataConquests: "/map/conquer_extended.txt",
  },
  dbConfig: {
    troops: {
      dbName: "TroopsDB",
      dbVersion: 2,
      dbTable: "troops",
      key: ["playerId", "createdAt"],
      indexes: [
        { name: "time", key: "timestamp" },
        { name: "id", key: "playerId" },
      ],
      url: null,
    },
    village: {
      dbName: "VillagesDB",
      dbVersion: 2,
      dbTable: "villages",
      key: "id",
      indexes: [{ name: "coordIndex", key: "coord", unique: true }],
      url: "/map/village.txt",
    },
    player: {
      dbName: "PlayerDB",
      dbVersion: 2,
      dbTable: "players",
      key: "id",
      indexes: [],
      url: "/map/player.txt",
    },
    tribe: {
      dbName: "TribesDB",
      dbVersion: 2,
      dbTable: "tribes",
      key: "id",
      indexes: [],
      url: "/map/ally.txt",
    },
    conquer: {
      dbName: "conquerDb",
      dbVersion: 2,
      dbTable: "conquer",
      key: "villageId",
      indexes: [],
      url: "/map/conquer_extended.txt",
    },
  },

  initAllDBs: async function () {
    const allowedEntities = ["village", "player", "tribe", "conquer"];
    const promises = [
      Lib.initDB("troops"),
      ...allowedEntities.map((entity) => Lib.initDB(entity)),
    ];

    const updatePromises = allowedEntities.map((entity) =>
      Lib.fetchAndUpdateDB(entity)
    );
    promises.push(...updatePromises);

    return Promise.all(promises);
  },

  csvToArray: function (/** @type {string} */ strData, strDelimiter = ",") {
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
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
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
  cleanString: function (/** @type {string} */ str) {
    try {
      return decodeURIComponent(str).replace(/\+/g, " ");
    } catch (error) {
      console.error(error, str);
      return str;
    }
  },
  updateLastUpdatedTimestamp: function (/** @type {string} */ entity) {
    localStorage.setItem(`${entity}_last_updated`, new Date().toDateString());
  },
  fetchAndUpdateDB: async function (/** @type {string} */ entity) {
    console.log("IndexedDB called with entity:", entity);

    const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
    const LAST_UPDATED_TIME = localStorage.getItem(`${entity}_last_updated`);
    const allowedEntities = ["village", "player", "tribe", "conquer"];

    // Check if entity is allowed
    if (!allowedEntities.includes(entity)) {
      console.error(`Entity ${entity} is not allowed!`);
      throw new Error(`Entity ${entity} does not exist!`);
    }

    const { dbName, dbTable, dbVersion, key, indexes } = Lib.dbConfig[entity];
    const { Village, Player, Tribe, Conquer } = Lib;

    try {
      // Decide whether to fetch new data or get from IndexedDB
      let worldData;
      if (
        LAST_UPDATED_TIME &&
        Date.now() < parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL
      ) {
        worldData = await getAllData();
      } else {
        return updateDatabase();
      }
    } catch (error) {
      console.error("Error in fetchAndUpdateDB:", error);
      throw error;
    }

    /**
     * @param {string} [url]
     */
    async function updateDatabase(url) {
      console.log("Fetching and saving data for entity:", entity);
      const DATA_URL = `https://marcomue.github.io/DS_Script/rawData/${entity}.txt`;

      try {
        const response = await jQuery.ajax(url || DATA_URL);
        const data = Lib.csvToArray(response);
        const responseData = mapDataToEntity(data);

        await saveToIndexedDbStorage(responseData);
        Lib.updateLastUpdatedTimestamp(entity);
        UI.SuccessMessage("Database updated!");
        return responseData;
      } catch (error) {
        console.error(`Error fetching data for ${entity}:`, error);
        throw new Error(`Error fetching data for ${entity}: ${error}`);
      }
    }

    function mapDataToEntity(data) {
      switch (entity) {
        case "village":
          return data
            .filter((item) => item[0] !== "")
            .map(
              (item) =>
                new Village(
                  parseInt(item[0]),
                  Lib.cleanString(item[1]),
                  item[2],
                  item[3],
                  parseInt(item[4]),
                  parseInt(item[5]),
                  parseInt(item[6])
                )
            );
        case "player":
          return data
            .filter((item) => item[0] !== "")
            .map(
              (item) =>
                new Player(
                  parseInt(item[0]),
                  Lib.cleanString(item[1]),
                  parseInt(item[2]),
                  parseInt(item[3]),
                  parseInt(item[4]),
                  parseInt(item[5])
                )
            );
        case "tribe":
          return data
            .filter((item) => item[0] !== "")
            .map(
              (item) =>
                new Tribe(
                  parseInt(item[0]),
                  Lib.cleanString(item[1]),
                  Lib.cleanString(item[2]),
                  parseInt(item[3]),
                  parseInt(item[4]),
                  parseInt(item[5]),
                  parseInt(item[6]),
                  parseInt(item[7])
                )
            );
        case "conquer":
          return data
            .filter((item) => item[0] !== "")
            .map(
              (item) =>
                new Conquer(
                  parseInt(item[0]),
                  parseInt(item[1]),
                  parseInt(item[2]),
                  parseInt(item[3]),
                  parseInt(item[4]),
                  parseInt(item[5]),
                  parseInt(item[6])
                )
            );
        default:
          return [];
      }
    }

    async function saveToIndexedDbStorage(data) {
      const DBOpenRequest = indexedDB.open(dbName, dbVersion);

      return new Promise((resolve, reject) => {
        DBOpenRequest.onupgradeneeded = function () {
          const db = DBOpenRequest.result;
          let objectStore;

          if (key) {
            objectStore = db.createObjectStore(dbTable, { keyPath: key });
            indexes.forEach((i) =>
              objectStore.createIndex(i.name, i.key, { unique: i.unique })
            );
          } else {
            objectStore = db.createObjectStore(dbTable, {
              autoIncrement: true,
            });
          }

          objectStore.transaction.oncomplete = () => {
            console.log("Object store created");
          };
        };

        DBOpenRequest.onsuccess = function () {
          const db = DBOpenRequest.result;
          const transaction = db.transaction(dbTable, "readwrite");
          const store = transaction.objectStore(dbTable);

          store.clear();
          data.forEach((item) => store.put(item));

          transaction.oncomplete = () => {
            resolve("Data saved to indexedDB");
          };

          transaction.onerror = (event) => {
            reject(DBOpenRequest.error);
          };
        };

        DBOpenRequest.onerror = function (event) {
          reject(DBOpenRequest.error);
        };

        DBOpenRequest.onblocked = function () {
          console.error("Database open blocked");
          reject(new Error("Database open blocked"));
        };
      });
    }

    async function getAllData() {
      console.log("Fetching data from IndexedDB");
      const DBOpenRequest = indexedDB.open(dbName, dbVersion);

      return new Promise((resolve, reject) => {
        DBOpenRequest.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(dbTable, "readonly");
          const store = transaction.objectStore(dbTable);
          const dbQuery = store.getAll();

          dbQuery.onsuccess = (event) => resolve(event.target.result);
          dbQuery.onerror = (event) => reject(event.target.error);
        };

        DBOpenRequest.onerror = (event) => reject(event.target.error);
      });
    }
  },

  // Somewhat broken
  // Function to search for a record by coords using the index
  getVillageByCoordinates: async function (
    /** @type {number} */ x,
    /** @type {number} */ y
  ) {
    return new Promise((resolve, reject) => {
      const { dbName, dbTable, dbVersion, indexes } = Lib.dbConfig["village"];
      const DBOpenRequest = indexedDB.open(dbName, dbVersion);

      DBOpenRequest.onerror = function () {
        console.error("Database error:", DBOpenRequest.error);
        reject(DBOpenRequest.error);
      };

      DBOpenRequest.onsuccess = function () {
        const db = DBOpenRequest.result;
        const transaction = db.transaction([dbTable], "readonly");
        const objectStore = transaction.objectStore(dbTable);
        const index = objectStore.index(indexes[0].name);
        const indeReq = index.get(`${x}|${y}`);

        indeReq.onerror = function () {
          console.error("Get request error:", DBOpenRequest.error);
          reject(DBOpenRequest.error);
        };

        indeReq.onsuccess = function () {
          if (indeReq.result) {
            resolve(indeReq.result);
          } else {
            console.log("No matching record found");
            resolve(null);
          }
        };
      };
    });
  },
  getVillageById: async function (villageId) {
    return new Promise((resolve, reject) => {
      const { dbName, dbTable, dbVersion } = Lib.dbConfig["village"];
      const DBOpenRequest = indexedDB.open(dbName, dbVersion);

      DBOpenRequest.onerror = function (event) {
        console.error("Database error:", event.target.errorCode);
        reject(event.target.errorCode);
      };

      DBOpenRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction([dbTable], "readonly");
        const objectStore = transaction.objectStore(dbTable);
        const getRequest = objectStore.get(villageId);

        getRequest.onerror = function (event) {
          console.error("Get request error:", event.target.errorCode);
        };

        getRequest.onsuccess = function (event) {
          if (getRequest.result) {
            resolve(getRequest.result);
          } else {
            console.log("No matching record found");
            resolve(null);
          }
        };
      };
    });
  },

  initDB: async function (
    /** @type {"troops" | "village" | "player" | "tribe" | "conquer"} */ entity
  ) {
    const allowedEntities = ["troops", "village", "player", "tribe", "conquer"];
    if (!allowedEntities.includes(entity)) {
      throw new Error(
        `Invalid entity: ${entity}. Allowed entities are: ${allowedEntities.join(
          ", "
        )}`
      );
    }

    const { dbName, dbTable, dbVersion, key, indexes } = this.dbConfig[entity];

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(dbTable)) {
          if (key) {
            let objectStore = db.createObjectStore(dbTable, {
              keyPath: key,
            });
            indexes.forEach((i) =>
              objectStore.createIndex(i.name, i.key, { unique: i.unique })
            );
          } else {
            reject("Key is missing!");
          }
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  readData: async function (
    /** @type {string} */ entity,
    /** @type {number} */ timestamp,
    /** @type {number} */ playerID
  ) {
    const db = await Lib.initDB(entity);
    const { dbTable } = Lib.dbConfig[entity];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([dbTable], "readwrite");
      const store = transaction.objectStore(dbTable);
      const request = store.get([playerID, timestamp]);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Error reading data:", playerID, timestamp);
        reject(request.error);
      };
    });
  },

  storeData: async function (entity, data) {
    const db = await Lib.initDB(entity);

    const { dbTable } = Lib.dbConfig[entity];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([dbTable], "readwrite");
      const store = transaction.objectStore(dbTable);

      // Array to hold promises for each put operation
      const promises = [];

      console.log("Data to store:", data);
      data.forEach((item) => {
        const request = store.put(item);
        // Create a promise for each request and push it to the array
        const promise = new Promise((resolve, reject) => {
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = () => {
            reject(request.error);
          };
        });
        promises.push(promise);
      });

      // Wait for all promises to resolve or reject
      Promise.all(promises)
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          reject(error);
        });

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  },

  deleteDataWithPartialKey: async function (entity, partialKey) {
    const db = await Lib.initDB(entity);
    const { dbTable } = Lib.dbConfig[entity];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([dbTable], "readwrite");
      const store = transaction.objectStore(dbTable);

      let count = 0;
      const request = store.openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          if (cursor.key[1] == partialKey) {
            const deleteRequest = cursor.delete();

            deleteRequest.onsuccess = () => {
              console.log(`Deleted record with key ${cursor.key}`);
              count++;
            };
            deleteRequest.onerror = () => {
              console.error(
                `Failed to delete record with key ${cursor.key}:`,
                request.error
              );
            };
          }
          cursor.continue();
        } else {
          resolve(count);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  },

  setMostRecentTimestamp: async function (entity) {
    localStorage.setItem(
      `${entity}_last_updated`,
      String(new Date().getTime())
    );
  },

  storeTroops: async function (
    /** @type {string} */ entity,
    /** @type {PlayerTotalTroops[]} */ values,
    /** @type {Date} */ updateTime
  ) {
    if (!(updateTime instanceof Date) || isNaN(updateTime.getTime())) {
      return false;
    }

    // TODO: add world to key
    let lastUpdateKey = `${entity}_last_updated`;
    let updateTimesKey = `${entity}_timestamps`;

    let lastUpdate = localStorage.getItem(lastUpdateKey);
    lastUpdate = lastUpdate ? Number(lastUpdate) : null;

    // TODO: debug change back from 2 to 15min
    if (lastUpdate && new Date().getTime() - lastUpdate < 5 * 60 * 1000) {
      console.debug("Data is up-to-date. No need to update.");
      return false;
    }

    await Lib.storeData(entity, values);

    console.debug("Data updated successfully.");
    let storedTimes = JSON.parse(localStorage.getItem(updateTimesKey)) || [];
    storedTimes.push(updateTime.getTime());

    try {
      localStorage.setItem(updateTimesKey, JSON.stringify(storedTimes));
      localStorage.setItem(lastUpdateKey, String(updateTime.getTime()));
    } catch (e) {
      console.error("Failed to update localStorage:", e);
      return false;
    }
  },

  deleteTroops: async function (
    /** @type {string} */ entity,
    /** @type {Date} */ date
  ) {
    if (!(date instanceof Date)) {
      throw new Error("timestamp must be a Date object");
    }

    let updateTimesKey = `${entity}_timestamps`;
    let storedTimes;

    try {
      storedTimes = JSON.parse(localStorage.getItem(updateTimesKey)) || [];
    } catch (error) {
      console.error("Failed to parse stored times:", error);
      storedTimes = [];
    }

    try {
      storedTimes = storedTimes.filter(
        (time) => Number(time) !== date.getTime()
      );
      let count = await Lib.deleteDataWithPartialKey("troops", date.getTime());
      console.debug(`Deleted ${count} records`);
    } catch (error) {
      console.error("Failed to delete data:", error);
      return false;
    }
    localStorage.setItem(updateTimesKey, JSON.stringify(storedTimes));

    return true;
  },

  calculateTimeDifferences: function (/** @type {string } */ timestamps) {
    let differences = [];

    for (let i = 1; i < timestamps.length; i++) {
      let diffInMs = Number(timestamps[i]) - Number(timestamps[i - 1]);
      let diffInSeconds = Math.floor(diffInMs / 1000);

      let months = Math.floor(diffInSeconds / (30 * 24 * 60 * 60));
      diffInSeconds %= 30 * 24 * 60 * 60;

      let days = Math.floor(diffInSeconds / (24 * 60 * 60));
      diffInSeconds %= 24 * 60 * 60;

      let hours = Math.floor(diffInSeconds / (60 * 60));
      diffInSeconds %= 60 * 60;

      let minutes = Math.floor(diffInSeconds / 60);
      let seconds = diffInSeconds % 60;

      differences.push({ months, days, hours, minutes, seconds });
    }

    return differences;
  },
};