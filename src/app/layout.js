import { Dancing_Script, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Happy Birthday Farwa Shakir 🎂",
  description:
    "A magical birthday celebration for the amazing Farwa Shakir on July 29th.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dancing.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
