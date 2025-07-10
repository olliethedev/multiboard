import { CommonModal } from "@/components/boards/modals/common-modal";
import { CommonAlertModal } from "@/components/boards/modals/common-alert-modal";
import { useModalQuery } from "@/lib/use-modal-query";
import { AddBoardForm } from "@/components/boards/forms/add-board-form";
import { DeleteBoardForm } from "@/components/boards/forms/delete-board-form";
import { EditBoardForm } from "@/components/boards/forms/edit-board-form";
import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AddColumnForm } from "@/components/boards/forms/add-column-form";
import { DeleteColumnForm } from "@/components/boards/forms/delete-column-form";
import { EditColumnForm } from "@/components/boards/forms/edit-column-form";

type ModalConfig = {
  title: string;
  description: string;
  requiresBoardId?: boolean;
  requiresColumnId?: boolean;
  requiresTaskId?: boolean;
  isAlert?: boolean;
  component: (props: {
    onClose: () => void;
    onSuccess: (param?: string) => void;
    boardId?: string;
    columnId?: string;
  }) => React.ReactElement;
};

const modalConfigs: Record<string, ModalConfig> = {
  "add-board": {
    title: "Add Board",
    description: "Add a new board to your organization.",
    component: ({ onClose, onSuccess }) => (
      <AddBoardForm onClose={onClose} onSuccess={onSuccess} />
    ),
  },
  "edit-board": {
    title: "Edit Board",
    description: "Edit the board.",
    requiresBoardId: true,
    component: ({ onClose, boardId }) => (
      <EditBoardForm onClose={onClose} onSuccess={onClose} boardId={boardId!} />
    ),
  },
  "delete-board": {
    title: "Delete Board",
    description:
      "Are you sure you want to delete this board? This action cannot be undone. All columns and tasks in this board will be permanently removed.",
    requiresBoardId: true,
    isAlert: true,
    component: ({ onClose, onSuccess, boardId }) => (
      <DeleteBoardForm
        boardId={boardId!}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    ),
  },
  "add-column": {
    title: "Add Column",
    description: "Add a new column to the board.",
    requiresBoardId: true,
    component: ({ onClose, boardId }) => (
      <AddColumnForm onClose={onClose} onSuccess={onClose} boardId={boardId!} />
    ),
  },
  "edit-column": {
    title: "Edit Column",
    description: "Edit the column.",
    requiresColumnId: true,
    component: ({ onClose, columnId }) => (
      <EditColumnForm columnId={columnId!} onClose={onClose} onSuccess={onClose} />
    ),
  },
  "delete-column": {
    title: "Delete Column",
    description:
      "Are you sure you want to delete this column? This action cannot be undone. All tasks in this column will be permanently removed.",
    requiresColumnId: true,
    isAlert: true,
    component: ({ onClose, columnId }) => (
      <DeleteColumnForm
        columnId={columnId!}
        onClose={onClose}
        onSuccess={onClose}
      />
    ),
  },
};

export function ModalsView() {
  const { modalState, closeQueryModal } = useModalQuery();
  const router = useRouter();

  const { slug: selectedBoardId } = useParams();

  const onAddBoardSuccess = useCallback(
    (boardId: string) => {
      router.push(`/boards/${boardId}`);
    },
    [router, closeQueryModal]
  );

  const onDeleteBoardSuccess = useCallback(() => {
    router.push("/boards");
  }, [router, closeQueryModal]);

  const closeModal = useCallback(() => {
    closeQueryModal();
  }, [closeQueryModal]);

  if (!modalState.openModalType) return null;

  const config = modalConfigs[modalState.openModalType];

  if (
    !config ||
    (config.requiresBoardId && !selectedBoardId) ||
    (config.requiresColumnId && !modalState.selectedColumnId) ||
    (config.requiresTaskId && !modalState.selectedTaskId)
  ) {
    return null;
  }

  const getSuccessCallback = () => {
    switch (modalState.openModalType) {
      case "add-board":
        return (param?: string) => {
          if (param) onAddBoardSuccess(param);
        };
      case "delete-board":
        return () => onDeleteBoardSuccess();

      default:
        return () => closeModal();
    }
  };

  const ModalWrapper = config.isAlert ? CommonAlertModal : CommonModal;

  return (
    <ModalWrapper
      modalType={modalState.openModalType}
      title={config.title}
      description={config.description}
    >
      {config.component({
        onClose: closeModal,
        onSuccess: getSuccessCallback(),
        boardId: selectedBoardId as string,
        columnId: modalState.selectedColumnId,
      })}
    </ModalWrapper>
  );
}
