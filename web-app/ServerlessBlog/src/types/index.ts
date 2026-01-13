export interface ApiResponse<T> {
    code: number;
    message?: string;
    data: T;
}

export interface PageResponse<T> {
    size: number;
    nextToken: string | null;
    hasMore: boolean;
    result: T[];
}

export interface Post {
    pk: string;
    sk: string;
    title: string;
    content: string;
    status: string;
    authorId: string;
    authorName: string;
    thumbnailUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    pk: string;
    sk: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: string;
}

export interface CreatePostRequest {
    title: string;
    content: string;
    thumbnailUrl?: string;
}

export interface UpdatePostRequest {
    title?: string;
    content?: string;
    status?: string;
    thumbnailUrl?: string;
}

export interface CreateCommentRequest {
    postId: string;
    content: string;
    postTitle: string;
    postAuthorId: string;
    postAuthorName: string;
}
