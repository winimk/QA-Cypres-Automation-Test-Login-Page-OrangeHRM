class DirectoryPageProject {
  visitPage() {
    const baseUrl = Cypress.env("orangeHrm");
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    return this;
  }

  // --- Elements ---
  elementPageTitle() {
    return cy.contains("h6", "Directory");
  }
  elementInputName() {
    return cy.get(".oxd-autocomplete-text-input > input");
  }
  elementDropdownJobTitleIcon() {
    return cy.get(":nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon");
  }
  elementDropdownJobTitleValue() {
    return cy.get(":nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text-input");
  }
  elementDropdownLocationIcon() {
    return cy.get(":nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text");
  }
  elementDropdownLocationValue() {
    return cy.get(":nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text-input");
  }
  elementButtonSearch() {
    return cy.get(".oxd-button--secondary");
  }
  elementButtonReset() {
    return cy.get(".oxd-button--ghost");
  }
  elementTextTotalResult() {
    return cy.get(".orangehrm-horizontal-padding > .oxd-text");
  }
  elementInputNameSuggestionList() {
    return cy.get(".oxd-autocomplete-dropdown");
  }
  elementTableResult() {
    return cy.get(".oxd-grid-item--gutters").filter(":has(.oxd-text.oxd-text--p)");
  }
  elementSidebarDetailCard() {
    return cy.get(".orangehrm-corporate-directory-sidebar");
  }

  // --- Action Method ---
  inputName(name) {
    this.elementInputName().should("be.visible").type(name);
    return this;
  }
  selectEmployeeNameFromSuggestion(name) {
    this.elementInputNameSuggestionList().should("be.visible");
    cy.get(".oxd-autocomplete-dropdown > div").contains(name).click();
    return this;
  }
  selectJobTitle(title) {
    this.elementDropdownJobTitleIcon().click();
    // Pastikan dropdown muncul
    cy.get(".oxd-select-dropdown").should("be.visible");
    // Pilih option berdasarkan teks
    cy.contains('.oxd-select-dropdown [role="option"]', title).click();
    return this;
  }
  selectLocation(location) {
    this.elementDropdownLocationIcon().click();
    cy.get(".oxd-select-dropdown > div").should("be.visible");
    cy.contains(".oxd-select-dropdown > div", location).click();
    return this;
  }
  clickSearch() {
    this.elementButtonSearch().click({ force: true });
    return this;
  }
  clickReset() {
    this.elementButtonReset().click({ force: true });
    return this;
  }
  clearInputName() {
    this.elementInputName().should("be.visible").clear({ force: true });
    return this;
  }
  clickResultCardbyName(name) {
    cy.get(".orangehrm-container .oxd-grid-item.oxd-grid-item--gutters").contains(".oxd-text.oxd-text--p.orangehrm-directory-card-header", name)
      .click();
    return this;
  }
  clickCloseCardDetail() {
    cy.get(".orangehrm-corporate-directory-sidebar > .oxd-grid-item > .oxd-sheet > .orangehrm-directory-card-top > .oxd-icon")
      .click();
    return this;
  }

  // --- Assertion Verify ---
  assertionUserIsOnDirectory() {
    cy.url().should("include", "/directory");
    this.elementPageTitle(); // untuk memastikan teks "Directory" muncul
    return this;
  }
  assertionInvalidMessageIsShownFieldName() {
    // Cara validasi pesan invalid
    cy.get(".oxd-input-group > .oxd-text").should("be.visible").and("have.text", "Invalid");
    return this;
  }
  assertionTextTotalResult(total) {
    // Text Total Resultnya
    this.elementTextTotalResult().should(
      "contain.text",
      total > 0
        ? `(${total}) Record${total > 1 ? "s" : ""} Found`
        : "No Records Found"
    );
    return this;
  }
  assertionResultCards(totalFromApi) {
    this.elementTableResult().should("have.length", totalFromApi);
    return this;
  }
  assertionJobTitleListAvailable() {
    cy.get(".oxd-select-dropdown").children().should("have.length.greaterThan", 1);
    return this;
  }
  assertionLocationListAvailable() {
    cy.get(".oxd-select-dropdown > div").should("be.visible").should("have.length.greaterThan", 1);
    return this;
  }
  assertionDetailCardOpened() {
    this.elementSidebarDetailCard().should("be.visible");
    return this;
  }
  assertionDetailCardClosed() {
    this.elementSidebarDetailCard().should("not.exist");
    return this;
  }
  assertionDetailCardName(name) {
    this.assertionDetailCardOpened();
    this.elementSidebarDetailCard().contains(".oxd-text.oxd-text--p.orangehrm-directory-card-header",name);
    return this;
  }

  // --- Intercept Methods ---
  interceptSearchRequest() {
    cy.intercept("GET", "**/directory/employees?*").as("getEmployeesRequest");
    return this;
  }
  interceptDetailEmployeesRequest() {
    cy.intercept("GET", "**/directory/employees/*?model=detailed").as("getDetailEmployeesRequest");
    return this;
  }

  // --- Wait Methods ---
  waitForSearchRequest(expectedStatus = 200, expectedTotal = null) {
    cy.wait("@getEmployeesRequest").then((interception) => {
      const res = interception.response;
      expect(res.statusCode).to.eq(expectedStatus);

      const totalFromApi = res.body.meta.total;
      cy.log(`Total dari API: ${totalFromApi}`);

      // Jika user kasih parameter expectedTotal dibandingkan juga
      if (expectedTotal !== null) {
        expect(totalFromApi,"Total dari API harus sama dengan expectedTotal").to.eq(expectedTotal);

        // Assert UI sesuai parameter
        this.assertionTextTotalResult(expectedTotal);
        this.assertionResultCards(expectedTotal);
      } else {
        // Kalau tidak ada parameter, default: pakai total dari API
        this.assertionTextTotalResult(totalFromApi);
        this.assertionResultCards(totalFromApi);
      }
    });
    return this;
  }
  waitForDetailEmployeesRequest(expectedStatus = 200) {
    cy.wait("@getDetailEmployeesRequest").then((interception) => {
      const { statusCode, body } = interception.response;
      expect(statusCode).to.eq(200);
      expect(body).to.have.property("data");
      // cy.log(`Nama yang tampil di detail: ${body.data.firstName} ${body.data.lastName}`);
    });
    return this;
  }
}

export default new DirectoryPageProject();