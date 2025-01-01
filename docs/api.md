# Qwik Card Game Engine API

## Core Concepts

The engine provides a framework for building card games with:

- State management
- Action processing
- Validation system
- Extensible rules
- UI components

## Game Configuration

Configure your game by providing a GameConfig:

```typescript
interface GameConfig {
  // Required
  id: string;
  name: string;

  // Optional
  rules?: {
    // Override default handlers
    handlers?: {
      onPlayCard?: (state: GameState, action: PlayCardAction) => GameState;
      onAttack?: (state: GameState, action: AttackAction) => GameState;
      onTurnEnd?: (state: GameState, action: EndTurnAction) => GameState;
    };

    // Add custom validators
    validators?: {
      canPlayCard?: (
        state: GameState,
        playerId: string,
        cardId: string,
      ) => boolean;
      canAttack?: (
        state: GameState,
        playerId: string,
        attackerId: string,
        targetId?: string,
      ) => boolean;
      canEndTurn?: (state: GameState, playerId: string) => boolean;
    };

    // Game parameters
    startingCoins?: number; // Default: 1
    startingHealth?: number; // Default: 20
    handSize?: number; // Default: 3
    maxFieldSize?: number; // Default: 5
  };
}
```

Example configuration:

```typescript
const gameConfig = {
  id: "my-game",
  name: "My Card Game",
  rules: {
    startingHealth: 30,
    handSize: 4,
    validators: {
      canAttack: (state, playerId, attackerId, targetId) => {
        // Custom attack rules
        const attacker = findCard(state, attackerId);
        const target = targetId ? findCard(state, targetId) : null;

        // Example: Cards can only attack targets of same type
        return !target || attacker.type === target.type;
      },
    },
  },
};
```

## State Structure

The complete game state structure:

```typescript
interface GameState {
  id: string;
  status: "waiting" | "playing" | "finished";
  turn: number;
  currentPlayer: string;
  winner?: string;
  players: Record<string, PlayerState>;
  lastUpdate: number;
}

interface PlayerState {
  id: string;
  health: number;
  resources: {
    coin: number;
  };
  hand: Card[];
  field: Card[];
}

interface Card {
  id: string;
  type: string;
  cost: number;
  power?: number;
  health?: number;
  [key: string]: any; // Custom properties
}
```

## Actions

The engine supports three basic actions:

### Play Card

```typescript
const playCard: PlayCardAction = {
  type: "playCard",
  playerId: "player1",
  cardId: "card1",
};
```

### Attack

```typescript
const attack: AttackAction = {
  type: "attack",
  playerId: "player1",
  attackerId: "card1",
  targetId: "card2", // or "player2" for direct attack
};
```

### End Turn

```typescript
const endTurn: EndTurnAction = {
  type: "endTurn",
  playerId: "player1",
};
```

## Components

### GameProvider

Initializes game engine and provides state:

```typescript
<GameProvider config={gameConfig}>
  <YourGame />
</GameProvider>
```

### GameBoard

Main game view component:

```typescript
<GameBoard
  state={gameState}
  playerId={currentPlayer}
  className="custom-class"
/>
```

### Other Components

- GameCard - Individual card display
- GameField - Play area
- PlayerArea - Player's board section
- PlayerHand - Hand display

## Hooks

### useGameState

Access current game state:

```typescript
const gameState = useGameState();
// Returns Signal<GameState>
```

### useGameAction

Perform game actions:

```typescript
const { playCard$, attack$, endTurn$ } = useGameAction();

// Usage:
await playCard$({
  type: "playCard",
  playerId,
  cardId,
});
```

## Extension Points

### Custom Card Types

Extend the base Card interface:

```typescript
interface ElementalCard extends Card {
  element: "fire" | "water" | "earth" | "air";
  specialAbility?: string;
}
```

### Custom Rules

Add game-specific rules through validators:

```typescript
rules: {
  validators: {
    canPlayCard: (state, playerId, cardId) => {
      const card = findCard(state, cardId);
      const player = state.players[playerId];

      // Example: Element requirements
      return player.field.some((c) => c.element === card.element);
    };
  }
}
```

### Custom Events

Handle special game events:

```typescript
rules: {
  handlers: {
    onPlayCard: (state, action) => {
      // Handle standard card play
      state = standardPlayCard(state, action);

      // Add special effects
      const card = findCard(state, action.cardId);
      if (card.type === "spell") {
        state = handleSpellEffects(state, card);
      }

      return state;
    };
  }
}
```

## Error Handling

Actions return ActionResult:

```typescript
interface ActionResult {
  success: boolean;
  newState?: GameState;
  error?: string;
}

// Usage
try {
  const result = await playCard$({
    type: "playCard",
    playerId,
    cardId,
  });

  if (!result.success) {
    console.error(result.error);
    // Handle error case
  }
} catch (e) {
  // Handle unexpected errors
}
```

## Best Practices

1. State Management

   - Never modify state directly
   - Use provided actions
   - Validate actions before processing

2. Custom Rules

   - Keep validators pure functions
   - Handle all edge cases
   - Consider game balance

3. Components

   - Use CSS modules for styling
   - Follow composition pattern
   - Handle loading states

4. Error Handling
   - Always check action results
   - Provide user feedback
   - Log errors appropriately
