const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 20000, // default 4000 ms → jadi 20 detik
    pageLoadTimeout: 60000, // untuk tunggu load page
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      reqres: "https://reqres.in/api",
      reqresApiKey: "reqres-free-v1",
      orangeHrm: "https://opensource-demo.orangehrmlive.com",
    },
  },
});
