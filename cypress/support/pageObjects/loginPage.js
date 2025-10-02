class LoginPage {
  visitPage() {
    cy.visit("https://opensource-demo.orangehrmlive.com");
  }
  inputUsername(username) {
    cy.get('input[name="username"]').should("be.visible").type(username);
  }
  inputPassword(password,  { useEnterKey = false } = {}) {
    cy.get('input[name="password"]').should("be.visible").type(password + (useEnterKey ? "{enter}" : ""));
  }
  clickLoginButton() {
    cy.get('button[type="submit"]').should("be.visible").click();
  }
  assertionLoginSuccess() {
    cy.url().should("include", "/dashboard"); // ini untuk memastikan URL mengandung '/dashboard'
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should("have.text","Dashboard"); // untuk memastikan teks "Dashboard" muncul
  }
  assertionLoginFailed() {
    cy.get(".oxd-alert-content-text").should("contain.text","Invalid credentials");
  }
  assertionRequiredMessageIsShownFieldUsername() {
    // Cara validasi pesan required muncul di field username
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text").should("be.visible").and("have.text", "Required");
  }
  assertionRequiredMessageIsShownFieldPassword() {
    // Cara validasi pesan required muncul di field password
    cy.get(":nth-child(3) > .oxd-input-group > .oxd-text").should("be.visible").and("have.text", "Required");
  }
}

// export default LoginPage;
export default new LoginPage();