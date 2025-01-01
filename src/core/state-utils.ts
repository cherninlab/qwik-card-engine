import { produce } from "immer";
import type { GameState, PlayerId } from "../types/core";

/**
 * Creates an updated copy of the game state, merging any partial changes.
 *
 * If you already rely on `immer` in other files, you can merge them
 * with produce(...) or do it manually. This function is an example.
 *
 * @param {GameState} state - The current state
 * @param {Partial<GameState>} updates - The new values to merge
 * @returns {GameState} - Updated, immutable copy
 */
export function createStateUpdate(
  state: GameState,
  updates: Partial<GameState>,
): GameState {
  return produce(state, (draft) => {
    // For each top-level property in updates, we override in the draft.
    // This is a simplistic approach to shallow-merge. If you have deep
    // properties, you might do more elaborate merges here.
    for (const [key, value] of Object.entries(updates)) {
      // @ts-expect-error for dynamic assignment
      draft[key] = value;
    }
  });
}

/**
 * Checks if any player has dropped to 0 (or below) health,
 * and if so, marks the game as finished and sets the winner.
 *
 * @param {GameState} state - The pre-check state
 * @returns {GameState} - Possibly updated state with winner and status
 */
export function checkWinCondition(state: GameState): GameState {
  return produce(state, (draft) => {
    // If game is already finished, skip
    if (draft.status === "finished") {
      return;
    }

    // For simple 2-player logic, if a player's health <= 0, the other wins
    for (const [pid, player] of Object.entries(draft.players)) {
      if (player.health <= 0) {
        // Mark the game as finished
        draft.status = "finished";

        // The winner is the other player (assuming exactly 2 players).
        const winnerId = Object.keys(draft.players).find((id) => id !== pid);
        if (winnerId) {
          draft.winner = winnerId as PlayerId;
        }

        // Optionally set a "endReason" metadata, etc.
        // draft.metadata.endReason = "health reached zero"
        break;
      }
    }
  });
}
