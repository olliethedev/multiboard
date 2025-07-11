"use client";

import React from "react";
import { GripVertical, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Kanban from "@/components/ui/kanban";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column, Task, User } from "@zenstackhq/runtime/models";
import { useModalQuery } from "@/lib/use-modal-query";
import { UserAvatar } from "@daveyplate/better-auth-ui";
import { format } from "date-fns";

type ColumnWithTasks = Column & {
  tasks: (Task & {
    assignee: User | null;
  })[];
};

type Props = {
  column: ColumnWithTasks;
};

export const BoardColumnContent = React.memo(function BoardColumnContent({
  column,
}: Props) {
  const {
    openAddTaskModal,
    openEditColumnModal,
    openDeleteColumnModal,
    openEditTaskModal,
  } = useModalQuery();
  const hasTasks = column.tasks && column.tasks.length > 0;

  const handleAddTaskClick = () => {
    openAddTaskModal(column.id);
  };

  return (
    <Kanban.Column key={column.id} value={column.id}>
      <div className="flex items-center">
        <Kanban.ColumnHandle asChild>
          <Button variant="ghost" size="icon">
            <GripVertical className="h-4 w-4" />
          </Button>
        </Kanban.ColumnHandle>
        <div className="flex items-center gap-2 flex-1">
          <span className="font-bold text-lg">{column.title}</span>
          <Badge variant="outline" className="pointer-events-none rounded-sm">
            {column.tasks?.length || 0}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditColumnModal(column.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddTaskClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                openDeleteColumnModal(column.id);
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-0.5 space-y-2">
        {hasTasks ? (
          column.tasks.map((task) => (
            <Kanban.Item key={task.id} value={task.id} asChild>
              <div className="rounded-md border bg-card p-3 shadow-xs cursor-pointer">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Kanban.ItemHandle asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <GripVertical className="h-3 w-3" />
                      </Button>
                    </Kanban.ItemHandle>
                    <span
                      className="line-clamp-1 font-medium text-base flex-1 text-left cursor-pointer hover:text-primary"
                      title={task.title}
                      onClick={() => openEditTaskModal(column.id, task.id)}
                    >
                      {task.title}
                    </span>
                    <Badge
                      variant={
                        task.priority === "HIGH" || task.priority === "URGENT"
                          ? "destructive"
                          : task.priority === "MEDIUM"
                            ? "default"
                            : "secondary"
                      }
                      className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize"
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground ">
                    {task.assignee ? (
                      <div className="flex items-center gap-1">
                        <UserAvatar user={task.assignee} size="sm" />
                        <span
                          className="line-clamp-1 text-sm font-medium"
                          title={task.assignee.name || task.assignee.email}
                        >
                          {task.assignee.name || task.assignee.email}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="size-2 rounded-full bg-destructive/20" />
                        <span className="line-clamp-1">Unassigned</span>
                      </div>
                    )}
                    <time className="text-[10px] tabular-nums">
                      Created {format(task.createdAt, "MMM d")}
                    </time>
                  </div>
                </div>
              </div>
            </Kanban.Item>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-1 md:py-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-3 hidden md:block">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1 mb-2 md:space-y-2 md:mb-4">
              <p className="text-sm text-muted-foreground">No tasks yet</p>
              <p className="text-xs text-muted-foreground">
                Add a task to get started
              </p>
            </div>
            <Button onClick={handleAddTaskClick} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        )}
      </div>
    </Kanban.Column>
  );
});
