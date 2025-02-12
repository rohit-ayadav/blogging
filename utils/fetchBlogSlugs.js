export const fetchBlogSlugs = async () => {
    try {
        const res = await fetch('https://blogging-one-omega.vercel.app/api/getpostslug');
        if (!res.ok) throw new Error('Failed to fetch blog slugs');
        const posts = await res.json();
        return posts.map(post => `/blogs/${post.params.slug}`);
    } catch (error) {
        console.error("Error fetching slugs:", error);
        return [];
    }
};
