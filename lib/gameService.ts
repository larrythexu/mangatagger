import genreList from "@/data/genres.json"
import { type GameState, type answerResult } from "@/types";
import { getDailyManga } from "./mangaService";
import { loadGameState, saveGameState } from "./storage";

const GENRE_SET = new Set(genreList)
const NUM_GUESSES = 3;

export function getNumGuesses(): number {
    return NUM_GUESSES;
}

// Check based on last gameState? if we can play
export function isNewDay(): boolean {
    const gameState = loadGameState()
    const today = new Date();
    return today.toDateString() !== gameState?.date;
}

// Retrieve daily genres answers
// Only computes answers on new day OR if DAILY_ANSWER is null, uses cached answer otherwise
let DAILY_ANSWER: Set<string> | null = null;
export function getAnswer(): Set<string> {
    // Check if new day, if so, get new answer
    if (isNewDay() || !DAILY_ANSWER) {
        const manga = getDailyManga();
        DAILY_ANSWER = new Set(manga.node.genres.map((genre) => genre.name.toLowerCase()));
        return DAILY_ANSWER;
    }

    return DAILY_ANSWER;
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
    console.log(newState)

    saveGameState(newState); //TODO: consider if we save state here or elsewhere?
    return newState;
}

export function loadGame() {
    const gameState = loadGameState()
    if (!gameState) {
        return initGame()
    }
    return gameState
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
    if (getAnswer().has(playerAnswer)) {
        gameState.guessedGenres.add(playerAnswer)
        gameState.remainingGenres.delete(playerAnswer)

        // Check if player has won
        if (gameState.guessedGenres === getAnswer()) {
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