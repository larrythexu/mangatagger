"use client"

import Image from "next/image";
import { getDailyManga } from "@/lib/mangaService";
import { initGame, submitAnswer } from "@/lib/gameService";
import { useState } from "react";
import { type GameState } from "@/types";

export default function Home() {

  const [gameState, setGameState] = useState<GameState | null>(null);

  const dailyManga = getDailyManga();
  console.log(dailyManga);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {dailyManga.node.title}
      <Image src={dailyManga.node.main_picture.medium} alt={dailyManga.node.title} width={500} height={500} />

      <button onClick={() => { setGameState(initGame()) }}>Play</button>

    </div>
  );
}
