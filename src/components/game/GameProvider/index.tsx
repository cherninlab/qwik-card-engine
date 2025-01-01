import { component$, Slot } from "@builder.io/qwik";
import { useGame } from "../../../hooks/useGame";
import { useGameContextProvider } from "../../../hooks/useGameContext";
import type { GameConfig, PlayerId } from "../../../types/core";

interface GameProviderProps {
  config: GameConfig;
  playerIds: PlayerId[];
}

/**
 * A simple provider that wires everything together:
 *  1) sets up the store & actions with `useGame(config, playerIds)`
 *  2) provides them in Qwik context
 *  3) renders children via <Slot />
 */
export const GameProvider = component$<GameProviderProps>(
  ({ config, playerIds }) => {
    const { state, actions } = useGame(config, playerIds);

    // Provide them in context:
    useGameContextProvider({ state, actions });

    // Children:
    return <Slot />;
  },
);
