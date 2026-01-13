import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineChat } from 'react-icons/hi';
import { postApi } from '../services/api';
import type { Post } from '../types';
import { stripMarkdown, formatDate, extractPostId } from '../utils/helpers';

export const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { loadPosts(); }, []);

    const loadPosts = async () => {
        try { const r = await postApi.getAll(); setPosts(r.data.result); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const timeAgo = (date: string) => {
        const now = new Date();
        const d = new Date(date);
        const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} ngày`;
        return formatDate(date);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 z-10 max-w-2xl mx-auto">
                <h1 className="text-xl font-bold text-gray-900">Khám phá</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-16 px-4">
                        <p className="text-gray-500">Chưa có bài viết nào</p>
                    </div>
                )}

                <div className="divide-y divide-gray-100">
                    {!loading && posts.map((post) => (
                        <article 
                            key={post.pk} 
                            className="px-5 py-4 cursor-pointer hover:bg-blue-50/50 transition-colors"
                            onClick={() => navigate(`/posts/${extractPostId(post.pk)}`)}
                        >
                            <div className="flex gap-3">
                                <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                                    {post.authorName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-[15px] text-gray-900">{post.authorName}</span>
                                        <span className="text-gray-400 text-sm">· {timeAgo(post.createdAt)}</span>
                                    </div>
                                    <h2 className="font-semibold text-[15px] text-primary mb-1.5">{post.title}</h2>
                                    <p className="text-[15px] text-gray-600 line-clamp-2 leading-relaxed">
                                        {stripMarkdown(post.content)}
                                    </p>
                                    <div className="flex items-center gap-6 mt-3">
                                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors">
                                            <HiOutlineChat className="w-5 h-5" />
                                        </button>
                                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                            <HiOutlineHeart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};
