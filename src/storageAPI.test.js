import Lib from "./storageAPI.js";
import { JSDOM } from "jsdom";

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
