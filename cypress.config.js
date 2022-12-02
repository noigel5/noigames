const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://noigel5.github.io/noigames/',
    viewportHeight: 1080,
    viewportWidth: 1920,
    defaultCommandTimeout: 500
  },
});
