import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
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
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Viết bài mới</h1>
                    <p className="text-gray-500 mt-1">Chia sẻ kiến thức với cộng đồng</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPreview(!preview)}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            preview ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {preview ? 'Chỉnh sửa' : 'Xem trước'}
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading || !title.trim() || !content.trim()}
                        className="flex-1 sm:flex-none px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                        {loading ? 'Đang đăng...' : 'Đăng bài'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {preview ? (
                    /* Preview */
                    <div>
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{user?.name || 'Bạn'}</p>
                                <p className="text-sm text-gray-500">Vừa xong</p>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {title || <span className="text-gray-300">Tiêu đề...</span>}
                        </h1>
                        <div className="prose">
                            {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-gray-300">Nội dung...</p>}
                        </div>
                    </div>
                ) : (
                    /* Editor */
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tiêu đề bài viết"
                            className="w-full text-2xl font-bold border-0 border-b border-gray-100 pb-3 focus:border-primary focus:outline-none placeholder:text-gray-300"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Viết nội dung... (hỗ trợ Markdown)"
                            rows={16}
                            className="w-full border-0 resize-none focus:outline-none placeholder:text-gray-300 leading-relaxed"
                        />
                        <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                            <span>**bold**</span>
                            <span>*italic*</span>
                            <span># heading</span>
                            <span>- list</span>
                            <span>`code`</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
