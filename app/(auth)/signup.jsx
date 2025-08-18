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
      router.push("/");
    } else {
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
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for iOS and Android
    >
      <ScrollView
        style={styles.fullScreen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Keep the keyboard open after tapping
      >
        <LinearGradient
          colors={["#FFDA6A", "#FFA245", "#9A59FF"]}
          style={styles.gradientBackground}
          start={[0, 0]}
          end={[0, 1]}
        >
          <View style={styles.header_container}>
            <View style={styles.title_container}>
              <Pressable
                onPress={() => {
                  router.push("/auth");
                }}
              >
                <Ionicons name="chevron-back-circle" size={35} color="#ffff" />
              </Pressable>
              <ThemedText style={styles.title}>Sign Up</ThemedText>
            </View>
            <ThemedText style={styles.subtitle}>Let's get to know eachother!</ThemedText>
            <Animated.Image
              source={isFocused ? VeggiesFocus : VeggiesDefault}
              style={[styles.veggies, { transform: [{ scale: scaleAnim }] }]}
            />
          </View>
        </LinearGradient>

        <View style={styles.form_container}>
          <View style={styles.input_container}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#6fbefeff"
              value={formData.fullName}
              onChangeText={(text) => updateField("fullName", text)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>
          <View style={styles.input_container}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#6fbefeff"
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>
          <View style={styles.input_container}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#6fbefeff"
              value={formData.phoneNumber}
              onChangeText={(text) => updateField("phoneNumber", text)}
              keyboardType="phone-pad"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>
          <View style={styles.input_container}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#6fbefeff"
              value={formData.password}
              onChangeText={(text) => updateField("password", text)}
              secureTextEntry
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>
          {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
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
              Register
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
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

  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#9A59FF"
  },

  gradientBackground: {
    width: "100%"
  },

  header_container: {
    padding: 30,
    width: "100%",
    alignItems: "center",
    paddingBottom: 0
  },

  title_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 10
  },

  title: {
    fontSize: 40,
    color: "#610fd3ff",
    textAlign: "center",
    marginBottom: 0
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#AB6FFE",
    marginBottom: 30
  },

  form_container: {
    backgroundColor: "#F7ECFF",
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%"
  },

  input_container: {
    marginBottom: 15
  },

  label: {
    fontSize: 18,
    color: "#0a70e4ff",
    fontWeight: "600",
    marginBottom: 8
  },

  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#81BCFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#6327B7",
    shadowColor: "#81BCFF",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },

  register_button: {
    backgroundColor: "#6327B7",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6327B7",
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
    fontSize: 18,
    fontWeight: "700"
  },

  register_button_text_disabled: {
    color: "#AB6FFE"
  },

  veggies: {
    alignSelf: "center",
    width: 330,
    height: 330
  },

  errorText: {
    color: "#B72727",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10
  }
});
