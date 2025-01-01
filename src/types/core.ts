/**
 * Core type definitions for the Qwik Card Engine.
 * This module contains all fundamental types used throughout the engine.
 * @module types/core
 */

// ================================
// Nominal Types
// ================================

/**
 * Unique identifier for a game instance.
 * Using nominal typing to prevent string type confusion.
 */
export type GameId = string & { readonly __gameId: unique symbol };

/**
 * Unique identifier for a player.
 * Using nominal typing to prevent string type confusion.
 */
export type PlayerId = string & { readonly __playerId: unique symbol };

/**
 * Unique identifier for a card.
 * Using nominal typing to prevent string type confusion.
 */
export type CardId = string & { readonly __cardId: unique symbol };

// ================================
// Game Configuration
// ================================

/**
 * Main game configuration interface.
 * Defines the core rules and settings for a game instance.
 */
export interface GameConfig {
  /** Unique identifier for this game configuration */
  id: GameId;

  /** Display name of the game */
  name: string;

  /** Optional game rules and mechanics */
  rules?: GameRules;

  /** Optional card definitions for the game */
  cards?: CardDefinition[];
}

/**
 * Defines the rules and mechanics for a game.
 * All properties are optional to allow for maximum flexibility.
 */
export interface GameRules {
  startingResources?: number;

  /** Starting health for each player (default: 20) */
  startingHealth?: number;

  /** Number of cards in starting hand (default: 3) */
  startingHandSize?: number;

  /** Maximum cards allowed in hand (default: 7) */
  maxHandSize?: number;

  /** Maximum cards allowed on field (default: 5) */
  maxFieldSize?: number;

  /** Number of cards that can be played per turn (default: 1) */
  cardsPerTurn?: number;

  /** Custom validators for game actions */
  validators?: {
    /** Validates if a card can be played */
    canPlayCard?: (
      state: GameState,
      playerId: PlayerId,
      cardId: CardId,
    ) => boolean;

    /** Validates if an attack can be performed */
    canAttack?: (
      state: GameState,
      attacker: PlayerId,
      attackerId: CardId,
      targetId: CardId | PlayerId,
    ) => boolean;

    /** Validates if a turn can be ended */
    canEndTurn?: (state: GameState, playerId: PlayerId) => boolean;
  };

  /** Handlers for game phase transitions */
  handlers?: {
    /** Called when a turn starts */
    onTurnStart?: (state: GameState) => GameState;

    /** Called when a turn ends */
    onTurnEnd?: (state: GameState) => GameState;

    /** Called when the game ends */
    onGameEnd?: (state: GameState) => GameState;
  };
}

// ================================
// Game State
// ================================

/**
 * Represents the complete state of a game at any point.
 * This is the core state object that gets updated with each action.
 */
export interface GameState {
  /** Unique identifier for this game instance */
  id: GameId;

  /** Current status of the game */
  status: GameStatus;

  /** Current phase within the game */
  phase: GamePhase;

  /** Current turn number */
  turn: number;

  /** ID of the player whose turn it is */
  currentPlayer: PlayerId;

  /** ID of the winning player, if game is finished */
  winner?: PlayerId;

  /** Map of player IDs to their current state */
  players: Record<PlayerId, PlayerState>;

  /** Last action that was performed */
  lastAction?: GameAction;

  /** Additional game metadata */
  metadata: GameMetadata;
}

/**
 * Represents the state of a single player.
 */
export interface PlayerState {
  /** Player's unique identifier */
  id: PlayerId;

  /** Current health points */
  health: number;

  /** Current resources available to the player */
  resources: PlayerResources;

  /** Cards in player's hand */
  hand: Card[];

  /** Cards on player's field */
  field: Card[];

  /** Number of cards played this turn */
  cardsPlayedThisTurn: number;

  /** Whether the player has attacked this turn */
  hasAttackedThisTurn: boolean;
}

/**
 * TBD
 */
export interface PlayerResources {
  coin: number;
}

/**
 * TBD
 */
export interface CardEffect {}

/**
 * Represents a card instance in the game.
 */
export interface Card {
  /** Unique identifier for this card */
  id: CardId;

  /** Display name of the card */
  name: string;

  /** Cost to play this card */
  cost: number;

