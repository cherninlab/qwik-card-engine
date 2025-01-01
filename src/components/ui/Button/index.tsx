import { ButtonHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { clsx } from "clsx";
import { Loader } from "../Loader";
import styles from "./Button.module.css";

type ButtonVariant = "default" | "primary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Props interface extending HTML button attributes
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size variant of the button */
  size?: ButtonSize;
  /** Whether the button should take full width of its container */
  isFullWidth?: boolean;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional disabled state */
  isDisabled?: boolean;
}

/**
 * A reusable button component that follows Qwik's component patterns.
 * Supports different variants, sizes, and states while maintaining full type safety.
 *
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="md"
 *   onClick$={() => console.log('clicked')}
 * >
 *   Click Me
 * </Button>
 * ```
 */
export const Button = component$<ButtonProps>(
  ({
    variant = "default",
    size = "md",
    isFullWidth = false,
    isLoading = false,
    isDisabled = false,
    class: className,
    ...props
  }) => {
    return (
      <button
        {...props}
        disabled={isDisabled || isLoading}
        class={clsx(
          styles.button,
          styles[variant],
          styles[size],
          isFullWidth && styles.fullWidth,
          isLoading && styles.loading,
          isDisabled && styles.disabled,
          className,
        )}
      >
        {isLoading ? (
          <Loader
            size={size === "lg" ? "md" : "sm"}
            class={styles.buttonLoader}
          />
        ) : (
          <Slot />
        )}
      </button>
    );
  },
);
