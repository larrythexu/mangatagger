"use client"

import { GameState } from "@/types";

export default function GenreList({ gameState }: { gameState: GameState }) {
    switch (gameState.status) {
        case "PLAYING":
            return (
                <div className="flex flex-row flex-wrap content-start gap-x-1 border-2 h-80 w-75 border-gray-800 bg-gray-800 rounded-md p-3">
                    {gameState.guessedGenres.map((genre) => (
                        <p className="border-1 border-gray-200 h-8 m-1 rounded-md bg-gray-600 text-white text-sm font-bold p-1" key={genre}>{genre}</p>
                    ))}
                </div >
            )
        case "WON":
            return (
                <div className="flex flex-row flex-wrap content-start gap-x-1 border-2 h-80 w-75 border-green-500 bg-green-500 rounded-md p-3">
                    {gameState.guessedGenres.map((genre) => (
                        <p className="border-1 border-gray-200 h-8 m-1 rounded-md bg-gray-600 text-white text-sm font-bold p-1" key={genre}>{genre}</p>
                    ))}
                </div>
            )
        case "LOST":
            return (
                <div className="flex flex-row flex-wrap content-start gap-x-1 border-2 h-80 w-75 border-red-500 bg-red-500 rounded-md p-3">
                    {gameState.manga.node.genres.map((genre) => (
                        <p className="border-1 border-gray-200 h-8 m-1 rounded-md bg-gray-600 text-white text-sm font-bold p-1" key={genre.name}>{genre.name.toUpperCase()}</p>
                    ))}
                </div>
            )
        default:
            return (
                <div>
                    <p>Error displaying genres!</p>
                </div>
            )
    }
}