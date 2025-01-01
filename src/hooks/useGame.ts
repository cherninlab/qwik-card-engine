import { $, useStore, type QRL } from "@builder.io/qwik";
import { processGameAction } from "../core/game-logic";
import { initializeGameState } from "../core/initialization";
import type {
  CardId,
  GameAction,
  GameConfig,
  GameState,
  PlayerId,
} from "../types/core";

export interface UseGameReturn {
  state: GameState;
  actions: {
    playCard$: QRL<(playerId: PlayerId, cardId: CardId) => void>;
    attack$: QRL<
      (playerId: PlayerId, cardId: CardId, targetId: PlayerId | CardId) => void
    >;
    endTurn$: QRL<(playerId: PlayerId) => void>;
  };
}

export function useGame(
  config: GameConfig,
  playerIds: PlayerId[],
): UseGameReturn {
  const initialState = initializeGameState(config, playerIds);

  const state = useStore<GameState>(initialState, { deep: true });

  // This remains a QRL, but we have to help TypeScript see that it's QRL
  const applyAction$: QRL<(action: GameAction) => void> = $(
    (action: GameAction) => {
      const next = processGameAction(structuredClone(state), action);
      Object.assign(state, next);
    },
  );

  // Now each function is also typed as QRL
  const playCard$: QRL<(playerId: PlayerId, cardId: CardId) => void> = $(
    (playerId: PlayerId, cardId: CardId) => {
      applyAction$({ type: "playCard", playerId, cardId });
    },
  );

  const attack$: QRL<
    (playerId: PlayerId, cardId: CardId, targetId: PlayerId | CardId) => void
  > = $((playerId: PlayerId, cardId: CardId, targetId: PlayerId | CardId) => {
    applyAction$({ type: "attack", playerId, cardId, targetId });
  });

  const endTurn$: QRL<(playerId: PlayerId) => void> = $(
    (playerId: PlayerId) => {
      applyAction$({ type: "endTurn", playerId });
    },
  );

  return {
    state,
    actions: {
      playCard$,
      attack$,
      endTurn$,
    },
  };
}
