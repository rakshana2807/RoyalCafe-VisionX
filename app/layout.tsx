import type { Metadata } from "next";
import "./globals.css";
import BookingProviderWrapper from "@/components/shared/BookingProviderWrapper";

export const metadata: Metadata = {
  title: "RoyalCafe Connect | Your Perfect Coffee & Seating",
  description: "A premium cafe seating booking platform",
  keywords: ["cafe workspace", "coworking cafe", "remote work cafe", "study space", "premium coffee", "fast wifi cafe"],
  authors: [{ name: "RoyalCafe Connect" }],
  openGraph: {
    title: "RoyalCafe Connect | Your Perfect Coffee & Seating",
    description: "A premium cafe seating booking platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BookingProviderWrapper>
          {children}
        </BookingProviderWrapper>
      </body>
    </html>
  );
}

