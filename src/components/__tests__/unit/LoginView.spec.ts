import { render, fireEvent } from "@testing-library/vue";
import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import LoginComponent from "@/components/Auth/LoginComponent.vue";

describe("LoginComponent", () => {
  it("Email is correct but password is invalid", async () => {
    const loginComponent = render(LoginComponent, {
      global: {
        plugins: [createTestingPinia({ fakeApp: true })],
      },
    });

    const emailIdText = "Email";
    const passwordIdText = "Password";
    const loginButton = loginComponent.container.querySelector("#btn_submit");

    const emailInputField = loginComponent.getByLabelText(emailIdText);
    const passwordInputField = loginComponent.getByLabelText(passwordIdText);

    await fireEvent.update(emailInputField, "user1@validemail.com");
    await fireEvent.update(passwordInputField, "2aspo");

    expect(loginButton).toBeDefined();

    if (loginButton) {
      await fireEvent.click(loginButton);

      const status = await loginComponent.findByText(
        "This field should be at least 6 characters long"
      );
      expect(status.innerHTML).toBe(
        "This field should be at least 6 characters long"
      );
    }
  });
  it("Email is invalid", async () => {
    const loginComponent = render(LoginComponent, {
      global: {
        plugins: [createTestingPinia({ fakeApp: true })],
      },
    });

    const emailIdText = "Email";
    const passwordIdText = "Password";
    const loginButton = loginComponent.container.querySelector("#btn_submit");

    const emailInputField = loginComponent.getByLabelText(emailIdText);
    const passwordInputField = loginComponent.getByLabelText(passwordIdText);

    await fireEvent.update(emailInputField, "user1.com");
    await fireEvent.update(passwordInputField, "Password#123");

    expect(loginButton).toBeDefined();

    if (loginButton) {
      await fireEvent.click(loginButton);

      const status = await loginComponent.findByText(
        "Value is not a valid email address"
      );
      expect(status.innerHTML).toBe("Value is not a valid email address");
    }
  });
  it("Email is empty", async () => {
    const loginComponent = render(LoginComponent, {
      global: {
        plugins: [createTestingPinia({ fakeApp: true })],
      },
    });

    const emailIdText = "Email";
    const passwordIdText = "Password";
    const loginButton = loginComponent.container.querySelector("#btn_submit");

    const emailInputField = loginComponent.getByLabelText(emailIdText);
    const passwordInputField = loginComponent.getByLabelText(passwordIdText);

    await fireEvent.update(emailInputField, "");
    await fireEvent.update(passwordInputField, "123456");

    expect(loginButton).toBeDefined();
    expect(loginButton).toHaveProperty("disabled", true);
  });
  it("Password is empty", async () => {
    const loginComponent = render(LoginComponent, {
      global: {
        plugins: [createTestingPinia({ fakeApp: true })],
      },
    });

    const emailIdText = "Email";
    const passwordIdText = "Password";
    const loginButton = loginComponent.container.querySelector("#btn_submit");

    const emailInputField = loginComponent.getByLabelText(emailIdText);
    const passwordInputField = loginComponent.getByLabelText(passwordIdText);

    await fireEvent.update(emailInputField, "vedang.javdekarmit@gmail.com");
    await fireEvent.update(passwordInputField, "");

    expect(loginButton).toBeDefined();
    expect(loginButton).toHaveProperty("disabled", true);
  });
});
