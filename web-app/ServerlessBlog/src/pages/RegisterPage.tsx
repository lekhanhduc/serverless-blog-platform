import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'REGISTER' | 'CONFIRM'>('REGISTER');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await authService.register(email, password, name);
            setStep('CONFIRM');
        } catch (err: any) { setError(err.message || 'Đăng ký thất bại'); }
        finally { setLoading(false); }
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.confirmRegistration(email, code);
            navigate('/login');
        } catch { setError('Mã xác nhận không đúng'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center mb-2">AWS Serverless</h1>
                <p className="text-gray-500 text-center mb-8">
                    {step === 'REGISTER' ? 'Tạo tài khoản mới' : `Nhập mã xác nhận gửi đến ${email}`}
                </p>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                {step === 'REGISTER' ? (
                    <form onSubmit={handleRegister} className="space-y-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tên hiển thị"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:border-gray-900"
                            required
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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
                        <button type="submit" disabled={loading} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold disabled:opacity-50">
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleConfirm} className="space-y-3">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Mã xác nhận (6 số)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[15px] text-center tracking-widest focus:outline-none focus:border-gray-900"
                            maxLength={6}
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold disabled:opacity-50">
                            {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-gray-500 mt-6">
                    Đã có tài khoản? <Link to="/login" className="text-gray-900 font-semibold">Đăng nhập</Link>
                </p>
                <p className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">← Về trang chủ</Link>
                </p>
            </div>
        </div>
    );
};
