import removeMarkdown from 'remove-markdown';

// Strip markdown for preview text
export const stripMarkdown = (text: string): string => {
    return removeMarkdown(text).replace(/\n+/g, ' ').trim();
};

// Format date to Vietnamese locale
export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };
    return new Date(dateStr).toLocaleDateString('vi-VN', options || defaultOptions);
};

// Calculate read time in minutes
export const getReadTime = (content: string): number => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
};

// Extract post ID from pk
export const extractPostId = (pk: string): string => {
    return pk.replace('POST#', '');
};
