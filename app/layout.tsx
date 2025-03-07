"use client";
import "./globals.css";
import { AuthenticationBoundary } from "../core/AuthenticationBoundary";
import { firebaseAuth } from "@/lib/firebase/firebaseConfig";
import { useEffect, useState, createContext } from "react";
import queryUserService from "@/service/queryUserService";
import { DocumentData } from "@firebase/firestore";

export const UserContext = createContext({ vendorId: "" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authedUser = firebaseAuth.currentUser;
  const [userName, setUserName] = useState(authedUser?.email);
  const [vendorId, setVendorId] = useState("");

  const getVendorId = async (id: string) => {
    const dbUser = (await queryUserService(id)) as DocumentData;
    setVendorId(dbUser.vendorId);
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        setUserName(user?.email);
        getVendorId(user?.uid);
      } else {
        // No user is signed in.
        // This always redirects back to the login screen.
      }
    });
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="header-container">
          <span className="logo">SebaA.ro</span>
          <span className="authed-user">{userName}</span>
        </div>
        <AuthenticationBoundary>
          <UserContext.Provider value={{ vendorId: vendorId }}>
            {children}
          </UserContext.Provider>
        </AuthenticationBoundary>
      </body>
    </html>
  );
}
