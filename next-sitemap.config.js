const { fetchBlogSlugs } = require("./utils/fetchBlogSlugs");

/** @type {import('next-sitemap').IConfig} */
module.exports = async () => {
    const blogPaths = await fetchBlogSlugs();

    return {
        siteUrl: "https://blogging-one-omega.vercel.app",
        generateRobotsTxt: true,
        exclude: ["/admin", "/dashboard"],
        robotsTxtOptions: {
            policies: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard"] }],
        },
        additionalPaths: async () => blogPaths.map(slug => ({
            loc: slug,
            lastmod: new Date().toISOString(),
            priority: 0.9,
            changefreq: "daily",
        })),
    };
};
