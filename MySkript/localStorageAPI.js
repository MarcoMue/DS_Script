// TODO rename to storageAPI.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    window.c_sdk = {
        types: {
            // https://forum.die-staemme.de/index.php?threads/weltdaten-und-configs.183996/
            Village: /** @class */ (function () {
                function Village(id, name, x, y, player_id, points, bonus_id) {
                    this.id = id;
                    this.name = name;
                    this.x = x;
                    this.y = y;
                    this.coord = "".concat(x, "|").concat(y);
                    this.player_id = player_id;
                    this.points = points;
                    this.bonus_id = bonus_id;
                }
                return (Village);
            }()),
            Player: /** @class */ (function () {
                function Player(id, name, ally_id, villages, points, rank) {
                    this.id = id;
                    this.name = name;
                    this.ally_id = ally_id;
                    this.villages = villages;
                    this.points = points;
                    this.rank = rank;
                }
                return Player;
            }()),
            Tribe: /** @class */ (function () {
                function Tribe(id, name, tag, members, villages, points, allPoints, rank) {
                    this.id = id;
                    this.name = name;
                    this.tag = tag;
                    this.members = members;
                    this.villages = villages;
                    this.points = points;
                    this.allPoints = allPoints;
                    this.rank = rank;
                }
                return Tribe;
            }()),
            Conquer: /** @class */ (function () {
                function Conquer(villageId, unixTimestamp, newPlayerId, oldPlayerId, oldTribeId, newTribeId, villagePoints) {
                    this.villageId = villageId;
                    this.unixTimestamp = unixTimestamp;
                    this.newPlayerId = newPlayerId;
                    this.oldPlayerId = oldPlayerId;
                    this.oldTribeId = oldTribeId;
                    this.newTribeId = newTribeId;
                    this.villagePoints = villagePoints;
                }
                return Conquer;
            }()),
            Person: /** @class */ (function () {
                function Person(name, age) {
                    this.name = name;
                    this.age = age;
                }
                return Person;
            }()),
            Car: /** @class */ (function () {
                function Car(make, model) {
                    this.make = make;
                    this.model = model;
                }
                return Car;
            }()),
            PlayerTotalTroops: /** @class */ (function () {
                function PlayerTotalTroops(timestamp, playerId, spear, sword, axe, spy, light, heavy, ram, catapult, snob, outgoing, incoming) {
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
                return PlayerTotalTroops;
            }()),
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
            var _a = c_sdk.types, Village = _a.Village, Person = _a.Person, Car = _a.Car;
            // Create instances of your classes
            var person1 = new Person("Alice", 30);
            var person2 = new Person("Bob", 25);
            var car1 = new Car("Toyota", "Corolla");
            var car2 = new Car("Honda", "Civic");
            var village1 = new Village("Village1", 100);
            // Create an object to hold all instances
            var dataToSave = {
                persons: [person1, person2],
                cars: [car1, car2],
                village: village1,
            };
            // Serialize the object to a JSON string
            var jsonString = JSON.stringify(dataToSave);
            // Save the JSON string to localStorage
            localStorage.setItem("myData", jsonString);
        },
        retrieveInstances: function (param) {
            console.log("retrieveInstances called with param:", param);
            var _a = c_sdk.types, Village = _a.Village, Person = _a.Person, Car = _a.Car;
            // Retrieve the JSON string from localStorage
            var retrievedJsonString = localStorage.getItem("myData");
            // Deserialize the JSON string back to an object
            var retrievedData = JSON.parse(retrievedJsonString);
            // Recreate instances of your classes from the retrieved data
            var retrievedPersons = retrievedData.persons.map(function (p) { return new Person(p.name, p.age); });
            var retrievedCars = retrievedData.cars.map(function (c) { return new Car(c.make, c.model); });
            var retrievedVillage = new Village(retrievedData.village.name, retrievedData.village.age);
            // Log the retrieved instances to verify
            console.log(retrievedPersons);
            console.log(retrievedCars);
            console.log(retrievedVillage);
        },
        csvToArray: function (strData, strDelimiter) {
            if (strDelimiter === void 0) { strDelimiter = ","; }
            var objPattern = new RegExp("(\\" +
                strDelimiter +
                "|\\r?\\n|\\r|^)" +
                '(?:"([^"]*(?:""[^"]*)*)"|' +
                '([^"\\' +
                strDelimiter +
                "\\r\\n]*))", "gi");
            var arrData = [[]];
            var arrMatches = null;
            while ((arrMatches = objPattern.exec(strData))) {
                var strMatchedDelimiter = arrMatches[1];
                if (strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter) {
                    arrData.push([]);
                }
                var strMatchedValue = void 0;
                if (arrMatches[2]) {
                    strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
                }
                else {
                    strMatchedValue = arrMatches[3];
                }
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            return arrData;
        },
        cleanString: function (string) {
            try {
                return decodeURIComponent(string).replace(/\+/g, " ");
            }
            catch (error) {
                console.error(error, string);
                return string;
            }
        },
        updateLastUpdatedTimestamp: function (entity) {
            localStorage.setItem("".concat(entity, "_last_updated"), Date.parse(new Date()));
        },
        fetchAndUpdateDB: function (entity) {
            return __awaiter(this, void 0, void 0, function () {
                function updateDatabase() {
                    return __awaiter(this, void 0, void 0, function () {
                        var DATA_URL, response, data, responseData, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Fetching and saving data for entity:", entity);
                                    DATA_URL = "https://marcomue.github.io/DS_Script/rawData/".concat(entity, ".txt");
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, jQuery.ajax(DATA_URL)];
                                case 2:
                                    response = _a.sent();
                                    data = c_sdk.csvToArray(response);
                                    responseData = mapDataToEntity(data);
                                    return [4 /*yield*/, saveToIndexedDbStorage(responseData)];
                                case 3:
                                    _a.sent();
                                    c_sdk.updateLastUpdatedTimestamp(entity);
                                    UI.SuccessMessage("Database updated!");
                                    return [2 /*return*/, responseData];
                                case 4:
                                    error_1 = _a.sent();
                                    console.error("Error fetching data for ".concat(entity, ":"), error_1);
                                    throw new Error("Error fetching data for ".concat(entity, ": ").concat(error_1));
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                }
                function mapDataToEntity(data) {
                    switch (entity) {
                        case "village":
                            return data
                                .filter(function (item) { return item[0] !== ""; })
                                .map(function (item) {
                                return new Village(parseInt(item[0]), c_sdk.cleanString(item[1]), item[2], item[3], parseInt(item[4]), parseInt(item[5]), parseInt(item[6]));
                            });
                        case "player":
                            return data
                                .filter(function (item) { return item[0] !== ""; })
                                .map(function (item) {
                                return new Player(parseInt(item[0]), c_sdk.cleanString(item[1]), parseInt(item[2]), parseInt(item[3]), parseInt(item[4]), parseInt(item[5]));
                            });
                        case "tribe":
                            return data
                                .filter(function (item) { return item[0] !== ""; })
                                .map(function (item) {
                                return new Tribe(parseInt(item[0]), c_sdk.cleanString(item[1]), c_sdk.cleanString(item[2]), parseInt(item[3]), parseInt(item[4]), parseInt(item[5]), parseInt(item[6]), parseInt(item[7]));
                            });
                        case "conquer":
                            return data
                                .filter(function (item) { return item[0] !== ""; })
                                .map(function (item) {
                                return new Conquer(parseInt(item[0]), parseInt(item[1]), parseInt(item[2]), parseInt(item[3]), parseInt(item[4]), parseInt(item[5]), parseInt(item[6]));
                            });
                        default:
                            return [];
                    }
                }
                function saveToIndexedDbStorage(data) {
                    return __awaiter(this, void 0, void 0, function () {
                        var DBOpenRequest;
                        return __generator(this, function (_a) {
                            console.time("openDB");
                            DBOpenRequest = indexedDB.open(dbName, dbVersion);
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    DBOpenRequest.onupgradeneeded = function () {
                                        var db = DBOpenRequest.result;
                                        var objectStore;
                                        if (key) {
                                            objectStore = db.createObjectStore(dbTable, { keyPath: key });
                                            indexes.forEach(function (i) {
                                                return objectStore.createIndex(i.name, i.key, { unique: i.unique });
                                            });
                                        }
                                        else {
                                            objectStore = db.createObjectStore(dbTable, {
                                                autoIncrement: true,
                                            });
                                        }
                                        objectStore.transaction.oncomplete = function () {
                                            console.log("Object store created");
                                            console.timeEnd("openDB");
                                        };
                                    };
                                    DBOpenRequest.onsuccess = function () {
                                        console.time("putData");
                                        var db = DBOpenRequest.result;
                                        var transaction = db.transaction(dbTable, "readwrite");
                                        var store = transaction.objectStore(dbTable);
                                        store.clear();
                                        data.forEach(function (item) { return store.put(item); });
                                        transaction.oncomplete = function () {
                                            console.timeEnd("putData");
                                            resolve("Data saved to indexedDB");
                                        };
                                        transaction.onerror = function (event) {
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
                                })];
                        });
                    });
                }
                function getAllData() {
                    return __awaiter(this, void 0, void 0, function () {
                        var DBOpenRequest;
                        return __generator(this, function (_a) {
                            console.log("Fetching data from IndexedDB");
                            DBOpenRequest = indexedDB.open(dbName, dbVersion);
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    DBOpenRequest.onsuccess = function (event) {
                                        var db = event.target.result;
                                        var transaction = db.transaction(dbTable, "readonly");
                                        var store = transaction.objectStore(dbTable);
                                        var dbQuery = store.getAll();
                                        dbQuery.onsuccess = function (event) { return resolve(event.target.result); };
                                        dbQuery.onerror = function (event) { return reject(event.target.error); };
                                    };
                                    DBOpenRequest.onerror = function (event) { return reject(event.target.error); };
                                })];
                        });
                    });
                }
                var TIME_INTERVAL, LAST_UPDATED_TIME, allowedEntities, _a, dbName, dbTable, dbVersion, key, indexes, url, _b, Village, Player, Tribe, Conquer, worldData;
                return __generator(this, function (_c) {
                    console.log("IndexedDB called with entity:", entity);
                    console.time("fetchAndUpdateDB");
                    TIME_INTERVAL = 60 * 60 * 1000;
                    LAST_UPDATED_TIME = localStorage.getItem("".concat(entity, "_last_updated"));
                    allowedEntities = ["village", "player", "tribe", "conquer"];
                    // Check if entity is allowed
                    if (!allowedEntities.includes(entity)) {
                        console.error("Entity ".concat(entity, " is not allowed!"));
                        throw new Error("Entity ".concat(entity, " does not exist!"));
                    }
                    _a = c_sdk.dbConfig[entity], dbName = _a.dbName, dbTable = _a.dbTable, dbVersion = _a.dbVersion, key = _a.key, indexes = _a.indexes, url = _a.url;
                    _b = c_sdk.types, Village = _b.Village, Player = _b.Player, Tribe = _b.Tribe, Conquer = _b.Conquer;
                    try {
                        worldData = void 0;
                        if (LAST_UPDATED_TIME &&
                            Date.now() < parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL) {
                            // worldData = await getAllData();
                        }
                        else {
                            return [2 /*return*/, updateDatabase()];
                        }
                        console.timeEnd("fetchAndUpdateDB");
                    }
                    catch (error) {
                        console.error("Error in fetchAndUpdateDB:", error);
                        throw error;
                    }
                    return [2 /*return*/];
                });
            });
        },
        // Function to search for a record by coords using the index
        getVillageByCoordinates: function (x, y) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.time("getVillageByCoordinates");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var _a = c_sdk.dbConfig["village"], dbName = _a.dbName, dbTable = _a.dbTable, dbVersion = _a.dbVersion, indexes = _a.indexes;
                            var DBOpenRequest = indexedDB.open(dbName, dbVersion);
                            DBOpenRequest.onerror = function (event) {
                                console.error("Database error:", event.target.errorCode);
                                reject(event.target.errorCode);
                            };
                            DBOpenRequest.onsuccess = function (event) {
                                var db = event.target.result;
                                var transaction = db.transaction([dbTable], "readonly");
                                var objectStore = transaction.objectStore(dbTable);
                                var index = objectStore.index(indexes[0].name);
                                var indeReq = index.get("".concat(x, "|").concat(y));
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
                                    }
                                    else {
                                        console.log("No matching record found");
                                        console.timeEnd("getVillageByCoordinates");
                                        resolve(null);
                                    }
                                };
                            };
                        })];
                });
            });
        },
        getVillageById: function (villageId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.time("getVillageById");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var _a = c_sdk.dbConfig["village"], dbName = _a.dbName, dbTable = _a.dbTable, dbVersion = _a.dbVersion;
                            var DBOpenRequest = indexedDB.open(dbName, dbVersion);
                            DBOpenRequest.onerror = function (event) {
                                console.error("Database error:", event.target.errorCode);
                                reject(event.target.errorCode);
                            };
                            DBOpenRequest.onsuccess = function (event) {
                                var db = event.target.result;
                                var transaction = db.transaction([dbTable], "readonly");
                                var objectStore = transaction.objectStore(dbTable);
                                var getRequest = objectStore.get(villageId);
                                getRequest.onerror = function (event) {
                                    console.timeEnd("getVillageById");
                                    console.error("Get request error:", event.target.errorCode);
                                };
                                getRequest.onsuccess = function (event) {
                                    if (getRequest.result) {
                                        console.timeEnd("getVillageById");
                                        resolve(getRequest.result);
                                    }
                                    else {
                                        console.timeEnd("getVillageById");
                                        console.log("No matching record found");
                                        resolve(null);
                                    }
                                };
                            };
                        })];
                });
            });
        },
        // -- Troop Counter -- Working --
        initDB: function (entity) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, dbName, dbTable, dbVersion, key, indexes;
                return __generator(this, function (_b) {
                    _a = c_sdk.dbConfig[entity], dbName = _a.dbName, dbTable = _a.dbTable, dbVersion = _a.dbVersion, key = _a.key, indexes = _a.indexes;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var request = indexedDB.open(dbName, dbVersion);
                            request.onupgradeneeded = function () {
                                var db = request.result;
                                if (!db.objectStoreNames.contains(dbTable)) {
                                    if (key) {
                                        var objectStore_1 = db.createObjectStore(dbTable, {
                                            keyPath: key,
                                        });
                                        indexes.forEach(function (i) {
                                            return objectStore_1.createIndex(i.name, i.key, { unique: i.unique });
                                        });
                                    }
                                    else {
                                        reject("Key is missing!");
                                    }
                                }
                            };
                            request.onsuccess = function () {
                                resolve(request.result);
                            };
                            request.onerror = function () {
                                reject(request.error);
                            };
                        })];
                });
            });
        },
        readData: function (entity, timestamp, playerID) {
            return __awaiter(this, void 0, void 0, function () {
                var db, dbTable;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, c_sdk.initDB(entity)];
                        case 1:
                            db = _a.sent();
                            dbTable = c_sdk.dbConfig[entity].dbTable;
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var transaction = db.transaction([dbTable], "readwrite");
                                    var store = transaction.objectStore(dbTable);
                                    var request = store.get([playerID, timestamp]);
                                    request.onsuccess = function () {
                                        resolve(request.result);
                                    };
                                    request.onerror = function () {
                                        console.error("Error reading data:", playerID, timestamp);
                                        reject(request.error);
                                    };
                                })];
                    }
                });
            });
        },
        storeData: function (entity, data) {
            return __awaiter(this, void 0, void 0, function () {
                var db, dbTable;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, c_sdk.initDB(entity)];
                        case 1:
                            db = _a.sent();
                            dbTable = c_sdk.dbConfig[entity].dbTable;
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var transaction = db.transaction([dbTable], "readwrite");
                                    var store = transaction.objectStore(dbTable);
                                    // Array to hold promises for each put operation
                                    var promises = [];
                                    console.log("Data to store:", data);
                                    data.forEach(function (item) {
                                        var request = store.put(item);
                                        // Create a promise for each request and push it to the array
                                        var promise = new Promise(function (resolve, reject) {
                                            request.onsuccess = function () {
                                                resolve(request.result);
                                            };
                                            request.onerror = function () {
                                                reject(request.error);
                                            };
                                        });
                                        promises.push(promise);
                                    });
                                    // Wait for all promises to resolve or reject
                                    Promise.all(promises)
                                        .then(function (results) {
                                        resolve(results);
                                    })
                                        .catch(function (error) {
                                        reject(error);
                                    });
                                    transaction.onerror = function () {
                                        reject(transaction.error);
                                    };
                                })];
                    }
                });
            });
        },
        deleteDataWithPartialKey: function (entity, partialKey) {
            return __awaiter(this, void 0, void 0, function () {
                var db, dbTable;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, c_sdk.initDB(entity)];
                        case 1:
                            db = _a.sent();
                            dbTable = c_sdk.dbConfig[entity].dbTable;
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var transaction = db.transaction([dbTable], "readwrite");
                                    var store = transaction.objectStore(dbTable);
                                    var count = 0;
                                    var request = store.openCursor();
                                    request.onsuccess = function () {
                                        var cursor = request.result;
                                        if (cursor) {
                                            if (cursor.key[1] == partialKey) {
                                                var deleteRequest = cursor.delete();
                                                deleteRequest.onsuccess = function () {
                                                    console.log("Deleted record with key ".concat(cursor.key));
                                                    count++;
                                                };
                                                deleteRequest.onerror = function () {
                                                    console.error("Failed to delete record with key ".concat(cursor.key, ":"), request.error);
                                                };
                                            }
                                            cursor.continue();
                                        }
                                        else {
                                            resolve(count);
                                        }
                                    };
                                    request.onerror = function () {
                                        reject(request.error);
                                    };
                                    transaction.onerror = function () {
                                        reject(transaction.error);
                                    };
                                })];
                    }
                });
            });
        },
        setMostRecentTimestamp: function (entity) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    localStorage.setItem("".concat(entity, "_last_updated"), String(new Date().getTime()));
                    return [2 /*return*/];
                });
            });
        },
        storeTroops: function (
        /** @type {string} */ entity, 
        /** @type {PlayerTotalTroops[]} */ values, 
        /** @type {Date} */ updateTime) {
            return __awaiter(this, void 0, void 0, function () {
                var lastUpdateKey, updateTimesKey, lastUpdate, storedTimes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(updateTime instanceof Date) || isNaN(updateTime.getTime())) {
                                return [2 /*return*/, false];
                            }
                            lastUpdateKey = "".concat(entity, "_last_updated");
                            updateTimesKey = "".concat(entity, "_timestamps");
                            lastUpdate = localStorage.getItem(lastUpdateKey);
                            lastUpdate = lastUpdate ? Number(lastUpdate) : null;
                            // TODO: debug change back from 2 to 15min
                            if (lastUpdate && new Date().getTime() - lastUpdate < 5 * 60 * 1000) {
                                console.debug("Data is up-to-date. No need to update.");
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, c_sdk.storeData(entity, values)];
                        case 1:
                            _a.sent();
                            console.debug("Data updated successfully.");
                            storedTimes = JSON.parse(localStorage.getItem(updateTimesKey)) || [];
                            storedTimes.push(updateTime.getTime());
                            try {
                                localStorage.setItem(updateTimesKey, JSON.stringify(storedTimes));
                                localStorage.setItem(lastUpdateKey, String(updateTime.getTime()));
                            }
                            catch (e) {
                                console.error("Failed to update localStorage:", e);
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        deleteTroops: function (
        /** @type {string} */ entity, 
        /** @type {Date} */ date) {
            return __awaiter(this, void 0, void 0, function () {
                var updateTimesKey, storedTimes, count, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(date instanceof Date)) {
                                throw new Error("timestamp must be a Date object");
                            }
                            updateTimesKey = "".concat(entity, "_timestamps");
                            try {
                                storedTimes = JSON.parse(localStorage.getItem(updateTimesKey)) || [];
                            }
                            catch (error) {
                                console.error("Failed to parse stored times:", error);
                                storedTimes = [];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            storedTimes = storedTimes.filter(function (time) { return Number(time) !== date.getTime(); });
                            return [4 /*yield*/, c_sdk.deleteDataWithPartialKey("troops", date.getTime())];
                        case 2:
                            count = _a.sent();
                            console.debug("Deleted ".concat(count, " records"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error("Failed to delete data:", error_2);
                            return [2 /*return*/, false];
                        case 4:
                            localStorage.setItem(updateTimesKey, JSON.stringify(storedTimes));
                            return [2 /*return*/, true];
                    }
                });
            });
        },
        calculateTimeDifferences: function (timestamps) {
            var differences = [];
            for (var i = 1; i < timestamps.length; i++) {
                var diffInMs = timestamps[i] - timestamps[i - 1];
                var diffInSeconds = Math.floor(diffInMs / 1000);
                var months = Math.floor(diffInSeconds / (30 * 24 * 60 * 60));
                diffInSeconds %= 30 * 24 * 60 * 60;
                var days = Math.floor(diffInSeconds / (24 * 60 * 60));
                diffInSeconds %= 24 * 60 * 60;
                var hours = Math.floor(diffInSeconds / (60 * 60));
                diffInSeconds %= 60 * 60;
                var minutes = Math.floor(diffInSeconds / 60);
                var seconds = diffInSeconds % 60;
                differences.push({ months: months, days: days, hours: hours, minutes: minutes, seconds: seconds });
            }
            return differences;
        },
    };
})();
var Lib = {
    loggy: function (value) {
        console.log("Hello from the library", value);
    },
};
