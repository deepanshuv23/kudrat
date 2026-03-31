/* eslint-disable @next/next/no-img-element */
import { DownloadJPEG } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ResponsiveDrawerDialog } from "./ui/responsive-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ImagePreviewProps {
  trigger?: React.ReactNode;
  jpegString: string;
  imageAlt?: string;
  description?: string;
  dateTime?: Date;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  extraDetails?: Record<string, string>;
}

export default function ImagePreview({
  trigger,
  description = "Image preview",
  imageAlt,
  jpegString,
  dateTime = new Date(),
  onOpenChange,
  open,
  extraDetails,
}: ImagePreviewProps) {
  return (
    <ResponsiveDrawerDialog
      open={open}
      trigger={trigger}
      onOpenChange={onOpenChange}
      dialogContent={
        <>
          <DialogHeader>
            <DialogTitle>Preview Image</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <img
            className="h-full w-full object-contain"
            src={`data:image/jpeg;base64,${jpegString}`}
            alt={imageAlt}
          />
          <DialogFooter className="pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mr-auto" variant="secondary">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80dvh] bg-popover">
                <DialogHeader>
                  <DialogTitle>Image Details</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Table divClassName="max-h-[50dvh] overflow-auto">
                  <TableHeader className="sticky top-0 bg-popover">
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-auto">
                    {extraDetails ? (
                      Object.entries(extraDetails).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <div>No extra details</div>
                    )}
                  </TableBody>
                </Table>
                <DialogFooter className="pt-2">
                  <DialogClose>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() =>
                DownloadJPEG(jpegString, dateTime.toLocaleString())
              }
              variant="default"
            >
              Download
            </Button>
            <DialogClose>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </>
      }
      drawerContent={
        <>
          <DrawerHeader className="text-left">
            <DrawerTitle>Preview Image</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <img
            className="h-full w-full object-contain"
            src={`data:image/jpeg;base64,${jpegString}`}
            alt={imageAlt}
          />
          <DrawerFooter className="pt-2">
            <Drawer>
              <DrawerTrigger>
                <Button className="w-full" variant="secondary">
                  View Details
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Image Details</DrawerTitle>
                  <DrawerDescription>
                    {description}
                  </DrawerDescription>
                </DrawerHeader>
                <Table divClassName="max-h-[50dvh] overflow-auto">
                  <TableHeader className="sticky top-0 bg-popover">
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-auto">
                    {extraDetails ? (
                      Object.entries(extraDetails).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <div>No extra details</div>
                    )}
                  </TableBody>
                </Table>
                <DrawerFooter>
                  <DrawerClose>
                    <Button className="w-full" variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Button
              onClick={() =>
                DownloadJPEG(jpegString, dateTime.toLocaleString())
              }
              variant="default"
            >
              Download
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </>
      }
    />
  );
}
