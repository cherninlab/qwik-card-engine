import { component$, PropFunction } from "@builder.io/qwik";
import { clsx } from "clsx";
import type { CardId, Card as GameCardType } from "../../../types/core";
import styles from "./GameCard.module.css";

export interface CardProps {
  /**
   * The card data from your game domain (with cost, power, health, etc.)
   */
  card: GameCardType;

  /**
   * Whether the card is playable (for highlighting or enabling interactions).
   */
  isPlayable?: boolean;

  /**
   * Whether the card can be attacked (for a different highlight or style).
   */
  isAttackable?: boolean;

  /**
   * If the card is disabled, we skip the onClick action.
   */
  isDisabled?: boolean;

  /**
   * Called when user clicks the card, passing the card's ID.
   */
  onClick$?: PropFunction<(cardId: CardId) => void>;

  /**
   * Optional className for further styling.
   */
  className?: string;
}

/**
 * A single unified Card component for your game.
 * Renders cost, (optionally) name, power, health, etc.
 */
export const GameCard = component$<CardProps>((props) => {
  const { card, isPlayable, isAttackable, isDisabled, onClick$, className } =
    props;

  // Condition for clickable interactions
  const canInteract = !isDisabled && (isPlayable || isAttackable);

  return (
    <div
      class={clsx(
        styles.card,
        canInteract && (isPlayable ? styles.playable : null),
        canInteract && (isAttackable ? styles.attackable : null),
        isDisabled && styles.disabled,
        className,
      )}
      onClick$={() => {
        if (canInteract) {
          onClick$?.(card.id);
        }
      }}
    >
      {/* Cost in top-left corner */}
      <div class={styles.cost}>{card.cost}</div>

      {/* Main content area */}
      <div class={styles.content}>
        {/* If the card has an image, display it. Otherwise, could show name or placeholder */}
        {card.metadata?.imageUrl ? (
          <div class={styles.image}>
            <img
              src={card.metadata.imageUrl}
              alt={card.name}
              width="100"
              height="100"
            />
          </div>
        ) : (
          <div class={styles.name}>{card.name}</div>
        )}
      </div>

      {/* Bottom stats row */}
      <div class={styles.stats}>
        {card.power !== undefined && (
          <div class={clsx(styles.stat, styles.power)}>{card.power}</div>
        )}
        {card.health !== undefined && (
          <div class={clsx(styles.stat, styles.health)}>{card.health}</div>
        )}
      </div>
    </div>
  );
});
