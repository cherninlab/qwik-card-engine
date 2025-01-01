import {
  createContextId,
  useContext,
  useContextProvider,
  type QRL,
} from "@builder.io/qwik";
import type { CardId, GameState, PlayerId } from "../types/core";

/** The shape of what we store in context: both state + typed actions. */
export interface GameActions {
  playCard$: QRL<(playerId: PlayerId, cardId: CardId) => void>;
  attack$: QRL<
    (playerId: PlayerId, cardId: CardId, targetId: PlayerId | CardId) => void
  >;
  endTurn$: QRL<(playerId: PlayerId) => void>;
}

export interface GameContextValue {
  state: GameState;
  actions: GameActions;
}

/**
 * The context ID used for storing the above { state, actions }.
 */
export const GameContext = createContextId<GameContextValue>("GAME_CONTEXT");

/**
 * Hook to provide a { state, actions } object in the Qwik context.
 */
export function useGameContextProvider(value: GameContextValue) {
  useContextProvider(GameContext, value);
}

/**
 * Hook to retrieve the context: { state, actions }.
 */
export function useGameContext(): GameContextValue {
  return useContext(GameContext);
}
