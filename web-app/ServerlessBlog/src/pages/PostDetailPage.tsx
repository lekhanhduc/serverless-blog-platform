import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { postApi, commentApi } from '../services/api';
import type { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

export const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { if (postId) { loadPost(); loadComments(); } }, [postId]);

    const loadPost = async () => {
        try { const r = await postApi.getById(postId!); setPost(r.data); }
        catch { } finally { setLoading(false); }
    };

    const loadComments = async () => {
        setCommentsLoading(true);
        try { const r = await commentApi.getByPost(postId!); setComments(r.data.result); } 
        catch { } finally { setCommentsLoading(false); }
    };

    const submitComment = async () => {
        if (!newComment.trim() || !post) return;
        setSubmitting(true);
        try { 
            await commentApi.create({ 
                postId: postId!, 
                content: newComment,
                postTitle: post.title,
                postAuthorId: post.authorId,
                postAuthorName: post.authorName
            }); 
            setNewComment(''); 
            loadComments(); 
        }
        catch { } finally { setSubmitting(false); }
    };

    const deleteComment = async (sk: string) => {
        if (!confirm('Xóa bình luận này?')) return;
        try { await commentApi.delete(postId!, sk.replace('COMMENT#', '')); loadComments(); } catch { }
    };

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
        return formatDate(date);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Không tìm thấy bài viết</p>
                <button onClick={() => navigate('/')} className="text-primary font-medium">Về trang chủ</button>
            </div>
        );
    }

    return (
        <div>
            {/* Back */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
            </button>

            {/* Post */}
            <article className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {post.authorName[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{post.authorName}</p>
                        <p className="text-sm text-gray-500">{formatDate(post.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                <div className="prose">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>

            {/* Comments */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Bình luận ({comments.length})</h2>

                {/* Input */}
                {user ? (
                    <div className="flex gap-3 mb-6">
                        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                rows={3}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:border-primary focus:outline-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={submitComment}
                                    disabled={submitting || !newComment.trim()}
                                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer"
                                >
                                    {submitting ? 'Đang gửi...' : 'Gửi'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg mb-6">
                        <button onClick={() => navigate('/login')} className="text-primary font-medium">Đăng nhập</button>
                        <span className="text-gray-500"> để bình luận</span>
                    </div>
                )}

                {/* List */}
                {commentsLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">Chưa có bình luận</p>
                ) : (
                    <div className="space-y-3">
                        {comments.map((c) => (
                            <div key={c.sk} className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                                    {c.authorName[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-900">{c.authorName}</span>
                                        <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                                        {user?.username === c.authorId && (
                                            <button 
                                                onClick={() => deleteComment(c.sk)} 
                                                className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
