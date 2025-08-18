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
import { useState, useRef } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { useValidateForm, areAllFieldsFilled } from "@/utils/useValidateForm";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import VeggiesDefault from "@/assets/veggies_default.png";
import VeggiesFocus from "@/assets/veggies_focus.png";

export default function SignUpScreen() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  function handleRegister() {
    const validationResult = useValidateForm(formData, ["fullName", "email", "phoneNumber", "password"]);

    if (validationResult.success) {
      setErrorMessage("");
      setSuccessMessage(validationResult.successMessage);

      console.log(formData);
      router.push("/onboarding");
    } else {
      setSuccessMessage("");
      setErrorMessage(validationResult.errorMessage);
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
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              <ThemedText style={styles.backText}>Back</ThemedText>
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
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor="#999"
                value={formData.fullName}
                onChangeText={(text) => updateField("fullName", text)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </View>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => updateField("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </View>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                value={formData.phoneNumber}
                onChangeText={(text) => updateField("phoneNumber", text)}
                keyboardType="phone-pad"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </View>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => updateField("password", text)}
                secureTextEntry
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </View>

            {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
            {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

            <Pressable
              style={[styles.register_button, !areAllFieldsFilled(formData) && styles.register_button_disabled]}
              onPress={areAllFieldsFilled(formData) ? handleRegister : undefined}
              disabled={!areAllFieldsFilled(formData)}
            >
              <ThemedText
                style={[
                  styles.register_button_text,
                  !areAllFieldsFilled(formData) && styles.register_button_text_disabled
                ]}
              >
                Get Started
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.loginText}>
              Already have an account?{" "}
              <ThemedText
                onPress={() => {
                  router.push("/login");
                }}
                style={styles.loginLink}
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

  errorText: {
    color: "#dc3545",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    paddingHorizontal: 10
  },

  successText: {
    color: "#28a745",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    paddingHorizontal: 10
  }
});
