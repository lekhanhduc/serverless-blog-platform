import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Grid,
    Divider, Paper
} from '@mui/material';

export const LandingPage: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    return (
        <Box>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 900, color: 'primary.main', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: 'secondary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>JB</Box>
                            JavaBackend
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {loading ? null : user ? (
                                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                                    Bảng quản trị
                                </Button>
                            ) : (
                                <>
                                    <Button variant="text" color="primary" sx={{ fontWeight: 700 }} onClick={() => navigate('/login')}>
                                        Đăng nhập
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                                        Tham gia ngay
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="lg">
                <Grid container spacing={10} sx={{ py: 20, alignItems: 'center' }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="overline" sx={{ fontWeight: 800, color: 'secondary.main', letterSpacing: '0.15em', mb: 2, display: 'block' }}>
                            ENTERPRISE KNOWLEDGE HUB
                        </Typography>
                        <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                            Chuyên sâu <br />
                            <Box component="span" sx={{ color: 'secondary.main' }}>Kiến thức Java</Box>
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.15rem', color: 'text.secondary', mb: 4, maxWidth: 520, lineHeight: 1.8 }}>
                            Nền tảng chia sẻ kỹ thuật, kiến trúc hệ thống và giải pháp backend thực chiến dành cho cộng đồng kỹ sư Java.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {user ? (
                                <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>
                                    Viết bài mới
                                </Button>
                            ) : (
                                <>
                                    <Button variant="contained" size="large" onClick={() => navigate('/register')}>
                                        Bắt đầu ngay
                                    </Button>
                                    <Button variant="outlined" size="large" onClick={() => navigate('/login')}>
                                        Khám phá bài viết
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: 6 }}>
                            <Paper elevation={0} sx={{ bgcolor: '#0f172a', color: '#e2e8f0', p: 4, borderRadius: 4, border: '1px solid #1e293b' }}>
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#334155' }} />
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#334155' }} />
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#334155' }} />
                                </Box>
                                <Typography component="pre" sx={{ fontFamily: '"Fira Code", monospace', fontSize: '0.9rem', lineHeight: 1.7, color: '#f8fafc' }}>
                                    {`@RestController
@RequestMapping("/api/v1/knowledge")
public class JavaController {
    
    @PostMapping("/share")
    public ResponseEntity<Post> push(@RequestBody Post data) {
        // Engineering Excellence
        return ResponseEntity.ok(
            service.broadcast(data)
        );
    }
}`}
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ opacity: 0.5 }} />

                <Box sx={{ py: 15 }}>
                    <Typography variant="h2" align="center" gutterBottom sx={{ mb: 10 }}>
                        Lĩnh vực <Box component="span" sx={{ color: 'secondary.main' }}>Chuyên môn</Box>
                    </Typography>

                    <Grid container spacing={4}>
                        {[
                            {
                                icon: '🎯',
                                title: 'Java Core & JVM',
                                content: 'Tối ưu hóa hiệu năng, Concurrency, Garbage Collection và cấu trúc dữ liệu nâng cao.'
                            },
                            {
                                icon: '🛡️',
                                title: 'Microservices & Security',
                                content: 'Thiết kế hệ thống phân tán, OAuth2/JWT và các mẫu kiến trúc Microservices hiện đại.'
                            },
                            {
                                icon: '☁️',
                                title: 'AWS Cloud Native',
                                content: 'Vận hành các ứng dụng Java trên hạ tầng Serverless, Lambda, và DynamoDB.'
                            }
                        ].map((item, idx) => (
                            <Grid key={idx} size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={{
                                    height: '100%',
                                    p: 5,
                                    borderRadius: 5,
                                    bgcolor: '#fafafa',
                                    border: '1px solid #f1f5f9',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: '#fff',
                                        borderColor: 'secondary.main',
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
                                    }
                                }}>
                                    <Typography variant="h3" sx={{ mb: 3 }}>{item.icon}</Typography>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.8 }}>{item.content}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            <Box component="footer" sx={{ py: 10, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
                        &copy; 2026 JavaBackend &bull; Nền tảng tri thức lập trình viên.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

// Internal Paper for the code visual
// (Removed local override to use MUI Paper)
