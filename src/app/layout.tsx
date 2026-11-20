import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {/* Le Header global avec le méga-menu */}
        <Header />
        
        {/* Contenu de la page */}
        <div className="flex-1">
          {children}
        </div>
        
        {/* Pied de page global */}
        <Footer />
      </body>
    </html>
  );
}