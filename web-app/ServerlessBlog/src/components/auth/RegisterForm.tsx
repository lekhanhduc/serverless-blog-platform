import React from 'react';
import { TextField, Button, Box, Alert, InputAdornment } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface RegisterFormProps {
    email: string;
    onEmailChange: (val: string) => void;
    password: string;
    onPasswordChange: (val: string) => void;
    name: string;
    onNameChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    email, onEmailChange, password, onPasswordChange, name, onNameChange, onSubmit, loading, error
}) => {
    return (
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
                label="Tên hiển thị"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                required
                fullWidth
                placeholder="Nguyễn Văn A"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutlineIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }
                }}
            />

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                fullWidth
                placeholder="name@example.com"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailOutlinedIcon fontSize="small" color="action" />
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
                placeholder="Tối thiểu 8 ký tự"
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
                {loading ? 'Đang khởi tạo...' : 'Đăng ký tài khoản'}
            </Button>
        </Box>
    );
};
