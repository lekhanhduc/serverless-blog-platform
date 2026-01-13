import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../services/api';
import type { Post } from '../types';
import { stripMarkdown, formatDate, extractPostId } from '../utils/helpers';

export const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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
        return formatDate(date);
    };

    const filtered = posts.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authorName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Khám phá</h1>
                <p className="text-gray-500 mt-1">Tìm kiếm và khám phá bài viết</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none transition-colors"
                />
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500">{search ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}</p>
                </div>
            )}

            {/* Posts Grid */}
            {!loading && filtered.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {filtered.map((post, index) => (
                        <article 
                            key={post.pk} 
                            className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                            onClick={() => navigate(`/posts/${extractPostId(post.pk)}`)}
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {post.authorName[0]}
                                </div>
                                <span className="font-medium text-gray-700">{post.authorName}</span>
                                <span>·</span>
                                <span>{timeAgo(post.createdAt)}</span>
                            </div>
                            <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 text-sm line-clamp-2">
                                {stripMarkdown(post.content)}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
