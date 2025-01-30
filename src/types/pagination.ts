export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  name?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
