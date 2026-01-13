import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { postApi, uploadToS3 } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import { useToast } from '../hooks/useToast';

export const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Vui lòng chọn file ảnh', 'error');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showToast('Ảnh không được vượt quá 10MB', 'error');
                return;
            }
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = async () => {
        if (!title.trim() || !content.trim()) return;
        setLoading(true);
        try {
            let thumbnailUrl: string | undefined;

            // Upload thumbnail if exists
            if (thumbnail) {
                setUploadProgress('Đang tải ảnh lên...');
                const { data } = await postApi.getUploadUrl(thumbnail.type);
                await uploadToS3(data.uploadUrl, thumbnail);
                thumbnailUrl = data.fileUrl;
            }

            setUploadProgress('Đang tạo bài viết...');
            const r = await postApi.create({ title, content, thumbnailUrl });
            navigate(`/posts/${r.data.pk.replace('POST#', '')}`);
        } catch (err) {
            console.error(err);
            showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    if (authLoading) return null;

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
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
                        {loading ? uploadProgress || 'Đang đăng...' : 'Đăng bài'}
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
                        {thumbnailPreview && (
                            <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-48 object-contain rounded-lg mb-4" />
                        )}
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
                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa (tùy chọn)</label>
                            {thumbnailPreview ? (
                                <div className="relative">
                                    <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-contain rounded-lg bg-gray-100" />
                                    <button
                                        onClick={removeThumbnail}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-500">Nhấn để chọn ảnh bìa</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF tối đa 10MB</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

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
                            rows={12}
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
