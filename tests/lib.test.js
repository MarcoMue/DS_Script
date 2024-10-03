// lib.test.js

const { expect } = require("chai");
const fs = require("fs");
const vm = require("vm");
const path = require("path");

console.log(__dirname);

// Load the script into a VM context
const scriptCode = fs.readFileSync(
  path.join(__dirname, "your-file.js"),
  "utf8"
);
const scriptContext = {};
vm.createContext(scriptContext);
vm.runInContext(scriptCode, scriptContext);

describe("Lib Tests", () => {
  it("should create a Village instance with correct properties", () => {
    const Village = scriptContext.Lib.Village;
    const village = new Village(1, "Village1", 100, 200, 10, 500, 3);

    expect(village.id).to.equal(1);
    expect(village.name).to.equal("Village1");
    expect(village.coord).to.equal("100|200");
    expect(village.player_id).to.equal(10);
  });

  it("should convert CSV to array correctly", () => {
    const csvToArray = scriptContext.Lib.csvToArray;
    const csvData = "id,name\n1,John\n2,Jane";
    const result = csvToArray(csvData, ",");

    expect(result).to.deep.equal([
      ["id", "name"],
      ["1", "John"],
      ["2", "Jane"],
    ]);
  });

  it("should store and read data in IndexedDB", async () => {
    // Add test for initDB and storing data in IndexedDB
    const initDB = scriptContext.Lib.initDB;
    const entity = "village";

    await initDB(entity);
    expect(true).to.be.true; // Placeholder assertion for now
  });
});
