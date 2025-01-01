import { component$, PropFunction } from "@builder.io/qwik";
import clsx from "clsx";
import type { CardId, PlayerState } from "../../../types/core";
import { PlayerHand } from "../PlayerHand";
import styles from "./PlayerArea.module.css";

interface PlayerAreaProps {
  player: PlayerState;
  isOpponent: boolean;
  canAct: boolean;
  onPlayCard$?: PropFunction<(cardId: CardId) => void>;
  className?: string;
}

export const PlayerArea = component$<PlayerAreaProps>(
  ({ player, isOpponent, canAct, onPlayCard$, className }) => {
    return (
      <div class={clsx(styles.container, className)}>
        <div class={styles.stats}>
          <div class={styles.health}>HP: {player.health}</div>
          <div class={styles.resources}>Coins: {player.resources.coin}</div>
        </div>

        {/* If this player is the local "actor," we can pass onPlayCard$ */}
        <PlayerHand
          cards={player.hand}
          canPlay={!isOpponent && canAct}
          onPlayCard$={onPlayCard$}
        />
      </div>
    );
  },
);
