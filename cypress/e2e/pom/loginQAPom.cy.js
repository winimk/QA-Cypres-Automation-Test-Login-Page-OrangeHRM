import LoginPage from "../../support/pageObjects/loginPage";
import loginData from "../../fixtures/loginData.json";

describe("Scenario Verifikasi Fungsi Login Orange HRM with POM", () => {
  beforeEach(() => {
    // Visit web sebelum tiap test case
    LoginPage.visitPage();
  });

  it("TC_001 - [POM] User login menggunakan username benar dan password benar", () => {
    LoginPage
      .inputUsername(loginData.validUsername)
      .inputPassword(loginData.validPassword)
      .clickLoginButton()
      .assertionLoginSuccess();
  });

  it("TC_002 - [POM] User login menggunakan username benar dan password benar lalu login dengan tombol enter", () => {
    LoginPage
      .inputUsername(loginData.validUsername)
      .inputPassword(loginData.validPassword, { useEnterKey: true })
      .assertionLoginSuccess();
  });

  it("TC_003 - [POM] User login menggunakan username salah dan password salah", () => {
    LoginPage.inputUsername(loginData.invalidUsername)
      .inputPassword(loginData.invalidPassword)
      .clickLoginButton()
      .assertionLoginFailed();
  });

  it("TC_004 - [POM] User login menggunakan username benar dan password salah", () => {
    LoginPage.inputUsername(loginData.validUsername)
      .inputPassword(loginData.invalidPassword)
      .clickLoginButton()
      .assertionLoginFailed();
  });

  it("TC_005 - [POM] User login menggunakan username salah dan password benar", () => {
    LoginPage.inputUsername(loginData.invalidUsername)
      .inputPassword(loginData.validPassword)
      .clickLoginButton()
      .assertionLoginFailed();
  });

  it("TC_006 - [POM] User login dengan username kosong dan password benar", () => {
    LoginPage.inputPassword(loginData.validPassword)
      .clickLoginButton()
      .assertionRequiredMessageIsShownFieldUsername();
  });

  it("TC_007 - [POM] User login dengan username benar dan password kosong", () => {
    LoginPage.inputUsername(loginData.validUsername)
      .clickLoginButton()
      .assertionRequiredMessageIsShownFieldPassword();
  });

  it("TC_008 - [POM] User login dengan username kosong dan password kosong", () => {
    LoginPage.clickLoginButton()
      .assertionRequiredMessageIsShownFieldUsername()
      .assertionRequiredMessageIsShownFieldPassword();
  });
});
