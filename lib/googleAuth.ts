// // lib/googleAuth.ts
// import * as AuthSession from "expo-auth-session";
// import * as SecureStore from "expo-secure-store";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { auth } from "./firebase";

// // Remplace par ton client ID Web (Google Cloud Console)
// const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// const useProxy = AuthSession.makeRedirectUri({ useProxy: true }).includes(
//   "expo-auth-session"
// );

// export async function signInWithGoogleAsync() {
//   try {
//     // construire l'url d'auth Google (scope basique)
//     const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
//     const authUrl =
//       `https://accounts.google.com/o/oauth2/v2/auth` +
//       `?client_id=${CLIENT_ID}` +
//       `&response_type=id_token%20token` +
//       `&scope=openid%20profile%20email` +
//       `&redirect_uri=${encodeURIComponent(redirectUri)}` +
//       `&nonce=${Math.random().toString(36).substring(2)}`;

//     const result = await AuthSession.startAsync({
//       authUrl,
//       returnUrl: redirectUri,
//     });

//     if (result.type === "success" && "params" in result) {
//       const { id_token, access_token } = (result as any).params;

//       // créer credential firebase
//       const credential = GoogleAuthProvider.credential(id_token, access_token);
//       const userCred = await signInWithCredential(auth, credential);

//       // stocker UID/local token si souhaité
//       await SecureStore.setItemAsync("user_uid", userCred.user.uid);

//       return { success: true, user: userCred.user };
//     } else {
//       return { success: false, canceled: true };
//     }
//   } catch (err) {
//     console.error("Google sign-in error", err);
//     return { success: false, error: err };
//   }
// }

// export async function signOutFirebase() {
//   try {
//     await auth.signOut();
//     await SecureStore.deleteItemAsync("user_uid");
//     return true;
//   } catch (e) {
//     console.error("signOut error", e);
//     return false;
//   }
// }

// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { useEffect } from "react";
// import { auth } from "./firebase";

// export function useGoogleAuth() {
//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId:
//       "835882233218-4bka1rt2d52ie6795em39lvujmhdchrv.apps.googleusercontent.com",
//   });

//   useEffect(() => {
//     if (response?.type === "success") {
//       const { id_token } = response.params;
//       const credential = GoogleAuthProvider.credential(id_token);
//       signInWithCredential(auth, credential);
//     }
//   }, [response]);

//   return {
//     signIn: () => promptAsync(),
//   };
// }
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: "TON_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId:
      "835882233218-rg09gkr3btr2n70nmjle118o221hnfej.apps.googleusercontent.com",
    webClientId:
      "835882233218-4bka1rt2d52ie6795em39lvujmhdchrv.apps.googleusercontent.com",
  });

  // écoute l'état Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  // quand Google renvoie un token
  useEffect(() => {
    async function login() {
      if (response?.type === "success") {
        const { id_token } = response.params;

        const credential = GoogleAuthProvider.credential(id_token);

        try {
          await signInWithCredential(auth, credential);
        } catch (err) {
          console.log("🔥 Firebase login error :", err);
        }
      }
    }

    login();
  }, [response]);

  return {
    user,
    signIn: () => promptAsync(),
  };
}
