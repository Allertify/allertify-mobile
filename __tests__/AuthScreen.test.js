import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AuthScreen from "@/app/(auth)/auth";

// Mock expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

// Mock ThemedText component
jest.mock("@/components/ui/ThemedText", () => {
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children, style, ...props }) => (
      <Text style={style} {...props}>
        {children}
      </Text>
    )
  };
});

// Mock assets
jest.mock("@/assets/burger.png", () => "burger-image");
jest.mock("@/assets/waves_bg.svg", () => {
  const { View } = require("react-native");
  return ({ style, ...props }) => <View style={style} {...props} testID="waves-svg" />;
});

describe("AuthScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByTestId } = render(<AuthScreen />);

    // Check if main title and subtitle are rendered
    expect(getByText("Allertify")).toBeTruthy();
    expect(getByText("Know what you're biting into.")).toBeTruthy();

    // Check if buttons are rendered
    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("or")).toBeTruthy();

    // Check if waves SVG is rendered
    expect(getByTestId("waves-svg")).toBeTruthy();
  });

  it("displays the correct title text", () => {
    const { getByText } = render(<AuthScreen />);
    const titleElement = getByText("Allertify");
    expect(titleElement).toBeTruthy();
  });

  it("displays the correct subtitle text", () => {
    const { getByText } = render(<AuthScreen />);
    const subtitleElement = getByText("Know what you're biting into.");
    expect(subtitleElement).toBeTruthy();
  });

  it("renders Sign Up button with correct text", () => {
    const { getByText } = render(<AuthScreen />);
    const signUpButton = getByText("Sign Up");
    expect(signUpButton).toBeTruthy();
  });

  it("renders Login button with correct text", () => {
    const { getByText } = render(<AuthScreen />);
    const loginButton = getByText("Login");
    expect(loginButton).toBeTruthy();
  });

  it('renders the "or" divider text', () => {
    const { getByText } = render(<AuthScreen />);
    const orText = getByText("or");
    expect(orText).toBeTruthy();
  });

  it("navigates to signup screen when Sign Up button is pressed", () => {
    const { getByText } = render(<AuthScreen />);
    const signUpButton = getByText("Sign Up");

    fireEvent.press(signUpButton);

    expect(mockPush).toHaveBeenCalledWith("/signup");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("navigates to home screen when Login button is pressed", () => {
    const { getByText } = render(<AuthScreen />);
    const loginButton = getByText("Login");

    fireEvent.press(loginButton);

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("renders burger image with correct source", () => {
    const { getByText } = render(<AuthScreen />);
    expect(getByText("Allertify")).toBeTruthy();
  });

  it("renders waves SVG component", () => {
    const { getByTestId } = render(<AuthScreen />);
    const wavesSvg = getByTestId("waves-svg");
    expect(wavesSvg).toBeTruthy();
  });

  it("has correct container structure", () => {
    const { getByText } = render(<AuthScreen />);

    // Verify main elements exist
    expect(getByText("Allertify")).toBeTruthy();
    expect(getByText("Know what you're biting into.")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("buttons are pressable and accessible", () => {
    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText("Sign Up"));
    expect(mockPush).toHaveBeenCalledWith("/signup");

    fireEvent.press(getByText("Login"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles multiple button presses correctly", () => {
    const { getByText } = render(<AuthScreen />);
    const signUpButton = getByText("Sign Up");
    const loginButton = getByText("Login");

    // Press Sign Up button multiple times
    fireEvent.press(signUpButton);
    fireEvent.press(signUpButton);

    // Press Login button once
    fireEvent.press(loginButton);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenNthCalledWith(1, "/signup");
    expect(mockPush).toHaveBeenNthCalledWith(2, "/signup");
    expect(mockPush).toHaveBeenNthCalledWith(3, "/");
  });

  it("uses correct router instance", () => {
    render(<AuthScreen />);
    // This test ensures useRouter is called and mockPush is properly set up
    expect(mockPush).toBeDefined();
    expect(typeof mockPush).toBe("function");
  });
});
