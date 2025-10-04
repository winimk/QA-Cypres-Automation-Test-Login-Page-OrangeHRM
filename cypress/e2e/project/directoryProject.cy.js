import LoginPage from "../../support/pageObjects/project/loginPageProject";
import DashboardPage from "../../support/pageObjects/project/dashboardPageProject";
import DirectoryPage from "../../support/pageObjects/project/directoryPageProject";
import loginData from "../../fixtures/project/loginDataProject.json";
import directoryData from "../../fixtures/project/directoryDataProject.json";

describe("Scenario Halaman Directory Orange HRM with POM and Intercept", () => {
  beforeEach(() => {
    // Login Dahulu
    LoginPage.doLogin(loginData.validUsername, loginData.validPassword);
    DashboardPage.assertionUserIsOnDashboard();
    DirectoryPage.visitPage();
    DirectoryPage.assertionUserIsOnDirectory();
  });

  it("TC_001 - Halaman Directory tampil dengan benar", () => {
    DirectoryPage.elementPageTitle().should("be.visible");
    DirectoryPage.elementInputName().should("be.visible");
    DirectoryPage.elementDropdownJobTitleIcon().should("be.visible");
    DirectoryPage.elementDropdownLocationIcon().should("be.visible");
    DirectoryPage.elementButtonSearch().should("be.visible");
    DirectoryPage.elementButtonReset().should("be.visible");
  });

  it("TC_002 - Validasi dropdown Job Title menampilkan list option", () => {
    DirectoryPage.elementDropdownJobTitleIcon().click();
    DirectoryPage.assertionJobTitleListAvailable();
  });

  it("TC_003 - Validasi dropdown Location menampilkan list option", () => {
    DirectoryPage.elementDropdownLocationIcon().click();
    DirectoryPage.assertionLocationListAvailable();
  });
  
  it("TC_004 - Cari karyawan by nama karyawan", () => {
    DirectoryPage.interceptSearchRequest()
      .inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .clickSearch()
      .waitForSearchRequest(200, 1); //Expect hanya ada 1 hasil

    DirectoryPage.elementTableResult().should("contain.text",directoryData.validEmNameFull);
  });

  it("TC_005 - Cari karyawan by nama yang invalid", () => {
    DirectoryPage.interceptSearchRequest()
      .inputName(directoryData.invalidEmName)
      .clickSearch()
      .assertionInvalidMessageIsShownFieldName();
  });

  it("TC_006 - Cari karyawan by Job Title", () => {
    DirectoryPage.selectJobTitle(directoryData.validJobTitle)
      .inputName(directoryData.validEmNameHalf)
      .clearInputName()
      .interceptSearchRequest()
      .clickSearch()
      .waitForSearchRequest(200, 1); //Expect hanya ada 1 hasil

    DirectoryPage.elementTableResult().should("contain.text",directoryData.validJobTitle);
  });

  it("TC_007 - Cari karyawan by Location", () => {
    DirectoryPage.selectLocation(directoryData.validLocationTitle)
      .inputName(directoryData.validEmNameHalf)
      .clearInputName()
      .interceptSearchRequest()
      .clickSearch()
      .waitForSearchRequest(200, 2); //Expect hanya ada 2 hasil

    DirectoryPage.elementTableResult().should("contain.text",directoryData.validLocationTitle);
  });

  it("TC_008 - Cari karyawan by Name, Job Title & Location", () => {
    DirectoryPage.inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .selectJobTitle(directoryData.validJobTitle)
      .selectLocation(directoryData.validLocationTitle)
      .interceptSearchRequest()
      .clickSearch()
      .waitForSearchRequest(200, 1); //Expect hanya ada 1 hasil

    DirectoryPage.elementTableResult().should("contain.text",directoryData.validEmNameFull);
    DirectoryPage.elementTableResult().should("contain.text",directoryData.validJobTitle);
    DirectoryPage.elementTableResult().should("contain.text",directoryData.validLocationTitle);
  });

   it("TC_009 - Reset button untuk clear semua filters", () => {
    DirectoryPage.inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .selectJobTitle(directoryData.validJobTitle)
      .selectLocation(directoryData.validLocationTitle)
      .clickReset();

    // untuk pastiin semua filter kosong kembali
    DirectoryPage.elementInputName().should("have.value", "");
    DirectoryPage.elementDropdownJobTitleValue().should("contain.text", "Select");
    DirectoryPage.elementDropdownLocationValue().should("contain.text", "Select");
   });
  
  it("TC_010 - Cek hasil 'No Records Found' jika data tidak ada", () => {
    DirectoryPage.interceptSearchRequest()
      .selectJobTitle(directoryData.validJobTitle2)
      .inputName(directoryData.validEmNameHalf)
      .clearInputName()
      .clickSearch()
      .waitForSearchRequest(200, 0); // expect 0 hasil
  });

  it("TC_011 - Klik 1 card maka tampil detail card", () => {
    DirectoryPage.interceptDetailEmployeesRequest()
      .inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .clickResultCardbyName(directoryData.validEmNameFull)
      .waitForDetailEmployeesRequest()
      .assertionDetailCardOpened();
  });

  it("TC_012 - Validasi isi detail card", () => {
    DirectoryPage.interceptDetailEmployeesRequest()
      .inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .clickResultCardbyName(directoryData.validEmNameFull)
      .waitForDetailEmployeesRequest()
      .assertionDetailCardOpened()
      .assertionDetailCardName(directoryData.validEmNameFull);
  });

  it("TC_013 - Klik card berbeda, maka detail card terupdate", () => {
    // Coba search dulu, agar data tidak kebanyakan
    DirectoryPage.selectLocation(directoryData.validLocationTitle)
      .inputName(directoryData.validEmNameHalf)
      .clearInputName()
      .interceptSearchRequest()
      .clickSearch()
      .waitForSearchRequest(200, 2); //Expect hanya ada 2 hasil
    
    DirectoryPage.elementTableResult().should("contain.text",directoryData.validLocationTitle);

    // Klik Card 1
    DirectoryPage.interceptDetailEmployeesRequest()
      .clickResultCardbyName(directoryData.validEmNameFull)
      .waitForDetailEmployeesRequest()
      .assertionDetailCardOpened()
      .assertionDetailCardName(directoryData.validEmNameFull);
    
    // Klik Card 2
    DirectoryPage.interceptDetailEmployeesRequest()
      .clickResultCardbyName(directoryData.validEmNameFull2)
      .waitForDetailEmployeesRequest()
      .assertionDetailCardOpened()
      .assertionDetailCardName(directoryData.validEmNameFull2);
  });

  it("TC_014 - Close card detail", () => {
    DirectoryPage.interceptDetailEmployeesRequest()
      .inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .clickResultCardbyName(directoryData.validEmNameFull)
      .waitForDetailEmployeesRequest()
      .assertionDetailCardOpened()
      .clickCloseCardDetail()
      .assertionDetailCardClosed();
  });

  it("TC_015 - Klik berulang pada card yang sama", () => {
    DirectoryPage.interceptDetailEmployeesRequest()
      .inputName(directoryData.validEmNameHalf)
      .selectEmployeeNameFromSuggestion(directoryData.validEmNameFull)
      .clickResultCardbyName(directoryData.validEmNameFull)
      .waitForDetailEmployeesRequest()
      .assertionDetailCardOpened()
      .clickResultCardbyName(directoryData.validEmNameFull)
      .assertionDetailCardClosed(); //Jika card yang sama diklik 2 kali maka detail card harusnya tertutup
  });
});
