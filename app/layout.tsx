import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "./ThemeProvider";
import LayoutProvider from "./LayoutProvider";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Treva Trends",
  description: "E-commerce website usinf Next.js and TypeScript",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link
       href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
         rel="stylesheet"
        />
      </head>
      <body>
      <StoreProvider>
        <ThemeProvider>
          <LayoutProvider>
          {children}
          </LayoutProvider>
        </ThemeProvider>
      </StoreProvider>
        </body>
    </html>
  );
}
