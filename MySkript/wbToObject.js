const data =
  "7609&5878&snob&1721923202000&11&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==\n7043&5878&ram&1721923201000&8&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==\n8543&5878&snob&1721923201000&11&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==\n8735&5878&snob&1721923201000&11&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==\n9899&5878&ram&1721923200000&8&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==\n6487&5878&snob&1721923200000&11&false&false&spear=/sword=/axe=/archer=/spy=/light=/marcher=/heavy=/ram=/catapult=/knight=/snob=/militia=MA==";

const DEBUG = true;

let y = convertWBPlanToArray(data);

// Assuming x and y are arrays of objects
if (x.length !== y.length) {
  console.error("Arrays x and y have different lengths");
} else {
  for (let i = 0; i < x.length; i++) {
    const xItem = x[i];
    const yItem = y[i];

    console.log(xItem.originVillageId);
    console.log(yItem.originVillageId);
  }
}

debugger;

// Export the function so it can be used externally
module.exports = { convert, convertWBPlanToArray };
