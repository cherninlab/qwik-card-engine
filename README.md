# QwikCE - Qwik Card Engine

Simple card game engine built for Qwik.

## Quick Start

```bash
# Or add to existing project
npm install @cherninlab/qwik-card-engine
```

## Basic Usage

```typescript
// 1. Define your game
const gameConfig = {
  id: 'my-game',
  name: 'My Card Game',
  resources: {
    coin: {
      startAmount: 1,
      gainPerTurn: 1
    }
  },
  cardTypes: {
    unit: {
      type: "unit"
    }
  }
};

// 2. Add game to your app
import { GameProvider } from '@cherninlab/qwik-card-engine';

export default component$(() => {
  return (
    <GameProvider config={gameConfig}>
      <YourGame />
    </GameProvider>
  );
});

// 3. Use game state and actions
import { useGameState, useGameAction } from '@cherninlab/qwik-card-engine';

export const YourGame = component$(() => {
  const state = useGameState();
  const { playCard$ } = useGameAction();

  return (
    <div>
      {/* Your game UI */}
    </div>
  );
});
```

## Examples

- [Number Battle](https://github.com/cherninlab/number-battle) - Simple number-based card game

## Documentation

- [API Documentation](./docs/api.md) - Server implementation guide

## Development

```bash
pnpm install
pnpm dev
pnpm build
```
