import "../styles/globals.css"; // Global styles
import GlobalProvider from "../containers/index";

export default function MyApp({ Component, pageProps }) {
  return (
    // Wrap page in global state provider
    <GlobalProvider>
      <Component {...pageProps} />;
    </GlobalProvider>
  );
}