import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import "./reset.css";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alyssa Melendez",
  description:
    "A personal portfolio website for Alyssa Melendez, a software engineer.",
  icons: {
    icon: "/alyssaSquare.jpg",
    shortcut: "/alyssaSquare.jpg",
    apple: "/alyssaSquare.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={crimsonText.className}>
        {/* <header>
          <h1>Alyssa Melendez</h1>
        </header> */}
        <main>{children}</main>
        <footer style={{ textAlign: "center", padding: "1rem" }}>
          <p>&copy; {new Date().getFullYear()} alyssa melendez</p>
          <p>
            <a
              href="https://www.linkedin.com/in/alyssakirstine"
              target="_blank"
            >
              linkedin
            </a>{" "}
            |{" "}
            <a href="https://github.com/alyssakirstine" target="_blank">
              github
            </a>{" "}
            |{" "}
            <a href="mailto:alyssakirstine@gmail.com" target="_blank">
              email
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
