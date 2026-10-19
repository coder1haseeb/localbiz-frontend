import { Roboto } from "next/font/google";
import "./globals.css";
import BackButton from "../components/BackButton";
import SessionGate from "../components/SessionGate";
import BusinessRegistrationProvider from "../components/BusinessRegistrationProvider";

const bodyFont = Roboto({
  variable: "--font-body-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "LocalBiz | Shop local",
  description: "Discover local stores and shop from nearby businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-bright text-on-surface">
        <BusinessRegistrationProvider><SessionGate>{children}</SessionGate></BusinessRegistrationProvider>
        <BackButton />
      </body>
    </html>
  );
}
