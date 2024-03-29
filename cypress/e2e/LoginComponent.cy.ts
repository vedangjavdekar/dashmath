describe("Login Tests", () => {
	it("Email is correct and Password is correct", () => {
		cy.viewport(1920, 1080);

		cy.visit("/");
		cy.contains("Get Started").click();
		cy.url().should(
			"be.equal",
			`${Cypress.config("baseUrl")}/authentication`
		);

		cy.get("#email").type("vedang.javdekarmit@gmail.com");
		cy.get("#btn_submit").should("be.disabled");
		cy.get("#password").type("123456");
		cy.get("#btn_submit").should("be.not.disabled");
		cy.get("#btn_submit").click();

		cy.url().should("be.equal", `${Cypress.config("baseUrl")}/editor`);
		cy.get("#btn_signout").click();
	});
	it("Email is doesn't exist", () => {
		cy.viewport(1920, 1080);
		cy.visit("/");
		cy.contains("Get Started").click();
		cy.url().should(
			"be.equal",
			`${Cypress.config("baseUrl")}/authentication`
		);

		cy.get("#email").type("vedang.javdekar@gmail.com");
		cy.get("#btn_submit").should("be.disabled");
		cy.get("#password").type("123456");
		cy.get("#btn_submit").should("be.not.disabled");
		cy.get("#btn_submit").click();

		cy.contains(
			"Error: User doesn't exist with these credentials. Consider signing up."
		);
	});
});
