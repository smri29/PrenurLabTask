const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiClientError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const apiRequest = async <T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new ApiClientError(payload.message || 'Request failed', response.status);
  }

  return payload;
};