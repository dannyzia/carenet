/**
 * API Client — fetch wrapper with auth headers, base URL, and error handling.
 *
 * In development mode, all calls resolve against mock data.
 * When Supabase is connected, the client switches to real API endpoints.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    return url.toString();
  }

  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (this.authToken) {
      headers.set("Authorization", `Bearer ${this.authToken}`);
    }
    return headers;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(this.buildUrl(endpoint, options?.params), {
      ...options,
      method: "GET",
      headers: this.buildHeaders(options?.headers),
    });
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
    return res.json();
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const res = await fetch(this.buildUrl(endpoint, options?.params), {
      ...options,
      method: "POST",
      headers: this.buildHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);
    return res.json();
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const res = await fetch(this.buildUrl(endpoint, options?.params), {
      ...options,
      method: "PUT",
      headers: this.buildHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`);
    return res.json();
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(this.buildUrl(endpoint, options?.params), {
      ...options,
      method: "DELETE",
      headers: this.buildHeaders(options?.headers),
    });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`);
    return res.json();
  }
}

/** Singleton API client instance */
export const apiClient = new ApiClient(BASE_URL);
