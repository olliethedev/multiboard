import { useQueryState, parseAsJson } from "nuqs";
import { z } from "zod";
import { useCallback } from "react";

const VALID_MODAL_TYPES = [
  "add-board",
  "edit-board",
  "delete-board",
  "add-column",
  "edit-column",
  "delete-column",
  "add-task",
  "edit-task",
  "delete-task",
] as const;

export interface QueryModalState {
  openModalType?: (typeof VALID_MODAL_TYPES)[number];
  selectedColumnId?: string;
  selectedTaskId?: string;
}

const modalStateSchema = z.object({
  openModalType: z.enum(VALID_MODAL_TYPES).optional(),
  selectedColumnId: z.string().optional(),
  selectedTaskId: z.string().optional(),
});

const defaultModalState: QueryModalState = {
  openModalType: undefined,
  selectedColumnId: undefined,
  selectedTaskId: undefined,
};

const modalStateParser = parseAsJson(modalStateSchema.parse)
  .withDefault(defaultModalState)
  .withOptions({
    throttleMs: 200,
  });

export function useModalQuery() {
  const [modalState, setModalState] = useQueryState("modalState", modalStateParser);

  const closeQueryModal = useCallback(() => {
    setModalState(prevState => ({ ...prevState, openModalType: undefined, selectedColumnId: undefined, selectedTaskId: undefined }));
  }, [setModalState]);

  const openAddBoardModal = useCallback(() => {
    setModalState(prevState => ({ ...prevState, openModalType: "add-board" }));
  }, [setModalState]);

  const openEditBoardModal = useCallback(() => {
    setModalState(prevState => ({ ...prevState, openModalType: "edit-board" }));
  }, [setModalState]);

  const openDeleteBoardModal = useCallback(() => {
    setModalState(prevState => ({ ...prevState, openModalType: "delete-board" }));
  }, [setModalState]);

  const openAddColumnModal = useCallback((columnId: string) => {
    setModalState(prevState => ({ ...prevState, openModalType: "add-column", selectedColumnId: columnId }));
  }, [setModalState]);

  const openEditColumnModal = useCallback((columnId: string) => {
    setModalState(prevState => ({ ...prevState, openModalType: "edit-column", selectedColumnId: columnId }));
  }, [setModalState]);

  const openDeleteColumnModal = useCallback((columnId: string) => {
    setModalState(prevState => ({ ...prevState, openModalType: "delete-column", selectedColumnId: columnId }));
  }, [setModalState]);

  const openAddTaskModal = useCallback((columnId: string) => {
    setModalState(prevState => ({ ...prevState, openModalType: "add-task", selectedColumnId: columnId }));
  }, [setModalState]);

  const openEditTaskModal = useCallback((columnId: string, taskId: string) => {
    setModalState(prevState => ({ ...prevState, openModalType: "edit-task", selectedColumnId: columnId, selectedTaskId: taskId }));
  }, [setModalState]);

  const openDeleteTaskModal = useCallback((columnId: string, taskId: string) => {
    setModalState(prevState => ({ ...prevState, openModalType: "delete-task", selectedColumnId: columnId, selectedTaskId: taskId }));
  }, [setModalState]);

  return {
    modalState,
    closeQueryModal,
    openAddBoardModal,
    openEditBoardModal,
    openDeleteBoardModal,
    openAddColumnModal,
    openEditColumnModal,
    openDeleteColumnModal,
    openAddTaskModal,
    openEditTaskModal,
    openDeleteTaskModal,
  };
}
