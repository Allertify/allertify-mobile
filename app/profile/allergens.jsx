import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useSettings } from "@/hooks/useAllergies";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AllergensScreen() {
  const router = useRouter();
  const { updateAllergies, clearError, allergies, getAllergies, error } = useSettings();
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [customAllergiesList, setCustomAllergiesList] = useState([]);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (allergies && allergies.length > 0) {
      const commonAllergyIds = commonAllergies.map((a) => a.id);
      const existingCommon = [];
      const existingCustom = [];

      allergies.forEach((allergy) => {
        if (commonAllergyIds.includes(allergy)) {
          existingCommon.push(allergy);
        } else {
          existingCustom.push(allergy);
          existingCommon.push(`custom_${allergy}`);
        }
      });

      setSelectedAllergies(existingCommon);
      setCustomAllergiesList(existingCustom);
    } else {
      // Reset state when no allergies
      setSelectedAllergies([]);
      setCustomAllergiesList([]);
    }
  }, [allergies]);

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

  function clearAllAllergies() {
    Alert.alert("Clear All Allergies", "Are you sure you want to remove all allergies? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            const result = await updateAllergies([]); // Pass empty array instead of undefined variable

            if (result.success) {
              setSuccessMessage("Successfully cleared all allergies!");
              setSelectedAllergies([]);
              setCustomAllergiesList([]);
            } else {
              setLocalError(result.error || "Failed to clear allergies. Please try again.");
            }
          } catch (err) {
            setLocalError("An unexpected error occurred. Please try again.");
            console.error("Clear allergies error:", err);
          } finally {
            setIsLoading(false);
          }
        }
      }
    ]);
  }

  async function handleUpdateAllergies() {
    setLocalError("");
    setSuccessMessage("");
    setIsLoading(true);
    clearError();

    const allAllergies = [...selectedAllergies.filter((id) => !id.startsWith("custom_")), ...customAllergiesList];

    try {
      const result = await updateAllergies(allAllergies);

      if (result.success) {
        setSuccessMessage("Successfully updated allergies!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setLocalError(result.error || "Allergies update failed. Please try again.");
      }
    } catch (err) {
      setLocalError("An unexpected error occurred. Please try again.");
      console.error("Update allergies error:", err);
    } finally {
      setIsLoading(false);
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

  function renderCurrentAllergyItem(allergy, index) {
    const isCommon = commonAllergies.some((common) => common.id === allergy);
    const commonAllergy = commonAllergies.find((common) => common.id === allergy);

    return (
      <View key={index} style={styles.currentAllergyItem}>
        <View style={styles.currentAllergyIcon}>
          <Ionicons name={isCommon ? commonAllergy.icon : "medical"} size={20} color="#8a42ffff" />
        </View>
        <ThemedText style={styles.currentAllergyText}>{isCommon ? commonAllergy.name : allergy}</ThemedText>
        {!isCommon && (
          <View style={styles.customBadge}>
            <ThemedText style={styles.customBadgeText}>Custom</ThemedText>
          </View>
        )}
      </View>
    );
  }

  const displayError = localError || error;
  const totalSelectedCount = selectedAllergies.length;
  const hasCurrentAllergies = allergies && allergies.length > 0;

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
            <Pressable style={styles.backButton} onPress={() => router.back()}>
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
                <Ionicons name="create" size={40} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText style={styles.title}>Edit Your Allergies</ThemedText>
              <ThemedText style={styles.subtitle}>
                Update your allergy information to keep your profile current and safe.
              </ThemedText>
            </View>

            {hasCurrentAllergies && (
              <View style={styles.currentAllergiesSection}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>Current Allergies</ThemedText>
                  <Pressable onPress={clearAllAllergies} style={styles.clearAllButton}>
                    <ThemedText style={styles.clearAllText}>Clear All</ThemedText>
                  </Pressable>
                </View>
                <View style={styles.currentAllergiesList}>{allergies.map(renderCurrentAllergyItem)}</View>
              </View>
            )}

            {!hasCurrentAllergies && (
              <View style={styles.noAllergiesContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#28a745" />
                <ThemedText style={styles.noAllergiesText}>No allergies currently recorded</ThemedText>
                <ThemedText style={styles.noAllergiesSubtext}>Add any food allergies you have below</ThemedText>
              </View>
            )}

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

              {customAllergiesList.length > 0 && (
                <View style={styles.customAllergiesContainer}>
                  <ThemedText style={styles.customAllergiesTitle}>Your Custom Allergies:</ThemedText>
                  <View style={styles.customAllergiesList}>{customAllergiesList.map(renderCustomAllergy)}</View>
                </View>
              )}
            </View>

            {totalSelectedCount > 0 && (
              <View style={styles.selectedContainer}>
                <ThemedText style={styles.selectedText}>
                  {totalSelectedCount} allerg{totalSelectedCount === 1 ? "y" : "ies"} selected
                </ThemedText>
              </View>
            )}

            {displayError ? <ThemedText style={styles.errorText}>{displayError}</ThemedText> : null}
            {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

            <Pressable
              style={[styles.continue_button, isLoading && styles.buttonDisabled]}
              onPress={handleUpdateAllergies}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ["#ccc", "#999"] : ["#fff5aaff", "#42e895ff", "#4284ffff"]}
                style={styles.continue_button_gradient}
                start={[0, 0]}
                end={[0.8, 0]}
              >
                <ThemedText style={styles.continue_button_text}>
                  {isLoading ? "Updating..." : "Update Allergies"}
                </ThemedText>
              </LinearGradient>
            </Pressable>
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
  currentAllergiesSection: {
    width: "100%",
    marginBottom: 30,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 20
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    color: "#333"
  },
  clearAllButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#dc3545"
  },
  clearAllText: {
    color: "#dc3545",
    fontSize: 12,
    fontWeight: "600"
  },
  currentAllergiesList: {
    gap: 10
  },
  currentAllergyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef"
  },
  currentAllergyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(138, 66, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  currentAllergyText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500"
  },
  customBadge: {
    backgroundColor: "#E5D1FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  customBadgeText: {
    fontSize: 10,
    color: "#8a42ffff",
    fontWeight: "600"
  },
  noAllergiesContainer: {
    alignItems: "center",
    marginBottom: 30
  },
  noAllergiesText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28a745",
    marginTop: 15,
    textAlign: "center"
  },
  noAllergiesSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5
  },
  allergiesSection: {
    width: "100%",
    marginBottom: 30
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
  buttonDisabled: {
    opacity: 0.6
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
  }
});
