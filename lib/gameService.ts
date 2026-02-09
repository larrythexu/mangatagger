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
export function getAnswer(gameState: GameState): string[] {
    return gameState.manga.node.genres.map((genre) => genre.name.toUpperCase());
}

export function initGame() {
    const manga = getDailyManga();
    const today = new Date();

    const newState: GameState = {
        date: today.toDateString(),
        manga,
        numGuessesMade: 0,
        guessedGenres: [],
        remainingGenres: [...GENRE_SET],
        numLives: NUM_GUESSES,
        status: "PLAYING"
    }
    console.log(genreList)

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
    playerAnswer = playerAnswer.toUpperCase()
    if (!GENRE_SET.has(playerAnswer)) {
        return { valid: false, gameState, reason: "Invalid genre!" }
    } else if (gameState.guessedGenres.includes(playerAnswer)) {
        return { valid: false, gameState, reason: "Already guessed genre!" }
    }

    // Create a new gameState object to trigger React re-renders
    const newGameState: GameState = {
        ...gameState,
        numGuessesMade: gameState.numGuessesMade + 1
    };

    // Handle answer
    if (getAnswer(gameState).includes(playerAnswer)) {
        newGameState.guessedGenres = [...gameState.guessedGenres, playerAnswer];
        newGameState.remainingGenres = gameState.remainingGenres.filter(g => g !== playerAnswer);

        // Check if player has won
        const answers = getAnswer(gameState);
        if (newGameState.guessedGenres.length === answers.length &&
            newGameState.guessedGenres.every(g => answers.includes(g))) {
            newGameState.status = "WON";
        }
    } else {
        newGameState.numLives = gameState.numLives - 1;
        newGameState.guessedGenres = [...gameState.guessedGenres];
        newGameState.remainingGenres = [...gameState.remainingGenres];

        // Check if player has lost
        if (newGameState.numLives === 0) {
            newGameState.status = "LOST";
        }
    }

    saveGameState(newGameState);
    return { valid: true, gameState: newGameState };
}