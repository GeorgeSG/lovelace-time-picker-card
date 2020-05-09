export interface CustomCardEntry {
  type: string;
  name?: string;
  description?: string;
  preview?: boolean;
}

declare global {
  interface Window {
    customCards: Array<CustomCardEntry>;
  }
}
