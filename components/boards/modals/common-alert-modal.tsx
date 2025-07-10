"use client";

import { useCallback } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QueryModalState, useModalQuery } from "@/lib/use-modal-query";


interface CommonAlertModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  modalType?: QueryModalState["openModalType"];
}

export function CommonAlertModal({
  title,
  description,
  children,
  modalType,
}: CommonAlertModalProps) {
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
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
} 