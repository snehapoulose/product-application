// jest.config.mjs
export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.*config.js$": "<rootDir>/src/config.mock.js",
    "\\.(css|jpg|png)$": "identity-obj-proxy"
  }
};
