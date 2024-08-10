if (typeof DEBUG !== "boolean") DEBUG = false;

// User Input
// Script Config
var scriptConfig = {
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

(function () {
  console.log("IIFE called.");
  openUI();

  function openUI() {
    const html = `
      <head></head>
      <body>
        <h1>All Incs</h1>
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
              <table>
                <tr>
                  <th>Variable filtered</th>
                  <th>Operator</th>
                  <th>Value</th>
                  <th></th>
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
      </body>
    `;
    Dialog.show("Troop counter", html);

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

  function loadWBCode() {
    let wbString = `
    6686&1961&snob&1721768099000&8&false&true&spear=/sword=/axe=MTYwMA==/archer=/spy=/light=ODAw/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==
    9849&1961&snob&1721768100000&8&false&true&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==
    8543&1961&snob&1721768098000&8&false&false&spear=/sword=/axe=MTYwMA==/archer=/spy=/light=ODAw/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==
    8735&1961&snob&1721768099000&8&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==
    9899&1961&ram&1721768097000&8&false&true&spear=/sword=/axe=MTYwMA==/archer=/spy=/light=ODAw/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==
  `;

    let data = document.getElementById("urlvalue").value;

    let result = null;
    if (wbString) {
      console.log("static");
      result = convertWBPlanToArray(wbString);
    }

    if (data) {
      console.log("data");
      result = convertWBPlanToArray(data);
    }

    // Function to add a new row to the table
    function addRow() {
      if (result.length === 0) {
        clearInterval(intervalId);
        return;
      }

      const rowData = result.shift(); // Get the first element and remove it from the array

      const newRow = `
            <tr>
              <td>${data[0].commandId}</td>
              <td>${data[0].originVillageId}</td>
              <td>${data[0].targetVillageId}</td>
              <td><button class="removeRow">Remove</button></td>
            </tr>
          `;
      $("#myTable").append(newRow);
    }

    // Set an interval to add a new row every second
    const intervalId = setInterval(addRow, 1000);

    // Event delegation to handle row removal
    $(document).on("click", ".removeRow", function () {
      $(this).closest("tr").remove();
    });
  }

  function readData() {
    console.log("readData");

    if (game_data.mode == "members") {
      var html =
        '<label> Reading...     </label><progress id="bar" max="1" value="0">  </progress>';
      Dialog.show("Progress bar", html);
      filtres = {};
      if (localStorage.troopCounterFilter) {
        filtres = JSON.parse(localStorage.troopCounterFilter);
      }
      table = document.getElementsByClassName("vis");
      nMembers = table[2].rows.length;
      playerInfoList = [];
      for (i = 1; i < nMembers - 1; i++) {
        let playerId = table[2].rows[i].innerHTML.split("[")[1].split("]")[0];
        let villageAmount = table[2].rows[i].innerHTML
          .split('<td class="lit-item">')[4]
          .split("</td>")[0];
        playerInfoList.push({
          playerId: playerId,
          villageAmount: villageAmount,
        });
      }
      mode = localStorage.troopCounterMode;
      data = "Coords,Player,";
      unitsList = game_data.units;
      for (k = 0; k < unitsList.length; k++) {
        data = data + unitsList[k] + ",";
      }
      players = getPlayerDict();
      data = data + "\n";
      i = 0;
      let pageNumber = 1;
      (function loop() {
        page = $.ajax({
          url:
            "https://" +
            window.location.host +
            "/game.php?screen=ally&mode=" +
            mode +
            "&player_id=" +
            playerInfoList[i].playerId +
            "&page=" +
            pageNumber,
          async: false,
          function(result) {
            return result.responseText;
          },
        });
        document.getElementById("bar").value = i / playerInfoList.length;

        let temp = page.responseText.split("vis w100");

        if (temp.length === 2 || temp.length === 4) {
          rows = page.responseText
            .split("vis w100")
            [temp.length - 1].split("<tr>");
          step = 1;
          if (mode == "members_defense") {
            step = 2;
          }
          for (j = 2; j + step < rows.length; j = j + step) {
            villageData = {};

            let coords = rows[j].match(/\d{1,3}\|\d{1,3}/g)[0].split("|");
            villageData["x"] = coords[0];
            villageData["y"] = coords[1];
            units = rows[j].split(/<td class="">|<td class="hidden">/g);
            for (k = 1; k < units.length; k++) {
              villageData[unitsList[k - 1]] = units[k]
                .split("</td>")[0]
                .replace(/ /g, "")
                .replace(/\n/g, "")
                .replace(/<spanclass="grey">\.<\/span>/g, "");
            }
            filtered = true; //filtered==true ok, ==false hide
            for (key in filtres) {
              for (k = 0; k < filtres[key].length; k++) {
                if (filtres[key][k][0] === ">") {
                  if (
                    parseInt(villageData[key]) < parseInt(filtres[key][k][1])
                  ) {
                    filtered = false;
                  }
                } else if (filtres[key][k][0] === "<") {
                  if (
                    parseInt(villageData[key]) > parseInt(filtres[key][k][1])
                  ) {
                    filtered = false;
                  }
                }
              }
            }
            if (filtered) {
              data = data + villageData["x"] + "|" + villageData["y"] + ",";
              data = data + players[playerInfoList[i].playerId] + ",";
              for (k = 0; k < unitsList.length; k++) {
                data = data + villageData[unitsList[k]] + ",";
              }
              data = data + "\n";
            }
          }
        }
        i++;

        if (temp.length === 4) {
          if (playerInfoList[i].villageAmount / 1000 > pageNumber) {
            i--;
            pageNumber++;
          } else {
            pageNumber = 1;
          }
        }

        if (i < playerInfoList.length) {
          setTimeout(loop, 200);
        } else {
          showData(data, mode);
        }
      })();
    }
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

    let planArray = plan.split("\n").filter((str) => str.trim() !== "");
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
})();
