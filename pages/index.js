import Layout from "../components/Layout";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { web3 } from "../containers/index"; // Web3 container
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(null);
  const [claimedNFTs, setClaimedNFTs] = useState(null);
  const [burnCount, setBurnCount] = useState(null);
  const [showModal, setShowmodal] = useState();
  const [minting, setMinting] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemID, setRedeemID] = useState(false); // TokenID that is being claimed

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [addy1, setAddy1] = useState("");
  const [addy2, setAddy2] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [modalStatus, setModalStatus] = useState("CHECKING");

  const {
    address,
    fetchEdition,
    purchaseEdition,
    redeemEdition,
    getClaimedNFTs,
  } = web3.useContainer(); // Use NFTs from global state

  async function createOrder() {
    try {
      setLoading(true);

      const item = {
        first: firstName,
        last: lastName,
        email: email,
        addy1: addy1,
        addy2: addy2,
        state: state,
        city: city,
        zip: zip,
        address: address, // ETH Aaddress
      };

      let { error } = await supabase.from("Orders").insert(item);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log("error");
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getEditions = async () => {
    const res = await fetchEdition();
    setEdition(res.data);
    const claim = await getClaimedNFTs();
    setClaimedNFTs(claim);
    getBurnedCount(claim);
  };

  const getBurnedCount = async (claim) => {
    const count = claim.filter((nft) => nft.owner === "Burned").length; // -> 3
    setBurnCount(count);
  };

  const mintWithLoading = async () => {
    setMinting(true);
    const result = await purchaseEdition(edition.salePrice);
    setMinting(false);
  };

  const redeemWithLoading = async () => {
    setRedeeming(true);
    console.log("Redeeming Token:");
    console.log(redeemID);
    const { data, result, message } = await redeemEdition(redeemID);
    if (result) {
      // Result = true what do we do
      try {
        createOrder();
        setModalStatus("SUCCESS");
        clearForm();
        // Do something with TX and etherscan link
        console.log(data);
        console.log(message);
        // Wipe form data
      } catch (error) {
        ("Api push failed");
      }
    } else {
      // Result = false what do we do
      setModalStatus("ERROR");
    }
    setRedeeming(false);
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setZip("");
    setCity("");
    setState("");
    setAddy1("");
    setAddy2("");
  };

  const redeemButtonHandler = () => {
    // Set state to Checking
    setModalStatus("CHECKING");
    // Open modal
    setShowmodal(true);
    // Check if owns and NFT
    const filteredArray = claimedNFTs.find((nft) => nft.owner == address);

    if (filteredArray) {
      setRedeemID(filteredArray.tokenID);
      setModalStatus("CONFIRMED");
    } else {
      setModalStatus("NONFT");
    }
  };

  const renderModal = useCallback(() => {
    switch (modalStatus) {
      case "CHECKING":
        return Checking();
      case "CONFIRMED":
        return Confirmed();
      case "NONFT":
        return Rejected();
      case "SUCCESS":
        return Success();
      case "ERROR":
        return Error();
      case "OWNERS":
        return Owners();
      default:
        return null;
    }
  }, [
    modalStatus,
    firstName,
    lastName,
    email,
    addy1,
    addy2,
    state,
    city,
    zip,
    redeeming,
  ]);

  const Checking = () => {
    return (
      <div>
        <a
          className="hover:opacity-50"
          onClick={() => setModalStatus("CONFIRMED")}
        >
          Checking ownership...
        </a>
      </div>
    );
  };

  const Success = () => {
    return (
      <div className="p-6">
        <p>
          SUCCESS! View your transcation on etherscan & check your email for
          confirmation
        </p>
      </div>
    );
  };

  const Error = () => {
    return (
      <div>
        <p>Oops something went wrong!</p>
      </div>
    );
  };

  const Rejected = () => {
    return (
      <div>
        <p>
          Sorry, looks like you don't own a loot merch NFT to redeem. Go mint
          one or buy one on OpenSea
        </p>
        <a
          className="w-full hover:opacity-50"
          onClick={() => setShowmodal(false)}
        >
          Close
        </a>
      </div>
    );
  };

  const Confirmed = useCallback(() => {
    return (
      <div>
        <div className="w-full flex flex-row justify-center items-center pt-6">
          <div className="pr-6">
            <Image src="/hatSM.png" layout="fixed" width="100" height="100" />
          </div>
          <div className="flex flex-col">
            <p className="pb-2">
              Congrats, looks like you own a redeemable lootmerch token.
              Complete the checkout form to burn your token, and place your
              order
            </p>
            <p className="pb-6 italic">Redeeming TokenID: {redeemID}</p>
          </div>
        </div>
        {/* Form Input */}
        <form class="bg-white">
          <div class="flex flex-wrap -mx-3 mb-4">
            {/* First name */}
            <div class="w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-blacks text-xs mb-2"
                for="grid-first-name"
              >
                First Name
              </label>
              <input
                className="appearance-none block w-full text-black border py-3 px-4 focus:outline-none focus:border-gray-500"
                id="firstName"
                type="text"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last name */}
            <div class="w-1/2 px-3">
              <label className="block uppercase tracking-wide text-blacks text-xs mb-2">
                Last Name
              </label>
              <input
                className="appearance-none block w-full text-black border py-3 px-4 focus:outline-none focus:border-gray-500"
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Field */}

          <div class="mb-4">
            <label className="block uppercase tracking-wide text-blacks text-xs mb-2">
              Email
            </label>
            <input
              class="appearance-none border w-full py-3 px-4 text-black leading-tight focus:outline-none focus:border-gray-500"
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div class="mb-4">
            <label
              className="block uppercase tracking-wide text-blacks text-xs mb-2"
              for="username"
            >
              Address Line 1
            </label>
            <input
              class="appearance-none border w-full py-3 px-4 text-black leading-tight focus:outline-none focus:border-gray-500"
              id="address1"
              type="text"
              placeholder="Address Line 1"
              value={addy1}
              onChange={(e) => setAddy1(e.target.value)}
            />
          </div>

          <div class="mb-4">
            <label
              className="block uppercase tracking-wide text-blacks text-xs mb-2"
              for="username"
            >
              Address Line 2
            </label>
            <input
              class="appearance-none border w-full py-3 px-4 text-black leading-tight focus:outline-none focus:border-gray-500"
              id="address2"
              type="text"
              placeholder="Address Line 2"
              value={addy2}
              onChange={(e) => setAddy2(e.target.value)}
            />
          </div>

          {/* States */}

          <div class="flex flex-wrap -mx-3 mb-2">
            {/* City Field */}

            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-blacks text-xs mb-2">
                City
              </label>
              <input
                className="appearance-none block w-full text-black border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="city"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* State Field */}
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-blacks text-xs mb-2">
                State
              </label>
              <input
                className="appearance-none block w-full text-black border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="state"
                type="text"
                placeholder="NY"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            {/* <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-blacks text-xs mb-2"
              for="grid-state"
            >
              State
            </label>
            <div class="relative">
              <select
                class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div> */}

            {/* Zip Field */}

            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-blacks text-xs mb-2"
                for="grid-zip"
              >
                Zip
              </label>
              <input
                class="appearance-none block w-full text-black border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                id="zip"
                type="text"
                placeholder="90210"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>

          <p className="text-xs text-red-500 mb-2">
            By redeeming this hat you will be burning your LootMerch NFT
            edition. We are working on a retroactive token airdrop for those who
            claim their hats.
          </p>
        </form>
        <button
          className="transition-all	duration-300 ease-in-out bg-black hover:bg-white hover:text-black border-black border text-white text-xs py-4 px-8 w-full hover:border-black active:border-gray-600"
          onClick={() => redeemWithLoading()}
        >
          {redeeming ? "Redeeming..." : "Redeem & Burn"}
        </button>
      </div>
    );
  });

  useEffect(() => {
    getEditions();
  }, []);

  return (
    <Layout>
      {/* Checkout Modal */}
      {showModal ? (
        <div className="bg-white/70 backdrop-blur-sm w-screen z-10 h-screen flex absolute top-0 left-0 justify-center items-center">
          <div
            onClick={() => setShowmodal(false)}
            className="z-10 absolute w-screen h-screen"
          ></div>
          <div className="lg:h-auto h-screen overflow-auto lg:pt-0 pt-20 overflow-auto flex flex-col z-50 bg-white w-screen lg:w-5/12 border border-black p-4 text-xs space-y-4 items-center justify-center">
            {renderModal()}
            <div className="flex flex-row justify-center">
              <p
                onClick={() => setShowmodal(false)}
                className="hover:opacity-50"
              >
                Close
              </p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Product Experience */}

      {!edition ? (
        <div className="flex w-11/12 h-screen text-xs items-center justify-center space-x-12">
          Loading...
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-11/12 h-screen text-xs items-center justify-items-center space-x-0 lg:space-x-12">
          {/* Replace with description on better smart contract */}
          <div className="w-full lg:w-1/2 justify-center items-center w-8/12 lg:pt-0 pt-24">
            <Image
              src="/hatLG.png"
              layout="responsive"
              width="500"
              height="500"
              blurDataURL="/hatLG.png"
              placeholder="blur" // Optional blur-up while loading
              priority
            ></Image>
          </div>

          <div className="w-full lg:w-3/12 lg:pt-0 pt-12 lg:order-first lg:pb-0 pb-4">
            Loot Merch Unofficial Dad Hat. Buy the NFT. Trade it on the open
            market. Redeem it to claim your hat.
          </div>
          {/* Replace with description on better smart contract */}
          <div className="flex flex-col space-y-2 pb-6">
            <div className="w-full flex-col flex justify-center items-center">
              <Image
                src="/lootNft.png"
                layout="fixed"
                width="200"
                height="200"
                blurDataURL="/lootNft.png"
                placeholder="blur" // Optional blur-up while loading
                priority
              ></Image>
              <p className="w-full text-center text-xs text-gray-400">
                LootMerch NFT
              </p>
            </div>
            <p>Price: {edition.salePrice} ETH</p>
            <p>Max Supply: {edition.editionSize}</p>
            <p>Minted: {edition.totalSupply}</p>
            <p>Claimed Hats (Burned): {burnCount}</p>

            {address ? (
              <div>
                {/* Action Button */}
                <div className="flex flex-col space-y-2">
                  <button
                    className="border bg-black text-white hover:text-black hover:bg-white border-gray-600 py-2 px-6 hover:border-black active:border-gray-600 transition-all	duration-300 ease-in-out"
                    onClick={mintWithLoading}
                  >
                    {minting ? "Minting" : "Mint"}
                  </button>
                  <button
                    className="border hover:border-black border-gray-300 py-2 px-6 hover:border-black active:border-gray-600 transition-all	duration-300 ease-in-out"
                    onClick={() => redeemButtonHandler()}
                  >
                    {redeeming ? "Redeeming" : "Redeem"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  disabled
                  className="border border-red-300 w-full py-2 px-6 transition-all	duration-300 ease-in-out"
                >
                  Connect To Mint
                </button>
              </div>
            )}
            <div>
              <table className="table-auto text-left">
                <thead>
                  <tr>
                    <th>TokenID</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                {claimedNFTs ? (
                  <tbody>
                    {claimedNFTs.map((nft, i) => {
                      // For each Zora post
                      return (
                        // Return Post component
                        <tr>
                          <td>
                            <a>{nft.tokenID}</a>
                          </td>
                          <td>
                            {nft.owner == "Burned" ? (
                              <div>Burned</div>
                            ) : (
                              <a
                                className="hover:underline"
                                href={
                                  "https://testnets.opensea.io/" + nft.owner
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {nft.owner == "Burned"
                                  ? "Burned"
                                  : nft.owner.substr(0, 5) +
                                    "..." +
                                    nft.owner.slice(nft.owner.length - 5)}
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody></tbody>
                )}
              </table>
            </div>
            <p className="italic text-gray-400">
              Marketplace coming soon, for now, you can trade tokens on Zora,
              OpenSea & Looksrare.
            </p>
            <a href="./about" className="text-xs hover:italic">
              About
            </a>
            <a className="text-xs hover:italic">Opensea</a>
            <a className="text-xs hover:italic">Etherscan</a>
            <a className="text-xs hover:italic">Powered by Zora Editions</a>
          </div>
        </div>
      )}
    </Layout>
  );
}
