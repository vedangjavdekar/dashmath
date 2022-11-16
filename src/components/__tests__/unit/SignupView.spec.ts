import { render, fireEvent, screen } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import SignupComponent from "@/components/Auth/SignupComponent.vue";

describe("SignupComponent", () => {
	it("Email is valid and Passwords don't match", async () => {
		const signupComponent = render(SignupComponent, {
			global: {
				plugins: [createTestingPinia({ fakeApp: true })],
			},
		});

		const emailIdText = "Email";
		const passwordIdText = "Password";
		const confirmPasswordIdText = "Confirm Password";
		const signUpButton =
			signupComponent.container.querySelector("#btn_submit");

		const emailInputField = signupComponent.getByLabelText(emailIdText);
		const passwordInputField =
			signupComponent.getByLabelText(passwordIdText);
		const confirmPasswordInputField = signupComponent.getByLabelText(
			confirmPasswordIdText
		);

		await fireEvent.update(emailInputField, "user1@validemail.com");
		await fireEvent.update(passwordInputField, "Password#123");
		await fireEvent.update(confirmPasswordInputField, "ssword#123");

		expect(signUpButton).toBeDefined();

		if (signUpButton) {
			await fireEvent.click(signUpButton);
			const status = await signupComponent.findByText(
				"The value must be equal to the other value"
			);
			expect(status.innerHTML).toBe(
				"The value must be equal to the other value"
			);
		}
	});

	it("Email is valid and Password Criteria not satisfied", async () => {
		const signupComponent = render(SignupComponent, {
			global: {
				plugins: [createTestingPinia({ fakeApp: true })],
			},
		});

		const emailIdText = "Email";
		const passwordIdText = "Password";
		const confirmPasswordIdText = "Confirm Password";
		const signUpButton =
			signupComponent.container.querySelector("#btn_submit");

		const emailInputField = signupComponent.getByLabelText(emailIdText);
		const passwordInputField =
			signupComponent.getByLabelText(passwordIdText);
		const confirmPasswordInputField = signupComponent.getByLabelText(
			confirmPasswordIdText
		);

		await fireEvent.update(emailInputField, "user1@validemail.com");
		await fireEvent.update(passwordInputField, "pasod");
		await fireEvent.update(confirmPasswordInputField, "pasod");

		expect(signUpButton).toBeDefined();

		if (signUpButton) {
			await fireEvent.click(signUpButton);
			const status = await signupComponent.findByText(
				"This field should be at least 6 characters long"
			);
			expect(status.innerHTML).toBe(
				"This field should be at least 6 characters long"
			);
		}
	});

	it("Email is empty", async () => {
		const signupComponent = render(SignupComponent, {
			global: {
				plugins: [createTestingPinia({ fakeApp: true })],
			},
		});

		const emailIdText = "Email";
		const passwordIdText = "Password";
		const confirmPasswordIdText = "Confirm Password";
		const signUpButton =
			signupComponent.container.querySelector("#btn_submit");

		const emailInputField = signupComponent.getByLabelText(emailIdText);
		const passwordInputField =
			signupComponent.getByLabelText(passwordIdText);
		const confirmPasswordInputField = signupComponent.getByLabelText(
			confirmPasswordIdText
		);

		await fireEvent.update(emailInputField, "");
		await fireEvent.update(passwordInputField, "Password");
		await fireEvent.update(confirmPasswordInputField, "Password");

		expect(signUpButton).toBeDefined();
		expect(signUpButton).toHaveProperty("disabled", true);
	});

	it("Email is valid and password is empty", async () => {
		const signupComponent = render(SignupComponent, {
			global: {
				plugins: [createTestingPinia({ fakeApp: true })],
			},
		});

		const emailIdText = "Email";
		const passwordIdText = "Password";
		const confirmPasswordIdText = "Confirm Password";
		const signUpButton =
			signupComponent.container.querySelector("#btn_submit");

		const emailInputField = signupComponent.getByLabelText(emailIdText);
		const passwordInputField =
			signupComponent.getByLabelText(passwordIdText);
		const confirmPasswordInputField = signupComponent.getByLabelText(
			confirmPasswordIdText
		);

		await fireEvent.update(emailInputField, "user1@validemail.com");
		await fireEvent.update(passwordInputField, "");
		await fireEvent.update(confirmPasswordInputField, "Password#123");

		expect(signUpButton).toBeDefined();
		expect(signUpButton).toHaveProperty("disabled", true);
	});

	it("Email is invalid", async () => {
		const signupComponent = render(SignupComponent, {
			global: {
				plugins: [createTestingPinia({ fakeApp: true })],
			},
		});

		const emailIdText = "Email";
		const passwordIdText = "Password";
		const confirmPasswordIdText = "Confirm Password";
		const signUpButton =
			signupComponent.container.querySelector("#btn_submit");

		const emailInputField = signupComponent.getByLabelText(emailIdText);
		const passwordInputField =
			signupComponent.getByLabelText(passwordIdText);
		const confirmPasswordInputField = signupComponent.getByLabelText(
			confirmPasswordIdText
		);

		await fireEvent.update(emailInputField, "user");
		await fireEvent.update(passwordInputField, "Password#123");
		await fireEvent.update(confirmPasswordInputField, "Password#123");

		expect(signUpButton).toBeDefined();

		if (signUpButton) {
			await fireEvent.click(signUpButton);

			const status = await screen.findByText(
				"Value is not a valid email address"
			);
			expect(status.innerHTML).toBe("Value is not a valid email address");
		}
	});
});
