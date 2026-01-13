import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi';
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
        try { const r = await commentApi.getByPost(postId!); setComments(r.data.result); } catch { }
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
        try { await commentApi.delete(postId!, sk.replace('COMMENT#', '')); loadComments(); } catch { }
    };

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
        return formatDate(date);
    };

    if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin" /></div>;
    if (!post) return <div className="text-center py-16"><p className="text-gray-500">Không tìm thấy</p></div>;

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 max-w-2xl mx-auto flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                <span className="font-bold text-lg">Bài viết</span>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Post */}
                <article className="px-4 py-4 border-b border-gray-200">
                    <div className="flex gap-3 mb-3">
                        <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {post.authorName[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-[15px]">{post.authorName}</p>
                            <p className="text-gray-400 text-sm">{formatDate(post.createdAt, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold mb-3 text-primary">{post.title}</h1>
                    <div className="prose text-[15px]">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                    <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500">
                            <HiOutlineHeart className="w-5 h-5" />
                        </button>
                        <span className="text-gray-400 text-sm">{comments.length} bình luận</span>
                    </div>
                </article>

                {/* Comment Input */}
                {user && (
                    <div className="px-4 py-3 border-b border-gray-200 flex gap-3">
                        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                            {user.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                rows={2}
                                className="w-full resize-none text-[15px] outline-none placeholder:text-gray-400"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={submitComment}
                                    disabled={submitting || !newComment.trim()}
                                    className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full disabled:opacity-40 hover:bg-primary-dark transition-colors"
                                >
                                    {submitting ? '...' : 'Đăng'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!user && (
                    <div className="px-4 py-4 border-b border-gray-200 text-center">
                        <button onClick={() => navigate('/login')} className="text-primary font-semibold">Đăng nhập</button>
                        <span className="text-gray-500"> để bình luận</span>
                    </div>
                )}

                {/* Comments */}
                <div className="divide-y divide-gray-100">
                    {comments.map((c) => (
                        <div key={c.sk} className="px-4 py-3 flex gap-3">
                            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold shrink-0">
                                {c.authorName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{c.authorName}</span>
                                    <span className="text-gray-400 text-xs">{timeAgo(c.createdAt)}</span>
                                    {user?.username === c.authorId && (
                                        <button onClick={() => deleteComment(c.sk)} className="ml-auto text-gray-400 hover:text-red-500">
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[15px] mt-0.5">{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">Chưa có bình luận</div>
                )}
            </div>
        </div>
    );
};
