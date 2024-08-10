const data = `8920&3297&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n8467&10497&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n7520&10497&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n9123&6443&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n9123&6454&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n8920&1393&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n9518&2404&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n7520&6517&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n9518&6517&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n8467&6517&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6963&1924&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6952&1924&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6487&1924&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n8920&5323&ram&1723231800000&2&false&false&spear=MA==\/sword=MA==\/axe=MzAwMA==\/archer=\/spy=MQ==\/light=MTgwMA==\/marcher=\/heavy=MA==\/ram=MjUw\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6963&3359&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6716&2049&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6487&3359&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6952&3359&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n7834&6087&sword&1723231800000&19&false&false&spear=\/sword=\/axe=\/archer=\/spy=\/light=\/marcher=\/heavy=\/ram=\/catapult=\/knight=\/snob=\/militia=MA==\n6963&6087&snob&1723231800000&11&false&false&spear=\/sword=\/axe=\/archer=\/spy=\/light=\/marcher=\/heavy=\/ram=\/catapult=\/knight=\/snob=\/militia=MA==\n6716&5417&catapult&1723231800000&14&false&false&spear=MA==\/sword=MA==\/axe=MA==\/archer=\/spy=MTE=\/light=MA==\/marcher=\/heavy=MA==\/ram=MQ==\/catapult=MA==\/knight=\/snob=MA==\/militia=MA==\n6487&6087&ram&1723231799000&19&false&false&spear=\/sword=\/axe=\/archer=\/spy=\/light=\/marcher=\/heavy=\/ram=\/catapult=\/knight=\/snob=\/militia=MA==\n9123&6087&light&1723231799000&19&false&false&spear=\/sword=\/axe=\/archer=\/spy=\/light=\/marcher=\/heavy=\/ram=\/catapult=\/knight=\/snob=\/militia=MA==\n`;
const DEBUG = true;

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
    // if (DEBUG) console.debug(`Plan object ${i} created: `, planObject);
  }

  //   if (DEBUG) console.debug(`Plan objects created: `, planObjects);
  return planObjects;
}

function convert(input) {
  const records = input.trim().split("\n");

  const parsedData = records.map((record) => {
    const fields = record.split("&");

    const villageId = fields[0];
    const targetVillageId = fields[1];
    const unitType = fields[2];
    const timestamp = parseInt(fields[3], 10);
    const attackDuration = parseInt(fields[4], 10);
    const isNobleAttack = fields[5] === "true";
    const isSpyAttack = fields[6] === "true";

    const units = fields[7].split("/").reduce((acc, unit) => {
      const [unitName, count] = unit.split("=");
      acc[unitName] = count ? parseInt(atob(count), 10) : 0;
      return acc;
    }, {});

    // Return an object representing this record
    return {
      villageId,
      targetVillageId,
      unitType,
      timestamp,
      attackDuration,
      isNobleAttack,
      isSpyAttack,
      units,
    };
  });

  // console.log(parsedData);
  return parsedData;
}

let x = convert(data);
let y = convertWBPlanToArray(data);

// Assuming x and y are arrays of objects
if (x.length !== y.length) {
  console.error("Arrays x and y have different lengths");
} else {
  for (let i = 0; i < x.length; i++) {
    const xItem = x[i];
    const yItem = y[i];

    // Compare properties
    for (const key in xItem) {
      if (xItem.hasOwnProperty(key) && yItem.hasOwnProperty(key)) {
        if (xItem[key] !== yItem[key]) {
          console.log(
            `Difference found at index ${i} for property ${key}: x = ${xItem[key]}, y = ${yItem[key]}`
          );
        }
      }
    }
  }
}

debugger;

// Export the function so it can be used externally
module.exports = { convert, convertWBPlanToArray };
