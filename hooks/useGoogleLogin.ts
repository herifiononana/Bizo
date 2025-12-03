import { auth } from "@/lib/firebase";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";

export const useGoogleLogin = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "835882233218-4bka1rt2d52ie6795em39lvujmhdchrv.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return {
    login: () => promptAsync(),
  };
};
