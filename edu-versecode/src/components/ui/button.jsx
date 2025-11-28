import React from "react";

const Button = React.forwardRef(
  ({ variant = "default", size = "default", asChild = false, className = "", ...props }, ref) => {
    const Comp = asChild ? "span" : "button";

    return (
      <>
        <style>{`
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            white-space: nowrap;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
            cursor: pointer;
          }

          .btn:disabled {
            opacity: 0.5;
            pointer-events: none;
          }

          /* === VARIANTS === */

          .btn-default {
            background: var(--primary);
            color: var(--primary-foreground);
          }
          .btn-default:hover {
            background: var(--primary-hover, rgba(0,0,0,0.1));
          }

          .btn-destructive {
            background: var(--destructive);
            color: var(--destructive-foreground);
          }
          .btn-destructive:hover {
            background: var(--destructive-hover);
          }

          .btn-outline {
            border: 1px solid var(--input);
            background: var(--background);
          }
          .btn-outline:hover {
            background: var(--accent);
            color: var(--accent-foreground);
          }

          .btn-secondary {
            background: var(--secondary);
            color: var(--secondary-foreground);
          }
          .btn-secondary:hover {
            background: var(--secondary-hover);
          }

          .btn-ghost {
            background: transparent;
          }
          .btn-ghost:hover {
            background: var(--accent);
            color: var(--accent-foreground);
          }

          .btn-link {
            background: transparent;
            color: var(--primary);
            text-decoration: underline;
            text-underline-offset: 4px;
          }
          .btn-link:hover {
            opacity: 0.8;
          }

          /* === SIZES === */

          .btn-size-default {
            height: 40px;
            padding: 0 16px;
          }

          .btn-size-sm {
            height: 36px;
            padding: 0 12px;
            border-radius: 6px;
          }

          .btn-size-lg {
            height: 44px;
            padding: 0 32px;
            border-radius: 6px;
          }

          .btn-size-icon {
            height: 40px;
            width: 40px;
            padding: 0;
          }
        `}</style>

        <Comp
          ref={ref}
          className={`btn btn-${variant} btn-size-${size} ${className}`}
          {...props}
        />
      </>
    );
  }
);

Button.displayName = "Button";

export { Button };
