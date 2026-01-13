import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineX } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading]);

    const submit = async () => {
        if (!title.trim() || !content.trim()) return;
        setLoading(true);
        try {
            const r = await postApi.create({ title, content });
            navigate(`/posts/${r.data.pk.replace('POST#', '')}`);
        } catch { }
        finally { setLoading(false); }
    };

    if (authLoading) return null;

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <HiOutlineX className="w-5 h-5" />
                </button>
                <span className="font-semibold">Viết bài mới</span>
                <button
                    onClick={submit}
                    disabled={loading || !title.trim() || !content.trim()}
                    className="px-5 py-1.5 bg-primary text-white text-sm font-semibold rounded-full disabled:opacity-40 hover:bg-primary-dark transition-colors"
                >
                    {loading ? 'Đang đăng...' : 'Đăng bài'}
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
                        <div className="flex gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-[15px]">{user?.name || user?.signInDetails?.loginId || 'Bạn'}</p>
                                <p className="text-gray-500 text-sm">Vừa xong</p>
                            </div>
                        </div>
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
