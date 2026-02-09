"use client"

import { GameState } from "@/types"
import { getNumGuesses } from "@/lib/gameService"
import Image from "next/image"
import heartSolid from "@/public/heart-solid-full.svg"
import heartRegular from "@/public/heart-regular-full.svg"

export default function StatusDisplay({ gameState }: { gameState: GameState }) {
    return (
        <div className="mt-4 text-center">
            <div className="flex items-center gap-1">
                Remaining Lives:
                {Array.from({ length: getNumGuesses() - gameState.numLives }).map((_, i) => (
                    <Image key={`regular-${i}`} src={heartRegular} width={20} height={20} alt="lost life" />
                ))}
                {Array.from({ length: gameState.numLives }).map((_, i) => (
                    <Image key={`solid-${i}`} src={heartSolid} width={20} height={20} alt="life" />
                ))}
            </div>

            <p>Guesses Made: {gameState.numGuessesMade}</p>
            {/* {Array.from(gameState.guessedGenres).map((genre) => (
                <p key={genre}>{genre}</p>
            ))} */}
        </div>
    )
}
