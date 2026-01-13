import removeMarkdown from 'remove-markdown';

export const stripMarkdown = (text: string): string => {
    return removeMarkdown(text).replace(/\n+/g, ' ').trim();
};

export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };
    return new Date(dateStr).toLocaleDateString('vi-VN', options || defaultOptions);
};

export const getReadTime = (content: string): number => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
};

export const extractPostId = (pk: string): string => {
    return pk.replace('POST#', '');
};
