import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiHome, HiSearch, HiPencilAlt, HiUser, HiMenu, HiX, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const menu = [
        { label: 'Trang chủ', icon: HiHome, path: '/' },
        { label: 'Khám phá', icon: HiSearch, path: '/posts' },
        ...(user ? [
            { label: 'Viết bài', icon: HiPencilAlt, path: '/posts/create' },
            { label: 'Bài viết của tôi', icon: HiUser, path: '/dashboard' },
        ] : []),
    ];

    const go = (path: string) => { navigate(path); setOpen(false); };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col">
                <div className="p-5 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => go('/')}>
                        AWS Serverless
                    </h1>
                </div>
                <nav className="flex-1 p-3">
                    {menu.map((item) => {
                        const active = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => go(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] mb-1 transition-colors
                                    ${active 
                                        ? 'bg-primary text-white font-medium' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                    {!user && (
                        <button
                            onClick={() => go('/login')}
                            className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                        >
                            Đăng nhập
                        </button>
                    )}
                </nav>

                {user && (
                    <div className="p-3 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{user.name || 'User'}</p>
                                <p className="text-xs text-gray-500 truncate">{user.signInDetails?.loginId}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { logout(); go('/'); }}
                            className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 text-gray-600 hover:text-error hover:bg-red-50 rounded-xl text-sm transition-colors"
                        >
                            <HiLogout className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>
                )}
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-40">
                <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-gray-600">
                    <HiMenu className="w-5 h-5" />
                </button>
                <span className="flex-1 text-center font-bold text-primary">AWS Serverless</span>
                {user ? (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.[0] || 'U'}
                    </div>
                ) : (
                    <button onClick={() => go('/login')} className="text-primary font-medium text-sm">Đăng nhập</button>
                )}
            </header>

            {/* Mobile Sidebar */}
            {open && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />}
            <div className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-primary">AWS Serverless</span>
                    <button onClick={() => setOpen(false)} className="p-1"><HiX className="w-5 h-5" /></button>
                </div>
                <nav className="p-3">
                    {menu.map((item) => {
                        const active = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => go(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] mb-1 ${active ? 'bg-primary text-white' : 'text-gray-700'}`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content - Full width */}
            <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};
