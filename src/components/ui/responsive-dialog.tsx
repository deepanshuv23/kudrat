import { useMediaQuery } from "~/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { useState } from "react";

interface ResponsiveDrawerDialogProps {
  trigger: React.ReactNode;
  dialogContent: React.ReactNode;
  drawerContent: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResponsiveDrawerDialog(props: ResponsiveDrawerDialogProps) {
  const [open, setOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={props.open ?? open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent className="bg-popover">
          {props.dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.open ?? open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent>{props.drawerContent}</DrawerContent>
    </Drawer>
  );
}
