import { component$, type PropFunction } from "@builder.io/qwik";
import clsx from "clsx";
import { CardId, GameState, PlayerId } from "../../../types/core";
import { GameField } from "../GameField";
import { PlayerArea } from "../PlayerArea";
import styles from "./GameBoard.module.css";

interface GameBoardProps {
  state: GameState;
  playerId: PlayerId;
  className?: string;
  onPlayCard$?: PropFunction<(cardId: CardId) => void>;
  onSelectCard$?: PropFunction<(cardId: CardId) => void>;
}

export const GameBoard = component$<GameBoardProps>(
  ({ state, playerId, className, onPlayCard$, onSelectCard$ }) => {
    const player = state.players[playerId];
    const opponent =
      state.players[
        Object.keys(state.players).find((id) => id !== playerId) as PlayerId
      ];

    const isPlayerTurn = state.currentPlayer === playerId;

    return (
      <div class={clsx(styles.container, className)}>
        <PlayerArea player={opponent} isOpponent={true} canAct={false} />

        <GameField
          playerField={player.field}
          opponentField={opponent.field}
          canAttack={isPlayerTurn}
          onSelectCard$={onSelectCard$}
        />

        <PlayerArea
          player={player}
          isOpponent={false}
          canAct={isPlayerTurn}
          onPlayCard$={onPlayCard$}
        />
      </div>
    );
  },
);
