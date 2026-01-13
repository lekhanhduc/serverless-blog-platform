import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

// Icons component
const Icons = {
    Home: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
    ),
    Search: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    ),
    Edit: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    ),
    Folder: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
    ),
    User: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Logout: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    Menu: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    Close: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    // AWS Logo
    AWS: () => (
        <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
            <path d="M18.9 34.2c0 .8.1 1.5.3 2 .2.5.5 1.1.9 1.7.1.2.2.4.2.5 0 .2-.1.4-.4.6l-1.3.9c-.2.1-.4.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.6-.7-1-.2-.4-.4-.8-.6-1.3-1.5 1.8-3.4 2.7-5.7 2.7-1.6 0-2.9-.5-3.9-1.4-1-.9-1.5-2.2-1.5-3.7 0-1.6.6-3 1.7-3.9 1.2-1 2.7-1.5 4.7-1.5.7 0 1.3 0 2 .1.7.1 1.4.2 2.1.4v-1.4c0-1.5-.3-2.5-.9-3.1-.6-.6-1.7-.9-3.2-.9-.7 0-1.4.1-2.1.3-.7.2-1.5.4-2.2.8-.3.2-.6.3-.7.3-.2 0-.3-.1-.3-.4v-1.1c0-.3 0-.5.1-.6.1-.1.3-.3.6-.4.7-.4 1.6-.7 2.5-.9.9-.2 1.9-.4 3-.4 2.3 0 4 .5 5.1 1.6 1.1 1.1 1.6 2.7 1.6 4.9v6.4h.1zm-7.9 3c.6 0 1.3-.1 2-.4.7-.2 1.3-.7 1.8-1.3.3-.4.5-.8.6-1.3.1-.5.2-1.1.2-1.8v-.9c-.5-.1-1.1-.2-1.6-.3-.6-.1-1.1-.1-1.7-.1-1.3 0-2.2.2-2.8.7-.6.5-.9 1.2-.9 2.1 0 .9.2 1.5.7 2 .4.5 1 .7 1.7.7v.6zm15.6 2.1c-.3 0-.5 0-.6-.1-.2-.1-.3-.3-.4-.6l-4.5-14.8c-.1-.3-.2-.5-.2-.7 0-.3.1-.4.4-.4h2c.3 0 .5 0 .6.1.2.1.3.3.4.6l3.2 12.6 3-12.6c.1-.3.2-.5.4-.6.2-.1.4-.1.7-.1h1.6c.3 0 .5 0 .7.1.2.1.3.3.4.6l3 12.8 3.3-12.8c.1-.3.2-.5.4-.6.2-.1.4-.1.6-.1h1.9c.3 0 .4.1.4.4 0 .1 0 .2-.1.3 0 .1-.1.3-.1.4l-4.6 14.8c-.1.3-.2.5-.4.6-.2.1-.4.1-.6.1h-1.8c-.3 0-.5 0-.7-.1-.2-.1-.3-.3-.4-.6l-2.9-12.3-2.9 12.3c-.1.3-.2.5-.4.6-.2.1-.4.1-.7.1h-1.8zm25 .4c-1 0-2-.1-3-.4-1-.3-1.7-.5-2.2-.9-.3-.2-.5-.4-.5-.6 0-.2.1-.4.1-.6v-1.1c0-.3.1-.4.4-.4.1 0 .2 0 .3.1.1 0 .3.1.4.2.7.3 1.4.6 2.2.8.8.2 1.5.3 2.3.3 1.2 0 2.2-.2 2.8-.6.6-.4.9-1 .9-1.8 0-.5-.2-1-.5-1.3-.4-.4-1-.7-1.9-1l-2.8-.9c-1.4-.4-2.4-1.1-3-2-.6-.8-.9-1.8-.9-2.8 0-.8.2-1.5.5-2.2.4-.6.8-1.2 1.4-1.6.6-.4 1.3-.8 2-.1 .8-.2 1.6-.3 2.5-.3.4 0 .9 0 1.4.1.5.1.9.1 1.4.2.4.1.8.2 1.2.4.4.1.7.3.9.4.3.2.5.3.6.5.1.2.2.4.2.7v1c0 .3-.1.4-.4.4-.1 0-.4-.1-.7-.3-1.2-.5-2.5-.8-3.9-.8-1.1 0-2 .2-2.6.6-.6.4-.9.9-.9 1.7 0 .5.2 1 .6 1.4.4.4 1.1.7 2.1 1.1l2.7.9c1.4.4 2.3 1.1 2.9 1.9.6.8.8 1.7.8 2.7 0 .8-.2 1.6-.5 2.2-.4.7-.8 1.2-1.5 1.7-.6.5-1.3.8-2.2 1-.8.3-1.7.4-2.7.4z" fill="#252F3E"/>
            <path d="M45.6 44.8c-5.5 4.1-13.5 6.2-20.4 6.2-9.6 0-18.3-3.6-24.9-9.5-.5-.5-.1-1.1.6-.8 7.1 4.1 15.8 6.6 24.9 6.6 6.1 0 12.8-1.3 19-3.9.9-.4 1.7.6.8 1.4z" fill="#FF9900"/>
            <path d="M48 41.7c-.7-.9-4.6-.4-6.4-.2-.5.1-.6-.4-.1-.7 3.1-2.2 8.2-1.6 8.8-.8.6.8-.2 6.1-3.1 8.7-.4.4-.9.2-.7-.3.7-1.7 2.2-5.8 1.5-6.7z" fill="#FF9900"/>
        </svg>
    ),
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const menu = [
        { label: 'Trang chủ', path: '/', icon: <Icons.Home /> },
        { label: 'Khám phá', path: '/posts', icon: <Icons.Search /> },
        ...(user ? [
            { label: 'Viết bài', path: '/posts/create', icon: <Icons.Edit /> },
            { label: 'Bài của tôi', path: '/dashboard', icon: <Icons.Folder /> },
            { label: 'Trang cá nhân', path: '/profile', icon: <Icons.User /> },
        ] : []),
    ];

    const go = (path: string) => { navigate(path); setOpen(false); };
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-50">
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => go('/')}>
                        <Icons.AWS />
                        <span className="text-sm text-gray-500 font-medium">Serverless Blog Platform</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3">
                    <div className="space-y-1">
                        {menu.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => go(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                                    ${isActive(item.path) 
                                        ? 'bg-primary text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* User */}
                <div className="p-3 border-t border-gray-100">
                    {user ? (
                        <div>
                            <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-lg">
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
                                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                                <Icons.Logout />
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => go('/login')}
                            className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
                <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-gray-600 cursor-pointer">
                    <Icons.Menu />
                </button>
                <div className="flex items-center gap-2">
                    <Icons.AWS />
                    <span className="text-sm text-gray-500 font-medium">Serverless Blog Platform</span>
                </div>
                {user ? (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.[0] || 'U'}
                    </div>
                ) : (
                    <button onClick={() => go('/login')} className="text-sm font-medium text-primary cursor-pointer">
                        Đăng nhập
                    </button>
                )}
            </header>

            {/* Mobile Overlay */}
            {open && <div className="lg:hidden fixed inset-0 bg-black/30 z-50" onClick={() => setOpen(false)} />}

            {/* Mobile Sidebar */}
            <div className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-200 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Icons.AWS />
                        <span className="text-sm text-gray-500 font-medium">Serverless Blog Platform</span>
                    </div>
                    <button onClick={() => setOpen(false)} className="p-2 text-gray-400 cursor-pointer">
                        <Icons.Close />
                    </button>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {menu.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => go(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                                ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Mobile User Section */}
                <div className="p-3 border-t border-gray-100">
                    {user ? (
                        <div>
                            <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-lg">
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
                                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                                <Icons.Logout />
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => go('/login')}
                            className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
                <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
};
