import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import "../../styles/scroll-area.css";

export const ScrollArea = React.forwardRef((props, ref) => {
  const { className = "", children, ...rest } = props;

  return (
    <ScrollAreaPrimitive.Root ref={ref} className={`sa-root ${className}`} {...rest}>
      <ScrollAreaPrimitive.Viewport className="sa-viewport">
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar />

      <ScrollAreaPrimitive.Corner className="sa-corner" />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = "ScrollArea";

export const ScrollBar = React.forwardRef((props, ref) => {
  const { orientation = "vertical", className = "", ...rest } = props;

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={`sa-scrollbar ${orientation === "vertical" ? "vertical" : "horizontal"} ${className}`}
      {...rest}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="sa-thumb" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = "ScrollBar";
