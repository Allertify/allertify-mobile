import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/hooks/useAuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { verifyOTP, resendOTP, isLoading, error, clearError } = useAuthContext();

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Refs for OTP input fields
  const otpRefs = useRef([]);

  useEffect(() => {
    startResendTimer();
  }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste operation
      const pastedCode = value.slice(0, 6).split("");
      const newOtpCode = [...otpCode];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newOtpCode[index + i] = char;
        }
      });
      setOtpCode(newOtpCode);

      // Focus on the next empty field or last field
      const nextIndex = Math.min(index + pastedCode.length, 5);
      otpRefs.current[nextIndex]?.focus();
    } else {
      // Handle single character input
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && !otpCode[index] && index > 0) {
      // Focus previous input on backspace
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otp = otpCode.join("");

    if (otp.length !== 6) {
      setErrorMessage("Please enter a complete 6-digit OTP code");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    clearError();

    try {
      const otpData = {
        email: email,
        otp: otp
      };

      const result = await verifyOTP(otpData);

      if (result.success) {
        setSuccessMessage("Verification successful! Welcome aboard!");

        setTimeout(() => {
          router.replace("/onboardingAllergy");
        }, 1500);
      } else {
        setErrorMessage(result.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Verification failed. Please try again.");
      console.error("OTP verification error:", err);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || isResending) {
      return;
    }

    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");
    clearError();

    try {
      const result = await resendOTP(email);

      if (result.success) {
        setSuccessMessage("A new OTP has been sent to your email.");
        setOtpCode(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        startResendTimer();
      } else {
        setErrorMessage(result.error || "Failed to resend OTP. Please try again.");

        Alert.alert("Resend Failed", "We couldn't resend the OTP. Please go back and register again.", [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setErrorMessage("Failed to resend OTP. Please try again.");

      Alert.alert(
        "Connection Error",
        "Unable to resend OTP due to connection issues. Please go back and register again.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otpCode.every((digit) => digit !== "");
  const displayError = errorMessage || error;
  const canResend = resendTimer === 0 && !isResending && !isLoading;

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
              <ThemedText style={styles.title}>Verify Your Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                We've sent a 6-digit verification code to{"\n"}
                {email}
              </ThemedText>
            </View>

            <View style={styles.otp_container}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[styles.otp_input, digit && styles.otp_input_filled]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  keyboardType="numeric"
                  maxLength={6} // Allow paste of full OTP
                  textAlign="center"
                  editable={!isLoading && !isResending}
                />
              ))}
            </View>

            {displayError ? <ThemedText style={styles.errorText}>{displayError}</ThemedText> : null}

            {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

            <Pressable
              style={[
                styles.verify_button,
                (!isOtpComplete || isLoading || isResending) && styles.verify_button_disabled
              ]}
              onPress={isOtpComplete && !isLoading && !isResending ? handleVerifyOTP : undefined}
              disabled={!isOtpComplete || isLoading || isResending}
            >
              <ThemedText
                style={[
                  styles.verify_button_text,
                  (!isOtpComplete || isLoading || isResending) && styles.verify_button_text_disabled
                ]}
              >
                {isLoading ? "Verifying..." : "Verify Account"}
              </ThemedText>
            </Pressable>

            <View style={styles.resend_container}>
              <ThemedText style={styles.resend_text}>Didn't receive the code? </ThemedText>
              <Pressable onPress={handleResendOTP} disabled={!canResend}>
                <ThemedText style={[styles.resend_link, !canResend && styles.resend_link_disabled]}>
                  {isResending ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </ThemedText>
              </Pressable>
            </View>

            <ThemedText style={styles.helpText}>
              Having trouble? You can go back and register again with the same details.
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
    marginBottom: 30
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
    lineHeight: 20
  },

  otp_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "100%",
    paddingHorizontal: 10
  },

  otp_input: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#f8f9fa"
  },

  otp_input_filled: {
    borderColor: "#8a42ffff",
    backgroundColor: "#f0e6ff"
  },

  verify_button: {
    backgroundColor: "#8a42ffff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 10,
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

  verify_button_disabled: {
    backgroundColor: "#E5D1FF",
    shadowOpacity: 0.1,
    elevation: 2
  },

  verify_button_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },

  verify_button_text_disabled: {
    color: "#AB6FFE"
  },

  resend_container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },

  resend_text: {
    color: "#666",
    fontSize: 14
  },

  resend_link: {
    color: "#8a42ffff",
    fontSize: 14,
    fontWeight: "600"
  },

  resend_link_disabled: {
    color: "#ccc"
  },

  errorText: {
    color: "#dc3545",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 10
  },

  successText: {
    color: "#28a745",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 10
  },

  helpText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic"
  }
});
