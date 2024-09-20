// TODO rename to storageAPI.js

(function () {
  window.c_sdk = {
    types: {
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
      Person: class {
        constructor(name, age) {
          this.name = name;
          this.age = age;
        }
      },
      Car: class {
        constructor(make, model) {
          this.make = make;
          this.model = model;
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
          snob
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
        }
      },
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
        dbVersion: 1,
        dbTable: "troops",
        key: ["playerId", "createdAt"],
        indexes: [],
        url: null,
      },
      village: {
        dbName: "VillagesDB",
        dbVersion: 1,
        dbTable: "villages",
        key: "id",
        indexes: [{ name: "coordIndex", key: "coord", unique: true }],
        url: "/map/village.txt",
      },
      player: {
        dbName: "PlayerDB",
        dbVersion: 1,
        dbTable: "players",
        key: "id",
        indexes: [],
        url: "/map/player.txt",
      },
      tribe: {
        dbName: "TribesDB",
        dbVersion: 1,
        dbTable: "tribes",
        key: "id",
        indexes: [],
        url: "/map/ally.txt",
      },
      conquer: {
        dbName: "conquerDb",
        dbVersion: 1,
        dbTable: "conquer",
        key: "villageId",
        indexes: [],
        url: "/map/conquer_extended.txt",
      },
    },
    storeDataInLocalStorage: function () {
      const { Village, Person, Car } = c_sdk.types;

      // Create instances of your classes
      const person1 = new Person("Alice", 30);
      const person2 = new Person("Bob", 25);
      const car1 = new Car("Toyota", "Corolla");
      const car2 = new Car("Honda", "Civic");
      const village1 = new Village("Village1", 100);

      // Create an object to hold all instances
      const dataToSave = {
        persons: [person1, person2],
        cars: [car1, car2],
        village: village1,
      };

      // Serialize the object to a JSON string
      const jsonString = JSON.stringify(dataToSave);

      // Save the JSON string to localStorage
      localStorage.setItem("myData", jsonString);
    },
    retrieveInstances: function (param) {
      console.log("retrieveInstances called with param:", param);
      const { Village, Person, Car } = c_sdk.types;

      // Retrieve the JSON string from localStorage
      const retrievedJsonString = localStorage.getItem("myData");

      // Deserialize the JSON string back to an object
      const retrievedData = JSON.parse(retrievedJsonString);

      // Recreate instances of your classes from the retrieved data
      const retrievedPersons = retrievedData.persons.map(
        (p) => new Person(p.name, p.age)
      );
      const retrievedCars = retrievedData.cars.map(
        (c) => new Car(c.make, c.model)
      );
      const retrievedVillage = new Village(
        retrievedData.village.name,
        retrievedData.village.age
      );

      // Log the retrieved instances to verify
      console.log(retrievedPersons);
      console.log(retrievedCars);
      console.log(retrievedVillage);
    },
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
    updateLastUpdatedTimestamp: function (entity) {
      localStorage.setItem(`${entity}_last_updated`, Date.parse(new Date()));
    },
    fetchAndUpdateDB: async function (entity) {
      console.log("IndexedDB called with entity:", entity);
      console.time("fetchAndUpdateDB");

      const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
      const LAST_UPDATED_TIME = localStorage.getItem(`${entity}_last_updated`);
      const allowedEntities = ["village", "player", "tribe", "conquer"];

      // Check if entity is allowed
      if (!allowedEntities.includes(entity)) {
        console.error(`Entity ${entity} is not allowed!`);
        throw new Error(`Entity ${entity} does not exist!`);
      }

      const { dbName, dbTable, dbVersion, key, indexes, url } =
        c_sdk.dbConfig[entity];
      const { Village, Player, Tribe, Conquer } = c_sdk.types;

      try {
        // Decide whether to fetch new data or get from IndexedDB
        let worldData;
        if (
          LAST_UPDATED_TIME &&
          Date.now() < parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL
        ) {
          // worldData = await getAllData();
        } else {
          return updateDatabase();
        }
        console.timeEnd("fetchAndUpdateDB");
      } catch (error) {
        console.error("Error in fetchAndUpdateDB:", error);
        throw error;
      }

      async function updateDatabase() {
        console.log("Fetching and saving data for entity:", entity);
        const DATA_URL = `https://marcomue.github.io/DS_Script/rawData/${entity}.txt`;

        try {
          const response = await jQuery.ajax(DATA_URL);
          const data = c_sdk.csvToArray(response);
          const responseData = mapDataToEntity(data);

          await saveToIndexedDbStorage(responseData);
          c_sdk.updateLastUpdatedTimestamp(entity);
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
                    c_sdk.cleanString(item[1]),
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
                    c_sdk.cleanString(item[1]),
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
                    c_sdk.cleanString(item[1]),
                    c_sdk.cleanString(item[2]),
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
        console.time("openDB");
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
              console.timeEnd("openDB");
            };
          };

          DBOpenRequest.onsuccess = function () {
            console.time("putData");
            const db = DBOpenRequest.result;
            const transaction = db.transaction(dbTable, "readwrite");
            const store = transaction.objectStore(dbTable);

            store.clear();
            data.forEach((item) => store.put(item));

            transaction.oncomplete = () => {
              console.timeEnd("putData");
              resolve("Data saved to indexedDB");
            };

            transaction.onerror = (event) => {
              console.timeEnd("putData");
              reject(event.target.error);
            };
          };

          DBOpenRequest.onerror = function (event) {
            console.timeEnd("openDB");
            reject(DBOpenRequest.error);
          };

          DBOpenRequest.onblocked = function () {
            console.error("Database open blocked");
            console.timeEnd("openDB");
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
    // Function to search for a record by coords using the index
    getVillageByCoordinates: async function (x, y) {
      console.time("getVillageByCoordinates");
      return new Promise((resolve, reject) => {
        const { dbName, dbTable, dbVersion, indexes } =
          c_sdk.dbConfig["village"];

        const DBOpenRequest = indexedDB.open(dbName, dbVersion);

        DBOpenRequest.onerror = function (event) {
          console.error("Database error:", event.target.errorCode);
          reject(event.target.errorCode);
        };

        DBOpenRequest.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction([dbTable], "readonly");
          const objectStore = transaction.objectStore(dbTable);
          const index = objectStore.index(indexes[0].name);
          const indeReq = index.get(`${x}|${y}`);

          indeReq.onerror = function (event) {
            console.time("getVillageByCoordinates");

            console.timeEnd("getVillageByCoordinates");

            console.error("Get request error:", event.target.errorCode);
            reject(event.target.errorCode);
          };

          indeReq.onsuccess = function (event) {
            if (indeReq.result) {
              console.timeEnd("getVillageByCoordinates");

              resolve(indeReq.result);
            } else {
              console.log("No matching record found");
              console.timeEnd("getVillageByCoordinates");
              resolve(null);
            }
          };
        };
      });
    },
    getVillageById: async function (villageId) {
      console.time("getVillageById");

      return new Promise((resolve, reject) => {
        const { dbName, dbTable, dbVersion } = c_sdk.dbConfig["village"];
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
            console.timeEnd("getVillageById");
            console.error("Get request error:", event.target.errorCode);
          };

          getRequest.onsuccess = function (event) {
            if (getRequest.result) {
              console.timeEnd("getVillageById");
              resolve(getRequest.result);
            } else {
              console.timeEnd("getVillageById");
              console.log("No matching record found");
              resolve(null);
            }
          };
        };
      });
    },

    getResultFromDB: async function (timestamp, playerID) {
      // Let us open our database
      const DBOpenRequest = window.indexedDB.open("TroopsDB", 1);

      DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result;
        getData();
      };

      function getData() {
        const transaction = db.transaction(["troops"], "readwrite");

        // report on the success of the transaction completing, when everything is done
        transaction.oncomplete = (event) => {
          console.log("Transaction completed.");
        };

        transaction.onerror = (event) => {
          console.log(
            "Transaction not opened due to error: ",
            transaction.error
          );
        };

        // create an object store on the transaction
        const objectStore = transaction.objectStore("troops");

        // Make a request to get a record by key from the object store

        console.log("Timestamp:", timestamp);
        console.log("PlayerID:", playerID);
        // debugger;
        // const objectStoreRequest = objectStore.get([playerID, timestamp]);

        const objectStoreRequest = objectStore.get([playerID, timestamp]);

        objectStoreRequest.onsuccess = (event) => {
          // report the success of our request
          console.log("Request successful.");

          const myRecord = objectStoreRequest.result;
          console.log("Result: ", myRecord);
        };
      }
      return new Date().getTime();
    },

    setMostRecentTimestamp: async function (entity) {
      localStorage.setItem(`${entity}_last_updated`, Date.parse(new Date()));
    },

    storeDataInIndexedDB: async function (entity, values, timestamp) {
      // TODO: add world to key
      let storageKey = `${entity}_last_updated`;
      let timestampsKey = `${entity}_timestamps`;

      let lastUpdate = localStorage.getItem(storageKey);
      lastUpdate = lastUpdate ? Number(lastUpdate) : null;

      // If the most recent timestamp is less than 15min old, do not update
      if (lastUpdate && new Date().getTime() - lastUpdate < 15 * 60 * 1000) {
        console.debug("Data is up-to-date. No need to update.");
        localStorage.setItem(storageKey, lastUpdate);
        return false;
      } else {
        console.debug("Data updated successfully.");
        let timestamps = JSON.parse(localStorage.getItem(timestampsKey)) || [];
        timestamps.push(timestamp);
        localStorage.setItem(timestampsKey, JSON.stringify(timestamps));

        let differences = c_sdk.calculateTimeDifferences(timestamps);
        console.log(differences);
      }

      const { dbName, dbTable, dbVersion, key, indexes } =
        c_sdk.dbConfig[entity];

      const DBOpenRequest = indexedDB.open(dbName, dbVersion);

      return new Promise((resolve, reject) => {
        DBOpenRequest.onupgradeneeded = function () {
          const db = DBOpenRequest.result;
          let objectStore;

          // Define the composite key as an array of fields
          if (key) {
            objectStore = db.createObjectStore(dbTable, {
              keyPath: key,
            });
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

          console.log("Data to store:", values);
          values.forEach((item) => {
            store.put(item);
          });

          transaction.oncomplete = () => {
            console.log("Data stored successfully");
            resolve();
          };

          transaction.onerror = function (event) {
            console.error("Transaction error:", event.target.error);
            reject(event.target.error);
          };
        };

        DBOpenRequest.onerror = function (event) {
          console.error("Database error:", event.target.error);
          reject(event.target.error);
        };
      });
    },

    calculateTimeDifferences: function (timestamps) {
      let differences = [];

      for (let i = 1; i < timestamps.length; i++) {
        let diffInMs = timestamps[i] - timestamps[i - 1];
        let diffInSeconds = Math.floor(diffInMs / 1000);
        let minutes = Math.floor(diffInSeconds / 60);
        let seconds = diffInSeconds % 60;
        differences.push({ minutes, seconds });
      }

      return differences;
    },

    // TODO:
    // resetbutton to clear db and localstorage
  };
})();
