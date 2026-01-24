import genreList from "@/data/genres.json"
import { type Manga } from "@/types";
import { getDailyManga } from "./mangaService";

// export default function getGenres() {
//     return genreList;
// }

const NUM_GUESSES = 3;

interface GameState {
    date: string;
    manga: Manga;
    numGuessesMade: number;
    numLives: number
    status: "PLAYING" | "WON" | "LOST";
}

export function canPlay(gameState: GameState) {
    const today = new Date();
    return today.toDateString() !== gameState.date;
}

export function initGame() {
    const manga = getDailyManga();
    const today = new Date();
    return {
        date: today.toDateString(),
        manga,
        numGuessesMade: 0,
        numLives: NUM_GUESSES,
        status: "PLAYING"
    }
}