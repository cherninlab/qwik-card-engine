import { component$ } from "@builder.io/qwik";
import { clsx } from "clsx";
import styles from "./Loader.module.css";

export interface LoaderProps {
  /** Size of the loader */
  size?: "sm" | "md" | "lg";
  /** Optional class name for custom styling */
  class?: string;
}

/**
 * Loading spinner component for indicating loading states
 * Can be used in buttons, cards, or any other component
 */
export const Loader = component$<LoaderProps>(
  ({ size = "md", class: className }) => {
    return (
      <div
        class={clsx(styles.loader, styles[size], className)}
        role="status"
        aria-label="Loading"
      >
        <div class={styles.spinner}></div>
      </div>
    );
  },
);
