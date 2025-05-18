"use client";

import ThemeProvider from "@/components/theme-provider";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  timeZone: string;
  messages: any;
}

export function Providers({ children, locale, timeZone, messages }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
