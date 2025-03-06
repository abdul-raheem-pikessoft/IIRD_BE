export type MessageResponse = { message: string };

export type ResponseData<T> = T | MessageResponse;

export type ListingResponseData<T> = {
  count: number;
  records: T[];
};

export type FindAllQueryResponse<T> = [T[], number];


