import { create } from "zustand";
import api from "../lib/axios";

const useFileStore = create((set, get) => ({
  // Currently selected file
  selectedFilePath: null,
  selectedFileContent: "",

  // Toggle to force file tree re-render
  reloadTree: false,

  // Actions
  setSelectedFilePath: (path) => set({ selectedFilePath: path }),
  setSelectedFileContent: (content) => set({ selectedFileContent: content }),

  triggerReloadTree: () => set((state) => ({ reloadTree: !state.reloadTree })),

  // Fetch file content from the server
  fetchFileContent: async (path) => {
    if (!path) return;
    try {
      const { data } = await api.get("/file", {
        params: { path },
      });
      if (data.error) {
        console.error("Server error:", data.error);
      } else {
        set({ selectedFileContent: data.content });
      }
    } catch (err) {
      console.error("Failed to load file:", err);
    }
  },

  // Save current file to the server
  saveFile: async () => {
    const { selectedFilePath, selectedFileContent, triggerReloadTree } = get();
    if (!selectedFilePath) return { success: false, message: "No file selected" };

    try {
      const { data: result } = await api.post("/file", {
        path: selectedFilePath,
        content: selectedFileContent,
      });

      if (result.error) {
        return { success: false, message: "Error: " + result.error };
      } else {
        triggerReloadTree();
        return { success: true, message: "File saved successfully!" };
      }
    } catch (error) {
      console.error("Save failed:", error);
      return { success: false, message: "Save failed!" };
    }
  },

  // Select a file and fetch its content
  selectFile: (path) => {
    set({ selectedFilePath: path });
    get().fetchFileContent(path);
  },
}));

export default useFileStore;
