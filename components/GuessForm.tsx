"use client"

import { GameState } from "@/types"
import { useState } from "react";

export default function GuessForm({ gameState, handleGuess }: { gameState: GameState, handleGuess: (guess: string) => void }) {
    const [input, setInput] = useState("");
    const [filteredGenres, setFilteredGenres] = useState<string[]>([]);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    function handleChange(value: string) {
        setInput(value);

        if (value.length >= 1) {
            const matches = gameState.remainingGenres.filter((genre) =>
                genre.toLowerCase().includes(value.toLowerCase())
            );

            setFilteredGenres(matches);
            setShowSuggestions(true);
            setHighlightIndex(-1);
        } else {
            setShowSuggestions(false);
        }
    }

    function selectAnswer(genre: string) {
        setInput(genre);
        setShowSuggestions(false);
        setHighlightIndex(-1);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        // Handle Enter key differently based on showSuggestions state
        if (e.key === "Enter") {
            e.preventDefault();
            if (showSuggestions && highlightIndex >= 0 && highlightIndex < filteredGenres.length) {
                selectAnswer(filteredGenres[highlightIndex]);
            } else if (input.length >= 1 && highlightIndex === -1) {
                handleGuess(input);
                setInput("");
            }
            return;
        }

        if (!showSuggestions) return;

        // Nav suggestions
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev < filteredGenres.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filteredGenres.length - 1));
        }

        if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    }

    return (
        <div className="flex justify-center mt-5">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    disabled={gameState.status !== "PLAYING"}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Manga Genre"
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-black"
                    style={gameState.status !== "PLAYING" ? { opacity: 0.5 } : {}}
                />
                {showSuggestions && filteredGenres.length > 0 && (
                    <ul className="absolute w-full bg-white border border-gray-300 list-none m-0 p-0 z-10 rounded-md mt-1 shadow-lg text-black max-h-60 overflow-y-auto">
                        {filteredGenres.map((genre, index) => (
                            <li
                                key={genre}
                                onClick={() => selectAnswer(genre)}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    background:
                                        index === highlightIndex ? "#eee" : "transparent"
                                }}
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="ml-2 w-20">
                <button onClick={() => {
                    handleGuess(input)
                    setInput("")
                }} className="w-20 p-2 bg-blue-500 text-white rounded-md"
                    disabled={gameState.status !== "PLAYING"}
                    style={gameState.status !== "PLAYING" ? { opacity: 0.5 } : {}}>
                    Guess
                </button>
            </div>
        </div>
    )
}