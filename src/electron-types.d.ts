export type AutoSaveRequest = { data: unknown, filePath: string };

export type AutoSaveResult = { success: boolean };
export type SaveResult = { success: false } | { success: true, filePath: string };
export type LoadResult = { success: false } | { success: true, data: unknown, filePath: string };

export type ElectronAPI = {
  autoSaveFile: (data: AutoSaveRequest) => Promise<AutoSaveResult>;
  saveFile: (data: unknown) => Promise<SaveResult>;
  loadFile: () => Promise<LoadResult>;
};

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
