import GameMenu from "@/components/GameMenu";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center mt-10 bg-zinc-50 font-sans dark:bg-black">
      <div className="text-5xl font-bold text-center mb-2">MangaTagger</div>
      <GameMenu />
    </div>
  );
}
