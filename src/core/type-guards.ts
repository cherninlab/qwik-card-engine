import type {
  AttackAction,
  CardId,
  EndTurnAction,
  GameAction,
  PlayCardAction,
  PlayerId,
} from "../types/core";

/**
 * Type guard for PlayCardAction
 */
export function isPlayCardAction(action: GameAction): action is PlayCardAction {
  return action.type === "playCard";
}

/**
 * Type guard for AttackAction
 */
export function isAttackAction(action: GameAction): action is AttackAction {
  return action.type === "attack";
}

/**
 * Type guard for EndTurnAction
 */
export function isEndTurnAction(action: GameAction): action is EndTurnAction {
  return action.type === "endTurn";
}

/**
 * Type guard for PlayerId
 */
export function isPlayerId(value: unknown): value is PlayerId {
  return typeof value === "string" && value.startsWith("player-");
}

/**
 * Type guard for CardId
 */
export function isCardId(value: unknown): value is CardId {
  return typeof value === "string" && value.includes("card-");
}

/**
 * Creates typed IDs with proper prefix
 */
export const createId = {
  player: (num: number): PlayerId => `player-${num}` as PlayerId,
  card: (prefix: string): CardId => `card-${prefix}-${Date.now()}` as CardId,
};
