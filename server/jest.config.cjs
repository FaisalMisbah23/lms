/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "jest.setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>"],
  setupFiles: ["<rootDir>/__tests__/jest.setup.ts"],
  forceExit: true,
};
