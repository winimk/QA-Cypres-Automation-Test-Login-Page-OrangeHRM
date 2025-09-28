describe("Scenario Verifikasi Fungsi Login", () => {
  beforeEach(() => {
    // Visi web pada halaman login sebelum tiap test case
    cy.visit("https://opensource-demo.orangehrmlive.com");
  });

  it("TC_001 - User login menggunakan username benar dan password benar", () => {
    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]').should("be.visible"); //Cek apakah tombol login terlihat
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.url().should("include", "/dashboard"); // ini untuk memastikan URL mengandung '/dashboard'
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should(
      "have.text",
      "Dashboard"
    ); // untuk memastikan teks "Dashboard" muncul
  });

  it("TC_002 - User login menggunakan username benar dan password benar lalu login dengan tombol enter", () => {
    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("admin123{enter}");

    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should(
      "have.text",
      "Dashboard"
    );
  });

  it("TC_003 - User login menggunakan username salah dan password salah", () => {
    cy.get('input[name="username"]').should("be.visible").type("AdminSalah");
    cy.get('input[name="password"]').should("be.visible").type("admin123Salah");
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.get(".oxd-alert-content-text").should(
      "contain.text",
      "Invalid credentials"
    );
  });

  it("TC_004 - User login menggunakan username benar dan password salah", () => {
    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('input[name="password"]').should("be.visible").type("admin123Salah");
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.get(".oxd-alert-content-text").should(
      "contain.text",
      "Invalid credentials"
    );
  });

  it("TC_005 - User login menggunakan username salah dan password benar", () => {
    cy.get('input[name="username"]').should("be.visible").type("AdminSalah");
    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.get(".oxd-alert-content-text").should(
      "contain.text",
      "Invalid credentials"
    );
  });

  it("TC_006 - User login dengan username kosong dan password benar", () => {
    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]').should("be.visible").click();

    // Cara validasi pesan required muncul di field username
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text")
      .should("be.visible")
      .and("have.text", "Required");
  });

  it("TC_007 - User login dengan username benar dan password kosong", () => {
    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('button[type="submit"]').should("be.visible").click();

    // Cara validasi pesan required muncul di field password
    cy.get(":nth-child(3) > .oxd-input-group > .oxd-text")
      .should("be.visible")
      .and("have.text", "Required");
  });

  it("TC_008 - User login dengan username kosong dan password kosong", () => {
    cy.get('button[type="submit"]').should("be.visible").click();

    // Cara validasi pesan required muncul di fielad username dan field password
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text")
      .should("be.visible")
      .and("have.text", "Required");
    cy.get(":nth-child(3) > .oxd-input-group > .oxd-text")
      .should("be.visible")
      .and("have.text", "Required");
  });
});
