import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../services/api';
import type { Post } from '../../types';
import { formatDate, extractPostId, stripMarkdown } from '../../utils/helpers';
import { Modal } from '../Modal';

interface Props {
    user: any;
    onLogout: () => void;
}

export const UserDashboard: React.FC<Props> = ({ }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { loadPosts(); }, []);

    const loadPosts = async () => {
        try { const r = await postApi.getMyPosts(); setPosts(r.data.result); }
        catch { } finally { setLoading(false); }
    };

    const deletePost = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try { await postApi.delete(deleteModal.id); loadPosts(); } 
        catch { } finally { 
            setDeleting(false);
            setDeleteModal({ open: false, id: null });
        }
    };

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
        return formatDate(date);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bài viết của tôi</h1>
                    <p className="text-gray-500 mt-1">Quản lý các bài viết bạn đã đăng</p>
                </div>
                <span className="text-sm text-gray-500">{posts.length} bài viết</span>
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
                    <p className="text-gray-500 mb-4">Bạn chưa có bài viết nào</p>
                    <button
                        onClick={() => navigate('/posts/create')}
                        className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                        Viết bài đầu tiên
                    </button>
                </div>
            )}

            {/* Posts */}
            {!loading && posts.length > 0 && (
                <div className="space-y-3">
                    {posts.map((post, index) => (
                        <article 
                            key={post.pk} 
                            className="bg-white rounded-xl border border-gray-200 p-5 animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div 
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => navigate(`/posts/${extractPostId(post.pk)}`)}
                                >
                                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                                        {stripMarkdown(post.content)}
                                    </p>
                                    <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
                                </div>

                                {/* Actions */}
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpen(menuOpen === post.pk ? null : post.pk)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                    {menuOpen === post.pk && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-20">
                                                <button
                                                    onClick={() => { navigate(`/posts/${extractPostId(post.pk)}/edit`); setMenuOpen(null); }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => { setDeleteModal({ open: true, id: extractPostId(post.pk) }); setMenuOpen(null); }}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Xóa
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                onConfirm={deletePost}
                title="Xóa bài viết"
                message="Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                loading={deleting}
            />
        </div>
    );
};
