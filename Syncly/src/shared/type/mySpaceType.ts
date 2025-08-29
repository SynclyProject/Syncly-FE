export type TMySpaceURLs = {
  tabId: number;
  tabName: string;
  createdAt: string;
  urls: TUrl[];
};

export type TUrl = {
  urlItemId: number;
  url: string;
  createdAt: string;
};
