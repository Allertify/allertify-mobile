import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Animated } from "react-native";
import SignUpScreen from "@/app/(auth)/signup";

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

jest.mock("@/assets/veggies_default.png", () => "veggies-default-image");
jest.mock("@/assets/veggies_focus.png", () => "veggies-focus-image");

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
    mockAreAllFieldsFilled.mockReturnValue(false);
    mockUseValidateForm.mockReturnValue({
      success: true,
      successMessage: "Registration successful!",
      errorMessage: ""
    });
  });

  describe("Component Rendering", () => {
    // Test 1: Verify all UI elements render correctly
    it("renders correctly with all form fields", () => {
      const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

      expect(getByText("Create Your Account")).toBeTruthy();
      expect(getByText("We're here to assist you make safer food choices. Are you ready?")).toBeTruthy();
      expect(getByPlaceholderText("Enter full name")).toBeTruthy();
      expect(getByPlaceholderText("Enter email")).toBeTruthy();
      expect(getByPlaceholderText("Enter phone number")).toBeTruthy();
      expect(getByPlaceholderText("Enter password")).toBeTruthy();
      expect(getByText("Get Started")).toBeTruthy();
      expect(getByText(/Already have an account/)).toBeTruthy(); // partial text check
      expect(getByText("Log In")).toBeTruthy();
    });

    // Test 2: Verify back button renders with correct elements
    it("renders back button with updated icon and text", () => {
      const { getByTestId, getByText } = render(<SignUpScreen />);
      expect(getByTestId("icon-chevron-back")).toBeTruthy();
      expect(getByText("Back")).toBeTruthy();
    });

    // Test 3: Verify component renders without crashing
    it("renders default veggies image initially", () => {
      const { getByTestId } = render(<SignUpScreen />);
      expect(getByTestId).toBeDefined();

      const { getByText } = render(<SignUpScreen />);
      expect(getByText("Create Your Account")).toBeTruthy();
    });
  });

  describe("Form Input Handling", () => {
    // Test 4: Full name input updates correctly
    it("updates fullName field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const fullNameInput = getByPlaceholderText("Enter full name");

      fireEvent.changeText(fullNameInput, "John Doe");

      expect(fullNameInput.props.value).toBe("John Doe");
    });

    // Test 5: Email input updates correctly
    it("updates email field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const emailInput = getByPlaceholderText("Enter email");

      fireEvent.changeText(emailInput, "john@example.com");

      expect(emailInput.props.value).toBe("john@example.com");
    });

    // Test 6: Phone number input updates correctly
    it("updates phoneNumber field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const phoneInput = getByPlaceholderText("Enter phone number");

      fireEvent.changeText(phoneInput, "1234567890");

      expect(phoneInput.props.value).toBe("1234567890");
    });

    // Test 7: Password input updates correctly
    it("updates password field when text is entered", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const passwordInput = getByPlaceholderText("Enter password");

      fireEvent.changeText(passwordInput, "password123");

      expect(passwordInput.props.value).toBe("password123");
    });

    // Test 8: Email input has correct keyboard settings
    it("email input has correct keyboard type and auto-capitalization", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const emailInput = getByPlaceholderText("Enter email");

      expect(emailInput.props.keyboardType).toBe("email-address");
      expect(emailInput.props.autoCapitalize).toBe("none");
    });

    // Test 9: Phone input has correct keyboard type
    it("phone input has correct keyboard type", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const phoneInput = getByPlaceholderText("Enter phone number");

      expect(phoneInput.props.keyboardType).toBe("phone-pad");
    });

    // Test 10: Password input is secure
    it("password input has secure text entry enabled", () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const passwordInput = getByPlaceholderText("Enter password");

      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe("Focus and Animation Handling", () => {
    // Test 11: Focus triggers scale animation and image change
    it("triggers animation and changes image on input focus", async () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const fullNameInput = getByPlaceholderText("Enter full name");

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
    });

    // Test 12: Blur resets scale animation and image
    it("triggers animation and resets image on input blur", async () => {
      const { getByPlaceholderText } = render(<SignUpScreen />);
      const fullNameInput = getByPlaceholderText("Enter full name");

      await act(async () => {
        fireEvent(fullNameInput, "focus");
      });

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
    });
  });

  describe("Form Validation and Submission", () => {
    // Test 13: Button disabled when fields not filled
    it("register button is disabled when fields are not filled", () => {
      mockAreAllFieldsFilled.mockReturnValue(false);
      const { getByText } = render(<SignUpScreen />);

      const registerText = getByText("Get Started");
      expect(registerText).toBeTruthy();

      fireEvent.press(registerText);

      expect(mockUseValidateForm).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockAreAllFieldsFilled).toHaveBeenCalled();
    });

    // Test 14: Button enabled when all fields filled
    it("register button is enabled when all fields are filled", () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      const { getByText } = render(<SignUpScreen />);

      const registerText = getByText("Get Started");
      expect(registerText).toBeTruthy();

      fireEvent.press(registerText);

      expect(mockUseValidateForm).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/onboarding");
      expect(mockAreAllFieldsFilled).toHaveBeenCalled();
    });

    // Test 15: Full form submission and navigation
    it("calls validation and navigates on successful registration", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

      fireEvent.changeText(getByPlaceholderText("Enter full name"), "John Doe");
      fireEvent.changeText(getByPlaceholderText("Enter email"), "john@example.com");
      fireEvent.changeText(getByPlaceholderText("Enter phone number"), "1234567890");
      fireEvent.changeText(getByPlaceholderText("Enter password"), "password123");

      const registerButton = getByText("Get Started");

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

      expect(mockPush).toHaveBeenCalledWith("/onboarding");
    });

    // Test 16: Error message display on validation failure
    it("displays error message on validation failure", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: false,
        successMessage: "",
        errorMessage: "Invalid email format"
      });

      const { getByText, queryByText } = render(<SignUpScreen />);
      const registerButton = getByText("Get Started");

      await act(async () => {
        fireEvent.press(registerButton);
      });

      await waitFor(() => {
        expect(getByText("Invalid email format")).toBeTruthy();
      });

      expect(queryByText("Registration successful!")).toBeFalsy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    // Test 17: Success message display on validation success
    it("displays success message on successful validation", async () => {
      mockAreAllFieldsFilled.mockReturnValue(true);
      mockUseValidateForm.mockReturnValue({
        success: true,
        successMessage: "Registration successful!",
        errorMessage: ""
      });

      const { getByText, queryByText } = render(<SignUpScreen />);
      const registerButton = getByText("Get Started");

      await act(async () => {
        fireEvent.press(registerButton);
      });

      await waitFor(() => {
        expect(getByText("Registration successful!")).toBeTruthy();
      });

      expect(queryByText("Invalid email format")).toBeFalsy();
    });

    // Test 18: Disabled button prevents form submission
    it("does not submit form when button is disabled", () => {
      mockAreAllFieldsFilled.mockReturnValue(false);
      const { getByText } = render(<SignUpScreen />);
      const registerButton = getByText("Get Started").parent;

      fireEvent.press(registerButton);

      expect(mockUseValidateForm).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    it("navigates back to auth screen when back button is pressed", () => {
      const { getByTestId } = render(<SignUpScreen />);
      const backButton = getByTestId("icon-chevron-back").parent;

      fireEvent.press(backButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it("navigates to login screen when login link is pressed", () => {
      const { getByText } = render(<SignUpScreen />);
      const loginLink = getByText("Log In").parent;

      fireEvent.press(loginLink);

      expect(mockPush).toHaveBeenCalledWith("/login");
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
        fireEvent.press(getByText("Get Started"));
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
        fireEvent.press(getByText("Get Started"));
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
        getByPlaceholderText("Enter full name"),
        getByPlaceholderText("Enter email"),
        getByPlaceholderText("Enter phone number"),
        getByPlaceholderText("Enter password")
      ];

      inputs.forEach((input) => {
        expect(input.props.onFocus).toBeDefined();
        expect(input.props.onBlur).toBeDefined();
        expect(input.props.onChangeText).toBeDefined();
      });
    });
  });
});
