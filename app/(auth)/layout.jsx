import React from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth",
  description: "Kommuniti Authentication",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
