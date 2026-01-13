import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserDashboard } from '../components/dashboard/UserDashboard';

export const DashboardPage: React.FC = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-aws-orange border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!user) return null;

    return <UserDashboard user={user} onLogout={() => {
        logout();
        navigate('/login');
    }} />;
};
