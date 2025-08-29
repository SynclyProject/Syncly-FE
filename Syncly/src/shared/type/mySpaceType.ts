export type TMySpaceURLs = {
  tapId: number;
  tapName: string;
  createdAt: string;
  urls: TUrl[];
};

export type TUrl = {
  urlItemId: number;
  url: string;
  createdAt: string;
};
