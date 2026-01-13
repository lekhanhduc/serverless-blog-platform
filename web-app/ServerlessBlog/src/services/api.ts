import type {
    ApiResponse, PageResponse, Post, Comment,
    CreatePostRequest, UpdatePostRequest, CreateCommentRequest
} from '../types';

const API_BASE_URL = 'https://serverless.javabuilder.online';

async function getAuthToken(): Promise<string | null> {
    try {
        const { fetchAuthSession } = await import('aws-amplify/auth');
        const session = await fetchAuthSession();
        return session.tokens?.accessToken?.toString() || null;
    } catch {
        return null;
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'API Error');
    }
    return data;
}

export const postApi = {
    getAll: (size = 20, nextToken?: string) => {
        const params = new URLSearchParams({ size: size.toString() });
        if (nextToken) params.append('nextToken', nextToken);
        return request<ApiResponse<PageResponse<Post>>>(`/posts?${params}`);
    },
    getById: (postId: string) => request<ApiResponse<Post>>(`/posts/${postId}`),
    create: (data: CreatePostRequest) => request<ApiResponse<Post>>('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (postId: string, data: UpdatePostRequest) => request<ApiResponse<Post>>(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (postId: string) => request<ApiResponse<void>>(`/posts/${postId}`, { method: 'DELETE' }),
    getMyPosts: (size = 20, nextToken?: string) => {
        const params = new URLSearchParams({ size: size.toString() });
        if (nextToken) params.append('nextToken', nextToken);
        return request<ApiResponse<PageResponse<Post>>>(`/posts/me?${params}`);
    },
};

export const commentApi = {
    getByPost: (postId: string, size = 20, nextToken?: string) => {
        const params = new URLSearchParams({ size: size.toString() });
        if (nextToken) params.append('nextToken', nextToken);
        return request<ApiResponse<PageResponse<Comment>>>(`/comments/post/${postId}?${params}`);
    },
    create: (data: CreateCommentRequest) => request<ApiResponse<Comment>>('/comments', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    delete: (postId: string, commentId: string) => request<ApiResponse<void>>(`/comments/post/${postId}/${commentId}`, {
        method: 'DELETE',
    }),
};

export type { Post, Comment, ApiResponse, PageResponse, CreatePostRequest, UpdatePostRequest, CreateCommentRequest };
