import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { XCircle } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Failed({ open, setOpen }: Props) {
  const t = useTranslations("Cart.Failed");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] text-center flex flex-col gap-4 py-8">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <XCircle className="w-30 h-30 text-destructive" />
          <DialogTitle className="text-destructive text-xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
