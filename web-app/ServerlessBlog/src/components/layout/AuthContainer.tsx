import React from 'react';
import type { ReactNode } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

interface AuthContainerProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children, title, subtitle }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
                px: 2,
                py: 4,
            }}
        >
            <Container sx={{ maxWidth: '460px !important' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 5 },
                        borderRadius: 3,
                        bgcolor: '#ffffff',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    {/* Logo/Brand */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                bgcolor: 'secondary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            JB
                        </Box>
                    </Box>

                    {/* Title & Subtitle */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: 'primary.main',
                                mb: 1,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' }
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                lineHeight: 1.5,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>

                    {/* Form Content */}
                    <Box sx={{ width: '100%' }}>
                        {children}
                    </Box>
                </Paper>
            </Container>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        color: 'rgba(255, 255, 255, 0.6)',
                    }}
                >
                    © 2026 JavaBackend • Enterprise System
                </Typography>
            </Box>
        </Box>
    );
};
