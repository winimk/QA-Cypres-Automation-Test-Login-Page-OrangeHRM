class LoginPage {
  visitPage() {
    cy.visit("https://opensource-demo.orangehrmlive.com");
    return this;
  }

  // --- Action Method ---
  inputUsername(username) {
    cy.get('input[name="username"]').should("be.visible").type(username);
    return this;
  }
  inputPassword(password, { useEnterKey = false } = {}) {
    cy.get('input[name="password"]').should("be.visible").type(password + (useEnterKey ? "{enter}" : ""));
    return this;
  }
  clickLoginButton() {
    cy.get('button[type="submit"]').should("be.visible").click();
    return this;
  }

  // --- Assertion Verify ---
  assertionLoginSuccess() {
    cy.url().should("include", "/dashboard"); // ini untuk memastikan URL mengandung '/dashboard'
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should("have.text","Dashboard"); // untuk memastikan teks "Dashboard" muncul
    return this;
  }
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
}

// export default LoginPage;
export default new LoginPage();