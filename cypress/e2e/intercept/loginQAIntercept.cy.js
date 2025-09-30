describe("Scenario Verifikasi Fungsi Login dengan Intercept", () => {
  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com");
  });

  it("TC_001 - User login menggunakan username benar dan password benar - [Intercept] memastikan ada request ke halaman dashboard", () => {
    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]').should("be.visible"); //Cek apakah tombol login terlihat

    cy.intercept("POST", "**/auth/validate").as("loginRequest");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 302);

    cy.url().should("include", "/dashboard"); // ini untuk memastikan URL mengandung '/dashboard'
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should("have.text","Dashboard"); // untuk memastikan teks "Dashboard" muncul
  });
  
  it("TC_002 - User login menggunakan username benar dan password benar lalu login dengan tombol enter - [Intercept] memastikan memanggil quick launch", () => {
    cy.intercept("GET", "**/dashboard/shortcuts").as("shortcutRequest");

    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('input[name="password"]').should("be.visible").type("admin123{enter}");

    cy.wait("@shortcutRequest").its("response.statusCode").should("eq", 200);

    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-breadcrumb > .oxd-text").should("have.text","Dashboard");
  });

  it("TC_003 - User login menggunakan username salah dan password salah - [Intercept] memastikan kembali lagi ke halaman login", () => {
    cy.get('input[name="username"]').should("be.visible").type("AdminSalah");
    cy.get('input[name="password"]').should("be.visible").type("admin123Salah");
    
    cy.intercept("GET", "**/auth/login").as("loginPageRequest");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.wait("@loginPageRequest").its("response.statusCode").should("eq", 200);

    cy.get(".oxd-alert-content-text").should("contain.text","Invalid credentials");
  });

  it("TC_004 - User login menggunakan username benar dan password salah - [Intercept] memastikan tidak ada request ke dahboard", () => {
    cy.get('input[name="username"]').should("be.visible").type("Admin");
    cy.get('input[name="password"]').should("be.visible").type("admin123Salah");

    cy.intercept("GET", "**/dashboard").as("dashboardRequest");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.wait(1000);
    cy.get("@dashboardRequest.all").should("have.length", 0); // tidak ada request dashboard

    cy.get(".oxd-alert-content-text").should("contain.text","Invalid credentials");
  });

  it("TC_005 - User login menggunakan username salah dan password benar - [Intercept] memastikan tidak ada request ke action summary", () => {
    cy.intercept("GET", "**/employees/action-summary*").as("actionSummaryRequest");

    cy.get('input[name="username"]').should("be.visible").type("AdminSalah");
    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.wait(1000);
    cy.get("@actionSummaryRequest.all").should("have.length", 0);

    cy.get(".oxd-alert-content-text").should("contain.text","Invalid credentials");
  });

  it("TC_006 - User login dengan username kosong dan password benar - [Intercept] karena belum ada field yang terisi, maka pastikan tidak ada request ke server validate", () => {
    cy.intercept("POST", "**/auth/validate").as("validateRequest");

    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.get("@validateRequest.all").should("have.length", 0);

    // Cara validasi pesan required muncul di field username
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text").should("be.visible").and("have.text", "Required");
  });

});
