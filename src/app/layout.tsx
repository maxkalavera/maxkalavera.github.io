import type { Metadata } from "next";
import { Provider } from 'jotai'
import { 
  Archivo_Black as FontSans,
  Fira_Sans as FontSerif,
  Fira_Mono as FontMono,
} from 'next/font/google';
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import "@/assets/globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

/*
  fonts classification:
    - display
    - body
    - cta (call to action)
    - code (To show programming language code)
    - navigation
    - captions    
*/

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
  display: 'swap',
});

const fontSerif= FontSerif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: 'swap',
});

const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Max Hernandez",
  description: "Max Hernandez's website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      suppressHydrationWarning={true}
    >
      <head>
      </head>
      <body
        className={cn(
          //'dark',
          'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-stone-950 dark:bg-background',
          'max-w-[100dvw] min-h-[100dvh]',
          'font-sans antialiased',
          'flex flex-col justify-start items-center gap-0',
          'overflow-x-hidden',
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable,
          'font-serif',
        )}
      >
        <Provider>
          <ThemeProvider attribute="class">
            <Header 
              className="w-full h-header print:hidden z-10"
            />
            <main
              className={cn(
                "w-full min-h-content h-fit",
                "flex flex-col justify-stretch items-center",
              )}
            >
              {children}
            </main>

            <Footer 
              className="w-full h-footer print:hidden z-10"
            />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
