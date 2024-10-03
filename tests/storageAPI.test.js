import { JSDOM } from "jsdom";
import * as Lib from "../src/storageAPI";

describe("csvToArray", () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM("<!DOCTYPE html><body></body>");
    global.document = dom.window.document;
  });

  it("should change the background color of the body", () => {
    Lib.csvToArray("blue");
    expect(document.body.style.backgroundColor).toBe("blue");
  });
});

describe("IndexedDB API", () => {
  beforeEach(() => {
    // Clear the database before each test
    indexedDB.deleteDatabase("test-db");
  });

  it("should store and retrieve data from IndexedDB", (done) => {
    const request = indexedDB.open("test-db", 1);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const store = db.createObjectStore("test-store", { keyPath: "id" });
      store.add({ id: 1, name: "test" });
    };

    request.onsuccess = (event) => {
      const db = request.result;
      const transaction = db.transaction("test-store", "readonly");
      const store = transaction.objectStore("test-store");
      const getRequest = store.get(1);

      getRequest.onsuccess = (event) => {
        const result = getRequest.result;
        expect(result).toEqual({ id: 1, name: "test" });
        done();
      };

      getRequest.onerror = (event) => {
        done.fail(getRequest.error);
      };
    };

    request.onerror = (event) => {
      done.fail(request.error);
    };
  });
});
