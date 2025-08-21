import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  FlatList
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useSettings } from "@/hooks/useSettings";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function onboardingAllergyScreen() {
  const router = useRouter();
  const { updateAllergies, clearError, allergies, error } = useSettings();
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [customAllergiesList, setCustomAllergiesList] = useState([]);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const commonAllergies = [
    { id: "peanuts", name: "Peanuts", icon: "nutrition" },
    { id: "treenuts", name: "Tree Nuts", icon: "leaf" },
    { id: "milk", name: "Milk", icon: "water" },
    { id: "eggs", name: "Eggs", icon: "egg" },
    { id: "fish", name: "Fish", icon: "fish" },
    { id: "shellfish", name: "Shellfish", icon: "bug" },
    { id: "soy", name: "Soy", icon: "leaf" },
    { id: "wheat", name: "Wheat", icon: "leaf" },
    { id: "sesame", name: "Sesame", icon: "flower" },
    { id: "corn", name: "Corn", icon: "leaf" },
    { id: "gluten", name: "Gluten", icon: "fast-food" },
    { id: "chocolate", name: "Chocolate", icon: "cafe" }
  ];

  function toggleAllergy(allergyId) {
    setSelectedAllergies((prev) =>
      prev.includes(allergyId) ? prev.filter((id) => id !== allergyId) : [...prev, allergyId]
    );
  }

  function addCustomAllergy() {
    if (customAllergy.trim() && !customAllergiesList.includes(customAllergy.trim())) {
      const newAllergy = customAllergy.trim();

      setCustomAllergiesList((prev) => [...prev, newAllergy]);
      setSelectedAllergies((prev) => [...prev, `custom_${newAllergy}`]);
      setCustomAllergy("");
    }
  }

  function removeCustomAllergy(allergy) {
    setCustomAllergiesList((prev) => prev.filter((item) => item !== allergy));
    setSelectedAllergies((prev) => prev.filter((id) => id !== `custom_${allergy}`));
  }

  async function handleSendAllergy() {
    setLocalError("");
    setSuccessMessage("");
    clearError();

    const allAllergies = [...selectedAllergies.filter((id) => !id.startsWith("custom_")), ...customAllergiesList];
    console.log(allergies);

    try {
      const result = await updateAllergies(allAllergies);

      if (result.success) {
        setSuccessMessage("Successfully updated allergies!");

        setTimeout(() => {
          router.replace({
            pathname: "/"
          });
        }, 1500);

        console.log(allergies);
      } else {
        setLocalError(result.error || "Allergies update failed. Please try again.");
      }
    } catch (err) {
      setLocalError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    }
  }

  function renderAllergyCard({ item }) {
    const isSelected = selectedAllergies.includes(item.id);

    return (
      <Pressable
        style={[styles.allergyCard, isSelected && styles.allergyCardSelected]}
        onPress={() => toggleAllergy(item.id)}
      >
        <View style={[styles.allergyIcon, isSelected && styles.allergyIconSelected]}>
          <Ionicons name={item.icon} size={24} color={isSelected ? "#FFFFFF" : "#8a42ffff"} />
        </View>
        <ThemedText style={[styles.allergyText, isSelected && styles.allergyTextSelected]}>{item.name}</ThemedText>
      </Pressable>
    );
  }

  function renderCustomAllergy(allergy, index) {
    return (
      <View key={index} style={styles.customAllergyTag}>
        <ThemedText style={styles.customAllergyText}>{allergy}</ThemedText>
        <Pressable onPress={() => removeCustomAllergy(allergy)} style={styles.removeButton}>
          <Ionicons name="close" size={16} color="#666" />
        </Pressable>
      </View>
    );
  }

  const displayError = localError || error;

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
          showsVerticalScrollIndicator={false}
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
              <LinearGradient
                colors={["#fff5aaff", "#5af9a9ff", "#4284ffff"]}
                style={styles.iconContainer}
                start={[0, 0]}
                end={[1, 0.8]}
              >
                <Ionicons name="medical" size={40} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText style={styles.title}>Tell us about your allergies</ThemedText>
              <ThemedText style={styles.subtitle}>
                Help us keep you safe by letting us know about any food allergies you have!
              </ThemedText>
            </View>

            {/* Common Allergies Grid */}
            <View style={styles.allergiesSection}>
              <ThemedText style={styles.sectionTitle}>Common Allergies</ThemedText>
              <FlatList
                data={commonAllergies}
                renderItem={renderAllergyCard}
                numColumns={3}
                keyExtractor={(item) => item.id}
                style={styles.allergiesGrid}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
              />
            </View>

            {/* Custom Allergy Input */}
            <View style={styles.customSection}>
              <ThemedText style={styles.sectionTitle}>Add Custom Allergy</ThemedText>
              <View style={styles.customInputContainer}>
                <View style={styles.input_container}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter custom allergy"
                    placeholderTextColor="#999"
                    value={customAllergy}
                    onChangeText={setCustomAllergy}
                    onSubmitEditing={addCustomAllergy}
                  />
                </View>
                <Pressable
                  style={styles.addButtonContainer}
                  onPress={addCustomAllergy}
                  disabled={!customAllergy.trim()}
                >
                  <LinearGradient
                    colors={!customAllergy.trim() ? ["#ccc", "#ccc"] : ["#fff5aaff", "#42e895ff", "#4284ffff"]}
                    style={styles.addButton}
                    start={[0, 0]}
                    end={[1, 0.8]}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </Pressable>
              </View>

              {/* Custom Allergies Tags */}
              {customAllergiesList.length > 0 && (
                <View style={styles.customAllergiesContainer}>
                  <ThemedText style={styles.customAllergiesTitle}>Your Custom Allergies:</ThemedText>
                  <View style={styles.customAllergiesList}>{customAllergiesList.map(renderCustomAllergy)}</View>
                </View>
              )}
            </View>

            {/* Selected Count */}
            {selectedAllergies.length > 0 && (
              <View style={styles.selectedContainer}>
                <ThemedText style={styles.selectedText}>
                  {selectedAllergies.length} allerg{selectedAllergies.length === 1 ? "y" : "ies"} selected
                </ThemedText>
              </View>
            )}

            {displayError ? <ThemedText style={styles.errorText}>{displayError}</ThemedText> : null}
            {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

            {/* Continue Button */}
            <Pressable style={styles.continue_button} onPress={handleSendAllergy}>
              <LinearGradient
                colors={["#fff5aaff", "#42e895ff", "#4284ffff"]}
                style={styles.continue_button_gradient}
                start={[0, 0]}
                end={[0.8, 0]}
              >
                <ThemedText style={styles.continue_button_text}>Continue</ThemedText>
              </LinearGradient>
            </Pressable>

            <ThemedText style={styles.skipText}>
              <ThemedText onPress={() => router.push("/")} style={styles.skipLink}>
                Skip for now
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
    paddingHorizontal: 20,
    paddingVertical: 40
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

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#8a42ffff",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
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

  allergiesSection: {
    width: "100%",
    marginBottom: 30
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15
  },

  allergiesGrid: {
    width: "100%"
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 15
  },

  allergyCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    padding: 8
  },

  allergyCardSelected: {
    backgroundColor: "#E5D1FF",
    borderColor: "#8a42ffff"
  },

  allergyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(138, 66, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },

  allergyIconSelected: {
    backgroundColor: "#8a42ffff"
  },

  allergyText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500"
  },

  allergyTextSelected: {
    color: "#8a42ffff",
    fontWeight: "600"
  },

  customSection: {
    width: "100%",
    marginBottom: 20
  },

  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  input_container: {
    flex: 1
  },

  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333"
  },

  addButtonContainer: {
    borderRadius: 12
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8a42ffff",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },

  customAllergiesContainer: {
    marginTop: 15,
    width: "100%"
  },

  customAllergiesTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 10
  },

  customAllergiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },

  customAllergyTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5D1FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8
  },

  customAllergyText: {
    fontSize: 14,
    color: "#8a42ffff",
    fontWeight: "500"
  },

  removeButton: {
    marginLeft: 8,
    padding: 2
  },

  selectedContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    width: "100%"
  },

  selectedText: {
    fontSize: 14,
    color: "#8a42ffff",
    textAlign: "center",
    fontWeight: "500"
  },

  continue_button: {
    borderRadius: 12,
    width: "100%",
    marginBottom: 15
  },

  continue_button_gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#42b0ffff",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },

  continue_button_text: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  skipText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center"
  },

  skipLink: {
    color: "#4278ffff",
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
