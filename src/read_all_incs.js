// Function to dynamically load a script
/**
 * @param {string} url
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${url}`));
    document.head.appendChild(script);
  });
}

// User Input
if (typeof DEBUG !== "boolean") DEBUG = false;

(async function () {
  //#region setup
  if (typeof jQuery === "undefined") {
    throw new Error("jQuery is required for this script to work.");
  }

  let scriptConfig = {
    baseScriptUrl: "https://localhost:8443/src/",
    baseHTMLUrl: "https://localhost:8443/UI/",
    scriptData: {
      prefix: "getIncsForPlayer",
      name: "Get Incs for Player",
      version: "v1.0.0",
      author: "",
      authorUrl: "",
      helpLink: "",
    },
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
    isMobile: jQuery("#mobileHeader").length > 0,
    delayBetweenRequests: 200,
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
    cleanString: function (str) {
      try {
        return decodeURIComponent(str).replace(/\+/g, " ");
      } catch (error) {
        console.error(error, str);
        return str;
      }
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

  // Load the library script
  const scriptName = "storageAPI.js";
  try {
    await loadScript(
      `${scriptConfig.baseScriptUrl}/${scriptName}?${new Date().getTime()}`
    );
    console.log(`${scriptName} loaded successfully`);
  } catch (error) {
    console.error("Error loading script:", error);
  }

  if (typeof Lib === "undefined") {
    throw new Error("Lib is required for this script to work.");
  }
  //#endregion setup

  // Start the script

  let targetVillages = new Set();
  let workbenchCommands = [];
  const objectMap = new Map();

  openUI();
  await Lib.initAllDBs();

  /**
   * Asynchronously loads HTML content from a specified URL and inserts it into a specified DOM element.
   *
   * @param {string} url - The relative URL of the HTML content to load.
   * @param {string} elementId - The ID of the DOM element where the HTML content will be inserted.
   * @returns {Promise<void>} A promise that resolves when the HTML content has been successfully loaded and inserted.
   * @throws {Error} Throws an error if the network response is not ok or if there is an issue loading the HTML content.
   */
  async function loadHTML(url, elementId) {
    let fullurl = `${scriptConfig.baseHTMLUrl}/${url}`;
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

  function handleInputChange(event) {
    console.log("handleInputChange called.");

    const coordRadio = document.getElementById("coord");
    const wbRadio = document.getElementById("wb");
    if (coordRadio.checked) {
      targetVillages = extractUniqueCoordinates(event.target.value);
    } else if (wbRadio.checked) {
      workbenchCommands = readWorkbenchExport(event.target.value);
      targetVillages = extractVillages(workbenchCommands);
    } else {
      alert("Please select a mode.");
    }

    if (workbenchCommands.length > 0) {
      targetVillages = [];
      workbenchCommands.forEach(async (command) => {
        let id = command.targetVillageId;
        let village = await Lib.getVillageById(id);
        // console.log(village.player_id, village.name);
        targetVillages.push(village.coord);
      });
    }
  }

  /**
   * Updates the HTML elements with the last updated date and the time elapsed since the last update.
   *
   * This function calculates the time difference between the current date and the last updated date
   * from the `twSDK.lastUpdated` timestamp. It then formats the last updated date and the time elapsed
   * in a human-readable format and updates the corresponding HTML elements with these values.
   *
   * @function
   */
  function showLastUpdatedDb() {
    const lastUpdatedDate = new Date(Number(twSDK.lastUpdated));
    const now = new Date();
    const timeDifference = now.getTime() - lastUpdatedDate.getTime();
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

  /**
   * Parses the input and returns a boolean value.
   *
   * @param {string|boolean} input - The input to be parsed. It can be a string or a boolean.
   * @returns {boolean} - Returns `true` if the input is the string "true" (case insensitive) or a boolean `true`.
   *                    - Returns `false` if the input is the string "false" (case insensitive) or a boolean `false`.
   * Logs an error and returns `false` if the input is neither a string nor a boolean.
   */
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

  /**
   * Converts a WB plan string into an array of plan objects.
   *
   * @param {string} plan - The WB plan string to convert.
   * @returns {Array<Lib>} An array of plan objects.
   *
   * Each plan object contains the following properties:
   * - {string} commandId - The command ID.
   * - {number} originVillageId - The ID of the origin village.
   * - {number} targetVillageId - The ID of the target village.
   * - {string} slowestUnit - The slowest unit in the plan.
   * - {number} arrivalTimestamp - The arrival timestamp.
   * - {number} type - The type of the plan.
   * - {boolean} drawIn - Whether the plan is a draw-in.
   * - {boolean} sent - Whether the plan has been sent.
   * - {Object} units - An object representing the units and their values.
   */
  function convertWBPlanToArray(plan) {
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
      // if (true) console.debug(`Plan object ${i} created: `, planObject);
    }

    if (true) console.debug(`Plan objects created: `, planObjects);
    return planObjects;
  }

  /**
   * @param { string} text
   */
  function readWorkbenchExport(text) {
    if (text !== "") {
      return convertWBPlanToArray(text);
    }
  }

  /**
   * Extracts unique coordinate matches from the given text and stores them in a Set.
   *
   * @param {string} text - The input text to search for coordinates.
   * @returns {Set<string>} A Set containing unique coordinate matches.
   */
  function extractUniqueCoordinates(text) {
    const pattern = /(\d{1,4})\|(\d{1,4})/g;
    const uniqueCoordinates = new Set();

    for (const match of text.matchAll(pattern)) {
      uniqueCoordinates.add(match[0]);
    }

    return uniqueCoordinates;
  }

  /**
   * @param {WorkbenchCommands[]} results
   * @returns {Promise<Set<any>>} A Promise that resolves to a Set of unique villages.
   */
  async function extractVillages(results) {
    console.log("extractVillages called.");

    // Use Promise.all to resolve all async calls concurrently
    const villagePromises = results.map((result) =>
      Lib.getVillageById(result.targetVillageId)
    );
    const villagesArray = await Promise.all(villagePromises);
    return new Set(villagesArray);
  }

  function addRadioControls() {
    document
      .getElementById("userInput")
      .addEventListener("change", handleInputChange);
  }

  async function readIncs() {
    console.log("readIncs called.");
    let commandIDs = [];

    async function fetchVillagePages(targetVillages) {
      if (targetVillages.size === 0) {
        UI.ErrorMessage("No villages to fetch!");
        return;
      }

      let pages = await Promise.all(
        Array.from(targetVillages).map(async (village) => {
          console.log("Fetching village:", village);
          let [x, y] = village.split("|");
          let res = await Lib.getVillageByCoordinates(x, y);
          return `/game.php?screen=info_village&id=${res.id}`;
        })
      );

      pages = pages.filter((url) => url !== null);
      return pages;
    }
    const pagesToFetch = await fetchVillagePages(targetVillages);

    if (pagesToFetch.length) {
      twSDK.startProgressBar(pagesToFetch.length);
      twSDK.getAll(
        pagesToFetch,
        async function (villageIndex, villagePageHtml) {
          twSDK.updateProgressBar(villageIndex, pagesToFetch.length);

          let villageName = $(villagePageHtml)
            .find("#content_value")
            .find("h2")
            .text();

          // .commands-container or #commands_outgoings
          let $cc = $(villagePageHtml).find("#commands_outgoings");

          if ($cc.length > 0) {
            let $firstTable = $cc.find("table").first();

            // Get all command IDs
            $firstTable.find(".quickedit-out").each(function () {
              console.log("Command ID:", $(this).attr("data-id"));
              commandIDs.push($(this).attr("data-id"));
            });

            // Add a new column to the table
            $firstTable.find(".command-row").each(function () {
              let $row = $(this);
              $("#myTable").append($row);
              $(".widget-command-timer").addClass("timer");
            });
          }
        },

        async function () {
          // initIncomingsOverview();
          UI.SuccessMessage("All villages fetched!");
          Timing.tickHandlers.timers.initTimers("widget-command-timer");
          console.log(commandIDs);

          const troopDetailsCheckbox = document.getElementById(
            "troopDetailsCheckbox"
          );

          if (troopDetailsCheckbox.checked) {
            await fetchAttackDetails(commandIDs);
          }
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

  async function fetchAttackDetails(commandIds) {
    async function fetchDetails(commands) {
      let pages = await Promise.all(
        commands.map(async (id) => {
          console.log("Fetching Command:", id);
          return `/game.php?screen=info_command&id=${id}`;
        })
      );

      pages = pages.filter((url) => url !== null);
      return pages;
    }
    const pagesToFetch = await fetchDetails(commandIds);

    let units = [];
    twSDK.startProgressBar(pagesToFetch.length);
    twSDK.getAll(
      pagesToFetch,
      async function (index, data) {
        twSDK.updateProgressBar(index, pagesToFetch.length);

        let $units = $(data).find(
          "#content_value > table:nth-of-type(2) > tbody > tr:nth-child(2)"
        );
        units.push($units);
      },

      async function () {
        // initIncomingsOverview();

        $("#myTable tbody tr").each(function (index) {
          // Get the td elements from $units
          let $unitTds = units[index].find("td");
          // Append each td from $units to the current row
          $(this).append($unitTds.clone());
        });

        UI.SuccessMessage("All Details fetched!");
      },
      function (error) {
        UI.ErrorMessage("Error fetching detail pages!");
        console.error(`${scriptInfo} Error:`, error);
      }
    );
  }

  async function TestButton1() {
    console.log("TestButton1 called.");
    console.log(targetVillages);
    console.log(workbenchCommands);
  }

  async function TestButton2() {
    try {
      console.log(await Lib.getVillageByCoordinates(452, 479));
      console.log(await Lib.getVillageById(42));
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
  }
})();