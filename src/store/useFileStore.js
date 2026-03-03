import { create } from "zustand";
import api from "../lib/axios";

const useFileStore = create((set, get) => ({
  // Currently selected file
  selectedFilePath: null,
  selectedFileContent: "",

  // Toggle to force file tree re-render
  reloadTree: false,

  // Open tabs (ordered list of file paths)
  openTabs: [],

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
    const { openTabs } = get();
    // Add to tabs if not already open
    const newTabs = openTabs.includes(path) ? openTabs : [...openTabs, path];
    set({ selectedFilePath: path, openTabs: newTabs });
    get().fetchFileContent(path);
  },

  // Close a tab
  closeTab: (path) => {
    const { openTabs, selectedFilePath } = get();
    const newTabs = openTabs.filter((t) => t !== path);
    if (path === selectedFilePath) {
      // Switch to the previous tab or clear
      const idx = openTabs.indexOf(path);
      const next = newTabs[Math.min(idx, newTabs.length - 1)] || null;
      set({ openTabs: newTabs, selectedFilePath: next, selectedFileContent: "" });
      if (next) get().fetchFileContent(next);
    } else {
      set({ openTabs: newTabs });
    }
  },

  // Close all tabs except the given one
  closeOtherTabs: (path) => {
    set({ openTabs: [path], selectedFilePath: path });
    get().fetchFileContent(path);
  },
}));

export default useFileStore;
