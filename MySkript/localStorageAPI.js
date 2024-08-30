// Define some methods in the library script
window.c_sdk = {
  types: {
    Village: class {
      constructor(name, age) {
        this.name = name;
        this.age = age;
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
  },
  config: {
    worldDataVillages: "/map/village.txt",
    worldDataPlayers: "/map/player.txt",
    worldDataTribes: "/map/ally.txt",
    worldDataConquests: "/map/conquer_extended.txt",
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
  },
  libraryMethod1: function (data) {
    console.log("Library Method 1 called with data:", data);
  },
  libraryMethod2: function (param) {
    console.log("Library Method 2 called with param:", param);
  },
  updateDB: async function (entity) {
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
          console.error("Error saving data to indexedDB:", error);
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
  },
};

const { Village, Person, Car } = window.c_sdk.types;

// Create instances of your classes
const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);
const car1 = new Car("Toyota", "Corolla");
const car2 = new Car("Honda", "Civic");

// Create an object to hold all instances
const dataToSave = {
  persons: [person1, person2],
  cars: [car1, car2],
};

// Serialize the object to a JSON string
const jsonString = JSON.stringify(dataToSave);

// Save the JSON string to localStorage
localStorage.setItem("myData", jsonString);

// Retrieve the JSON string from localStorage
const retrievedJsonString = localStorage.getItem("myData");

// Deserialize the JSON string back to an object
const retrievedData = JSON.parse(retrievedJsonString);

// Recreate instances of your classes from the retrieved data
const retrievedPersons = retrievedData.persons.map(
  (p) => new Person(p.name, p.age)
);
const retrievedCars = retrievedData.cars.map((c) => new Car(c.make, c.model));

// Log the retrieved instances to verify
console.log(retrievedPersons);
console.log(retrievedCars);