import React from "react";

/* ===========================================================
   Inline CSS — replaces all Tailwind & shadcn classes
   =========================================================== */
const styles = `
/* ===== Label ===== */
.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  color: var(--foreground);
  margin-bottom: 4px;
  display: inline-block;
}

.form-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== Shared Input Styling ===== */
.form-input,
.form-textarea {
  width: 100%;
  border: 1px solid var(--input);
  background: var(--background);
  color: var(--foreground);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--muted-foreground);
}

/* Focus ring */
.form-input:focus,
.form-textarea:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}

/* Disabled */
.form-input:disabled,
.form-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== Input (height-specific) ===== */
.form-input {
  height: 40px;
  display: flex;
  align-items: center;
}

/* ===== Textarea (multi-line) ===== */
.form-textarea {
  min-height: 80px;
  resize: vertical;
}
`;

/* ===========================================================
   COMPONENTS
   =========================================================== */

/* ===== Label ===== */
export const Label = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <>
      <style>{styles}</style>
      <label ref={ref} className={`form-label ${className}`} {...props} />
    </>
  );
});
Label.displayName = "Label";

/* ===== Input ===== */
export const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <>
      <style>{styles}</style>
      <input
        ref={ref}
        type={type}
        className={`form-input ${className}`}
        {...props}
      />
    </>
  );
});
Input.displayName = "Input";

/* ===== Textarea ===== */
export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <>
      <style>{styles}</style>
      <textarea
        ref={ref}
        className={`form-textarea ${className}`}
        {...props}
      />
    </>
  );
});
Textarea.displayName = "Textarea";
