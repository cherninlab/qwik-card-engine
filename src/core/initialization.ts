import { produce } from "immer";
import type { CardId, GameConfig, GameState, PlayerId } from "../types/core";
import { createStateUpdate } from "./state-utils";

/**
 * Creates a fresh GameState for a new game session, based on a config and
 * the provided list of player IDs. If you have more complicated logic (e.g.,
 * shuffle decks, draw opening hands), you can do it here.
 *
 * @param {GameConfig} config - Basic configuration (e.g. startingHealth)
 * @param {PlayerId[]} playerIds - Which players are participating
 * @returns {GameState} - The newly created game state, in "playing" status
 */
export function initializeGameState(
  config: GameConfig,
  playerIds: PlayerId[],
): GameState {
  // Start with a minimal “empty” state
  let baseState: GameState = {
    id: config.id,
    status: "playing",
    phase: "main", // optional: if you have phases
    turn: 1,
    currentPlayer: playerIds[0],
    players: {},
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      turnStartedAt: Date.now(),
      actionCount: 0,
    },
    // If you have a “winner” property, it can be left undefined initially
  };

  // Use immer or manual merges to fill out the players
  baseState = produce(baseState, (draft) => {
    for (const pid of playerIds) {
      draft.players[pid] = {
        id: pid,
        health: config.rules?.startingHealth ?? 20,
        resources: { coin: config.rules?.startingResources ?? 1 },
        hand: [],
        field: [],
        cardsPlayedThisTurn: 0,
        hasAttackedThisTurn: false,
      };

      // If you want to deal an opening hand, do so here:
      const openingHandSize = config.rules?.startingHandSize ?? 3;
      for (let i = 0; i < openingHandSize; i++) {
        // For simplicity, create a placeholder card
        draft.players[pid].hand.push({
          id: `card-${pid}-${i}` as CardId,
          name: `Starter Card #${i}`,
          cost: 1,
          power: 1,
          health: 1,
        });
      }
    }
  });

  // Return final, updated state (an optional step to unify metadata if needed)
  return createStateUpdate(baseState, {});
}
