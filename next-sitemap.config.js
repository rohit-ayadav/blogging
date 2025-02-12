/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://blogging-one-omega.vercel.app',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/admin', '/dashboard'],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard'] },
        ],
    },
    transform: async (config, path) => {
        return {
            loc: path, // URL location
            lastmod: new Date().toISOString(), // Last modified date
            priority: path.startsWith('/blog/') ? 0.9 : (path === '/' ? 1.0 : 0.8), // High priority for blog posts
            changefreq: 'daily', // How often it updates
        };
    },
};
