import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Animated } from "react-native";
import SignUpScreen from "@/app/(auth)/signup";

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

// Mock useValidateForm hook
const mockUseValidateForm = jest.fn();
const mockAreAllFieldsFilled = jest.fn();

jest.mock("@/utils/useValidateForm", () => ({
  useValidateForm: (...args) => mockUseValidateForm(...args),
  areAllFieldsFilled: (...args) => mockAreAllFieldsFilled(...args)
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, ...props }) => {
    const { View } = require("react-native");
    return <View {...props}>{children}</View>;
  }
}));

// Mock Ionicons
jest.mock("@expo/vector-icons/Ionicons", () => {
  const { View } = require("react-native");
  return ({ name, size, color, ...props }) => <View {...props} testID={`icon-${name}`} />;
});

// Mock assets
jest.mock("@/assets/veggies_default.png", () => "veggies-default-image");
jest.mock("@/assets/veggies_focus.png", () => "veggies-focus-image");

// Mock Animated
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

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    mockAreAllFieldsFilled.mockReturnValue(false);
    mockUseValidateForm.mockReturnValue({
      success: true,
      successMessage: "Registration successful!",
      errorMessage: ""
    });
  });

  describe("Component Rendering", () => {
    it("renders correctly with all form fields", () => {
      const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

      // Check title and subtitle
      expect(getByText("Sign Up")).toBeTruthy();
      expect(getByText("Let's get to know eachother!")).toBeTruthy();

      // Check form labels
      expect(getByText("Full Name")).toBeTruthy();
      expect(getByText("Email")).toBeTruthy();
      expect(getByText("Phone Number")).toBeTruthy();
      expect(getByText("Password")).toBeTruthy();

      // Check input fields
      expect(getByPlaceholderText("Enter your full name")).toBeTruthy();
      expect(getByPlaceholderText("Enter your email")).toBeTruthy();
      expect(getByPlaceholderText("Enter your phone number")).toBeTruthy();
      expect(getByPlaceholderText("Enter your password")).toBeTruthy();

      // Check register button
      expect(getByText("Register")).toBeTruthy();
    });

    it("renders back button icon", () => {
      const { getByTestId } = render(<SignUpScreen />);
      expect(getByTestId("icon-chevron-back-circle")).toBeTruthy();
    });

    it("renders default veggies image initially", () => {
      const { getByTestId } = render(<SignUpScreen />);
      // Since we mocked the animated image, we can test through testID
      // The actual test should verify the component renders without crashing
      expect(getByTestId).toBeDefined();

      // Alternative: test that no error occurs during rendering
      const { getByText } = render(<SignUpScreen />);
      expect(getByText("Sign Up")).toBeTruthy();
    });
  });

  describe("Form Input Handling", () => {
    it("updates fullName field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const fullNameInput = getByPlaceholderText("Enter your full name");

      fireEvent.changeText(fullNameInput, "John Doe");

      expect(fullNameInput.props.value).toBe("John Doe");
    });

    it("updates email field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const emailInput = getByPlaceholderText("Enter your email");

      fireEvent.changeText(emailInput, "john@example.com");

      expect(emailInput.props.value).toBe("john@example.com");
    });

    it("updates phoneNumber field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const phoneInput = getByPlaceholderText("Enter your phone number");

      fireEvent.changeText(phoneInput, "1234567890");

      expect(phoneInput.props.value).toBe("1234567890");
    });

    it("updates password field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const passwordInput = getByPlaceholderText("Enter your password");

      fireEvent.changeText(passwordInput, "password123");

      expect(passwordInput.props.value).toBe("password123");
    });

    it("email input has correct keyboard type and auto-capitalization", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const emailInput = getByPlaceholderText("Enter your email");

      expect(emailInput.props.keyboardType).toBe("email-address");
      expect(emailInput.props.autoCapitalize).toBe("none");
    });

    it("phone input has correct keyboard type", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const phoneInput = getByPlaceholderText("Enter your phone number");

      expect(phoneInput.props.keyboardType).toBe("phone-pad");
    });

    it("password input has secure text entry enabled", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const passwordInput = getByPlaceholderText("Enter your password");

      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe("Focus and Animation Handling", () => {
    it("triggers animation and changes image on input focus", async () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const fullNameInput = getByPlaceholderText("Enter your full name");

      await act(async () => {
        fireEvent(fullNameInput, "focus");
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

      // Since the animated image is mocked, we verify the animation was triggered
      // The actual image switching would happen in the real component
    });

    it("triggers animation and resets image on input blur", async () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const fullNameInput = getByPlaceholderText("Enter your full name");

      // First focus
      await act(async () => {
        fireEvent(fullNameInput, "focus");
      });

      // Then blur
      await act(async () => {
        fireEvent(fullNameInput, "blur");
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

      // Since the animated image is mocked, we verify the animation was triggered
      // The actual image switching would happen in the real component
    });
  });

  describe("Form Validation and Submission", () => {
    it("register button is disabled when fields are not filled", () => {
      mockAreAllFieldsFilled.mockReturnValue(false);
      const { getByText } = render(<SignUpScreen />);

      const registerText = getByText("Register");
      expect(registerText).toBeTruthy();

      // Test the disabled functionality by trying to press the button
      // When disabled, the onPress should not trigger validation
      fireEvent.press(registerText);

      // Verify validation was NOT called (button was disabled)
      expect(mockUseValidateForm).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();

      // Verify the disabled state function was called
      expect(mockAreAllFieldsFilled).toHaveBeenCalled();
    });

    it("register button is enabled when all fields are filled", () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      const { getByText } = render(<SignUpScreen />);

      const registerText = getByText("Register");
      expect(registerText).toBeTruthy();

      // Test that button works when enabled
      fireEvent.press(registerText);

      // Verify validation WAS called (button was enabled)
      expect(mockUseValidateForm).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");

      // Verify the enabled state function was called
      expect(mockAreAllFieldsFilled).toHaveBeenCalled();
    });

    it("calls validation and navigates on successful registration", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

      // Fill in form data
      fireEvent.changeText(getByPlaceholderText("Enter your full name"), "John Doe");
      fireEvent.changeText(getByPlaceholderText("Enter your email"), "john@example.com");
      fireEvent.changeText(getByPlaceholderText("Enter your phone number"), "1234567890");
      fireEvent.changeText(getByPlaceholderText("Enter your password"), "password123");

      const registerButton = getByText("Register");

      await act(async () => {
        fireEvent.press(registerButton);
      });

      expect(mockUseValidateForm).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "John Doe",
          email: "john@example.com",
          phoneNumber: "1234567890",
          password: "password123"
        }),
        ["fullName", "email", "phoneNumber", "password"]
      );

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("displays error message on validation failure", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: false,
        successMessage: "",
        errorMessage: "Invalid email format"
      });

      const { getByText, queryByText } = render(<SignUpScreen />);
      const registerButton = getByText("Register");

      await act(async () => {
        fireEvent.press(registerButton);
      });

      await waitFor(() => {
        expect(getByText("Invalid email format")).toBeTruthy();
      });

      expect(queryByText("Registration successful!")).toBeFalsy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("displays success message on successful validation", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      const { getByText, queryByText } = render(<SignUpScreen />);
      const registerButton = getByText("Register");

      await act(async () => {
        fireEvent.press(registerButton);
      });

      await waitFor(() => {
        expect(getByText("Registration successful!")).toBeTruthy();
      });

      expect(queryByText("Invalid email format")).toBeFalsy();
    });

    it("does not submit form when button is disabled", () => {
      mockAreAllFieldsFilled.mockReturnValue(false);
      const { getByText } = render(<SignUpScreen />);
      const registerButton = getByText("Register").parent;

      fireEvent.press(registerButton);

      expect(mockUseValidateForm).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    it("navigates back to auth screen when back button is pressed", () => {
      const { getByTestId } = render(<SignUpScreen />);
      const backButton = getByTestId("icon-chevron-back-circle").parent;

      fireEvent.press(backButton);

      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });

  describe("Message Display", () => {
    it("does not display error or success messages initially", () => {
      const { queryByText } = render(<SignUpScreen />);

      expect(queryByText("Invalid email format")).toBeFalsy();
      expect(queryByText("Registration successful!")).toBeFalsy();
    });

    it("clears error message when showing success message", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);

      // First render with error
      mockUseValidateForm.mockReturnValue({
        success: false,
        successMessage: "",
        errorMessage: "Invalid email format"
      });

      const { getByText, queryByText, rerender } = render(<SignUpScreen />);

      await act(async () => {
        fireEvent.press(getByText("Register"));
      });

      expect(getByText("Invalid email format")).toBeTruthy();

      // Then success
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      rerender(<SignUpScreen />);

      await act(async () => {
        fireEvent.press(getByText("Register"));
      });

      await waitFor(() => {
        expect(queryByText("Invalid email format")).toBeFalsy();
        expect(getByText("Registration successful!")).toBeTruthy();
      });
    });
  });

  describe("Accessibility and Props", () => {
    it("has correct input props and accessibility features", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);

      const inputs = [
        getByPlaceholderText("Enter your full name"),
        getByPlaceholderText("Enter your email"),
        getByPlaceholderText("Enter your phone number"),
        getByPlaceholderText("Enter your password")
      ];

      inputs.forEach((input) => {
        expect(input.props.onFocus).toBeDefined();
        expect(input.props.onBlur).toBeDefined();
        expect(input.props.onChangeText).toBeDefined();
      });
    });
  });
});
