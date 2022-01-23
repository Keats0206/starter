import Link from "next/link"; // Dynamic routing
import { useState } from "react"; // State management
import { web3 } from "../containers/index"; // Global state

// Header
export default function Header() {
  const [loading, setLoading] = useState(false); // Loading state
  const { address, authenticate } = web3.useContainer(); // Global state

  const authenticateWithLoading = async () => {
    setLoading(true); // Toggle loading
    await authenticate(); // Authenticate
    setLoading(false); // Toggle loading
  };

  return (
    <div class="flex justify-center fixed top-0 w-full h-16 z-50 place-content-center backdrop-blur-lg border-b">
      <div class="w-full self-center flex flex-row justify-between content-center w-lg max-w-screen-lg px-4">
        <div>Logo</div>
        <div>
          {address ? (
            // If user is authenticated
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
              {address.substr(0, 5) + "..." + address.slice(address.length - 5)}
            </button>
          ) : (
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              onClick={authenticateWithLoading}
              disabled={loading}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
