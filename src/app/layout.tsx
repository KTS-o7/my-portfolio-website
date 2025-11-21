import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "KTS - Portfolio",
    description: "Portfolio of Krishna Tejaswi S, a Full Stack Developer.",
    openGraph: {
        title: "KTS - Portfolio",
        description: "Portfolio of Krishna Tejaswi S, a Full Stack Developer.",
        type: "website",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
