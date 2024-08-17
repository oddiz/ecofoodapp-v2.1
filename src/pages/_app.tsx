import "../styles/globals.css";
import { SearchProvider } from "@/hooks/useSearch";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Navigator } from "@/components/Nav/Navigator";
import { Header } from "@/components/Header/Header";
import { NavProvider } from "@/hooks/useNavigator";

function EcoFoodApp({
  Component,
  pageProps,
}: AppProps) {
  return (
    <NavProvider>
      <SearchProvider>
        <Head>
          <title>Eco Food App</title>
        </Head>
        <main className="bg-primary-100 dark:bg-primarydark-600 flex h-screen flex-1 flex-row overflow-y-hidden">
          <Navigator />
          <div className="flex flex-1 flex-col">
            <Header />
            <Component {...pageProps} />
          </div>
        </main>
      </SearchProvider>
    </NavProvider>
  );
}

export default EcoFoodApp;
