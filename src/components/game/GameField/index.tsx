import { component$, PropFunction } from "@builder.io/qwik";
import clsx from "clsx";
import type { Card, CardId } from "../../../types/core";
import { GameCard } from "../GameCard";
import styles from "./GameField.module.css";

interface GameFieldProps {
  playerField: Card[];
  opponentField: Card[];
  canAttack: boolean;
  onSelectCard$?: PropFunction<(cardId: CardId) => void>;
  className?: string;
}

export const GameField = component$<GameFieldProps>(
  ({ playerField, opponentField, canAttack, onSelectCard$, className }) => {
    return (
      <div class={clsx(styles.container, className)}>
        <div class={styles.field}>
          {/* Opponent's field */}
          <div class={styles.opponentField}>
            {opponentField.map((card) => (
              <GameCard
                key={card.id}
                card={card}
                isAttackable={canAttack}
                onClick$={(cardId) => {
                  if (canAttack && onSelectCard$) {
                    onSelectCard$(cardId as CardId);
                  }
                }}
              />
            ))}
          </div>

          {/* Player's field */}
          <div class={styles.playerField}>
            {playerField.map((card) => (
              <GameCard
                key={card.id}
                card={card}
                onClick$={(cardId) => {
                  if (canAttack && onSelectCard$) {
                    onSelectCard$(cardId as CardId);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);
