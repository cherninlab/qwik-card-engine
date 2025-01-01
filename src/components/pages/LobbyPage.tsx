import { $, component$, useSignal } from "@builder.io/qwik";

interface Player {
  id: string;
  name: string;
  ready: boolean;
}

/**
 * A super minimal "lobby" page, showing players and a "Ready" toggle.
 */
export const LobbyPage = component$(() => {
  // For demonstration, we store an array of players
  const players = useSignal<Player[]>([
    { id: "player-1", name: "Alice", ready: false },
    { id: "player-2", name: "Bob", ready: false },
  ]);

  // Suppose we track "my" readiness locally
  const myId = "player-1";
  const isReady = useSignal(false);

  // Toggle readiness
  const toggleReady = $(() => {
    isReady.value = !isReady.value;
    const index = players.value.findIndex((p) => p.id === myId);
    if (index !== -1) {
      players.value[index] = {
        ...players.value[index],
        ready: isReady.value,
      };
    }
  });

  // Example “Start Game” scenario
  const startGame = $(() => {
    const allReady = players.value.every((p) => p.ready);
    if (allReady) {
      location.href = "/game/awesome-game";
    } else {
      alert("Not all players are ready yet!");
    }
  });

  return (
    <div class="lobby-page" style="padding:1rem">
      <h2>Game Lobby</h2>
      <p>Lobby ID: 123 (example URL param or route param)</p>

      <div class="players" style="margin-top:1rem">
        {players.value.map((player) => (
          <div key={player.id} style="margin-bottom:0.5rem">
            {player.name} {player.ready ? "✓" : ""}
          </div>
        ))}
      </div>

      <button onClick$={toggleReady} style="margin-right:1rem">
        {isReady.value ? "Not Ready" : "Ready"}
      </button>

      <button onClick$={startGame}>Start Game</button>
    </div>
  );
});
