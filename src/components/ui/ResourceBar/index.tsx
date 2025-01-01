import { component$ } from "@builder.io/qwik";
import { clsx } from "clsx";
import styles from "./ResourceBar.module.css";

export interface ResourceBarProps {
  current: number;
  max: number;
  class?: string;
}

/**
 * Resource indicator component for displaying available/used resources
 */
export const ResourceBar = component$<ResourceBarProps>(
  ({ current, max, class: className }) => {
    return (
      <div class={clsx(styles.container, className)}>
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            class={clsx(styles.resource, i < current && styles.active)}
          />
        ))}
        <span class={styles.count}>
          {current}/{max}
        </span>
      </div>
    );
  },
);
