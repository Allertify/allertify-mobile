import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AuthScreen from "../app/(auth)/auth";

describe("AuthScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<AuthScreen />);

    // check if the main texts exist
    expect(getByText("Allertify")).toBeTruthy();
    expect(getByText("Know what you're biting into.")).toBeTruthy();

    // check if buttons exist
    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("signup button is pressable", () => {
    const { getByText } = render(<AuthScreen />);
    const signupButton = getByText("Sign Up");
    fireEvent.press(signupButton);
    // TODO: sign up logic
  });

  it("login button is pressable", () => {
    const { getByText } = render(<AuthScreen />);
    const loginButton = getByText("Login");
    fireEvent.press(loginButton);
    // TODO: login logic
  });
});
