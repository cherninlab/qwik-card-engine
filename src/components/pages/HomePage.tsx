import { component$ } from "@builder.io/qwik";

/**
 * A minimal homepage that displays simple buttons for
 * navigating to the game or the lobby.
 *
 * In a real app, you’d likely use Qwik City route navigation or
 * <Link> components, but here we show a simplistic location.href approach.
 */
export const HomePage = component$(() => {
  return (
    <div class="home-page" style="padding:1rem">
      <h1>Welcome to Qwik Card Game</h1>
      <p>
        This is a simple demonstration of how to navigate to a game or lobby.
      </p>

      <div style="margin-top:1rem; display:flex; gap:1rem">
        <button onClick$={() => (location.href = "/game/new")}>New Game</button>
        <button onClick$={() => (location.href = "/lobby/123")}>
          Join Lobby
        </button>
      </div>
    </div>
  );
});
