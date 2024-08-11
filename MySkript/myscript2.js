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
              <table id="myTable">
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
    let data = document.getElementById("urlvalue").value;
    let results = null;

    if (data) {
      results = convertWBPlanToArray(data);
    }

    // Function to add a new row to the table
    function addRow() {
      if (results.length === 0) {
        clearInterval(intervalId);
        return;
      }

      console.log("result: ", results);
      const rowData = results.shift(); // Get the first element and remove it from the array
      console.log("rowData: ", rowData);

      const newRow = `
            <tr>
              <td>${rowData.commandId}</td>
              <td>${rowData.originVillageId}</td>
              <td>${rowData.targetVillageId}</td>
              <td><button class="removeRow">Remove</button></td>
            </tr>
          `;
      $("#myTable").append(newRow);
    }

    // Set an interval to add a new row every second
    const intervalId = setInterval(addRow, 250);

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

    let planArray = plan
      .split("\n")
      .map((str) => str.trim())
      .filter((str) => str !== "");

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
