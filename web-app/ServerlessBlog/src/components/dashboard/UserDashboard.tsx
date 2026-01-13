import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { postApi } from '../../services/api';
import type { Post } from '../../types';
import { formatDate, extractPostId, stripMarkdown } from '../../utils/helpers';

interface Props {
    user: any;
    onLogout: () => void;
}

export const UserDashboard: React.FC<Props> = ({ user, onLogout }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => { loadPosts(); }, []);

    const loadPosts = async () => {
        try { const r = await postApi.getMyPosts(); setPosts(r.data.result); }
        catch { } finally { setLoading(false); }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Xóa bài viết này?')) return;
        try { await postApi.delete(id); loadPosts(); } catch { }
    };

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
        return formatDate(date);
    };

    const displayName = user.name || user.signInDetails?.loginId?.split('@')[0] || 'Bạn';

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10 max-w-2xl mx-auto">
                <h1 className="text-xl font-bold">Bài viết của tôi</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Profile */}
                <div className="px-4 py-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {displayName[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold">{displayName}</h2>
                            <p className="text-gray-500 text-sm">{user.signInDetails?.loginId}</p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 text-sm">
                        <span><strong>{posts.length}</strong> bài viết</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
                    >
                        Đăng xuất
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty */}
                {!loading && posts.length === 0 && (
                    <div className="text-center py-16 px-4">
                        <p className="text-gray-500 mb-4">Bạn chưa có bài viết nào</p>
                        <button
                            onClick={() => navigate('/posts/create')}
                            className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Viết bài đầu tiên
                        </button>
                    </div>
                )}

                {/* Posts */}
                <div className="divide-y divide-gray-100">
                    {!loading && posts.map((post) => (
                        <article key={post.pk} className="px-4 py-4">
                            <div className="flex gap-3">
                                <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                                    {post.authorName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[15px]">{post.authorName}</span>
                                            <span className="text-gray-400 text-sm">· {timeAgo(post.createdAt)}</span>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setMenuOpen(menuOpen === post.pk ? null : post.pk)}
                                                className="p-1.5 hover:bg-gray-100 rounded-full"
                                            >
                                                <HiOutlineDotsHorizontal className="w-5 h-5 text-gray-400" />
                                            </button>
                                            {menuOpen === post.pk && (
                                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[120px] z-10">
                                                    <button
                                                        onClick={() => { navigate(`/posts/${extractPostId(post.pk)}/edit`); setMenuOpen(null); }}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <HiOutlinePencil className="w-4 h-4" /> Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => { deletePost(extractPostId(post.pk)); setMenuOpen(null); }}
                                                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <HiOutlineTrash className="w-4 h-4" /> Xóa
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div onClick={() => navigate(`/posts/${extractPostId(post.pk)}`)} className="cursor-pointer">
                                        <h2 className="font-semibold text-[15px] text-primary mb-1">{post.title}</h2>
                                        <p className="text-[15px] text-gray-600 line-clamp-2">{stripMarkdown(post.content)}</p>
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
