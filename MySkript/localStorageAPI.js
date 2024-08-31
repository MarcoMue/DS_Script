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
        dbName: "c_villagesDb",
        dbVersion: 1,
        dbTable: "villages",
        key: "villageId",
        indexes: [{ name: "coordIndex", key: "coords", unique: true }],
        url: "/map/village.txt",
      },
      player: {
        dbName: "playersDb",
        dbVersion: 1,
        dbTable: "players",
        key: "playerId",
        indexes: [],
        url: "/map/player.txt",
      },
      ally: {
        dbName: "tribesDb",
        dbVersion: 1,
        dbTable: "tribes",
        key: "tribeId",
        indexes: [],
        url: "/map/ally.txt",
      },
      conquer: {
        dbName: "conquerDb",
        dbVersion: 1,
        dbTable: "conquer",
        key: "",
        indexes: [],
        url: "/map/conquer_extended.txt",
      },
    },
    storeDataInLocalStorage: function (data) {
      console.log("Library Method 1 called with data:", data);
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
      console.log("Library Method 2 called with param:", param);
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
    updateDB: async function (entity) {
      console.log("IndexedDB called with entity:", entity);

      const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
      const LAST_UPDATED_TIME = localStorage.getItem(`${entity}_last_updated`);

      // check if entity is allowed and can be fetched
      const allowedEntities = ["village", "player", "ally", "conquer"];
      if (!allowedEntities.includes(entity)) {
        throw new Error(`Entity ${entity} does not exist!`);
      }

      const { dbName, dbTable, dbVersion, key, indexes, url } =
        c_sdk.dbConfig[entity];

      const { Village } = c_sdk.types;

      // initial world data
      const worldData = {};

      // Helpers: Fetch entity data and save to localStorage
      const fetchDataAndSave = async () => {
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

                  return {
                    villageId: parseInt(item[0]),
                    villageName: c_sdk.cleanString(item[1]),
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
                    playerName: c_sdk.cleanString(item[1]),
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
                    tribeName: c_sdk.cleanString(item[1]),
                    tribeTag: c_sdk.cleanString(item[2]),
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
          throw new Error(`Error fetching data for ${entity}: ${error}`);
        }
      };

      // Helpers: Save to IndexedDb storage
      async function saveToIndexedDbStorage(data) {
        const DBOpenRequest = indexedDB.open(dbName, dbVersion);

        DBOpenRequest.onupgradeneeded = function (event) {
          const db = event.target.result;

          let objectStore;
          if (key.length) {
            objectStore = db.createObjectStore(dbTable, {
              keyPath: key,
            });

            if (indexes.length > 0) {
              objectStore.createIndex(indexes[0].name, indexes[0].key, {
                unique: indexes[0].unique,
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
      //TEMP: do it anyway
      worldData[entity] = await fetchDataAndSave();
    },
  };
})();
