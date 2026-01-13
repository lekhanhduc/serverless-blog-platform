import React from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { InputAdornment } from '@mui/material';

interface LoginFormProps {
    email: string;
    onEmailChange: (val: string) => void;
    password: string;
    onPasswordChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    email, onEmailChange, password, onPasswordChange, onSubmit, loading, error
}) => {
    return (
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
                label="Email hoặc Username"
                type="text"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                fullWidth
                placeholder="email@example.com hoặc username"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutlinedIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }
                }}
            />

            <TextField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                fullWidth
                placeholder="••••••••"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }
                }}
            />

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                    mt: 1,
                    py: 1.5,
                    fontWeight: 700,
                }}
            >
                {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </Button>
        </Box>
    );
};
