describe("Signup Tests", () => {
	it("Email and Password are correct but existing email", () => {
		const testEmail = "vedang.javdekarmit@gmail.com";
		const testPassword = "123456";

		cy.viewport(1920, 1080);
		cy.visit("/");
		cy.contains("Get Started").click();
		cy.url().should(
			"be.equal",
			`${Cypress.config("baseUrl")}/authentication`
		);

		cy.contains("Signup").click();

		cy.wait(400).get("#email").type(testEmail);
		cy.get("#btn_submit").should("be.disabled");

		cy.get("#password").type(testPassword);
		cy.get("#btn_submit").should("be.disabled");

		cy.get("#confirmPassword").type(testPassword);
		cy.get("#btn_submit").should("be.not.disabled");

		cy.get("#btn_submit").click();

		cy.contains(
			"User with this email already exists. Login or use another email address."
		);
	});
});
