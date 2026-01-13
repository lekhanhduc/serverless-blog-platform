import React from 'react';
import { TextField, Button, Box, Alert, InputAdornment } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface ChallengeFormProps {
    displayName: string;
    onDisplayNameChange: (val: string) => void;
    password: string;
    onPasswordChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error?: string;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
    displayName, onDisplayNameChange, password, onPasswordChange, onSubmit, loading, error
}) => {
    return (
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
                label="Tên hiển thị (Tác giả)"
                placeholder="Ví dụ: Lê Khánh Đức"
                value={displayName}
                onChange={(e) => onDisplayNameChange(e.target.value)}
                required
                fullWidth
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
                label="Chọn mật khẩu mới"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                fullWidth
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
                {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
            </Button>
        </Box>
    );
};
