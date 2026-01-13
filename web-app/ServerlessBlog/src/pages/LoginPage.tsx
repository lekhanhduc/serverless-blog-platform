import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'LOGIN' | 'CHALLENGE'>('LOGIN');
    const { refreshUser } = useAuth();
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const { nextStep } = await authService.login(email, password);
            if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
                setMode('CHALLENGE');
            } else {
                await refreshUser();
                navigate('/');
            }
        } catch { setError('Email hoặc mật khẩu không đúng'); }
        finally { setLoading(false); }
    };

    const handleChallenge = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.confirmChallenge(password, displayName);
            await refreshUser();
            navigate('/');
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold text-center text-gray-900 mb-1">
                        {mode === 'LOGIN' ? 'Đăng nhập' : 'Hoàn tất đăng ký'}
                    </h1>
                    <p className="text-gray-500 text-center text-sm mb-6">
                        {mode === 'LOGIN' ? 'Chào mừng bạn quay lại' : 'Thiết lập thông tin tài khoản'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {mode === 'LOGIN' ? (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-primary text-white font-medium rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer"
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleChallenge} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Tên của bạn"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white font-medium rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer">
                                {loading ? 'Đang xử lý...' : 'Hoàn tất'}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Chưa có tài khoản? <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký</Link>
                </p>
                <p className="text-center mt-3">
                    <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Về trang chủ</Link>
                </p>
            </div>
        </div>
    );
};
