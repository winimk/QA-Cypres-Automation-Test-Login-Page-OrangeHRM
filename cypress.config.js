const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 10000, // default 4000 ms → jadi 10 detik
    pageLoadTimeout: 60000, // untuk tunggu load page
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
