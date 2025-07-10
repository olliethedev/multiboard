import { useCallback } from "react";
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { QueryModalState, useModalQuery } from "@/lib/use-modal-query";


interface CommonModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  modalType?: QueryModalState["openModalType"];
}

export function CommonModal({
  title,
  description,
  children,
  modalType,
}: CommonModalProps) {
  const { modalState, closeQueryModal } = useModalQuery();

  const isOpen = modalState.openModalType === modalType;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // Modal is being closed via context - reset the modal type
        closeQueryModal();
      }
    },
    [closeQueryModal]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
