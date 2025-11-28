import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { X, Check, Circle } from "lucide-react";
import "../../styles/overlay.css";

/* ---------------------------
   Dialog (Radix wrappers)
   --------------------------- */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef(({ className = "", ...props }, ref) => {
  return <DialogPrimitive.Overlay ref={ref} className={`dialog-overlay ${className}`} {...props} />;
});
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={`dialog-content ${className}`} {...props}>
        {children}
        <DialogPrimitive.Close className="dialog-close">
          <X className="icon" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className = "", ...props }) => (
  <div className={`dialog-header ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className = "", ...props }) => (
  <div className={`dialog-footer ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={`dialog-title ${className}`} {...props} />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={`dialog-desc ${className}`} {...props} />
));
DialogDescription.displayName = "DialogDescription";

/* ---------------------------
   Dropdown (Radix wrappers)
   --------------------------- */
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuSubTrigger = React.forwardRef(({ className = "", inset, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={`dropdown-subtrigger ${inset ? "inset" : ""} ${className}`}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSubContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent ref={ref} className={`dropdown-subcontent ${className}`} {...props} />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export const DropdownMenuContent = React.forwardRef(({ className = "", sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset} className={`dropdown-content ${className}`} {...props} />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef(({ className = "", inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} className={`dropdown-item ${inset ? "inset" : ""} ${className}`} {...props} />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuCheckboxItem = React.forwardRef(({ className = "", children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem ref={ref} className={`dropdown-checkbox ${className}`} checked={checked} {...props}>
    <span className="dropdown-indicator">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="icon" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuRadioItem = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={`dropdown-radio ${className}`} {...props}>
    <span className="dropdown-indicator">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="icon-small" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export const DropdownMenuLabel = React.forwardRef(({ className = "", inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} className={`dropdown-label ${inset ? "inset" : ""} ${className}`} {...props} />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = React.forwardRef(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={`dropdown-sep ${className}`} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuShortcut = ({ className = "", ...props }) => <span className={`dropdown-shortcut ${className}`} {...props} />;
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

/* ---------------------------
   Tooltip (Radix wrappers)
   --------------------------- */
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef(({ className = "", sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={`tooltip-content ${className}`} {...props} />
));
TooltipContent.displayName = "TooltipContent";
