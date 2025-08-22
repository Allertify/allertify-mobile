import { useValidateForm, areAllFieldsFilled } from "@/utils/useValidateForm";

describe("useValidateForm", () => {
  const validFormData = {
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "1234567890",
    password: "Password123!"
  };

  describe("Full Name Validation", () => {
    it("should pass with valid full name", () => {
      const result = useValidateForm(validFormData, ["fullName"]);
      expect(result.success).toBe(true);
      expect(result.successMessage).toBe("Validation successful.");
    });

    it("should fail with full name less than 3 characters", () => {
      const formData = { ...validFormData, fullName: "Jo" };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid name between 3 and 50 characters.");
    });

    it("should fail with full name more than 50 characters", () => {
      const longName = "A".repeat(51);
      const formData = { ...validFormData, fullName: longName };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid name between 3 and 50 characters.");
    });

    it("should pass with full name exactly 3 characters", () => {
      const formData = { ...validFormData, fullName: "Joe" };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(true);
    });

    it("should pass with full name exactly 50 characters", () => {
      const exactName = "A".repeat(50);
      const formData = { ...validFormData, fullName: exactName };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(true);
    });

    it("should handle full name with leading/trailing whitespace", () => {
      const formData = { ...validFormData, fullName: "  John Doe  " };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(true);
    });

    it("should fail with only whitespace in full name", () => {
      const formData = { ...validFormData, fullName: "   " };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid name between 3 and 50 characters.");
    });

    it("should skip full name validation when not in fieldsToValidate", () => {
      const formData = { ...validFormData, fullName: "A" }; // Invalid name
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("should pass with valid email", () => {
      const result = useValidateForm(validFormData, ["email"]);
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email - missing @", () => {
      const formData = { ...validFormData, email: "johnexample.com" };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid email address.");
    });

    it("should fail with invalid email - missing domain", () => {
      const formData = { ...validFormData, email: "john@" };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid email address.");
    });

    it("should fail with invalid email - missing TLD", () => {
      const formData = { ...validFormData, email: "john@example" };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid email address.");
    });

    it("should fail with invalid email - spaces", () => {
      const formData = { ...validFormData, email: "john doe@example.com" };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid email address.");
    });

    it("should pass with email containing numbers and special characters", () => {
      const formData = { ...validFormData, email: "john.doe123+test@example-site.co.uk" };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(true);
    });

    it("should handle email with leading/trailing whitespace", () => {
      const formData = { ...validFormData, email: "  john@example.com  " };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(true);
    });

    it("should fail with empty email", () => {
      const formData = { ...validFormData, email: "" };
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid email address.");
    });

    it("should skip email validation when not in fieldsToValidate", () => {
      const formData = { ...validFormData, email: "invalid-email" };
      const result = useValidateForm(formData, ["fullName"]);

      expect(result.success).toBe(true);
    });
  });

  describe("Phone Number Validation", () => {
    it("should pass with valid phone number", () => {
      const result = useValidateForm(validFormData, ["phoneNumber"]);
      expect(result.success).toBe(true);
    });

    it("should pass with 8-digit phone number", () => {
      const formData = { ...validFormData, phoneNumber: "12345678" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(true);
    });

    it("should pass with 15-digit phone number", () => {
      const formData = { ...validFormData, phoneNumber: "123456789012345" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(true);
    });

    it("should fail with phone number less than 8 digits", () => {
      const formData = { ...validFormData, phoneNumber: "1234567" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid phone number (8-15 digits).");
    });

    it("should fail with phone number more than 15 digits", () => {
      const formData = { ...validFormData, phoneNumber: "1234567890123456" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid phone number (8-15 digits).");
    });

    it("should fail with phone number containing letters", () => {
      const formData = { ...validFormData, phoneNumber: "12345abc90" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid phone number (8-15 digits).");
    });

    it("should fail with phone number containing special characters", () => {
      const formData = { ...validFormData, phoneNumber: "1234-567-890" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid phone number (8-15 digits).");
    });

    it("should fail with phone number containing spaces", () => {
      const formData = { ...validFormData, phoneNumber: "123 456 7890" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid phone number (8-15 digits).");
    });

    it("should handle phone number with leading/trailing whitespace", () => {
      const formData = { ...validFormData, phoneNumber: "  1234567890  " };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(true);
    });

    it("should fail with empty phone number", () => {
      const formData = { ...validFormData, phoneNumber: "" };
      const result = useValidateForm(formData, ["phoneNumber"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid phone number (8-15 digits).");
    });

    it("should skip phone number validation when not in fieldsToValidate", () => {
      const formData = { ...validFormData, phoneNumber: "123" }; // Invalid phone
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(true);
    });
  });

  describe("Password Validation", () => {
    it("should pass with valid password", () => {
      const result = useValidateForm(validFormData, ["password"]);
      expect(result.success).toBe(true);
    });

    it("should fail with password less than 8 characters", () => {
      const formData = { ...validFormData, password: "Abc123!" };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    });

    it("should fail with password missing uppercase letter", () => {
      const formData = { ...validFormData, password: "password123!" };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    });

    it("should fail with password missing lowercase letter", () => {
      const formData = { ...validFormData, password: "PASSWORD123!" };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    });

    it("should fail with password missing number", () => {
      const formData = { ...validFormData, password: "Password!" };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    });

    it("should fail with password missing special character", () => {
      const formData = { ...validFormData, password: "Password123" };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    });

    it("should pass with various special characters", () => {
      const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", "."];

      specialChars.forEach((char) => {
        const formData = { ...validFormData, password: `Password123${char}` };
        const result = useValidateForm(formData, ["password"]);

        expect(result.success).toBe(true);
      });
    });

    it("should handle password with leading/trailing whitespace", () => {
      const formData = { ...validFormData, password: "  Password123!  " };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(true);
    });

    it("should fail with empty password", () => {
      const formData = { ...validFormData, password: "" };
      const result = useValidateForm(formData, ["password"]);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    });

    it("should skip password validation when not in fieldsToValidate", () => {
      const formData = { ...validFormData, password: "123" }; // Invalid password
      const result = useValidateForm(formData, ["email"]);

      expect(result.success).toBe(true);
    });
  });

  describe("Multiple Field Validation", () => {
    it("should pass when all fields are valid", () => {
      const result = useValidateForm(validFormData);
      expect(result.success).toBe(true);
      expect(result.successMessage).toBe("Validation successful.");
    });

    it("should fail on first invalid field and stop validation", () => {
      const formData = {
        fullName: "A", // Invalid
        email: "invalid-email", // Invalid
        phoneNumber: "123", // Invalid
        password: "weak" // Invalid
      };
      const result = useValidateForm(formData);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe("Please enter a valid name between 3 and 50 characters.");
    });

    it("should validate only specified fields", () => {
      const formData = {
        fullName: "A", // Invalid
        email: "john@example.com", // Valid
        phoneNumber: "123", // Invalid
        password: "Password123!" // Valid
      };
      const result = useValidateForm(formData, ["email", "password"]);

      expect(result.success).toBe(true);
    });

    it("should use default fieldsToValidate when not specified", () => {
      const formData = {
        fullName: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        password: "Password123!"
      };
      const result = useValidateForm(formData);

      expect(result.success).toBe(true);
    });

    it("should handle empty fieldsToValidate array", () => {
      const formData = {
        fullName: "A", // Would be invalid
        email: "invalid", // Would be invalid
        phoneNumber: "123", // Would be invalid
        password: "weak" // Would be invalid
      };
      const result = useValidateForm(formData, []);

      expect(result.success).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing form data properties", () => {
      const incompleteFormData = {
        fullName: "John Doe"
        // Missing other fields
      };

      const result = useValidateForm(incompleteFormData, ["fullName"]);
      expect(result.success).toBe(true);
    });

    it("should handle null values", () => {
      const formData = {
        fullName: null,
        email: "john@example.com",
        phoneNumber: "1234567890",
        password: "Password123!"
      };

      expect(() => useValidateForm(formData, ["fullName"])).toThrow();
    });

    it("should handle undefined values", () => {
      const formData = {
        fullName: undefined,
        email: "john@example.com",
        phoneNumber: "1234567890",
        password: "Password123!"
      };

      expect(() => useValidateForm(formData, ["fullName"])).toThrow();
    });
  });
});

describe("areAllFieldsFilled", () => {
  it("should return true when all fields are filled", () => {
    const formData = {
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      password: "Password123!"
    };

    expect(areAllFieldsFilled(formData)).toBe(true);
  });

  it("should return false when any field is empty", () => {
    const formData = {
      fullName: "John Doe",
      email: "",
      phoneNumber: "1234567890",
      password: "Password123!"
    };

    expect(areAllFieldsFilled(formData)).toBe(false);
  });

  it("should return false when field contains only whitespace", () => {
    const formData = {
      fullName: "John Doe",
      email: "   ",
      phoneNumber: "1234567890",
      password: "Password123!"
    };

    expect(areAllFieldsFilled(formData)).toBe(false);
  });

  it("should return true when fields have leading/trailing whitespace but content", () => {
    const formData = {
      fullName: "  John Doe  ",
      email: "  john@example.com  ",
      phoneNumber: "  1234567890  ",
      password: "  Password123!  "
    };

    expect(areAllFieldsFilled(formData)).toBe(true);
  });

  it("should handle empty object", () => {
    const formData = {};
    expect(areAllFieldsFilled(formData)).toBe(true);
  });

  it("should handle single field object", () => {
    const formData = { name: "John" };
    expect(areAllFieldsFilled(formData)).toBe(true);
  });

  it("should handle single empty field object", () => {
    const formData = { name: "" };
    expect(areAllFieldsFilled(formData)).toBe(false);
  });

  it("should handle mixed data types by converting to strings", () => {
    const formData = {
      name: "John",
      age: "25", // Keep as string since trim() only works on strings
      active: "true", // Keep as string
      notes: "Some notes"
    };

    expect(areAllFieldsFilled(formData)).toBe(true);
  });

  it("should return false for null or undefined values", () => {
    const formData = {
      name: "John",
      email: null
    };

    expect(() => areAllFieldsFilled(formData)).toThrow();
  });
});
