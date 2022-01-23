  import Web3Modal from "web3modal"; // Web3Modal
  import { providers } from "ethers"; // Ethers
  import { useState, useEffect } from "react"; // State management
  import { createContainer } from "unstated-next"; // Unstated-next containerization
  import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)
  
  // Web3Modal provider options
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Inject Infura
        infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
      },
    },
  };
  
  function useWeb3() {
    const [modal, setModal] = useState(null); // Web3Modal
    const [address, setAddress] = useState(null); // ETH address
  
    /**
     * Setup Web3Modal on page load (requires window)
     */
    const setupWeb3Modal = () => {
      // Creaste new web3Modal
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions: providerOptions,
      });
  
      // Set web3Modal
      setModal(web3Modal);
    };
  
    /**
     * Authenticate and store necessary items in global state
     */
    const authenticate = async () => {
      // Initiate web3Modal
      const web3Provider = await modal.connect();
      await web3Provider.enable();
  
      // Generate ethers provider
      const provider = new providers.Web3Provider(web3Provider);
  
      // Collect address
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
    };
  
    // On load events
    useEffect(setupWeb3Modal, []);
  
    return {
      address,
      authenticate,
    };
  }
  
  // Create unstate-next container
  const web3 = createContainer(useWeb3);
  export default web3;
  