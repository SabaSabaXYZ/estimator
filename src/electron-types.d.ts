export type SaveResult = { success: false } | { success: true, filePath: string };
export type LoadResult = { success: false } | { success: true, data: unknown, filePath: string };

export type ElectronAPI = {
  saveFile: (data: unknown) => Promise<SaveResult>;
  loadFile: () => Promise<LoadResult>;
};

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
