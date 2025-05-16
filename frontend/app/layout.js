import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import { LanguageProvider } from "./_context/LanguageContext";
import Header from "./_components/Header";

export const metadata = { title: "EventBookingSystem" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
