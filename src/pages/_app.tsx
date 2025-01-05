import "../app/globals.css"; 
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="antialiased">
      {/* Add your Geist font or other layout structure here */}
      <Component {...pageProps} />
    </div>
  );
}
