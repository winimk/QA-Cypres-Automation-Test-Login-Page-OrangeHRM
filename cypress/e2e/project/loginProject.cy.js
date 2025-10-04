import LoginPage from "../../support/pageObjects/project/loginPageProject";
import DashboardPage from "../../support/pageObjects/project/dashboardPageProject";
import loginData from "../../fixtures/project/loginDataProject.json";

describe("Scenario Verifikasi Fungsi Login Orange HRM with POM and Intercept", () => {
  beforeEach(() => {
    // Visit web sebelum tiap test case
    LoginPage.visitPage();
  });

  it("TC_001 - User login menggunakan username benar dan password benar", () => {
    LoginPage
      .interceptLoginRequest()
      .inputUsername(loginData.validUsername)
      .inputPassword(loginData.validPassword)
      .clickLoginButton()
      .waitForLoginRequest(302);
      
    DashboardPage.assertionUserIsOnDashboard();
  });

  it("TC_002 - User login menggunakan username benar dan password benar lalu login dengan tombol enter", () => {
    DashboardPage.interceptShortcutRequest();
    LoginPage
      .inputUsername(loginData.validUsername)
      .inputPassword(loginData.validPassword, { useEnterKey: true })
    DashboardPage.waitForShortcutRequest(200);
    DashboardPage.assertionUserIsOnDashboard();
  });

  it("TC_003 - User login menggunakan username salah dan password salah", () => {
    LoginPage
      .interceptLoginPageRequest()
      .inputUsername(loginData.invalidUsername)
      .inputPassword(loginData.invalidPassword)
      .clickLoginButton()
      .waitForLoginPageRequest(200)
      .assertionLoginFailed();
  });

  it("TC_004 - User login menggunakan username benar dan password salah", () => {
    DashboardPage.interceptDashboardPageRequest()
    LoginPage
      .inputUsername(loginData.validUsername)
      .inputPassword(loginData.invalidPassword)
      .clickLoginButton()
    DashboardPage.waitForNotInDashboardPageRequest()
    LoginPage.assertionLoginFailed();
  });

  it("TC_005 - User login menggunakan username salah dan password benar", () => {
    LoginPage.inputUsername(loginData.invalidUsername)
      .inputPassword(loginData.validPassword)
      .clickLoginButton()
      .assertionLoginFailed();
  });

  it("TC_006 - User login dengan username kosong dan password benar", () => {
    LoginPage.inputPassword(loginData.validPassword)
      .clickLoginButton()
      .assertionRequiredMessageIsShownFieldUsername();
  });

  it("TC_007 - User login dengan username benar dan password kosong", () => {
    LoginPage.inputUsername(loginData.validUsername)
      .clickLoginButton()
      .assertionRequiredMessageIsShownFieldPassword();
  });

  it("TC_008 - User login dengan username kosong dan password kosong", () => {
    LoginPage.clickLoginButton()
      .assertionRequiredMessageIsShownFieldUsername()
      .assertionRequiredMessageIsShownFieldPassword();
  });
});
