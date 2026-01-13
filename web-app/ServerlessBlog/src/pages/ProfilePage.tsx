import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../services/api';
import type { Post } from '../types';

export const ProfilePage: React.FC = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { 
        if (!authLoading && !user) navigate('/login');
        if (user) loadPosts();
    }, [user, authLoading]);

    const loadPosts = async () => {
        try { const r = await postApi.getMyPosts(); setPosts(r.data.result); }
        catch { } finally { setLoading(false); }
    };

    if (authLoading || !user) return null;

    const displayName = user.name || user.signInDetails?.loginId?.split('@')[0] || 'User';
    const email = user.signInDetails?.loginId || '';

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Trang cá nhân</h1>
                <p className="text-gray-500 mt-1">Thông tin tài khoản của bạn</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">
                        {displayName[0]?.toUpperCase()}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 truncate">{displayName}</h2>
                        <p className="text-gray-500 truncate">{email}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center sm:text-left">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '-' : posts.length}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Bài viết</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs sm:text-sm text-gray-500">Người theo dõi</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs sm:text-sm text-gray-500">Đang theo dõi</p>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">{email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">Tham gia tháng 1, 2026</span>
                    </div>
                </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Cài đặt</h3>
                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa thông tin
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Đổi mật khẩu
                    </button>
                    <div className="border-t border-gray-100 my-2" />
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};
