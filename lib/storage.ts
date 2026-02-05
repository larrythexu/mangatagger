"use client"

import { type GameState } from "@/types";

const STORAGE_KEY = "mangatagger-state"

export function saveGameState(gameState: GameState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
}

export function loadLocalGameState(): GameState | null {
    const gameState = localStorage.getItem(STORAGE_KEY)
    if (!gameState) {
        return null
    }
    try {
        return JSON.parse(gameState) as GameState
    } catch (e) {
        console.error(e)
        return null
    }
}
