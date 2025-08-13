const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  coveragePathIgnorePatterns: ["<rootDir>/prisma"],
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
