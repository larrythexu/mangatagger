import GameMenu from "@/components/GameMenu";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center mt-10 bg-zinc-50 font-sans dark:bg-black">
      <div className="text-5xl font-bold text-center mb-2">MangaTagger</div>
      <div className="text-md text-center text-gray-500 mb-5">Guess the genres from the manga cover!</div>
      <GameMenu />
      <Footer />
    </div>
  );
}
