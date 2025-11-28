import React from "react";

/* ------------------------------------------
   STYLES (Included inside same file)
------------------------------------------- */
const styles = `
/* ===== Avatar ===== */

.avatar-root {
  position: relative;
  display: flex;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--muted);
  width: 100%;
  height: 100%;
  border-radius: 50%;
}


/* ===== Badge ===== */

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.badge-default {
  background: var(--primary);
  color: var(--primary-foreground);
}
.badge-default:hover {
  background: var(--primary-hover, rgba(0,0,0,0.1));
}

.badge-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
}
.badge-secondary:hover {
  background: var(--secondary-hover);
}

.badge-destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
}
.badge-destructive:hover {
  background: var(--destructive-hover);
}

.badge-outline {
  border-color: var(--foreground);
  color: var(--foreground);
}


/* ===== Card ===== */

.card {
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--card-foreground);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 6px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.1;
}

.card-description {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.card-content {
  padding: 24px;
  padding-top: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  padding: 24px;
  padding-top: 0;
}
`;

/* ------------------------------------------
   COMPONENTS
------------------------------------------- */

/* ===== Avatar ===== */
export const Avatar = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`avatar-root ${className}`} {...props} />;
});
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef(({ className = "", ...props }, ref) => {
  return <img ref={ref} className={`avatar-image ${className}`} {...props} />;
});
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`avatar-fallback ${className}`} {...props} />;
});
AvatarFallback.displayName = "AvatarFallback";

/* ===== Badge ===== */
export function Badge({ variant = "default", className = "", ...props }) {
  return <div className={`badge badge-${variant} ${className}`} {...props} />;
}

/* ===== Card ===== */
export const Card = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card ${className}`} {...props} />;
});
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card-header ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`card-title ${className}`} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`card-description ${className}`} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card-content ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card-footer ${className}`} {...props} />
));
CardFooter.displayName = "CardFooter";

/* ===== Inject CSS once ===== */
export default function InjectUIStyles() {
  return <style>{styles}</style>;
}
