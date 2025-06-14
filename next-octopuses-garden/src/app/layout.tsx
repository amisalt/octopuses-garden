import type { Metadata } from "next";
import { Jersey_25, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto_mono = Roboto_Mono({
  variable:"--font-roboto-mono",
  subsets:["cyrillic","cyrillic-ext","greek","vietnamese"]
})

const roboto = Roboto({
  variable:"--font-roboto",
  subsets:["math","symbols","greek-ext"]
})

const jersey = Jersey_25({
  weight:'400',
  variable:"--font-jersey",
  subsets:["latin","latin-ext"],
  fallback:["var(--font-roboto-mono)", "var(--font-roboto)"]
})

export const metadata: Metadata = {
  title: "Octopuses Garden",
  description: "Super duper game by me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jersey.variable} ${roboto_mono.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
