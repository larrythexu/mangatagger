"use client"

import { useEffect, useState } from 'react';
import { initGame, submitAnswer } from '../lib/gameService';
import { GameState } from '@/types';
import Image from 'next/image';
import { getDailyManga } from "@/lib/mangaService";
import StatusDisplay from './StatusDisplay';
import { loadLocalGameState } from '@/lib/storage';


export default function GameMenu() {
    const dailyManga = getDailyManga();
    const [gameState, setGameState] = useState<GameState | null>(null);

    // Load previous game state - start new game depending on date
    useEffect(() => {
        const localState = loadLocalGameState()
        const today = new Date().toDateString();

        if (localState && localState.date === today) {
            // eslint-disable-next-line
            setGameState(localState);
        } else {
            console.log("New day from previous gamestate, initiating new game!")
            const newState = initGame()
            setGameState(newState);
        }
    }, [])

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [winMessage, setWinMessage] = useState<string>("");
    const [loseMessage, setLoseMessage] = useState<string>("");

    function handleGuess(guess: string) {
        const result = submitAnswer(gameState!, guess);

        // All error handling, display in message. Doesn't update state
        if (!result.valid) {
            setErrorMessage(result.reason);
            return
        }

        // Valid answer
        // Check if game is won or lost
        if (result.gameState.status === "WON") {
            setWinMessage("You won!");
        } else if (result.gameState.status === "LOST") {
            setLoseMessage("You lost!");
        }

        // Update state
        setGameState(result.gameState);
    }

    return (
        <div className="flex-col items-center">

            {gameState === null ? (
                <div>Loading...</div>
            ) : (
                <div className="flex flex-col items-center">
                    {gameState.manga.node.title}
                    <Image className="h-80 w-auto" src={gameState.manga.node.main_picture.large} alt={gameState.manga.node.title} width={500} height={500} />

                    <StatusDisplay gameState={gameState} />
                </div>
            )}

            {/* <GuessForm gameState={gameState} handleGuess={handleGuess}/> */}
        </div>
    )
}