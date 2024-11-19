import crypto from 'crypto';

export const generateRandomID = (length = DEFAULT_ID_LENGTH) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
        { length }, 
        () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
};

export const generatePictureFilename = (input) => {
    return `photos_${crypto.createHash('sha256').update(input).digest('hex')}.json`;
};