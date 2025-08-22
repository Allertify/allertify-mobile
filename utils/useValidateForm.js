export function useValidateForm(formData, fieldsToValidate = ["fullName", "email", "phoneNumber", "password"]) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.]).{8,}$/;
  const phoneRegex = /^\+\d{1,4}\s?\d{8,15}$/;

  const { fullName, email, phoneNumber, password } = formData;

  if (fieldsToValidate.includes("fullName")) {
    if (fullName.trim().length < 3 || fullName.trim().length > 50) {
      return {
        success: false,
        errorMessage: "Please enter a valid name between 3 and 50 characters."
      };
    }
  }

  if (fieldsToValidate.includes("email")) {
    if (!emailRegex.test(email.trim())) {
      return {
        success: false,
        errorMessage: "Please enter a valid email address."
      };
    }
  }

  if (fieldsToValidate.includes("phoneNumber")) {
    if (!phoneRegex.test(phoneNumber.trim())) {
      return {
        success: false,
        errorMessage: "Please enter a valid phone number (8-15 digits) with your country code (eg. +62)."
      };
    }
  }

  if (fieldsToValidate.includes("password")) {
    if (!passwordRegex.test(password.trim())) {
      return {
        success: false,
        errorMessage:
          "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      };
    }
  }

  return { success: true, successMessage: "Validation successful." };
}

export function areAllFieldsFilled(formData) {
  return Object.values(formData).every((value) => value.trim() !== "");
}
