export type ExtensionResponse = {
  success: boolean;
  error?: string;
  count?: number;
  data?: {
    id?: number | string;
    count?: number;
    urls?: string[];
    [k: string]: unknown;
  };
  [k: string]: unknown;
};
