import NFT from "../components/NFT";

export default function NFTGrid({ children }, isProfile) {
  return (
    <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8  max-w-screen-lg">
      {[1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10].map((row, index) => (
        <NFT />
      ))}
    </div>
  );
}
