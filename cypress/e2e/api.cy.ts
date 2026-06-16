describe("API - Solicitudes", () => {
  const baseUrl = "/api/v1/solicitudes";

  beforeEach(() => {
    // API routes are protected by the middleware — set the auth cookie
    cy.login();
  });

  it("GET /api/v1/solicitudes returns 200 and an array", () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it("GET /api/v1/solicitudes/:id returns a single request", () => {
    cy.request(baseUrl).then((listResponse) => {
      const firstId = listResponse.body[0].id;

      cy.request(`${baseUrl}/${firstId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id", firstId);
        expect(response.body).to.have.property("title");
        expect(response.body).to.have.property("status");
      });
    });
  });

  it("POST /api/v1/solicitudes creates a new request", () => {
    const newRequest = {
      title: "Cypress API Test Request",
      description: "Created via Cypress API testing to validate POST endpoint works correctly.",
      category: "Testing",
      priority: "medium",
      requester: "Cypress Bot",
    };

    cy.request("POST", baseUrl, newRequest).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("title", newRequest.title);
      expect(response.body).to.have.property("status", "pending");
    });
  });

  it("POST /api/v1/solicitudes returns 400 for invalid payload", () => {
    cy.request({
      method: "POST",
      url: baseUrl,
      body: {
        title: "AB",           // Too short (min 5)
        description: "short",  // Too short (min 10)
        category: "T",         // Too short (min 2)
        priority: "invalid",   // Not in enum
        requester: "AB",       // Too short (min 3)
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("GET /api/v1/solicitudes/:id returns 404 for non-existent id", () => {
    cy.request({
      url: `${baseUrl}/non-existent-id-xyz`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error");
    });
  });
});
