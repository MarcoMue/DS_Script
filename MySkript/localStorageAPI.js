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
      return new Promise(async (resolve, reject) => {
        console.log("IndexedDB called with entity:", entity);
        console.time("fetchAndUpdateDB");

        const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
        const LAST_UPDATED_TIME = localStorage.getItem(
          `${entity}_last_updated`
        );

        // check if entity is allowed and can be fetched
        const allowedEntities = ["village", "player", "tribe", "conquer"];
        if (!allowedEntities.includes(entity)) {
          reject(`Entity ${entity} is not allowed!`);
          throw new Error(`Entity ${entity} does not exist!`);
        }

        const { dbName, dbTable, dbVersion, key, indexes, url } =
          c_sdk.dbConfig[entity];
        const { Village, Player, Tribe, Conquer } = c_sdk.types;

        // Helpers: Fetch entity data and save to localStorage
        async function fetchDataAndSave() {
          console.log("Replacing URL:", url);
          // const DATA_URL = url;
          const DATA_URL = `https://marcomue.github.io/DS_Script/rawData/${entity}.txt`;

          try {
            // fetch data
            const response = await jQuery.ajax(DATA_URL);
            const data = c_sdk.csvToArray(response);
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
                  // id, name, x, y, player_id, points, bonus_id
                  .map((item) => {
                    return new Village(
                      parseInt(item[0]),
                      c_sdk.cleanString(item[1]),
                      item[2],
                      item[3],
                      parseInt(item[4]),
                      parseInt(item[5]),
                      parseInt(item[6])
                    );
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
                    return new Player(
                      parseInt(item[0]),
                      c_sdk.cleanString(item[1]),
                      parseInt(item[2]),
                      parseInt(item[3]),
                      parseInt(item[4]),
                      parseInt(item[5])
                    );
                  });
                break;
              case "tribe":
                responseData = data
                  .filter((item) => {
                    if (item[0] != "") {
                      return item;
                    }
                  })
                  .map((item) => {
                    return new Tribe(
                      parseInt(item[0]),
                      c_sdk.cleanString(item[1]),
                      c_sdk.cleanString(item[2]),
                      parseInt(item[3]),
                      parseInt(item[4]),
                      parseInt(item[5]),
                      parseInt(item[6]),
                      parseInt(item[7])
                    );
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
                    return new Conquer(
                      parseInt(item[0]),
                      parseInt(item[1]),
                      parseInt(item[2]),
                      parseInt(item[3]),
                      parseInt(item[4]),
                      parseInt(item[5]),
                      parseInt(item[6])
                    );
                  });
                break;
              default:
                return [];
            }

            try {
              await saveToIndexedDbStorage(responseData);
            } catch (error) {
              console.error("Error saving data to indexedDB:", error);
            }
            return responseData;
          } catch (error) {
            throw new Error(`Error fetching data for ${entity}: ${error}`);
          }
        }

        async function saveToIndexedDbStorage(data) {
          console.time("openDB");
          return new Promise((resolve, reject) => {
            const DBOpenRequest = indexedDB.open(dbName, dbVersion);

            DBOpenRequest.onupgradeneeded = function () {
              const db = DBOpenRequest.result;
              let objectStore;

              if (key.length) {
                console.log("Creating object store with keyPath:", key);
                objectStore = db.createObjectStore(dbTable, { keyPath: key });

                if (indexes.length > 0) {
                  indexes.forEach((i) => {
                    objectStore.createIndex(i.name, i.key, {
                      unique: i.unique,
                    });
                  });
                }
              } else {
                console.log("Creating object store with autoIncrement key");
                objectStore = db.createObjectStore(dbTable, {
                  autoIncrement: true,
                });
              }

              // Transaction completed
              objectStore.transaction.oncompleted = (e) => {
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
              data.forEach((item) => {
                store.put(item);
              });

              transaction.oncomplete = () => {
                console.timeEnd("putData");
                return resolve();
              };
              transaction.onerror = (event) => {
                console.timeEnd("putData");
                return reject(event.target.errorCode);
              };

              c_sdk.updateLastUpdatedTimestamp(entity);
              UI.SuccessMessage("Database updated!");
              console.timeEnd("putData");
              resolve(DBOpenRequest.result);
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

        // Helpers: Read all data from indexedDB
        async function getAllData() {
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
        const worldData = {};
        /*
        if (LAST_UPDATED_TIME !== null) {
          if (
            Date.parse(new Date()) >=
            parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL
          ) {
            worldData[entity] = await fetchDataAndSave();
          } else {
            worldData[entity] = await getAllData(dbName, dbTable);
          }
        } else {
          worldData[entity] = await fetchDataAndSave();
        }
          */

        worldData[entity] = await fetchDataAndSave();

        console.timeEnd("fetchAndUpdateDB");
        resolve(worldData[entity]);
      });
    },
    // Function to search for a record by coords using the index
    // Bad performance
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
  };
})();
