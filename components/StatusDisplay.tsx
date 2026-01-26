"use client"

import { GameState } from "@/types"
import { getNumGuesses } from "@/lib/gameService"

export default function StatusDisplay({ gameState }: { gameState: GameState }) {
    return (
        <div>
            <p>{gameState.numLives} / {getNumGuesses()}</p>
            <p>{gameState.numGuessesMade}</p>
            {Array.from(gameState.guessedGenres).map((genre) => (
                <p key={genre}>{genre}</p>
            ))}
        </div>
    )
}
