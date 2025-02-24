import "../styles/globals.css";
import { SearchProvider } from "@/hooks/useSearch";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Navigator } from "@/components/Nav/Navigator";
import { Header } from "@/components/Header/Header";
import { NavProvider } from "@/hooks/useNavigator";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

function EcoFoodApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <NavProvider>
      <SearchProvider>
        <Head>
          <title>Eco Food App</title>
        </Head>
        <main className="bg-primarydark-600 caret-transparent cursor-default flex h-screen flex-1 flex-row overflow-y-hidden">
          <Navigator />
          <div className="flex flex-1 flex-col max-h-screen">
            <Header />
            <Component {...pageProps} />
          </div>
        </main>
        <Toaster />
      </SearchProvider>
    </NavProvider>
  );
}

export default EcoFoodApp;
