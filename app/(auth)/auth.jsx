import { Image, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ui/ThemedText";
import Burger from "@/assets/burger.png";
import Waves from "@/assets/waves_bg.svg";

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.title_container}>
        <ThemedText style={styles.title}>Allertify</ThemedText>
        <ThemedText style={styles.subtitle}>Know what you're biting into.</ThemedText>
      </View>

      <Waves style={styles.waves} width="100%" height={300} preserveAspectRatio="none" />

      <Image source={Burger} style={styles.burger} />

      <View style={styles.buttons_area}>
        <Pressable
          style={styles.signup_button}
          onPress={() => {
            router.push("/signup");
          }}
        >
          <ThemedText style={styles.signup_button_text}>Sign Up</ThemedText>
        </Pressable>

        <View style={styles.or_container}>
          <View style={styles.line} />
          <ThemedText style={styles.or_text}>or</ThemedText>
          <View style={styles.line} />
        </View>

        <Pressable
          style={styles.login_button}
          onPress={() => {
            router.push("/login");
          }}
        >
          <ThemedText style={styles.login_button_text}>Login</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: "#F7ECFF",
    paddingTop: 50,
    paddingBottom: 50
  },

  title: {
    fontSize: 40,
    color: "#6327B7",
    textAlign: "center",
    marginBottom: 0
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#AB6FFE"
  },

  burger: {
    position: "absolute",
    top: 160,
    alignSelf: "center",
    width: 350,
    height: 350,
    zIndex: 2
  },

  waves: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },

  buttons_area: {
    zIndex: 2,
    display: "flex",
    gap: 10
  },

  signup_button: {
    alignSelf: "center",
    backgroundColor: "#ffff",
    padding: 8,
    paddingRight: 70,
    paddingLeft: 70,
    borderRadius: 20,
    elevation: 3
  },

  signup_button_text: {
    color: "#4040B6",
    fontSize: 17,
    fontWeight: "bold"
  },

  login_button: {
    alignSelf: "center",
    borderColor: "#5810C8",
    borderWidth: 2,
    padding: 8,
    paddingRight: 70,
    paddingLeft: 70,
    borderRadius: 20
  },

  login_button_text: {
    color: "#ffff",
    fontSize: 17,
    fontWeight: "bold"
  },

  or_container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10
  },

  line: {
    width: 60,
    height: 1,
    backgroundColor: "#ffffffff"
  },

  or_text: {
    alignSelf: "center",
    fontSize: 17,
    color: "#F7ECFF"
  }
});
