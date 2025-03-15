import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { User } from "@/types/FireBaseUser";
import Toast from "react-native-toast-message";
import CustomButton from "@/components/shared/CustomButton";

const AUTH_PERSISTANT = true;

export default function LoginScreen() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const { user } = useAuth() as { user: User };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // for logout if flag persistant is false
    if (!AUTH_PERSISTANT) {
      auth().signOut();
      setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/choosecompany");
    }
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Email et mot de passe sont requis",
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Veuillez entrer un email valide",
      });
      return;
    }

    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      router.replace("/choosecompany");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Vérifiez vos informations",
      });
    }
  };
  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21A67C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <CustomButton
        title="Se connecter"
        onPressFunction={handleLogin}
        height={60}
      />
    </View>
  );
}

// 💡 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 66,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
