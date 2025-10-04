class LoginPageProject {
  visitPage() {
    const baseUrl = Cypress.env("orangeHrm");

    cy.visit(baseUrl);
    return this;
  }
  // --- Elements ---
  elementInputUsername() { 
    return cy.get('input[name="username"]');
  }
  elementInputPassword() {
    return cy.get('input[name="password"]');
  }
  elementLoginButton() {
    return cy.get('button[type="submit"]');
  }

  // --- Action Method ---
  inputUsername(username) {
    this.elementInputUsername().should("be.visible").type(username);
    return this;
  }
  inputPassword(password, { useEnterKey = false } = {}) {
    this.elementInputPassword().should("be.visible").type(password + (useEnterKey ? "{enter}" : ""));
    return this;
  }
  clickLoginButton() {
    this.elementLoginButton().should("be.visible").click();
    return this;
  }

  // --- Assertion Verify ---
  assertionLoginFailed() {
    cy.get(".oxd-alert-content-text").should("contain.text","Invalid credentials");
    return this;
  }
  assertionRequiredMessageIsShownFieldUsername() {
    // Cara validasi pesan required muncul di field username
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text").should("be.visible").and("have.text", "Required");
    return this;
  }
  assertionRequiredMessageIsShownFieldPassword() {
    // Cara validasi pesan required muncul di field password
    cy.get(":nth-child(3) > .oxd-input-group > .oxd-text").should("be.visible").and("have.text", "Required");
    return this;
  }

  // --- Intercept Methods ---
  interceptLoginRequest() {
    cy.intercept("POST", "**/auth/validate").as("loginRequest");
    return this;
  }
  interceptLoginPageRequest() {
    cy.intercept("GET", "**/auth/login").as("loginPageRequest");
    return this;
  }

  // --- Wait Methods ---
  waitForLoginRequest(expectedStatus = 302) {
    cy.wait("@loginRequest").its("response.statusCode").should("eq", expectedStatus);
    return this;
  }

  waitForLoginPageRequest(expectedStatus = 200) {
    cy.wait("@loginPageRequest").its("response.statusCode").should("eq", expectedStatus);
    return this;
  }

  // Complete Flow Login
  doLogin(username, password) {
    this.visitPage();
    this.interceptLoginRequest();
    this.inputUsername(username);
    this.inputPassword(password);
    this.clickLoginButton();
    this.waitForLoginRequest(302);
    return this;
  }
}

// export default LoginPageProject;
export default new LoginPageProject();