  /** Attack power of the card (if applicable) */
  power?: number;

  /** Health points of the card (if applicable) */
  health?: number;

  /** Special effects this card has */
  effects?: CardEffect[];

  /** Additional card metadata */
  metadata?: CardMetadata;
}

/**
 * Represents a card's base definition in the game configuration.
 */
export interface CardDefinition extends Omit<Card, "id" | "metadata"> {
  /** Type of the card */
  type: CardType;
}

// ================================
// Actions
// ================================

/**
 * Union type of all possible game actions.
 */
export type GameAction =
  | PlayCardAction
  | AttackAction
  | EndTurnAction
  | CustomAction;

/**
 * Base interface for all actions.
 */
export interface BaseGameAction {
  /** Type of the action */
  type: string;

  /** ID of the player performing the action */
  playerId: PlayerId;

  /** Timestamp when the action was performed */
  timestamp?: number;
}

/**
 * Action for playing a card from hand.
 */
export interface PlayCardAction extends BaseGameAction {
  type: "playCard";
  cardId: CardId;
}

/**
 * Action for attacking with a card.
 */
export interface AttackAction extends BaseGameAction {
  type: "attack";
  cardId: CardId;
  targetId: CardId | PlayerId;
}

/**
 * Action for ending the current turn.
 */
export interface EndTurnAction extends BaseGameAction {
  type: "endTurn";
}

/**
 * Template for game-specific custom actions.
 */
export interface CustomAction extends BaseGameAction {
  type: string;
  data: Record<string, unknown>;
}

/**
 * Result of processing a game action.
 */
export interface ActionResult {
  /** Whether the action was successful */
  success: boolean;

  /** Updated game state */
  state: GameState;

  /** Error message if action failed */
  error?: string;

  /** Additional metadata about the action processing */
  metadata?: ActionMetadata;
}

// ================================
// Metadata & Utilities
// ================================

/**
 * Metadata attached to the game state.
 */
export interface GameMetadata {
  /** When the game was created */
  createdAt: number;

  /** When the state was last updated */
  updatedAt: number;

  /** When the current turn started */
  turnStartedAt: number;

  /** Total number of actions processed */
  actionCount: number;
}

/**
 * Metadata attached to action results.
 */
export interface ActionMetadata {
  /** Time taken to process the action */
  processingTime?: number;

  /** List of state changes made */
  stateChanges?: string[];
}

/**
 * Metadata attached to card instances.
 */
export interface CardMetadata {
  /** Turn number when the card was played */
  turnPlayed?: number;

  /** Original health value of the card */
  originalHealth?: number;

  /** Current modifiers affecting the card */
  modifiers?: CardModifier[];

  imageUrl?: string;

  createdAt?: number;
}

// ================================
// Enums & Constants
// ================================

/** Possible game statuses */
export type GameStatus =
  | "initializing"
  | "waiting"
  | "playing"
  | "paused"
  | "finished";

/** Possible game phases */
export type GamePhase = "setup" | "draw" | "main" | "combat" | "end";

/** Available card types */
export type CardType = "unit" | "spell" | "artifact";

/** Possible card effect targets */
export type EffectTarget = "self" | "opponent" | "all" | "random";

/** Possible card modifiers */
export type CardModifier = "frozen" | "buffed" | "debuffed";

/**
 * Result of a validation check.
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Callback for state changes.
 */
export type StateChangeCallback = (state: GameState) => void;

/**
 * Engine configuration options.
 */
export interface EngineOptions {
  /** Whether to enable debug logging */
  enableLogging?: boolean;

  /** Whether to validate all actions */
  validateActions?: boolean;

  /** Time limit for turns in milliseconds */
  turnTimeLimit?: number;

  /** Callback for state changes */
  onStateChange?: StateChangeCallback;

  /** Callback for errors */
  onError?: (error: Error) => void;
}

export interface Engine {
  /** Process a game action */
  processAction(action: GameAction): Promise<ActionResult>;

  /** Get current game state */
  getState(): Readonly<GameState>;

  /** Initialize a new game */
  initializeGame(playerIds: PlayerId[]): Promise<ActionResult>;

  /** Subscribe to state changes */
  subscribe(callback: StateChangeCallback): () => void;

  /** Clean up engine resources */
  cleanup(): void;
}
