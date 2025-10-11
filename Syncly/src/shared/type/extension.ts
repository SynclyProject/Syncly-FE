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

export type ExtensionResponse2 = {
  success: boolean;
  error?: string;
  count?: number;
  data?: {
    code?: string;
    isSuccess?: boolean;
    message?: string;
    result?: {
      count?: number;
      createdAt?: string;
      id?: number;
      urls?: string[];
    };
    [k: string]: unknown;
  };
  [k: string]: unknown;
};
