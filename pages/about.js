import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import Image from "next/image";
import { web3 } from "../containers/index"; // Web3 container

export default function Home() {
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(null);
  const [claimedNFTs, setClaimedNFTs] = useState(null);
  const [burnCount, setBurnCount] = useState(null);
  const [showModal, setShowmodal] = useState();
  const [minting, setMinting] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  return (
    <Layout>
      <div className="w-screen h-screen flex justify-center items-center w-96 flex flex-col">
        <p className="text-black font-xl font-bold mb-6">About:</p>
        <ul className="list-disc space-y-4">
          <li>
            Hack project by 0xPkeating, proceeds from the sale will be used to
            cover manufacturing cost and fund more experimentation around crypto
            commerce
          </li>
          <li>
            Currently sourcing manufacturers - the quality goal is something
            inline with streetwear brands like MadHappy, Kith, Aime Leon Dore,
            etc.
          </li>
          <li>
            Manufacturing is currently in process, and should be complete in 4
            weeks. Redeemed hats will be shipped from NYC as early as May.
          </li>
          <li>5 loot caps have been reserved for the team</li>
          <li>1 loot cap has been reserved for dom</li>
        </ul>
        <div className="mt-6">Built with love, Pete ❤️‍🔥</div>
      </div>
    </Layout>
  );
}
