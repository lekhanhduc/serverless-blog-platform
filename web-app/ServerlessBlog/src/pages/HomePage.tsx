import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../services/api';
import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { stripMarkdown, formatDate, extractPostId } from '../utils/helpers';

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { loadPosts(); }, []);

    const loadPosts = async () => {
        try { const r = await postApi.getAll(); setPosts(r.data.result); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} ngày`;
        return formatDate(date);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Trang chủ</h1>
                <p className="text-gray-500 mt-1">Bài viết mới nhất từ cộng đồng</p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {/* Empty */}
            {!loading && posts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-500 mb-4">Chưa có bài viết nào</p>
                    {user && (
                        <button 
                            onClick={() => navigate('/posts/create')}
                            className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                            Viết bài đầu tiên
                        </button>
                    )}
                </div>
            )}

            {/* Posts */}
            {!loading && posts.length > 0 && (
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <article 
                            key={post.pk} 
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                            onClick={() => navigate(`/posts/${extractPostId(post.pk)}`)}
                        >
                            {/* Thumbnail */}
                            {post.thumbnailUrl && (
                                <img src={post.thumbnailUrl} alt={post.title} className="w-full h-48 object-contain bg-gray-100" />
                            )}
                            
                            <div className="p-5">
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                                        {post.authorName[0].toUpperCase()}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                            <span className="font-medium text-gray-900">{post.authorName}</span>
                                            <span>·</span>
                                            <span>{timeAgo(post.createdAt)}</span>
                                        </div>

                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {stripMarkdown(post.content)}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                5 phút đọc
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
