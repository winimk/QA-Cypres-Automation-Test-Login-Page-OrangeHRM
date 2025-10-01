describe("Reqres API Testing Automation", () => {
  const baseUrl = Cypress.env("reqres");
  const apiKey = Cypress.env("reqresApiKey");
  
  it("AT_001 - [Positive Test] Melakukan Register User", () => {
    cy.request({
      method: "POST",
      url: baseUrl + "/register",
      headers: {"x-api-key" : apiKey},
      body: {
        email: "eve.holt@reqres.in",
        password: "pistol"
      },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body,  "Response has id").to.have.property("id");
      expect(response.body, "Response has token").to.have.property("token");
    });
  });

  it("AT_002 - [Negative Test] Melakukan register user dengan email yg tidak didefinisikan di web reqres.in", () => {
    cy.request({
      method: "POST",
      url: baseUrl + "/register",
      headers: {"x-api-key": apiKey},
      body: {
        email: "salah.eve.holt@reqres.in",
        password: "pistol",
      },
      failOnStatusCode: false, // agar bisa handle response error, karena memang kita expect error
    }).then((response) => {
      expect(response.status, "Status codenya 400").to.eq(400);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Response has error").to.have.property("error");
    });
  });

  it("AT_003 - [Positive Test] Melakukan login user", () => {
    cy.request({
      method: "POST",
      url: baseUrl + "/login",
      headers: {"x-api-key": apiKey},
      body: {
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Response has token").to.have.property("token");
    });
  });

  it("AT_004 - [Negative Test] Melakukan login user dengan tidak menyertakan password.", () => {
    cy.request({
      method: "POST",
      url: baseUrl + "/login",
      headers: {"x-api-key": apiKey},
      body: {
        email: "eve.holt@reqres.in",
        password: "",
      },
      failOnStatusCode: false, // agar bisa handle response error, karena memang kita expect error
    }).then((response) => {
      expect(response.status, "Status codenya 400").to.eq(400);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Response has error").to.have.property("error");
      expect(response.body.error, "Response explain about missing password").to.include("Missing password");
    });
  });

  it("AT_005 - [Positive Test] Mendapatkan all user", () => {
    cy.request({
      method: "GET",
      url: baseUrl + "/users",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Response has data property").to.have.property("data");
      expect(response.body.page, "Response has default page = 1").to.eq(1);
      expect(response.body.per_page, "Response has default per_page = 6").to.eq(6);
    });
  });

  it("AT_006 - [Negative Test] Mendapatkan all user dengan page melebihi batas maksimum.", () => {
    cy.request({
      method: "GET",
      url: baseUrl + "/users?page=1000",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body.data, "Data kosong").to.be.an("array").that.is.empty;
    });
  });

  it("AT_007 - Delay Response Get All User", () => {
    const delayParam = 5;
    cy.request({
      method: "GET",
      url: baseUrl + `/users?delay=${delayParam}`,
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, `Response time > ${delayParam} seconds` ).to.be.above(delayParam * 1000);
      expect(response.body, "Response has data property").to.have.property("data");
    });
  });

  const dataCreateUser = [
    { name: "morpheus", job: "leader" },
    { name: "fulan", job: "QA Engineer" },
    { name: "fulana", job: "programmer" },
  ];

  it("AT_008 - Create User (Make several user using Data-driven Testing)", () => {
    dataCreateUser.forEach((item) => {
      cy.request({
        method: "POST",
        url: baseUrl + "/users",
        headers: { "x-api-key": apiKey },
        body: {
          name: `${item.name}`,
          job: `${item.job}`,
        },
      }).then((response) => {
        expect(response.status, "Status codenya 201").to.eq(201);
        expect(response.duration, "Response time harus < 500ms").to.be.lessThan(
          500
        );
        expect(
          response.body,
          `Response has name property of ${item.name}`
        ).to.have.property("name", `${item.name}`);
        expect(
          response.body,
          "Response has createdAt property"
        ).to.have.property("createdAt");
      });
    });
  });

  it("AT_009 - User Update PUT", () => {
    cy.request({
      method: "PUT",
      url: baseUrl + "/users/3",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Berhasil melakukan update menggunakan PUT").to.have.property("updatedAt");
    });
  });

  it("AT_010 - User Update PATCH", () => {
    cy.request({
      method: "PATCH",
      url: baseUrl + "/users/5",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status, "Status codenya 200").to.eq(200);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Berhasil melakukan update menggunakan PATCH").to.have.property("updatedAt");
    });
  });

  it("AT_011 - User DELETE", () => {
    cy.request({
      method: "DELETE",
      url: baseUrl + "/users/5",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status, "Status codenya 204").to.eq(204);
      expect(response.duration, "Response time harus < 500ms").to.be.lessThan(500);
      expect(response.body, "Response Kosong").to.eql("");
    });
  });
});
