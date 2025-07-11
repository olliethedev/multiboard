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
  actions?: React.ReactNode;
}

export function CommonModal({
  title,
  description,
  children,
  modalType,
  actions,
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
      <DialogContent className="sm:max-w-[600px] overflow-x-hidden overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title} {actions}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
