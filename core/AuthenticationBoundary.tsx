"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/firebaseConfig";
import LoginForm from "@/components/LoginForm";

/**
 * Contains constants which describe the authentication state of the current session.
 */
enum AuthenticationState {
  /**
   * Indicates that the authentication state has not been determined yet.
   */
  Unknown,

  /**
   * Indicates that the current session is not authenticated.
   */
  Unauthenticated,

  /**
   * Indicates that the current session is authenticated.
   */
  Authenticated,
}

/**
 * A context that contains information about the currently authenticated user.
 */
export const AuthenticationContext = React.createContext({
  authenticationState: AuthenticationState.Unknown,
  userDetails: {} as TokenValues,
});

/**
 * The local storage key under which the authentication token is stored.
 */
const AuthenticationTokenKey = "auth_token";

/**
 * Describes the values of the decoded IQNECT token. Used for validating whether
 * a token is still valid before performing a request.
 */
interface TokenValues {
  /**
   * The timestamp when this token will expire, in seconds.
   */
  exp: number;

  /**
   * The timestamp when this token was issued, in seconds.
   */
  iat: number;

  /**
   * The email address of the user for which the token was issued.
   */
  email: string;

  /**
   * The ID of the system for which the token was issued.
   */
  client_id: string;

  /**
   * The ID of the tenant to which the user belongs.
   */
  tenant_id: string;

  // TODO: To be completed after decoding a token
}

/**
 * Decodes the specified JWT token into a JSON object.
 * @param token         The token to decode.
 * @returns             An object containing the token's properties and values, if it could
 *                      be decoded, `undefined` otherwise.
 */
function DecodeJWT(token: string): TokenValues | undefined {
  // NOTE: Code from https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  try {
    const base64URL = token.split(".")[1];
    const base64Content = base64URL.replace(/-/g, "+").replace(/_/g, "/");
    const JSONPayload = decodeURIComponent(
      window
        .atob(base64Content)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(JSONPayload) as TokenValues;
  } catch (e) {
    console.error(`Could not decode token.`, e);
  }
}

/**
 * A component that validates that there is an active session before rendering
 * its child elements.
 * If an active session exists, the child elements are rendered. Otherwise a login
 * screen is rendered instead.
 * @param props         The component properties.
 * @returns             A react element.
 */
export function AuthenticationBoundary(props: { children?: ReactNode }) {
  const [authenticationState, setAuthenticationState] = useState(
    AuthenticationState.Unknown
  );
  const [token, setToken] = useState<string>();
  const [tokenValues, setTokenValues] = useState<TokenValues>();

  // Displays a loading indicator while a login request is in progress
  const [isLoggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    try {
      const tkn = localStorage.getItem(AuthenticationTokenKey);
      if (tkn) {
        // If the token is set, set it, which triggers an effect that verifies it
        setToken(tkn);
      } else {
        // Otherwise assume not authenticated
        setAuthenticationState(AuthenticationState.Unauthenticated);
      }
    } catch (e) {
      // Assume the token is not set if an error occurs while reading
      // the local storage (e.g. safari private mode)
      console.error(`Could not read the token from local storage. `, e);
    }
  }, []);

  useEffect(() => {
    // When the token changes, parse it and verify its validity
    if (token) {
      const tokenValues = DecodeJWT(token);
      if (tokenValues) {
        setTokenValues(tokenValues);
        if (tokenValues.exp * 1000 > Date.now()) {
          // If the token is valid, set the authentication state as authenticated
          setAuthenticationState(AuthenticationState.Authenticated);

          try {
            localStorage.setItem("auth_token", token);
          } catch (e) {
            console.error("Could not persist authorization token.", e);
            // If the token can't be stored, just log an error; the current session
            // will work, but the user will be asked to reauthenticate when reloading
          }
        } else {
          // Otherwise require users to log in again
          setAuthenticationState(AuthenticationState.Unauthenticated);
        }
      }
    }
  }, [token]);

  /**
   * Redirects to the SSO login page to obtain the authorization token.
   */
  async function login(email: string, password: string) {
    setLoggingIn(true);
    // Obtain the URL to the SSO authentication page and redirect to it
    try {
      const auth = firebaseAuth;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          user.getIdToken().then((r) => {
            setToken(r);
            setLoggingIn(false);
          });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoggingIn(false);
        });
    } catch (e) {
      setLoggingIn(false);
    }
  }

  switch (authenticationState) {
    case AuthenticationState.Unknown:
    default:
      return "loading";
    case AuthenticationState.Unauthenticated:
      return <LoginForm onLogin={login} loggingIn={isLoggingIn} />;
    case AuthenticationState.Authenticated:
      // For authenticated contexts, just render the children normally
      return (
        <AuthenticationContext.Provider
          value={{
            authenticationState,
            // NOTE: When state is authenticated, tokenValues is non-null
            userDetails: tokenValues!,
          }}
        >
          {props.children ?? null}
        </AuthenticationContext.Provider>
      );
  }
}

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
