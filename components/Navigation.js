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
    <div class="flex justify-center fixed top-0 w-full h-16 z-50 place-content-center backdrop-blur-lg border-b border-gray-800">
      <div class="w-full self-center flex flex-row justify-between content-center px-4">
        <div className="flex flex-row items-center">
          <a href="./" className="text-lg font-bold hover:text-red-600 ">
            LOOT.MERCH
          </a>
          {/* <img src="../logo.png" height="50" width="75" layout="fill"></img>
          <p className="text-xs font-light pl-2 text-gray-700">Redeemable fashion plaform</p> */}
        </div>
        <div>
          {address ? (
            // If user is authenticated
            <button className="text-sm text-gray-700 hover:text-black">
              {address.substr(0, 5) + "..." + address.slice(address.length - 5)}
            </button>
          ) : (
            <button
              class="text-sm text-green-400 hover:text-green-600"
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
