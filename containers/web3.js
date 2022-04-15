import Web3Modal from "web3modal"; // Web3Modal
import { providers, ethers } from "ethers"; // Ethers
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
  const [provider, setProvider] = useState(null); // ETH address
  const [signer, setSigner] = useState(null); // ETH address

  const contractAddress = "0x07d6465ea570f267a8653c3ca4d9a867fdfa46a3";
  const minterABI = require("../contracts/abi/minter.json");

  // Creating infura provider for dApp connection
  let infura = new ethers.providers.InfuraProvider("rinkeby");

  /**
   * Setup Web3Modal on page load (requires window)
   */
  const setupWeb3Modal = () => {
    // Creaste new web3Modal
    const web3Modal = new Web3Modal({
      network: "rinkeby",
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
    setProvider(provider);

    // Collect address
    const signer = provider.getSigner();
    setSigner(signer);
    const address = await signer.getAddress();
    setAddress(address);
  };

  const fetchEdition = async () => {
    var editionContract = new ethers.Contract(
      contractAddress,
      minterABI,
      infura
    );

    try {
      const name = await editionContract.name();
      const symbol = await editionContract.symbol();
      // const description = await editionContract.description();
      const owner = await editionContract.owner();
      const salePrice = await editionContract.salePrice();
      const editionSize = await editionContract.editionSize();
      const uris = await editionContract.getURIs(); // array of content URIs
      const totalSupply = await editionContract.totalSupply();

      let nftEdition = {
        contractAddress: contractAddress,
        name: name,
        symbol: symbol,
        // description: description,
        owner: owner,
        salePrice: ethers.utils.formatEther(salePrice),
        editionSize: editionSize.toString(),
        uris: uris, // array of content URIs
        totalSupply: totalSupply.toString(),
      };
      return {
        data: nftEdition,
        result: true,
        message: "Succesful fetch",
      };
    } catch (error) {
      return {
        data: error,
        result: false,
        message: error,
      };
    }
  };

  const purchaseEdition = async (salePrice) => {
    var editionContract = new ethers.Contract(
      contractAddress,
      minterABI,
      signer
    );

    const price = ethers.utils.parseEther(salePrice);

    try {
      const tx = await editionContract.purchase({
        value: price,
      });
      return {
        data: tx,
        result: true,
        message: "NFT Purchased",
      };
    } catch (error) {
      if (error.code == "INSUFFICIENT_FUNDS") {
        return {
          data: error,
          result: false,
          message:
            "Insufficient funds in your wallet! Add more eth to buy an NFT",
        };
      } else {
        return {
          data: error,
          result: false,
          message:
            "Oops, something went wrong with the transaction. Try again!",
        };
      }
    }
  };

  const getClaimedNFTs = async () => {
    // get total count
    var editionContract = new ethers.Contract(
      contractAddress,
      minterABI,
      infura
    );

    const totalSupply = await editionContract.totalSupply();

    const claims = [];

    for (let i = 1; i <= totalSupply.toNumber(); i++) {
      try {
        const owner = await editionContract.ownerOf(i);
        const nft = await createNFT(i, owner);
        claims.push(nft);
      } catch (error) {
        const nft = await createNFT(i, "Burned");
        claims.push(nft);
      }
    }
    return claims;
  };

  const createNFT = async (id, owner) => {
    const nft = {
      tokenID: id,
      owner: owner,
    };
    return nft;
  };

  const redeemEdition = async (tokenID) => {
    var mintingContract = new ethers.Contract(
      contractAddress,
      minterABI,
      signer
    );

    try {
      const tx = await mintingContract.burn(tokenID);
      return {
        data: tx,
        result: true,
        message: "NFT Redeemed and burned ",
      };
    } catch (error) {
      return {
        data: error,
        result: false,
        message: "Oops, something went wrong with the transaction. Try again!",
      };
    }
  };
  // On load events
  useEffect(setupWeb3Modal, []);

  return {
    address,
    authenticate,
    fetchEdition,
    purchaseEdition,
    redeemEdition,
    getClaimedNFTs,
  };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
