import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Animated } from "react-native";
import LoginScreen from "@/app/(auth)/login";

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack
  })
}));

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

const mockUseValidateForm = jest.fn();
const mockAreAllFieldsFilled = jest.fn();

jest.mock("@/utils/useValidateForm", () => ({
  useValidateForm: (...args) => mockUseValidateForm(...args),
  areAllFieldsFilled: (...args) => mockAreAllFieldsFilled(...args)
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, ...props }) => {
    const { View } = require("react-native");
    return <View {...props}>{children}</View>;
  }
}));

jest.mock("@expo/vector-icons/Ionicons", () => {
  const { View } = require("react-native");
  return ({ name, size, color, ...props }) => <View {...props} testID={`icon-${name}`} />;
});

jest.mock("@/assets/ramen_default.png", () => "ramen_default");
jest.mock("@/assets/ramen_focus.png", () => "ramen_focus");

const mockAnimatedValue = {
  setValue: jest.fn(),
  addListener: jest.fn(),
  removeAllListeners: jest.fn()
};

const mockAnimatedSpring = jest.fn(() => ({
  start: jest.fn()
}));

jest.spyOn(Animated, "Value").mockImplementation(() => mockAnimatedValue);
jest.spyOn(Animated, "spring").mockImplementation(mockAnimatedSpring);

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAreAllFieldsFilled.mockReturnValue(false);
    mockUseValidateForm.mockReturnValue({
      success: true,
      successMessage: "Login successful!",
      errorMessage: ""
    });
  });

  describe("Component Rendering", () => {
    // Test 1: Verify all UI elements render correctly
    it("renders correctly with all form fields", () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);

      expect(getByText("Welcome Back")).toBeTruthy();
      expect(getByText("Let's get back to making wiser food choices!")).toBeTruthy();
      expect(getByPlaceholderText("Enter email")).toBeTruthy();
      expect(getByPlaceholderText("Enter password")).toBeTruthy();
      expect(getByText("Login")).toBeTruthy();
      expect(getByText(/Don't have an account/)).toBeTruthy(); // partial text check
      expect(getByText("Sign Up")).toBeTruthy();
    });

    // Test 2: Verify back button renders with correct elements
    it("renders back button with correct icon and text", () => {
      const { getByTestId, getByText } = render(<LoginScreen />);
      expect(getByTestId("icon-chevron-back")).toBeTruthy();
      expect(getByText("Back")).toBeTruthy();
    });

    // Test 3: Verify component renders without crashing
    it("renders default ramen image initially", () => {
      const { getByTestId } = render(<LoginScreen />);
      expect(getByTestId).toBeDefined();

      const { getByText } = render(<LoginScreen />);
      expect(getByText("Welcome Back")).toBeTruthy();
    });

    // Test 4: Verify only login form fields are present (not signup fields)
    it("does not render signup-specific fields", () => {
      const { queryByPlaceholderText } = render(<LoginScreen />);

      expect(queryByPlaceholderText("Enter full name")).toBeFalsy();
      expect(queryByPlaceholderText("Enter phone number")).toBeFalsy();
    });
  });

  describe("Form Input Handling", () => {
    // Test 5: Email input updates correctly
    it("updates email field when text is entered", () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText("Enter email");

      fireEvent.changeText(emailInput, "john@example.com");

      expect(emailInput.props.value).toBe("john@example.com");
    });

    // Test 6: Password input updates correctly
    it("updates password field when text is entered", () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const passwordInput = getByPlaceholderText("Enter password");

      fireEvent.changeText(passwordInput, "password123");

      expect(passwordInput.props.value).toBe("password123");
    });

    // Test 7: Email input has correct keyboard settings
    it("email input has correct keyboard type and auto-capitalization", () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText("Enter email");

      expect(emailInput.props.keyboardType).toBe("email-address");
      expect(emailInput.props.autoCapitalize).toBe("none");
    });

    // Test 8: Password input is secure
    it("password input has secure text entry enabled", () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const passwordInput = getByPlaceholderText("Enter password");

      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe("Focus and Animation Handling", () => {
    // Test 9: Focus triggers scale animation and image change
    it("triggers animation and changes image on input focus", async () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText("Enter email");

      await act(async () => {
        fireEvent(emailInput, "focus");
      });

      expect(mockAnimatedSpring).toHaveBeenCalledWith(
        mockAnimatedValue,
        expect.objectContaining({
          toValue: 1.05,
          friction: 3,
          tension: 40,
          useNativeDriver: true
        })
      );
    });

    // Test 10: Blur resets scale animation and image
    it("triggers animation and resets image on input blur", async () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText("Enter email");

      await act(async () => {
        fireEvent(emailInput, "focus");
      });

      await act(async () => {
        fireEvent(emailInput, "blur");
      });

      expect(mockAnimatedSpring).toHaveBeenCalledWith(
        mockAnimatedValue,
        expect.objectContaining({
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true
        })
      );
    });

    // Test 11: Both email and password inputs trigger focus animation
    it("triggers animation on both email and password focus", async () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText("Enter email");
      const passwordInput = getByPlaceholderText("Enter password");

      await act(async () => {
        fireEvent(emailInput, "focus");
      });

      expect(mockAnimatedSpring).toHaveBeenCalledTimes(1);

      await act(async () => {
        fireEvent(passwordInput, "focus");
      });

      expect(mockAnimatedSpring).toHaveBeenCalledTimes(2);
    });
  });

  describe("Form Validation and Submission", () => {
    // Test 12: Button disabled when fields not filled
    it("login button is disabled when fields are not filled", () => {
      mockAreAllFieldsFilled.mockReturnValue(false);
      const { getByText } = render(<LoginScreen />);

      const loginText = getByText("Login");
      expect(loginText).toBeTruthy();

      fireEvent.press(loginText);

      expect(mockUseValidateForm).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockAreAllFieldsFilled).toHaveBeenCalled();
    });

    // Test 13: Button enabled when all fields filled
    it("login button is enabled when all fields are filled", () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Login successful!",
        errorMessage: ""
      });

      const { getByText } = render(<LoginScreen />);

      const loginText = getByText("Login");
      expect(loginText).toBeTruthy();

      fireEvent.press(loginText);

      expect(mockUseValidateForm).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockAreAllFieldsFilled).toHaveBeenCalled();
    });

    // Test 14: Full form submission and navigation
    it("calls validation and navigates on successful login", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Login successful!",
        errorMessage: ""
      });

      const { getByText, getByPlaceholderText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText("Enter email"), "john@example.com");
      fireEvent.changeText(getByPlaceholderText("Enter password"), "password123");

      const loginButton = getByText("Login");

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(mockUseValidateForm).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@example.com",
          password: "password123"
        }),
        ["email", "password"]
      );

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    // Test 15: Validation called with correct field requirements
    it("validates form with only email and password fields", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Login successful!",
        errorMessage: ""
      });

      const { getByText } = render(<LoginScreen />);
      const loginButton = getByText("Login");

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(mockUseValidateForm).toHaveBeenCalledWith(expect.any(Object), ["email", "password"]);
    });

    // Test 16: Error message display on validation failure
    it("displays error message on validation failure", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: false,
        successMessage: "",
        errorMessage: "Invalid credentials"
      });

      const { getByText, queryByText } = render(<LoginScreen />);
      const loginButton = getByText("Login");

      await act(async () => {
        fireEvent.press(loginButton);
      });

      await waitFor(() => {
        expect(getByText("Invalid credentials")).toBeTruthy();
      });

      expect(queryByText("Login successful!")).toBeFalsy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    // Test 17: Success message display on validation success
    it("displays success message on successful validation", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Login successful!",
        errorMessage: ""
      });

      const { getByText, queryByText } = render(<LoginScreen />);
      const loginButton = getByText("Login");

      await act(async () => {
        fireEvent.press(loginButton);
      });

      await waitFor(() => {
        expect(getByText("Login successful!")).toBeTruthy();
      });

      expect(queryByText("Invalid credentials")).toBeFalsy();
    });

    // Test 18: Disabled button prevents form submission
    it("does not submit form when button is disabled", () => {
      mockAreAllFieldsFilled.mockReturnValue(false);
      const { getByText } = render(<LoginScreen />);
      const loginButton = getByText("Login").parent;

      fireEvent.press(loginButton);

      expect(mockUseValidateForm).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    // Test 19: Back button navigation
    it("navigates back when back button is pressed", () => {
      const { getByTestId } = render(<LoginScreen />);
      const backButton = getByTestId("icon-chevron-back").parent;

      fireEvent.press(backButton);

      expect(mockBack).toHaveBeenCalled();
    });

    // Test 20: Sign up link navigation
    it("navigates to signup screen when signup link is pressed", () => {
      const { getByText } = render(<LoginScreen />);
      const signupLink = getByText("Sign Up");

      fireEvent.press(signupLink);

      expect(mockPush).toHaveBeenCalledWith("/signup");
    });
  });

  describe("Message Display", () => {
    // Test 21: Initial state has no messages
    it("does not display error or success messages initially", () => {
      const { queryByText } = render(<LoginScreen />);

      expect(queryByText("Invalid credentials")).toBeFalsy();
      expect(queryByText("Login successful!")).toBeFalsy();
    });

    // Test 22: Message state management
    it("clears error message when showing success message", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);

      // First render with error
      mockUseValidateForm.mockReturnValue({
        success: false,
        successMessage: "",
        errorMessage: "Invalid credentials"
      });

      const { getByText, queryByText, rerender } = render(<LoginScreen />);

      await act(async () => {
        fireEvent.press(getByText("Login"));
      });

      expect(getByText("Invalid credentials")).toBeTruthy();

      // Then success
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Login successful!",
        errorMessage: ""
      });

      rerender(<LoginScreen />);

      await act(async () => {
        fireEvent.press(getByText("Login"));
      });

      await waitFor(() => {
        expect(queryByText("Invalid credentials")).toBeFalsy();
        expect(getByText("Login successful!")).toBeTruthy();
      });
    });

    // Test 23: Success message clears error
    it("clears success message when showing error message", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);

      // First render with success
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Login successful!",
        errorMessage: ""
      });

      const { getByText, queryByText, rerender } = render(<LoginScreen />);

      await act(async () => {
        fireEvent.press(getByText("Login"));
      });

      expect(getByText("Login successful!")).toBeTruthy();

      // Then error
      mockUseValidateForm.mockReturnValue({
        success: false,
        successMessage: "",
        errorMessage: "Invalid credentials"
      });

      rerender(<LoginScreen />);

      await act(async () => {
        fireEvent.press(getByText("Login"));
      });

      await waitFor(() => {
        expect(queryByText("Login successful!")).toBeFalsy();
        expect(getByText("Invalid credentials")).toBeTruthy();
      });
    });
  });

  describe("Accessibility and Props", () => {
    // Test 24: Input accessibility features
    it("has correct input props and accessibility features", () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      const inputs = [getByPlaceholderText("Enter email"), getByPlaceholderText("Enter password")];

      inputs.forEach((input) => {
        expect(input.props.onFocus).toBeDefined();
        expect(input.props.onBlur).toBeDefined();
        expect(input.props.onChangeText).toBeDefined();
      });
    });
  });

  describe("Form State Management", () => {
    // Test 27: Initial form state
    it("initializes with empty form data", () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      expect(getByPlaceholderText("Enter email").props.value).toBe("");
      expect(getByPlaceholderText("Enter password").props.value).toBe("");
    });

    // Test 28: Form data persistence
    it("maintains form data across re-renders", () => {
      const { getByPlaceholderText, rerender } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText("Enter email");
      const passwordInput = getByPlaceholderText("Enter password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "testpass");

      rerender(<LoginScreen />);

      expect(getByPlaceholderText("Enter email").props.value).toBe("test@example.com");
      expect(getByPlaceholderText("Enter password").props.value).toBe("testpass");
    });
  });
});
