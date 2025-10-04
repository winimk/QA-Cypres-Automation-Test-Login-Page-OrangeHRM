import ForgotPasswordPage from "../../support/pageObjects/project/forgotPasswordPageProject";
import loginData from "../../fixtures/project/loginDataProject.json";
import LoginPage from "../../support/pageObjects/project/loginPageProject";

describe("Scenario Verifikasi Fungsi Forgot Password Orange HRM with POM and Intercept", () => {
  beforeEach(() => {
    // Visit web sebelum tiap test case
    ForgotPasswordPage.visitPage();
  });

  it("TC_001 - Page tampil dengan benar", () => {
    ForgotPasswordPage.elementPageTitle().should("be.visible");
    ForgotPasswordPage.elementInputUsername().should("exist");
    ForgotPasswordPage.elementButtonCancel().should("be.visible");
    ForgotPasswordPage.elementButtonResetPassword().should("be.visible");
  });

  it("TC_002 - Submit dengan username kosong", () => {
    ForgotPasswordPage
      .clickResetPassword()
      .assertionRequiredMessageIsShownFieldUsername();
  });

  it("TC_003 - Submit dengan username valid", () => {
    ForgotPasswordPage
      .interceptResetPasswordRequest()
      .interceptSendPasswordResetPageRequest()
      .inputUsername(loginData.validUsername)
      .clickResetPassword()
      .waitForResetPasswordRequest(302)
      .waitForSendPasswordResetPageRequest(200);
  });

  it("TC_004 - Submit dengan username valid dengan tombol enter", () => {
    ForgotPasswordPage
      .interceptResetPasswordRequest()
      .interceptSendPasswordResetPageRequest()
      .inputUsername(loginData.validUsername, { useEnterKey: true })
      .waitForResetPasswordRequest(302)
      .waitForSendPasswordResetPageRequest(200);
  });

  it("TC_005 - Klik tombol Cancel kembali ke login page", () => {
    LoginPage.interceptLoginPageRequest();
    ForgotPasswordPage.clickCancel();
    LoginPage.waitForLoginPageRequest();
  });
});
