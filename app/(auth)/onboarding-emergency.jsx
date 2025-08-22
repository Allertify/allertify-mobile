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
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useEmergencyContact } from "@/hooks/useEmergencyContact";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useValidateForm } from "@/utils/useValidateForm";

export default function onboardingEmergencyContactScreen() {
  const router = useRouter();

  const {
    emergencyContact: existingContact,
    hasEmergencyContact,
    addEmergencyContact,
    editEmergencyContact,
    removeEmergencyContact,
    isLoading,
    error,
    clearError
  } = useEmergencyContact();

  const [currentContact, setCurrentContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });

  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(true);

  const relationshipOptions = [
    { id: "parent", name: "Parent", icon: "people" },
    { id: "spouse", name: "Spouse", icon: "heart" },
    { id: "sibling", name: "Sibling", icon: "people-circle" },
    { id: "friend", name: "Friend", icon: "person" },
    { id: "doctor", name: "Doctor", icon: "medical" },
    { id: "guardian", name: "Guardian", icon: "shield-checkmark" },
    { id: "partner", name: "Partner", icon: "heart-circle" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal-circle" }
  ];

  // Update form visibility based on contact existence
  useEffect(() => {
    if (isEditing) {
      // Always show form when editing
      setShowAddForm(true);
    } else if (hasEmergencyContact) {
      // Hide form when we have a contact and not editing
      setShowAddForm(false);
    } else {
      // Show form when no contact exists
      setShowAddForm(true);
    }
  }, [hasEmergencyContact, isEditing]);

  function selectRelationship(relationshipId) {
    const selected = relationshipOptions.find((option) => option.id === relationshipId);
    setCurrentContact((prev) => ({
      ...prev,
      relationship: selected ? selected.name : ""
    }));
  }

  async function handleAddEmergencyContact() {
    const validation = useValidateForm({ phoneNumber: currentContact.phone }, ["phoneNumber"]);

    if (!validation.success) {
      setLocalError(validation.errorMessage);
      return;
    }

    if (!currentContact.name.trim()) {
      setLocalError("Please enter a contact name");
      return;
    }

    if (!currentContact.relationship.trim()) {
      setLocalError("Please select a relationship");
      return;
    }

    setLocalError("");
    clearError();

    try {
      const contactData = {
        name: currentContact.name.trim(),
        phone_number: currentContact.phone.trim(),
        relationship: currentContact.relationship
      };

      const result = await addEmergencyContact(contactData);

      if (result && result.success) {
        setCurrentContact({ name: "", phone: "", relationship: "" });
        setSuccessMessage("Emergency contact added successfully!");

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.error("Failed to add contact:", result?.error);
        setLocalError(result?.error || "Failed to add emergency contact. Please try again.");
      }
    } catch (err) {
      console.error("Emergency contact add error:", err);
      setLocalError("An unexpected error occurred. Please try again.");
    }
  }

  function handleRemoveEmergencyContact() {
    if (!existingContact?.id) {
      setLocalError("No contact to remove");
      return;
    }

    Alert.alert("Remove Contact", "Are you sure you want to remove this emergency contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            setLocalError("");
            clearError();

            const result = await removeEmergencyContact(existingContact.id);

            if (result && result.success) {
              setSuccessMessage("Emergency contact removed successfully!");
              setTimeout(() => setSuccessMessage(""), 3000);
            } else {
              setLocalError(result?.error || "Failed to remove emergency contact. Please try again.");
            }
          } catch (err) {
            setLocalError("An unexpected error occurred. Please try again.");
            console.error("Emergency contact remove error:", err);
          }
        }
      }
    ]);
  }

  function handleEditEmergencyContact() {
    if (existingContact) {
      setCurrentContact({
        name: existingContact.name || "",
        phone: existingContact.phone_number || existingContact.phone || "",
        relationship: existingContact.relationship || ""
      });
      setIsEditing(true);
      setShowAddForm(true);
    }
  }

  async function handleUpdateEmergencyContact() {
    if (!existingContact?.id) {
      setLocalError("No contact to update");
      return;
    }

    const validation = useValidateForm({ phoneNumber: currentContact.phone }, ["phoneNumber"]);

    if (!validation.success) {
      setLocalError(validation.errorMessage);
      return;
    }

    if (!currentContact.name.trim()) {
      setLocalError("Please enter a contact name");
      return;
    }

    if (!currentContact.relationship.trim()) {
      setLocalError("Please select a relationship");
      return;
    }

    setLocalError("");
    clearError();

    try {
      const contactData = {
        name: currentContact.name.trim(),
        phone_number: currentContact.phone.trim(),
        relationship: currentContact.relationship
      };

      const result = await editEmergencyContact(existingContact.id, contactData);

      if (result && result.success) {
        setCurrentContact({ name: "", phone: "", relationship: "" });
        setIsEditing(false);
        setSuccessMessage("Emergency contact updated successfully!");

        setShowAddForm(false);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.error("Failed to update contact:", result?.error);
        setLocalError(result?.error || "Failed to update emergency contact. Please try again.");
      }
    } catch (err) {
      console.error("Emergency contact update error:", err);
      setLocalError("An unexpected error occurred. Please try again.");
    }
  }

  function cancelEdit() {
    setCurrentContact({ name: "", phone: "", relationship: "" });
    setIsEditing(false);
    setLocalError("");
  }

  async function handleContinue() {
    console.log("Continue clicked - hasEmergencyContact:", hasEmergencyContact);
    if (!hasEmergencyContact) {
      setLocalError("Please add an emergency contact before continuing");
      return;
    }

    router.replace({
      pathname: "/"
    });
  }

  function renderRelationshipOption(option) {
    const isSelected = currentContact.relationship === option.name;

    return (
      <Pressable
        key={option.id}
        style={[styles.relationshipCard, isSelected && styles.relationshipCardSelected]}
        onPress={() => selectRelationship(option.id)}
      >
        <View style={[styles.relationshipIcon, isSelected && styles.relationshipIconSelected]}>
          <Ionicons name={option.icon} size={20} color={isSelected ? "#FFFFFF" : "#8a42ffff"} />
        </View>
        <ThemedText style={[styles.relationshipText, isSelected && styles.relationshipTextSelected]}>
          {option.name}
        </ThemedText>
      </Pressable>
    );
  }

  function renderEmergencyContact(contact) {
    const relationshipOption = relationshipOptions.find((opt) => opt.name === contact.relationship);
    const icon = relationshipOption ? relationshipOption.icon : "person";

    return (
      <View key={contact.id || "contact"} style={styles.contactCard}>
        <View style={styles.contactInfo}>
          <View style={styles.contactIcon}>
            <Ionicons name={icon} size={24} color="#8a42ffff" />
          </View>
          <View style={styles.contactDetails}>
            <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
            <ThemedText style={styles.contactPhone}>{contact.phone_number || contact.phone}</ThemedText>
            <ThemedText style={styles.contactRelationship}>{contact.relationship}</ThemedText>
          </View>
        </View>
        <View style={styles.contactActions}>
          <Pressable onPress={handleEditEmergencyContact} style={styles.editContactButton}>
            <Ionicons name="pencil-outline" size={18} color="#4284ffff" />
          </Pressable>
          <Pressable onPress={handleRemoveEmergencyContact} style={styles.removeContactButton}>
            <Ionicons name="trash-outline" size={18} color="#dc3545" />
          </Pressable>
        </View>
      </View>
    );
  }

  const displayError = localError || error;
  const isFormValid = currentContact.name.trim() && currentContact.phone.trim() && currentContact.relationship.trim();
  const isProcessing = isLoading;

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
                colors={["#fff5aaff", "#ff6b6bff", "#4284ffff"]}
                style={styles.iconContainer}
                start={[0, 0]}
                end={[1, 0.8]}
              >
                <Ionicons name="call" size={40} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText style={styles.title}>Emergency Contact</ThemedText>
              <ThemedText style={styles.subtitle}>
                Add 1 trusted contact who can be reached during allergy emergencies.
              </ThemedText>
            </View>

            {/* Contact Input Form - Show when showAddForm is true */}
            {showAddForm && (
              <View style={styles.contactFormSection}>
                <ThemedText style={styles.sectionTitle}>
                  {isEditing ? "Edit Emergency Contact" : "Add Emergency Contact"}
                </ThemedText>

                <View style={styles.input_container}>
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Name"
                    placeholderTextColor="#999"
                    value={currentContact.name}
                    onChangeText={(text) => setCurrentContact((prev) => ({ ...prev, name: text }))}
                    editable={!isProcessing}
                  />
                </View>

                <View style={styles.input_container}>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number (e.g., +628111111111)"
                    placeholderTextColor="#999"
                    value={currentContact.phone}
                    onChangeText={(text) => setCurrentContact((prev) => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                    editable={!isProcessing}
                  />
                </View>

                {/* Relationship Selection */}
                <View style={styles.relationshipSection}>
                  <ThemedText style={styles.relationshipSectionTitle}>Relationship</ThemedText>
                  <View style={styles.relationshipGrid}>{relationshipOptions.map(renderRelationshipOption)}</View>
                </View>

                {/* Action Buttons */}
                <View style={styles.formActionButtons}>
                  {isEditing && (
                    <Pressable style={[styles.cancelButton]} onPress={cancelEdit} disabled={isProcessing}>
                      <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                    </Pressable>
                  )}

                  <Pressable
                    style={[styles.addContactButton, (!isFormValid || isProcessing) && styles.addContactButtonDisabled]}
                    onPress={isEditing ? handleUpdateEmergencyContact : handleAddEmergencyContact}
                    disabled={!isFormValid || isProcessing}
                  >
                    <LinearGradient
                      colors={!isFormValid || isProcessing ? ["#ccc", "#ccc"] : ["#ffc30fff", "#ff8e1eff", "#8a42ffff"]}
                      style={styles.addContactButtonGradient}
                      start={[0, 0]}
                      end={[1, 0.8]}
                    >
                      <Ionicons name={isEditing ? "checkmark" : "person-add"} size={20} color="#FFFFFF" />
                      <ThemedText style={styles.addContactButtonText}>
                        {isProcessing ? "Processing..." : isEditing ? "Update Contact" : "Add Contact"}
                      </ThemedText>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Emergency Contact Display - Show when not showing the form */}
            {!showAddForm && hasEmergencyContact && existingContact && (
              <View style={styles.contactsListSection}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>Your Emergency Contact</ThemedText>
                </View>
                <View style={styles.contactsList}>{renderEmergencyContact(existingContact)}</View>
              </View>
            )}

            {displayError ? <ThemedText style={styles.errorText}>{displayError}</ThemedText> : null}
            {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

            {/* Continue Button - Only show when contact is displaying (form is hidden) */}
            {!showAddForm && hasEmergencyContact && (
              <Pressable
                style={[styles.continue_button, isProcessing && styles.continue_button_disabled]}
                onPress={handleContinue}
                disabled={isProcessing}
              >
                <LinearGradient
                  colors={isProcessing ? ["#ccc", "#ccc"] : ["#fff5aaff", "#42e895ff", "#4284ffff"]}
                  style={styles.continue_button_gradient}
                  start={[0, 0]}
                  end={[0.8, 0]}
                >
                  <ThemedText style={styles.continue_button_text}>
                    {isProcessing ? "Processing..." : "Continue"}
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            )}

            <ThemedText style={styles.skipText}>
              <ThemedText onPress={() => router.replace("/")} style={styles.skipLink}>
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

  contactFormSection: {
    width: "100%",
    marginBottom: 30
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15
  },

  sectionHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },

  addNewContactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(138, 66, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4
  },

  addNewContactText: {
    fontSize: 12,
    color: "#8a42ffff",
    fontWeight: "600"
  },

  input_container: {
    width: "100%",
    marginBottom: 15
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

  relationshipSection: {
    width: "100%",
    marginBottom: 20
  },

  relationshipSectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 10
  },

  relationshipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8
  },

  relationshipCard: {
    width: "22%",
    aspectRatio: 1.2,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    padding: 8,
    marginBottom: 8
  },

  relationshipCardSelected: {
    backgroundColor: "#E5D1FF",
    borderColor: "#8a42ffff"
  },

  relationshipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(138, 66, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  },

  relationshipIconSelected: {
    backgroundColor: "#8a42ffff"
  },

  relationshipText: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
    fontWeight: "500"
  },

  relationshipTextSelected: {
    color: "#8a42ffff",
    fontWeight: "600"
  },

  formActionButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },

  cancelButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center"
  },

  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600"
  },

  addContactButton: {
    borderRadius: 12,
    flex: 2
  },

  addContactButtonDisabled: {
    opacity: 0.6
  },

  addContactButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8
  },

  addContactButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },

  contactsListSection: {
    width: "100%",
    marginBottom: 20
  },

  contactsList: {
    width: "100%",
    gap: 10
  },

  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e9ecef"
  },

  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },

  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(138, 66, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },

  contactDetails: {
    flex: 1
  },

  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2
  },

  contactPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2
  },

  contactRelationship: {
    fontSize: 12,
    color: "#8a42ffff",
    fontWeight: "500"
  },

  contactActions: {
    flexDirection: "row",
    gap: 8
  },

  editContactButton: {
    padding: 8
  },

  removeContactButton: {
    padding: 8
  },

  continue_button: {
    borderRadius: 12,
    width: "100%",
    marginBottom: 15
  },

  continue_button_disabled: {
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
    marginBottom: 15,
    paddingHorizontal: 10
  },

  successText: {
    color: "#28a745",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    paddingHorizontal: 10
  }
});
