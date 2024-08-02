"use strict";
/*
 *  Author: TheAHouse
 *  Version: 1.0.0
 *  Last updated: 2021/02/18
 *  Description: Mass Attack Planner tool for Tribalwars
 */
const HEADER = "<p>Mass Attack Planner <small><i>by TheAHouse</i></small></p>";
const activeWorldData = JSON.parse(localStorage.getItem("activeTW"));
const unitInfo = activeWorldData["unitInfo"]["config"];
const coordsToID = JSON.parse(
  localStorage.getItem(`coordsToID_${activeWorldData["world"]}`)
);
let groups = [];
// Screen to add groups
function groupScreen() {
  document.body.innerHTML = HEADER;
  // Arrival date
  let arrivalDateLabel = document.createElement("label");
  arrivalDateLabel.setAttribute("for", "arrivalDate");
  arrivalDateLabel.textContent = `Arrival Date for group #${
    groups.length + 1
  }:`;
  document.body.appendChild(arrivalDateLabel);
  // Add break
  document.body.appendChild(document.createElement("br"));
  let arrivalDate = document.createElement("input");
  arrivalDate.setAttribute("type", "datetime-local");
  arrivalDate.setAttribute("step", "1");
  arrivalDate.setAttribute("id", "arrivalDate");
  document.body.appendChild(arrivalDate);
  // Add break
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createElement("br"));
  // Add group button
  let groupButton = document.createElement("button");
  groupButton.textContent = "Add Group";
  groupButton.addEventListener("click", () => addGroup());
  document.body.appendChild(groupButton);
  // Add confirm button if group > 1
  if (groups.length > 0) {
    let calculatePlanButton = document.createElement("button");
    calculatePlanButton.textContent = "Calculate Plan";
    calculatePlanButton.addEventListener("click", () => calculatePlan());
    document.body.appendChild(calculatePlanButton);
  }
}
// Screen to add actions
function actionScreen(arrivalDate) {
  document.body.innerHTML = HEADER;
  // Add group information
  document.body.innerHTML += `Group #${groups.length}<br>Arrival Date: ${arrivalDate}<br><br>`;
  // Action name
  let actionNameLabel = document.createElement("label");
  actionNameLabel.setAttribute("for", "actionName");
  actionNameLabel.textContent = "Action name:";
  document.body.appendChild(actionNameLabel);
  // Add break
  document.body.appendChild(document.createElement("br"));
  let actionName = document.createElement("input");
  actionName.setAttribute("type", "text");
  actionName.setAttribute("id", "actionName");
  document.body.appendChild(actionName);
  // Add break
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createElement("br"));
  // Slowest unit
  document.body.innerHTML += "Slowest unit:<br>";
  let unitSelect = document.createElement("select");
  unitSelect.setAttribute("id", "unitSelect");
  document.body.appendChild(unitSelect);
  ["ram", "axe", "light", "snob", "sword"].forEach((unit) => {
    let option = document.createElement("option");
    option.setAttribute("value", unit);
    option.textContent = unit;
    unitSelect.appendChild(option);
  });
  // Add break
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createElement("br"));
  // From coords
  let fromCoordsLabel = document.createElement("label");
  fromCoordsLabel.setAttribute("for", "fromCoords");
  fromCoordsLabel.textContent = "From coords:";
  document.body.appendChild(fromCoordsLabel);
  // Add break
  document.body.appendChild(document.createElement("br"));
  let fromCoords = document.createElement("textarea");
  fromCoords.setAttribute("id", "fromCoords");
  fromCoords.setAttribute("rows", "6");
  fromCoords.setAttribute("cols", "55");
  fromCoords.textContent = "Paste text with from coords here";
  document.body.appendChild(fromCoords);
  // Add break
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createElement("br"));
  // To coords
  let toCoordsLabel = document.createElement("label");
  toCoordsLabel.setAttribute("for", "toCoords");
  toCoordsLabel.textContent = "To coords:";
  document.body.appendChild(toCoordsLabel);
  // Add break
  document.body.appendChild(document.createElement("br"));
  let toCoords = document.createElement("textarea");
  toCoords.setAttribute("id", "toCoords");
  toCoords.setAttribute("rows", "6");
  toCoords.setAttribute("cols", "55");
  toCoords.textContent = "Paste text with to coords here";
  document.body.appendChild(toCoords);
  // Add break
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createElement("br"));
  // Add action button
  let actionButton = document.createElement("button");
  actionButton.textContent = "Add Action";
  actionButton.addEventListener("click", () => addAction());
  document.body.appendChild(actionButton);
  // Add stop button if actions in group > 0
  if (groups[groups.length - 1][1].length > 0) {
    let stopButton = document.createElement("button");
    stopButton.textContent = "Stop adding actions";
    stopButton.addEventListener("click", () => groupScreen());
    document.body.appendChild(stopButton);
  }
}
// Screen to display plan
function outputScreen(plan) {
  document.body.innerHTML = HEADER;
  // Output
  let outputLabel = document.createElement("label");
  outputLabel.setAttribute("for", "output");
  outputLabel.textContent = "Op Plan:";
  document.body.appendChild(outputLabel);
  // Add break
  document.body.appendChild(document.createElement("br"));
  let output = document.createElement("textarea");
  output.setAttribute("id", "output");
  output.setAttribute("rows", "20");
  output.setAttribute("cols", "55");
  output.textContent = plan;
  document.body.appendChild(output);
  output.select();
}
function addGroup() {
  let arrivalDate = new Date($("#arrivalDate").val().toString());
  if (isNaN(arrivalDate.getTime())) {
    alert("Enter a valid date");
  } else {
    groups.push([arrivalDate, []]);
    actionScreen(arrivalDate.toLocaleString());
  }
}
function addAction() {
  let actionName = $("#actionName").val().toString();
  let slowestUnit = $("#unitSelect").val().toString();
  let fromCoords = extractCoords($("#fromCoords").val().toString());
  let toCoords = extractCoords($("#toCoords").val().toString());
  if (
    actionName.length == 0 ||
    fromCoords == null ||
    toCoords == null ||
    fromCoords.length < toCoords.length
  ) {
    alert(
      "Please enter valid data\nAction name can't be empty and from coords >= to coords > 0"
    );
  } else {
    groups[groups.length - 1][1].push([
      actionName,
      slowestUnit,
      fromCoords,
      toCoords,
    ]);
    actionScreen(groups[groups.length - 1][0].toLocaleString());
  }
}
// Regex to extract all coords within a text
function extractCoords(coordsText) {
  return coordsText.match(/\d{3}\|\d{3}/g);
}
// Evenly add coords until length is reached
function extendCoordsArray(coords, len) {
  let i = 0;
  while (coords.length < len) {
    coords.push(coords[i]);
    i++;
  }
}
// Get the distance in seconds between 2 coords
function distanceInSec(fromCoord, toCoord, speed) {
  let fromCoordXY = fromCoord.split("|");
  let toCoordXY = toCoord.split("|");
  return Math.round(
    Math.sqrt(
      (parseInt(fromCoordXY[0]) - parseInt(toCoordXY[0])) ** 2 +
        (parseInt(fromCoordXY[1]) - parseInt(toCoordXY[1])) ** 2
    ) * speed
  );
}
// Retrieve a link for each command (redirect to rally point of fromCoord with target toCoord set)
function getLink(fromCoord, toCoord) {
  if (coordsToID != null && fromCoord in coordsToID && toCoord in coordsToID) {
    return `[url=${activeWorldData["origin"]}/game.php?village=${coordsToID[fromCoord]}&screen=place&target=${coordsToID[toCoord]}]>>>[/url]`;
  }
  return "X";
}
// Template for each command, (doesn't start with [b] because the plan is sorted first on date)
function entryTemplate(sendDate, toCoord, arrivalDate, unit, actionName, link) {
  let strSendDate =
    sendDate.toISOString().match(/([^T]+)/)[0] +
    " " +
    sendDate.toTimeString().match(/([^ ]+)/)[0];
  let strArrivalDate =
    arrivalDate.toISOString().match(/([^T]+)/)[0] +
    " " +
    arrivalDate.toTimeString().match(/([^ ]+)/)[0];
  return `${strSendDate}[/b] | ${toCoord} | [i]${strArrivalDate}[/i] | ${unit} | ${actionName} | ${link}`;
}
// Add all entries together in a neat format
function cleanupPlan(entries) {
  let i = 1;
  let date = entries[0].substr(0, 10);
  let plan = `[size=11]${date}[/size]\n\n`;
  let timeInHours = parseInt(entries[0].substr(11, 2));
  entries.forEach((entry) => {
    let currentDate = entry.substr(0, 10);
    let currentTimeInHours = parseInt(entry.substr(11, 2));
    // Show when you have to launch on a different day
    if (currentDate > date) {
      plan += `\n[size=11]${currentDate}[/size]\n\n`;
      date = currentDate;
      timeInHours = currentTimeInHours;
    }
    // Add an empty line every unique hour
    else if (currentTimeInHours > timeInHours) {
      plan += "\n";
      timeInHours = currentTimeInHours;
    }
    plan += `${i}. [b]${entry.substr(11)}\n`;
    i++;
  });
  return plan;
}
// Calculate the attack plan
function calculatePlan() {
  alert("Calculating plan ...");
  let finalPlan = [];
  groups.forEach((group) => {
    group[1].forEach((action) => {
      let speed = unitInfo[action[1]]["speed"] * 60;
      // Make fromCoords and toCoords equally long
      extendCoordsArray(action[3], action[2].length);
      action[3].forEach((toCoord) => {
        //  [distance in seconds, fromCoords]
        let shortestDistance = [];
        action[2].forEach((fromCoord) => {
          let distance = distanceInSec(fromCoord, toCoord, speed);
          if (shortestDistance.length == 0 || shortestDistance[0] > distance) {
            shortestDistance = [distance, fromCoord];
          }
        });
        // @ts-ignore
        let sendDate = new Date(
          group[0].getTime() - shortestDistance[0] * 1000
        );
        let link = getLink(shortestDistance[1], toCoord);
        let planEntry = entryTemplate(
          sendDate,
          toCoord,
          group[0],
          action[1],
          action[0],
          link
        );
        finalPlan.push(planEntry);
        // Remove used fromCoord
        action[2].splice(action[2].indexOf(shortestDistance[1]), 1);
      });
    });
  });
  if (finalPlan != []) {
    finalPlan.sort();
    outputScreen(cleanupPlan(finalPlan));
  } else {
    outputScreen("Empty plan?...");
  }
}
groupScreen();
