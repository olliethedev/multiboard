import {
  AutoFormInputComponentProps,
  FieldConfig,
} from "@/components/ui/auto-form/types";
import {
  TaskCreateSchema,
  TaskUpdateSchema,
} from "@zenstackhq/runtime/zod/models";
import { Check, Copy, MoreVertical, Share, Trash2 } from "lucide-react";
import { Column, Priority, Task, User } from "@zenstackhq/runtime/models";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchSelect from "@/components/search-select";
import { useMemo, memo, useState } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useActiveOrganization, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/model/task";
import { FIND_UNIQUE_BOARD } from "@/lib/constants";
import { useFindUniqueBoard } from "@/hooks/model/board";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ColumnWithTasks = Column & {
  tasks: (Task & {
    assignee: User | null;
  })[];
};

type AddTaskFormProps = {
  columnId: string;
  boardId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const addTaskFormPropsAreEqual = (
  prevProps: AddTaskFormProps,
  nextProps: AddTaskFormProps
): boolean => {
  if (prevProps.columnId !== nextProps.columnId) return false;
  if (prevProps.boardId !== nextProps.boardId) return false;

  if (prevProps.onClose !== nextProps.onClose) return false;
  if (prevProps.onSuccess !== nextProps.onSuccess) return false;

  return true;
};

const AddTaskFormComponent = ({
  columnId,
  boardId,
  onClose,
  onSuccess,
}: AddTaskFormProps) => {
  const schema = useMemo(() => {
    return TaskCreateSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      isArchived: true,
      completedAt: true,
      order: true,
    }).extend({
      columnId: z.string().default(columnId),
      priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    });
  }, [columnId]);

  const { columns, existingTasks } = useTaskFormData({ boardId, columnId });

  const memberOptions = useMemberOptions();

  const config = useMemo(() => {
    return createTaskFieldConfig(columns || [], memberOptions);
  }, [columns, memberOptions]);

  const {
    mutateAsync: createTask,
    isPending: isCreatingTask,
    error: createTaskError,
  } = useCreateTask({ optimisticUpdate: false });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const nextOrder =
      existingTasks && existingTasks.length > 0
        ? Math.max(...existingTasks.map((task) => task.order)) + 1
        : 0;
    await createTask({
      data: {
        title: data.title!,
        description: data.description,
        priority: data.priority!,
        assigneeId: data.assigneeId || null,
        columnId,
        order: nextOrder,
      },
    });
    toast.success("Task created successfully");
    onSuccess();
  };

  return (
    <AutoForm
      className="space-y-2 first:*:grid first:*:grid-cols-2 first:*:gap-x-4"
      formSchema={schema}
      fieldConfig={config}
      onSubmit={onSubmit}
    >
      {createTaskError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {createTaskError?.message ||
            `Failed to create task. Please try again.`}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isCreatingTask}>
          {isCreatingTask ? "Creating..." : "Create Task"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isCreatingTask}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
};

export const AddTaskForm = memo(AddTaskFormComponent, addTaskFormPropsAreEqual);

type EditTaskFormProps = {
  columnId: string;
  boardId: string;
  taskId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const editTaskFormPropsAreEqual = (
  prevProps: EditTaskFormProps,
  nextProps: EditTaskFormProps
): boolean => {
  if (prevProps.columnId !== nextProps.columnId) return false;
  if (prevProps.boardId !== nextProps.boardId) return false;
  if (prevProps.taskId !== nextProps.taskId) return false;

  if (prevProps.onClose !== nextProps.onClose) return false;
  if (prevProps.onSuccess !== nextProps.onSuccess) return false;

  return true;
};

const EditTaskFormComponent = ({
  columnId,
  boardId,
  taskId,
  onClose,
  onSuccess,
}: EditTaskFormProps) => {
  const { columns, task } = useTaskFormData({ boardId, columnId, taskId });

  const initialData = useMemo(() => {
    if (!task) return {};
    return {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      columnId: task.columnId,
      assigneeId: task.assigneeId || "",
    };
  }, [task]);

  const schema = useMemo(() => {
    return TaskUpdateSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      isArchived: true,
      completedAt: true,
      order: true,
    }).extend({
      columnId: z.string().default(columnId),
      priority: z
        .nativeEnum(Priority)
        .default(task?.priority || Priority.MEDIUM),
    });
  }, [columnId, task?.priority]);

  const memberOptions = useMemberOptions();

  const config = useMemo(() => {
    return createTaskFieldConfig(columns || [], memberOptions);
  }, [columns, memberOptions]);

  const {
    mutateAsync: updateTask,
    isPending: isUpdatingTask,
    error: updateTaskError,
  } = useUpdateTask({ optimisticUpdate: false });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await updateTask({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        columnId: data.columnId,
        assigneeId: data.assigneeId || null,
      },
    });
    toast.success("Task updated successfully");
    onSuccess();
  };

  return (
    <AutoForm
      className="space-y-2 first:*:grid first:*:grid-cols-2 first:*:gap-x-4"
      formSchema={schema}
      fieldConfig={config}
      values={initialData}
      onSubmit={onSubmit}
    >
      {updateTaskError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {updateTaskError?.message ||
            `Failed to update task. Please try again.`}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isUpdatingTask}>
          {isUpdatingTask ? "Updating..." : "Update Task"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpdatingTask}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
};

