class ForgotPasswordPageProject {
  visitPage() {
    const baseUrl = Cypress.env("orangeHrm");
    cy.visit(`${baseUrl}/web/index.php/auth/requestPasswordResetCode`);
    return this;
  }

  // --- Elements ---
  elementPageTitle() {
    return cy.contains("h6", "Reset Password");
  }
  elementInputUsername() {
    return cy.get('input[name="username"]');
  }
  elementButtonResetPassword() {
    return cy.contains("button", "Reset Password");
  }
  elementButtonCancel() {
    return cy.contains("button", "Cancel");
  }

  // --- Action Method ---
  inputUsername(username, { useEnterKey = false } = {}) {
    this.elementInputUsername().should("be.visible").type(username + (useEnterKey ? "{enter}" : ""));
    return this;
  }

  clickResetPassword() {
    this.elementButtonResetPassword().click();
    return this;
  }

  clickCancel() {
    this.elementButtonCancel().click();
    return this;
  }

  // --- Assertion Verify ---
  assertionRequiredMessageIsShownFieldUsername() {
    cy.get(".oxd-input-group .oxd-text").should("be.visible").and("have.text", "Required");
    return this;
  }

  // --- Intercept Methods ---
  interceptResetPasswordRequest() {
    cy.intercept("POST", "**/auth/requestResetPassword").as("resetPasswordRequest");
    return this;
  }
  interceptSendPasswordResetPageRequest() {
    cy.intercept("GET", "**/auth/sendPasswordReset").as("sendPasswordResetPageRequest");
    return this;
  }


  // --- Wait Methods ---
  waitForResetPasswordRequest(expectedStatus = 302) {
    cy.wait("@resetPasswordRequest").its("response.statusCode").should("eq", expectedStatus);
    return this;
  }
  waitForSendPasswordResetPageRequest(expectedStatus = 200) {
    cy.wait("@sendPasswordResetPageRequest").its("response.statusCode").should("eq", expectedStatus);
    return this;
  }
}

export default new ForgotPasswordPageProject();