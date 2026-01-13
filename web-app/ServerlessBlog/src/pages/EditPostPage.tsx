import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineX } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const EditPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading]);
    useEffect(() => { if (postId) loadPost(); }, [postId]);

    const loadPost = async () => {
        try { const r = await postApi.getById(postId!); setTitle(r.data.title); setContent(r.data.content); }
        catch { } finally { setLoading(false); }
    };

    const submit = async () => {
        if (!title.trim() || !content.trim()) return;
        setSaving(true);
        try { await postApi.update(postId!, { title, content }); navigate(`/posts/${postId}`); }
        catch { } finally { setSaving(false); }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <HiOutlineX className="w-5 h-5" />
                </button>
                <span className="font-semibold">Chỉnh sửa bài viết</span>
                <button
                    onClick={submit}
                    disabled={saving || !title.trim() || !content.trim()}
                    className="px-5 py-1.5 bg-primary text-white text-sm font-semibold rounded-full disabled:opacity-40 hover:bg-primary-dark transition-colors"
                >
                    {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)]">
                {/* Editor - Left */}
                <div className="flex-1 p-4 lg:border-r border-gray-200">
                    <div className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Nội dung</div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tiêu đề bài viết"
                        className="w-full text-xl font-bold outline-none placeholder:text-gray-400 mb-3 pb-3 border-b border-gray-100"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Viết nội dung... (hỗ trợ Markdown)"
                        className="w-full h-[calc(100vh-220px)] text-[15px] outline-none resize-none placeholder:text-gray-400 leading-relaxed"
                    />
                    <p className="text-xs text-gray-400 mt-2">**bold** · *italic* · # heading · - list · `code`</p>
                </div>

                {/* Preview - Right */}
                <div className="flex-1 p-4 bg-gray-50 lg:bg-white">
                    <div className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Xem trước</div>
                    <div className="bg-white lg:bg-gray-50 rounded-lg p-4 min-h-[200px]">
                        <h1 className="text-xl font-bold mb-3 text-primary">{title || <span className="text-gray-300">Tiêu đề...</span>}</h1>
                        <div className="prose text-[15px]">
                            {content ? (
                                <ReactMarkdown>{content}</ReactMarkdown>
                            ) : (
                                <p className="text-gray-300 italic">Nội dung sẽ hiển thị ở đây...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
