export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "node",
  setupFiles: ["fake-indexeddb/auto"],
};
