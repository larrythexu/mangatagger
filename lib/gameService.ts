import genreList from "@/data/genres.json"
import { type GameState, type answerResult } from "@/types";
import { getDailyManga } from "./mangaService";
import { saveGameState } from "./storage";

const GENRE_SET = new Set(genreList)
const NUM_GUESSES = 3;

export function getNumGuesses(): number {
    return NUM_GUESSES;
}

// Retrieve daily genres answers
export function getAnswer(gameState: GameState): Set<string> {
    return new Set(gameState.manga.node.genres.map((genre) => genre.name.toLowerCase()));
}

export function initGame() {
    const manga = getDailyManga();
    const today = new Date();

    const newState: GameState = {
        date: today.toDateString(),
        manga,
        numGuessesMade: 0,
        guessedGenres: new Set(),
        remainingGenres: new Set(GENRE_SET),
        numLives: NUM_GUESSES,
        status: "PLAYING"
    }

    saveGameState(newState); //TODO: consider if we save state here or elsewhere?
    return newState;
}

// SubmitAnswer: Handle main game logic (TODO: possible add guess limit as well)
// When player submits an answer, update gameState
// If invalid answer/gamestate, returns failed gameState with reason
// Otherwise, checks if player gussed correctly or not, losing life if they do. 
// Game ends if player guesses all genres OR runs out of lives
export function submitAnswer(gameState: GameState, playerAnswer: string): answerResult {
    if (gameState.status !== "PLAYING") {
        console.log("Game isn't in playing state!")
        return { valid: false, gameState, reason: "Game isn't in playing state!" }
    }

    // Check if genre is valid
    playerAnswer = playerAnswer.toLowerCase()
    if (!GENRE_SET.has(playerAnswer)) {
        return { valid: false, gameState, reason: "Invalid genre!" }
    } else if (gameState.guessedGenres.has(playerAnswer)) {
        return { valid: false, gameState, reason: "Already guessed genre!" }
    }

    gameState.numGuessesMade++

    // Handle answer
    if (getAnswer(gameState).has(playerAnswer)) {
        gameState.guessedGenres.add(playerAnswer)
        gameState.remainingGenres.delete(playerAnswer)

        // Check if player has won
        if (gameState.guessedGenres === getAnswer(gameState)) {
            gameState.status = "WON"
        }
    } else {
        gameState.numLives--

        // Check if player has lost
        if (gameState.numLives === 0) {
            gameState.status = "LOST"
        }
    }

    saveGameState(gameState);
    return { valid: true, gameState }
}