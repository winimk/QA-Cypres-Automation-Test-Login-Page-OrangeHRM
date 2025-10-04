class DashboardPageProject {
  // --- Assertion Verify ---
  assertionUserIsOnDashboard() {
    cy.url().should("include", "/dashboard"); // ini untuk memastikan URL mengandung '/dashboard'
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should("have.text","Dashboard"); // untuk memastikan teks "Dashboard" muncul
    return this;
  }

  // --- Intercept Methods ---
  interceptShortcutRequest() {
    cy.intercept("GET", "**/dashboard/shortcuts").as("shortcutRequest");
    return this;
  }
  interceptDashboardPageRequest() {
    cy.intercept("GET", "**/dashboard").as("dashboardRequest");
    return this;
  }

  // --- Wait Methods ---
  waitForShortcutRequest(expectedStatus = 200) {
    cy.wait("@shortcutRequest").its("response.statusCode").should("eq", expectedStatus);
    return this;
  }
  waitForNotInDashboardPageRequest() {
    cy.wait(1000);
    cy.get("@dashboardRequest.all").should("have.length", 0); // tidak ada request dashboard
    return this;
  }
}

export default new DashboardPageProject();