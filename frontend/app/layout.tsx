import type { ReactNode } from "react";
import Navbar from "../components/navbar";

export const metadata = {
  title: "Decision Coach",
  description: "AI-powered decision support with outcome tracking and pattern learning.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
          background: "#f7f7f7",
        }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}