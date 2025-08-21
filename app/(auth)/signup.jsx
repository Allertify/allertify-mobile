import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { useValidateForm, areAllFieldsFilled } from "@/utils/useValidateForm";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/hooks/useAuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import VeggiesDefault from "@/assets/veggies_default.png";
import VeggiesFocus from "@/assets/veggies_focus.png";

export default function SignUpScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthContext();
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (localError) {
      setLocalError("");
    }
    if (error) {
      clearError();
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  }

  async function handleRegister() {
    setLocalError("");
    setSuccessMessage("");
    clearError();

    // Validate forms
    const validationResult = useValidateForm(formData, ["fullName", "email", "phoneNumber", "password"]);

    if (!validationResult.success) {
      setLocalError(validationResult.errorMessage);
      return;
    }

    // Attempt register
    try {
      const registrationData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password
      };

      const result = await register(registrationData);

      if (result.success) {
        setSuccessMessage("Registration successful! Please check your email for OTP.");

        // Navigate to OTP screen after a brief delay
        setTimeout(() => {
          router.replace({
            pathname: "/otp",
            params: {
              email: formData.email,
              phone: formData.phoneNumber
            }
          });
        }, 1500);
      } else {
        setLocalError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setLocalError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    }
  }

  function handleFocus() {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  }

  function handleBlur() {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  }

  // Show local error first, then auth context error
  const displayError = localError || error;
  const isFormDisabled = !areAllFieldsFilled(formData) || isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#ffc30fff", "#ff8e1eff", "#8a42ffff"]}
        style={styles.fullScreen}
        start={[0, 0]}
        end={[0, 1]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header_container}>
            <Pressable
              style={styles.backButton}
              onPress={() => {
                if (!isLoading) {
                  router.back();
                }
              }}
              disabled={isLoading}
            >
              <Ionicons name="chevron-back" size={24} color={isLoading ? "#CCCCCC" : "#FFFFFF"} />
              <ThemedText style={[styles.backText, isLoading && styles.disabledText]}>Back</ThemedText>
            </Pressable>
          </View>

          <View style={styles.form_container}>
            <View style={styles.title_container}>
              <ThemedText style={styles.title}>Create Your Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                We're here to assist you make safer food choices. Are you ready?
              </ThemedText>
              <Animated.Image
                source={isFocused ? VeggiesFocus : VeggiesDefault}
                style={[styles.veggies, { transform: [{ scale: scaleAnim }] }]}
              />
            </View>

            <View style={styles.input_container}>
              <TextInput
                style={[styles.input, isLoading && styles.inputDisabled]}
                placeholder="Enter full name"
                placeholderTextColor={isLoading ? "#ccc" : "#999"}
                value={formData.fullName}
                onChangeText={(text) => updateField("fullName", text)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!isLoading}
              />
            </View>

            <View style={styles.input_container}>
              <TextInput
                style={[styles.input, isLoading && styles.inputDisabled]}
                placeholder="Enter email"
                placeholderTextColor={isLoading ? "#ccc" : "#999"}
                value={formData.email}
                onChangeText={(text) => updateField("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!isLoading}
              />
            </View>

            <View style={styles.input_container}>
              <TextInput
                style={[styles.input, isLoading && styles.inputDisabled]}
                placeholder="Enter phone number"
                placeholderTextColor={isLoading ? "#ccc" : "#999"}
                value={formData.phoneNumber}
                onChangeText={(text) => updateField("phoneNumber", text)}
                keyboardType="phone-pad"
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!isLoading}
              />
            </View>

            <View style={styles.input_container}>
              <TextInput
                style={[styles.input, isLoading && styles.inputDisabled]}
                placeholder="Enter password"
                placeholderTextColor={isLoading ? "#ccc" : "#999"}
                value={formData.password}
                onChangeText={(text) => updateField("password", text)}
                secureTextEntry
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!isLoading}
              />
            </View>

            {displayError ? <ThemedText style={styles.errorText}>{displayError}</ThemedText> : null}

            {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

            <Pressable
              style={[styles.register_button, isFormDisabled && styles.register_button_disabled]}
              onPress={!isFormDisabled ? handleRegister : undefined}
              disabled={isFormDisabled}
            >
              <ThemedText style={[styles.register_button_text, isFormDisabled && styles.register_button_text_disabled]}>
                {isLoading ? "Creating Account..." : "Get Started"}
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.loginText}>
              Already have an account?{" "}
              <ThemedText
                onPress={() => {
                  if (!isLoading) {
                    router.push("/login");
                  }
                }}
                style={[styles.loginLink, isLoading && styles.linkDisabled]}
              >
                Log In
              </ThemedText>
            </ThemedText>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1
  },

  fullScreen: {
    flex: 1
  },

  scrollView: {
    flex: 1
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },

  header_container: {
    paddingBottom: 20,
    width: "100%"
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start"
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginLeft: 8
  },

  disabledText: {
    color: "#CCCCCC"
  },

  form_container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },

  title_container: {
    alignItems: "center",
    marginBottom: 10
  },

  title: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 10
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    lineHeight: 20
  },

  veggies: {
    width: 150,
    height: 150,
    marginBottom: 10
  },

  input_container: {
    marginBottom: 15,
    width: "100%"
  },

  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
    width: "100%"
  },

  inputDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
    color: "#999"
  },

  register_button: {
    backgroundColor: "#8a42ffff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    shadowColor: "#8a42ffff",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },

  register_button_disabled: {
    backgroundColor: "#E5D1FF",
    shadowOpacity: 0.1,
    elevation: 2
  },

  register_button_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },

  register_button_text_disabled: {
    color: "#AB6FFE"
  },

  loginText: {
    color: "#666",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center"
  },

  loginLink: {
    color: "#8a42ffff",
    fontWeight: "600"
  },

  linkDisabled: {
    color: "#ccc"
  },

  errorText: {
    color: "#dc3545",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 10,
    paddingHorizontal: 10
  },

  successText: {
    color: "#28a745",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 10,
    paddingHorizontal: 10
  }
});
