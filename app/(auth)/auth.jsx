import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import Waves from "../../assets/waves_bg.svg";
import Burger from "../../assets/burger.png";

export default function AuthScreen() {
  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.title_container}>
        <Text style={styles.title}>Allertify</Text>
        <Text style={styles.subtitle}>Know what you're biting into.</Text>
      </View>

      <Waves style={styles.waves} width="100%" height={280} preserveAspectRatio="none" />

      <Image source={Burger} style={styles.burger} />

      <View style={styles.buttons_area}>
        <Pressable style={styles.signup_button} onPress={() => {}}>
          <Text style={styles.signup_button_text}>Sign Up</Text>
        </Pressable>
        <View style={styles.or_container}>
          <View style={styles.line} />
          <Text style={styles.or_text}>or</Text>
          <View style={styles.line} />
        </View>
        <Pressable style={styles.login_button} onPress={() => {}}>
          <Text style={styles.login_button_text}>Login</Text>
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
    marginBottom: 0,
    fontWeight: "bold"
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#AB6FFE"
  },

  burger: {
    position: "absolute",
    top: 170,
    alignSelf: "center",
    width: 330,
    height: 300,
    zIndex: 2,
    backgroundColor: "transparent"
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
    fontWeight: "bold",
    color: "#F7ECFF"
  }
});
