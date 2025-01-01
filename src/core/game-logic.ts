import { produce } from "immer";

import type {
  AttackAction,
  EndTurnAction,
  GameAction,
  GameState,
  PlayCardAction,
  PlayerId,
} from "../types/core";

import { checkWinCondition, createStateUpdate } from "./state-utils";
import { validateAction } from "./validators";

import {
  isAttackAction,
  isEndTurnAction,
  isPlayCardAction,
} from "./type-guards";

/**
 * Main function that processes a single action:
 *   1. Validate
 *   2. Apply effect (play card, attack, end turn)
 *   3. Check for winner
 *   4. Update metadata
 *
 * @param {GameState} state - The current game state prior to the action
 * @param {GameAction} action - The action being performed
 * @returns {GameState} A brand new, updated state after applying the action
 */
export function processGameAction(
  state: GameState,
  action: GameAction,
): GameState {
  // 1. Validate action
  const validationResult = validateAction(state, action);
  if (!validationResult.valid) {
    throw new Error(validationResult.error);
  }

  // 2. Process based on action type
  let newState = state;
  if (isPlayCardAction(action)) {
    newState = handlePlayCard(newState, action);
  } else if (isAttackAction(action)) {
    newState = handleAttack(newState, action);
  } else if (isEndTurnAction(action)) {
    newState = handleEndTurn(newState, action);
  }

  // 3. Check win condition
  newState = checkWinCondition(newState);

  // 4. Update metadata (e.g. increment actionCount, set updatedAt, etc.)
  return createStateUpdate(newState, {
    metadata: {
      ...newState.metadata,
      actionCount: newState.metadata.actionCount + 1,
      updatedAt: Date.now(),
    },
  });
}

/* ------------------------------------------------------------------------- */
/*                          PLAY CARD ACTION                                 */
/* ------------------------------------------------------------------------- */

/**
 * Moves a card from the player's hand to their field, deducts resources,
 * and increments the "cardsPlayedThisTurn" counter.
 */
function handlePlayCard(state: GameState, action: PlayCardAction): GameState {
  const { playerId, cardId } = action;

  return produce(state, (draft) => {
    const player = draft.players[playerId];
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Remove the card from hand
    const cardIndex = player.hand.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      throw new Error(`Card ${cardId} not found in hand.`);
    }

    const card = player.hand[cardIndex];
    player.hand.splice(cardIndex, 1);

    // Place it on the field
    player.field.push({
      ...card,
      metadata: {
        ...card.metadata,
        turnPlayed: draft.turn,
      },
    });

    // Deduct resources, increment counters
    player.resources.coin -= card.cost;
    player.cardsPlayedThisTurn += 1;
  });
}

/* ------------------------------------------------------------------------- */
/*                          ATTACK ACTION                                    */
/* ------------------------------------------------------------------------- */

/**
 * Finds the attacking card, applies damage to either a player or another card,
 * and marks the attacker as having attacked.
 */
function handleAttack(state: GameState, action: AttackAction): GameState {
  const { playerId, cardId, targetId } = action;

  return produce(state, (draft) => {
    const player = draft.players[playerId];
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    const attacker = player.field.find((c) => c.id === cardId);
    if (!attacker) {
      throw new Error(`Attacking card ${cardId} not found on field`);
    }

    // If the targetId is also a player key, do direct damage
    if (targetId in draft.players) {
      const defendingPlayer =
        draft.players[targetId as keyof typeof draft.players];
      defendingPlayer.health -= attacker.power ?? 1;
    } else {
      // Otherwise, we assume the target is a card
      for (const [, p] of Object.entries(draft.players)) {
        const targetCardIndex = p.field.findIndex((c) => c.id === targetId);
        if (targetCardIndex !== -1) {
          // Remove or reduce HP as you see fit
          p.field.splice(targetCardIndex, 1);
          break;
        }
      }
    }

    // Mark as attacked
    player.hasAttackedThisTurn = true;
  });
}

/* ------------------------------------------------------------------------- */
/*                          END TURN ACTION                                  */
/* ------------------------------------------------------------------------- */

/**
 * Ends the current player's turn, increments the turn number,
 * resets counters, and advances to the next player's turn.
 */
function handleEndTurn(state: GameState, action: EndTurnAction): GameState {
  const playerIds = Object.keys(state.players);
  const currentIndex = playerIds.indexOf(action.playerId);
  const nextIndex = (currentIndex + 1) % playerIds.length;
  const nextPlayer = playerIds[nextIndex];

  return produce(state, (draft) => {
    draft.currentPlayer = nextPlayer as PlayerId;
    draft.turn += 1;
    draft.metadata.turnStartedAt = Date.now();

    // Reset each player's "cardsPlayedThisTurn" and "hasAttackedThisTurn"
    for (const [id, p] of Object.entries(draft.players)) {
      p.cardsPlayedThisTurn = 0;
      p.hasAttackedThisTurn = false;

      // Example: +1 coin at start of each player's turn
      if (id === nextPlayer) {
        p.resources.coin += 1;
      }
    }
  });
}
