import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await authService.register(email, password, username);
            navigate('/login');
        } catch (err: any) { setError(err.message || 'Đăng ký thất bại'); }
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

                    <h1 className="text-xl font-bold text-center text-gray-900 mb-1">Tạo tài khoản</h1>
                    <p className="text-gray-500 text-center text-sm mb-6">Tham gia cộng đồng Serverless Blog</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên của bạn"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
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
                            <p className="text-xs text-gray-400 mt-1">Tối thiểu 8 ký tự</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Đã có tài khoản? <Link to="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
                </p>
                <p className="text-center mt-3">
                    <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Về trang chủ</Link>
                </p>
            </div>
        </div>
    );
};
