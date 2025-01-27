// utils/deviceDetection.js
import { UAParser } from 'ua-parser-js';


/**
 * Extracts device information from the user-agent string.
 * @param {string} userAgent - The user-agent string.
 * @returns {Object} Device information (browser, OS, device).
 */
export function getDeviceInfoFromUA(userAgent = '') {
    if (!userAgent) {
        return {
            browser: 'Unknown',
            os: 'Unknown',
            device: 'Unknown',
        };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
        os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
        device: result.device.model
            ? `${result.device.vendor || ''} ${result.device.model || ''}`.trim()
            : 'Desktop/Laptop',
    };
}

/**
 * Extracts device information and IP address from the request object.
 * @param {Object} req - The request object (e.g., Express.js request).
 * @returns {Object} Device information (browser, OS, device, IP).
 */
export function getDeviceInfo(req) {
    console.log('getDeviceInfo\n\n\n');
    const userAgent = req.headers['user-agent'] || '';
    const ip =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket?.remoteAddress ||
        'Unknown';

    const deviceInfo = getDeviceInfoFromUA(userAgent);
    return { ...deviceInfo, ip };
}

/**
 * Exports for use.
 */
export default {
    getDeviceInfo,
    getDeviceInfoFromUA,
};
