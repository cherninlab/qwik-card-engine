import type {
  AttackAction,
  EndTurnAction,
  GameAction,
  GameState,
  PlayCardAction,
  ValidationResult,
} from "../types/core";
import {
  isAttackAction,
  isEndTurnAction,
  isPlayCardAction,
} from "./type-guards";

/**
 * Validates a given action by delegating to more specific logic
 * based on the action type. Returns { valid: false } with an
 * error message if the action is disallowed.
 *
 * @param {GameState} state - Current game state
 * @param {GameAction} action - Requested action to validate
 * @returns {ValidationResult} - { valid: boolean, error?: string }
 */
export function validateAction(
  state: GameState,
  action: GameAction,
): ValidationResult {
  // Quick check: is the game still active?
  if (state.status !== "playing") {
    return {
      valid: false,
      error: "Game is not in a playable state.",
    };
  }

  // If we have multiple phases, you might also check if the action
  // is allowed in the current phase. For now, let's skip that.

  // Delegate to action-specific validators
  if (isPlayCardAction(action)) {
    return validatePlayCard(state, action);
  }
  if (isAttackAction(action)) {
    return validateAttack(state, action);
  }
  if (isEndTurnAction(action)) {
    return validateEndTurn(state, action);
  }

  // If we don’t recognize the action, default to valid:
  return { valid: true };
}

/* ------------------------------------------------------------------------- */
/*                           PLAY CARD VALIDATION                            */
/* ------------------------------------------------------------------------- */

/**
 * Validate a PlayCardAction to ensure the player:
 *   - Exists in the state
 *   - Has the card in their hand
 *   - Has enough resources
 *   - Has not exceeded any “cards played this turn” limit (if applicable)
 */
function validatePlayCard(
  state: GameState,
  action: PlayCardAction,
): ValidationResult {
  const { playerId, cardId } = action;
  const player = state.players[playerId];
  if (!player) {
    return { valid: false, error: `Player ${playerId} not found.` };
  }

  const card = player.hand.find((c) => c.id === cardId);
  if (!card) {
    return { valid: false, error: "Card not found in player hand." };
  }

  if (player.resources.coin < card.cost) {
    return { valid: false, error: "Not enough coins to play card." };
  }

  // Example rule: only 1 card per turn
  if (player.cardsPlayedThisTurn >= 1) {
    return { valid: false, error: "Already played a card this turn." };
  }

  // If we got here, pass
  return { valid: true };
}

/* ------------------------------------------------------------------------- */
/*                           ATTACK VALIDATION                               */
/* ------------------------------------------------------------------------- */

/**
 * Validate an AttackAction to ensure the player:
 *   - Exists
 *   - Has the attacking card on their field
 *   - Has not attacked this turn (or the game rules for number of attacks)
 */
function validateAttack(
  state: GameState,
  action: AttackAction,
): ValidationResult {
  const { playerId, cardId } = action;
  const player = state.players[playerId];
  if (!player) {
    return { valid: false, error: `Player ${playerId} not found.` };
  }

  const attacker = player.field.find((c) => c.id === cardId);
  if (!attacker) {
    return { valid: false, error: "Attacking card not found on field." };
  }

  // Basic example rule: each player can only attack once per turn
  if (player.hasAttackedThisTurn) {
    return { valid: false, error: "Already attacked this turn." };
  }

  // Additional checks could include “card can only attack once,” etc.
  return { valid: true };
}

/* ------------------------------------------------------------------------- */
/*                           END TURN VALIDATION                             */
/* ------------------------------------------------------------------------- */

/**
 * Validate an EndTurnAction to ensure it’s actually the player’s turn, etc.
 */
function validateEndTurn(
  state: GameState,
  action: EndTurnAction,
): ValidationResult {
  if (state.currentPlayer !== action.playerId) {
    return { valid: false, error: "It's not your turn." };
  }
  return { valid: true };
}
