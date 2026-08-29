import "./globals.css";
import { AppStateProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "NextHire.ai — AI Interview Training & CV Preparation",
  description:
    "AI mock interview training and ATS-ready CV preparation in 28 languages. No sign-up required.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper font-body text-ink antialiased">
        <AppStateProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppStateProvider>
      </body>
    </html>
  );
}
