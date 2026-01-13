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
        } catch { setError('Thông tin đăng nhập không chính xác'); }
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center mb-2">AWS Serverless</h1>
                <p className="text-gray-500 text-center mb-8">Đăng nhập để tiếp tục</p>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                {mode === 'LOGIN' ? (
                    <form onSubmit={handleSignIn} className="space-y-3">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email hoặc username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:border-gray-900"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:border-gray-900"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleChallenge} className="space-y-3">
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Tên hiển thị"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:border-gray-900"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu mới"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:border-gray-900"
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold disabled:opacity-50">
                            {loading ? 'Đang xử lý...' : 'Hoàn tất'}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-gray-500 mt-6">
                    Chưa có tài khoản? <Link to="/register" className="text-gray-900 font-semibold">Đăng ký</Link>
                </p>
                <p className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">← Về trang chủ</Link>
                </p>
            </div>
        </div>
    );
};
