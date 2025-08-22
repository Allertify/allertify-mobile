import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

const mockPush = jest.fn();
const mockBack = jest.fn();

// Mock external dependencies
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

describe("AllergyOnboardingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe("Component Rendering", () => {
    // Test 1: Verify all main UI elements render correctly
    it("renders correctly with all main sections", () => {
      const { getByText, getByPlaceholderText } = render(<AllergyOnboardingScreen />);

      expect(getByText("Tell us about your allergies")).toBeTruthy();
      expect(getByText("Help us keep you safe by letting us know about any food allergies you have!")).toBeTruthy();
      expect(getByText("Common Allergies")).toBeTruthy();
      expect(getByText("Add Custom Allergy")).toBeTruthy();
      expect(getByPlaceholderText("Enter custom allergy")).toBeTruthy();
      expect(getByText("Continue")).toBeTruthy();
      expect(getByText("Skip for now")).toBeTruthy();
    });

    // Test 2: Verify all common allergies are rendered
    it("renders all common allergy options", () => {
      const { getByText } = render(<AllergyOnboardingScreen />);

      const expectedAllergies = [
        "Peanuts",
        "Tree Nuts",
        "Milk",
        "Eggs",
        "Fish",
        "Shellfish",
        "Soy",
        "Wheat",
        "Sesame",
        "Corn",
        "Gluten",
        "Chocolate"
      ];

      expectedAllergies.forEach((allergy) => {
        expect(getByText(allergy)).toBeTruthy();
      });
    });

    // Test 3: Verify back button renders with correct elements
    it("renders back button with icon and text", () => {
      const { getByTestId, getByText } = render(<AllergyOnboardingScreen />);

      expect(getByTestId("icon-chevron-back")).toBeTruthy();
      expect(getByText("Back")).toBeTruthy();
    });

    // Test 4: Verify medical icon renders in header
    it("renders medical icon in header", () => {
      const { getByTestId } = render(<AllergyOnboardingScreen />);

      expect(getByTestId("icon-medical")).toBeTruthy();
    });
  });

  describe("Navigation Handling", () => {
    // Test 5: Back button navigation
    it("navigates back when back button is pressed", () => {
      const { getByText } = render(<AllergyOnboardingScreen />);
      const backButton = getByText("Back").parent;

      fireEvent.press(backButton);

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    // Test 6: Continue button navigation
    it("navigates to home when continue button is pressed", () => {
      const { getByText } = render(<AllergyOnboardingScreen />);
      const continueButton = getByText("Continue").parent;

      fireEvent.press(continueButton);

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    // Test 7: Skip link navigation
    it("navigates to home when skip link is pressed", () => {
      const { getByText } = render(<AllergyOnboardingScreen />);
      const skipLink = getByText("Skip for now").parent;

      fireEvent.press(skipLink);

      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("Common Allergy Selection", () => {
    // Test 8: Single allergy selection
    it("selects common allergy when pressed", () => {
      const { getByText, queryByText } = render(<AllergyOnboardingScreen />);
      const peanutsCard = getByText("Peanuts").parent;

      fireEvent.press(peanutsCard);

      expect(queryByText("1 allergy selected")).toBeTruthy();
    });

    // Test 9: Multiple allergy selection
    it("selects multiple common allergies", () => {
      const { getByText, queryByText } = render(<AllergyOnboardingScreen />);
      const peanutsCard = getByText("Peanuts").parent;
      const milkCard = getByText("Milk").parent;

      fireEvent.press(peanutsCard);
      fireEvent.press(milkCard);

      expect(queryByText("2 allergies selected")).toBeTruthy();
    });

    // Test 10: Allergy deselection
    it("deselects common allergy when pressed again", () => {
      const { getByText, queryByText } = render(<AllergyOnboardingScreen />);
      const peanutsCard = getByText("Peanuts").parent;

      // Select then deselect
      fireEvent.press(peanutsCard);
      expect(queryByText("1 allergy selected")).toBeTruthy();

      fireEvent.press(peanutsCard);
      expect(queryByText("1 allergy selected")).toBeFalsy();
    });

    // Test 11: Correct singular/plural text
    it("displays correct singular/plural text for selected allergies", () => {
      const { getByText, queryByText } = render(<AllergyOnboardingScreen />);
      const peanutsCard = getByText("Peanuts").parent;
      const milkCard = getByText("Milk").parent;

      fireEvent.press(peanutsCard);
      expect(queryByText("1 allergy selected")).toBeTruthy();

      fireEvent.press(milkCard);
      expect(queryByText("2 allergies selected")).toBeTruthy();
      expect(queryByText("1 allergy selected")).toBeFalsy();
    });
  });

  describe("Custom Allergy Management", () => {
    // Test 12: Add custom allergy via button
    it("adds custom allergy when add button is pressed", async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      fireEvent.changeText(input, "Coconut");

      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryByText("Your Custom Allergies:")).toBeTruthy();
        expect(queryByText("Coconut")).toBeTruthy();
        expect(queryByText("1 allergy selected")).toBeTruthy();
      });
    });

    // Test 13: Add custom allergy via enter key
    it("adds custom allergy when enter key is pressed", async () => {
      const { getByPlaceholderText, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");

      fireEvent.changeText(input, "Avocado");

      await act(async () => {
        fireEvent(input, "submitEditing");
      });

      await waitFor(() => {
        expect(queryByText("Your Custom Allergies:")).toBeTruthy();
        expect(queryByText("Avocado")).toBeTruthy();
        expect(queryByText("1 allergy selected")).toBeTruthy();
      });
    });

    // Test 14: Input clears after adding custom allergy
    it("clears input field after adding custom allergy", async () => {
      const { getByPlaceholderText, getByTestId } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      fireEvent.changeText(input, "Mango");

      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(input.props.value).toBe("");
      });
    });

    // Test 15: Prevents adding empty custom allergies
    it("does not add empty or whitespace-only custom allergies", async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      // Try empty string
      fireEvent.changeText(input, "");
      await act(async () => {
        fireEvent.press(addButton);
      });
      expect(queryByText("Your Custom Allergies:")).toBeFalsy();

      // Try whitespace only
      fireEvent.changeText(input, "   ");
      await act(async () => {
        fireEvent.press(addButton);
      });
      expect(queryByText("Your Custom Allergies:")).toBeFalsy();
    });

    // Test 16: Prevents duplicate custom allergies
    it("does not add duplicate custom allergies", async () => {
      const { getByPlaceholderText, getByTestId, queryAllByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      // Add first instance
      fireEvent.changeText(input, "Banana");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryAllByText("Banana")).toHaveLength(1);
      });

      // Try to add duplicate
      fireEvent.changeText(input, "Banana");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryAllByText("Banana")).toHaveLength(1);
      });
    });

    // Test 17: Removes custom allergy
    it("removes custom allergy when remove button is pressed", async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      // Add custom allergy
      fireEvent.changeText(input, "Kiwi");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryByText("Kiwi")).toBeTruthy();
        expect(queryByText("1 allergy selected")).toBeTruthy();
      });

      // Remove custom allergy
      const removeButton = getByTestId("icon-close").parent;
      await act(async () => {
        fireEvent.press(removeButton);
      });

      await waitFor(() => {
        expect(queryByText("Kiwi")).toBeFalsy();
        expect(queryByText("Your Custom Allergies:")).toBeFalsy();
        expect(queryByText("1 allergy selected")).toBeFalsy();
      });
    });

    // Test 18: Trims whitespace from custom allergy input
    it("trims whitespace from custom allergy input", async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      fireEvent.changeText(input, "  Papaya  ");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryByText("Papaya")).toBeTruthy();
        // Don't check for the untrimmed version since it won't exist as a separate element
      });
    });
  });

  describe("Combined Selection Logic", () => {
    // Test 19: Counts both common and custom allergies
    it("counts both common and custom allergies in selection count", async () => {
      const { getByText, getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const peanutsCard = getByText("Peanuts").parent;
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      // Select common allergy
      fireEvent.press(peanutsCard);
      expect(queryByText("1 allergy selected")).toBeTruthy();

      // Add custom allergy
      fireEvent.changeText(input, "Quinoa");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryByText("2 allergies selected")).toBeTruthy();
      });
    });

    // Test 20: Console logs correct allergies on continue
    it("logs correct allergies when continue is pressed", async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(<AllergyOnboardingScreen />);
      const peanutsCard = getByText("Peanuts").parent;
      const milkCard = getByText("Milk").parent;
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;
      const continueButton = getByText("Continue").parent;

      // Select common allergies
      fireEvent.press(peanutsCard);
      fireEvent.press(milkCard);

      // Add custom allergy
      fireEvent.changeText(input, "Strawberry");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await act(async () => {
        fireEvent.press(continueButton);
      });

      expect(console.log).toHaveBeenCalledWith("Selected allergies:", ["peanuts", "milk", "Strawberry"]);
    });
  });

  describe("Add Button State Management", () => {
    // Test 21: Add button prevents action when input is empty
    it("prevents adding allergy when input is empty", async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      // Try to add with empty input
      await act(async () => {
        fireEvent.press(addButton);
      });

      expect(queryByText("Your Custom Allergies:")).toBeFalsy();

      // Add text and verify it works
      fireEvent.changeText(input, "Apple");
      await act(async () => {
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(queryByText("Your Custom Allergies:")).toBeTruthy();
        expect(queryByText("Apple")).toBeTruthy();
      });
    });

    // Test 22: Add button prevents action with whitespace only
    it("prevents adding allergy when input contains only whitespace", async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");
      const addButton = getByTestId("icon-add").parent;

      fireEvent.changeText(input, "   ");
      await act(async () => {
        fireEvent.press(addButton);
      });

      expect(queryByText("Your Custom Allergies:")).toBeFalsy();
    });
  });

  describe("Accessibility and Props", () => {
    // Test 23: Input has correct placeholder text
    it("custom allergy input has correct placeholder", () => {
      const { getByPlaceholderText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");

      expect(input.props.placeholder).toBe("Enter custom allergy");
      expect(input.props.placeholderTextColor).toBe("#999");
    });

    // Test 24: Input has proper event handlers
    it("custom allergy input has proper event handlers", () => {
      const { getByPlaceholderText } = render(<AllergyOnboardingScreen />);
      const input = getByPlaceholderText("Enter custom allergy");

      expect(input.props.onChangeText).toBeDefined();
      expect(input.props.onSubmitEditing).toBeDefined();
    });

    // Test 25: Icons render with correct names
    it("renders icons with correct testIDs", () => {
      const { getByTestId } = render(<AllergyOnboardingScreen />);

      expect(getByTestId("icon-medical")).toBeTruthy();
      expect(getByTestId("icon-chevron-back")).toBeTruthy();
      expect(getByTestId("icon-add")).toBeTruthy();
    });
  });

  describe("Selection Display", () => {
    // Test 26: No selection count shown initially
    it("does not show selection count when no allergies selected", () => {
      const { queryByText } = render(<AllergyOnboardingScreen />);

      expect(queryByText(/allergy selected/)).toBeFalsy();
      expect(queryByText(/allergies selected/)).toBeFalsy();
    });

    // Test 27: Custom allergies section hidden initially
    it("does not show custom allergies section when no custom allergies added", () => {
      const { queryByText } = render(<AllergyOnboardingScreen />);

      expect(queryByText("Your Custom Allergies:")).toBeFalsy();
    });
  });
});
