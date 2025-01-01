import { $, component$ } from "@builder.io/qwik";
import { GameBoard } from "../../components/game/GameBoard";
import { GameProvider } from "../../components/game/GameProvider";
import { Loader } from "../../components/ui/Loader";
import { useGameContext } from "../../hooks/useGameContext";
import type { CardId, GameConfig, PlayerId } from "../../types/core";

/**
 * Example game configuration:
 * For a real app, you could fetch or load this from a routeLoader$.
 */
const gameConfig: GameConfig = {
  id: "my-game" as any, // cast to GameId
  name: "Qwik Demo",
  rules: {
    startingHealth: 20,
    startingHandSize: 3,
    startingResources: 1,
  },
};

/**
 * We'll assume we have exactly two players: player-1 and player-2
 */
const playerIds: PlayerId[] = ["player-1", "player-2"] as any;

export const GamePage = component$(() => {
  // We wrap the game in GameProvider to instantiate the state
  // and provide it via context.
  return (
    <GameProvider config={gameConfig} playerIds={playerIds}>
      <InnerGame />
    </GameProvider>
  );
});

/**
 * A nested component that reads from the context, picks the local player's ID,
 * and renders the GameBoard.  In a real app, you might pick the local player
 * from a login system or from query params.
 */
const InnerGame = component$(() => {
  const { state, actions } = useGameContext();

  // For this demo, we'll assume "player-1" is the local player
  const localPlayer = "player-1" as PlayerId;

  // If the state isn't fully loaded (like an async SSR scenario),
  // we might show a loader.  But here, it's all local.
  if (!state.players[localPlayer]) {
    return <Loader />;
  }

  // Example onPlayCard$ callback
  const onPlayCard = $((cardId: CardId) => {
    actions.playCard$(localPlayer, cardId);
  });

  // Example onSelectCard$ callback for attacking
  const onSelectCard = $((cardId: CardId) => {
    // We might need an "attacker" card in a real UI.  For a POC, let's assume "card-0" or so
    // Or we can store a selectedAttacker in a signal.  This is just a placeholder:
    actions.attack$(localPlayer, "card-player-1-0" as any, cardId);
  });

  return (
    <div class="game-page">
      <GameBoard
        state={state}
        playerId={localPlayer}
        onPlayCard$={onPlayCard}
        onSelectCard$={onSelectCard}
      />
    </div>
  );
});
