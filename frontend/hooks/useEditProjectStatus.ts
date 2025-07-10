// frontend/hooks/useEditProjectStatus.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "lib/api";
import { ApiResponse } from "@shared/interface/ApiResponseInterface";
import { IProject, ProjectStatus } from "@shared/interface/ProjectInterface";
import { toast } from "sonner";

interface EditStatusPayload {
  projectId: string;
  status: ProjectStatus;
}

export function useEditProjectStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<IProject>, Error, EditStatusPayload>({
    mutationFn: async ({ projectId, status }) => {
      const res = await api.patch<ApiResponse<IProject>>(
        "/api/v1/projects/edit-project",
        { projectId, status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Project status updated");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
} 