"use client"

import { useEffect, useState } from 'react';
import { initGame, submitAnswer } from '../lib/gameService';
import { GameState } from '@/types';
import Image from 'next/image';
import GenreList from './GenreList';
import StatusDisplay from './StatusDisplay';
import GuessForm from './GuessForm';
import { loadLocalGameState } from '@/lib/storage';



export default function GameMenu() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [winMessage, setWinMessage] = useState<string>("");
    const [loseMessage, setLoseMessage] = useState<string>("");

    // Load previous game state - start new game depending on date
    useEffect(() => {
        const localState = loadLocalGameState()
        const today = new Date().toDateString();

        if (localState && localState.date === today) {
            // eslint-disable-next-line
            setGameState(localState);

            if (localState.status === "WON") {
                setWinMessage("You won!");
            } else if (localState.status === "LOST") {
                setLoseMessage("You lost!");
            }
        } else {
            console.log("New day from previous gamestate, initiating new game!")
            const newState = initGame()
            setGameState(newState);
        }
    }, [])

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
        <div>

            {gameState === null ? (
                <div>Loading...</div>
            ) : (
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-2">{gameState.manga.node.title}</h2>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <Image className="h-80 w-auto" src={gameState.manga.node.main_picture.large} alt={gameState.manga.node.title} width={402} height={600} />
                        <GenreList gameState={gameState} />
                    </div>
                    <StatusDisplay gameState={gameState} />
                    <GuessForm gameState={gameState} handleGuess={handleGuess} />

                    {errorMessage && <p className="text-red-500 mt-2 font-bold">{errorMessage}</p>}
                    {winMessage && <p className="text-green-500 mt-2 font-bold">{winMessage}</p>}
                    {loseMessage && <p className="text-red-500 mt-2 font-bold">{loseMessage}</p>}
                    <div className="h-60"></div>
                </div>
            )}
        </div>
    )
}