import { component$, PropFunction } from "@builder.io/qwik";
import clsx from "clsx";
import type { Card, CardId } from "../../../types/core";
import { GameCard } from "../GameCard";
import styles from "./PlayerHand.module.css";

interface PlayerHandProps {
  cards: Card[];
  canPlay: boolean;
  onPlayCard$?: PropFunction<(cardId: CardId) => void>;
  className?: string;
}

export const PlayerHand = component$<PlayerHandProps>(
  ({ cards, canPlay, onPlayCard$, className }) => {
    return (
      <div class={clsx(styles.container, className)}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            class={styles.cardSlot}
            style={{
              transform: `rotate(${(index - cards.length / 2) * 5}deg)`,
            }}
          >
            <GameCard
              card={card}
              isPlayable={canPlay}
              onClick$={(cardId) => {
                if (canPlay && onPlayCard$) {
                  onPlayCard$(cardId as CardId);
                }
              }}
            />
          </div>
        ))}
      </div>
    );
  },
);
