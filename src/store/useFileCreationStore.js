import { create } from "zustand";
import api from "../lib/axios";

const useFileCreationStore = create((set, get) => ({
  // 'file' | 'folder' | null
  isCreating: null,
  newItemName: "",

  // Actions
  startCreatingFolder: () => set({ isCreating: "folder", newItemName: "" }),
  startCreatingFile: () => set({ isCreating: "file", newItemName: "" }),
  cancelCreating: () => set({ isCreating: null, newItemName: "" }),
  setNewItemName: (name) => set({ newItemName: name }),

  // Submit creation — returns { success, message } for toast
  submitCreation: async () => {
    const { newItemName, isCreating } = get();
    if (!newItemName.trim()) {
      get().cancelCreating();
      return null;
    }

    const itemName = newItemName.trim();
    const isFolder = isCreating === "folder";

    try {
      const { data: result } = await api.post("/file", {
        path: isFolder ? `${itemName}/.keep` : itemName,
        content: "",
      });
      if (result.error) {
        return { success: false, message: "Error: " + result.error };
      } else {
        get().cancelCreating();
        return {
          success: true,
          message: `${isFolder ? "Folder" : "File"} "${itemName}" created!`,
        };
      }
    } catch (error) {
      console.error("Create failed:", error);
      get().cancelCreating();
      return {
        success: false,
        message: "Failed to create " + (isFolder ? "folder" : "file"),
      };
    }
  },
}));

export default useFileCreationStore;