export const EditTaskForm = memo(
  EditTaskFormComponent,
  editTaskFormPropsAreEqual
);

type EditTaskActionsProps = {
  taskId: string;
  onSuccess: () => void;
};

export function EditTaskActions({ taskId, onSuccess }: EditTaskActionsProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    mutateAsync: deleteTask,
    isPending: isDeletingTask,
    error: deleteTaskError,
  } = useDeleteTask({
    optimisticUpdate: false,
  });

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        where: { id: taskId },
      });
      toast.success("Task deleted successfully");
      onSuccess();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Task</DialogTitle>
            <DialogDescription>
              Copy the link below to share this task with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={currentUrl}
                readOnly
                className="h-9"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={handleCopyUrl}
            >
              <span className="sr-only">Copy</span>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTaskError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {deleteTaskError.message ||
                "Failed to delete task. Please try again."}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingTask}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={isDeletingTask}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingTask ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function createTaskFieldConfig(
  columns: ColumnWithTasks[],
  memberOptions: {
    label: string;
    value: string;
  }[]
) {
  const config: FieldConfig<
    z.infer<typeof TaskCreateSchema> | z.infer<typeof TaskUpdateSchema>
  > = {
    title: {
      order: 0,
      inputProps: {
        placeholder: "e.g., Fix login bug",
      },
      renderParent: ({ children }) => (
        <div className="col-span-2">{children}</div>
      ),
    },
    priority: {
      inputProps: {
        className: "w-full",
      },
    },
    description: {
      order: 3,
      fieldType: ({
        isRequired,
        field,
        fieldConfigItem,
        fieldProps,
      }: AutoFormInputComponentProps) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Description
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <MinimalTiptapEditor
              className="min-h-40 max-w-full"
              immediatelyRender={false}
              throttleDelay={1000}
              output="markdown"
              editable={true}
              value={field.value}
              editorClassName="focus:outline-none px-4 py-2 min-h-40 h-full"
              onChange={(content) => {
                if (typeof content === "string") {
                  field.onChange(content);
                } else {
                  console.warn("Tiptap content is not a string");
                }
              }}
              {...fieldProps}
            />
          </FormControl>
          {fieldConfigItem?.description && (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
          )}
        </FormItem>
      ),
      renderParent: ({ children }) => (
        <div className="col-span-2">{children}</div>
      ),
    },
    assigneeId: {
      order: 2,
      fieldType: ({
        isRequired,
        field,
        fieldConfigItem,
      }: AutoFormInputComponentProps) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Assign to
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <SearchSelect
              options={memberOptions}
              value={field.value || ""}
              onChange={(value) => field.onChange(value)}
              placeholder="Select member"
              emptyMessage="No member found."
            />
          </FormControl>
          {fieldConfigItem?.description && (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
          )}
        </FormItem>
      ),
      renderParent: ({ children }) => (
        <div className="col-span-2">{children}</div>
      ),
    },
    columnId: {
      order: 1,
      fieldType: ({
        isRequired,
        field,
        fieldConfigItem,
      }: AutoFormInputComponentProps) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Column
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldConfigItem?.description && (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
          )}
        </FormItem>
      ),
    },
  };

  return config;
}

function useMemberOptions() {
  const { data: activeOrganization } = useActiveOrganization();
  const { data: session } = useSession();

  const orgCompKey = activeOrganization?.members
    ?.map((m) => `${m.user.id}:${m.user.name}`)
    .join(",");

  const memberOptions = useMemo(() => {
    const currentUserId = session?.user?.id;
    const currentUserName = session?.user?.name;
    const members = activeOrganization?.members;

    const memberOptionsArray: { label: string; value: string }[] = members
      ? members.map((member) => ({
          label:
            member.user.id === currentUserId
              ? `${member.user.name} (you)`
              : member.user.name,
          value: member.user.id,
        }))
      : [
          {
            label: `${currentUserName || ""} (you)`,
            value: currentUserId || "",
          },
        ];
    memberOptionsArray.unshift({
      label: "Unassigned",
      value: "",
    });
    return memberOptionsArray.sort((a, b) => a.label.localeCompare(b.label));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgCompKey, session?.user?.id, session?.user?.name]);

  return memberOptions;
}

// Stable query options to prevent unnecessary rerenders
const BOARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
} as const;

function useTaskFormData({
  boardId,
  columnId,
  taskId,
}: {
  boardId: string;
  columnId: string;
  taskId?: string;
}) {
  const { data: board } = useFindUniqueBoard(
    FIND_UNIQUE_BOARD(boardId),
    BOARD_QUERY_OPTIONS
  );

  const columns = useMemo(() => board?.columns, [board?.columns]);

  const existingTasks = useMemo(
    () => columns?.find((column) => column.id === columnId)?.tasks,
    [columns, columnId]
  );

  const task = useMemo(
    () => (taskId ? existingTasks?.find((task) => task.id === taskId) : null),
    [taskId, existingTasks]
  );

  return { columns, existingTasks, task };
}
