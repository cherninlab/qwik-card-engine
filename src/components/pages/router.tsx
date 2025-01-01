/**
 * A simple object defining route patterns for demonstration.
 *
 * In Qwik City, you might actually place your routes in "src/routes/[...]".
 * But here's an example if you want a single place to define them.
 */
export const gameRoutes = {
  home: "/",
  game: "/game/:id",
  lobby: "/lobby/:lobbyId",
  profile: "/profile",
};
