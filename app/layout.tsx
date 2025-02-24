"use client";
import "./globals.css";
import { AuthenticationBoundary } from "../core/AuthenticationBoundary";
import { firebaseAuth } from "@/lib/firebase/firebaseConfig";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authedUser = firebaseAuth.currentUser;
  // const [userName, setUserName] = useState(authedUser?.email);

  // useEffect(() => {
  //   setUserName(authedUser?.email);
  // }, [authedUser]);

  return (
    <html lang="en">
      <body>
        <div className="header-container">
          <span className="logo">SERBA.RO</span>
          {/* <span className="authed-user">{userName}</span> */}
        </div>
        {/* <AuthenticationBoundary> */}
        {children}
        {/* </AuthenticationBoundary> */}
      </body>
    </html>
  );
}
