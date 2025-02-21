import incrementViewInDB from "@/action/incrementView";

interface ViewResponse {
    error: boolean;
    message: string;
}

interface ViewedBlogs {
    [blogId: string]: string;
}

const incrementView = async (id: string, like: boolean) => {
    if (typeof window === 'undefined' || !id?.trim() || !isLocalStorageAvailable()) {
        // console.log('View increment skipped');
        return;
    }
    const STORAGE_KEY_FOR_BLOG_VIEWS = 'viewed_blogs';
    const STORAGE_KEY_FOR_BLOG_LIKES = 'liked_blogs';
    try {
        const today = new Date().toISOString().slice(0, 10);

        // if like is true, it means the user has liked the post else the user has viewed the post
        if (like) {
            const storedBlogs = localStorage.getItem(STORAGE_KEY_FOR_BLOG_LIKES);
            let likedBlogs: ViewedBlogs = {};
            try {
                likedBlogs = storedBlogs ? JSON.parse(storedBlogs) : {};
            } catch {
                localStorage.removeItem(STORAGE_KEY_FOR_BLOG_LIKES);
            }
            likedBlogs = Object.fromEntries(
                Object.entries(likedBlogs).filter(([_, date]) => date === today)
            );
            if (likedBlogs[id] === today) {
                // console.log(`Like already incremented for blog post with ID: ${id}`);
                return;
            }
            const response: ViewResponse = await incrementViewInDB(id, true);
            if (response.error) {
                throw new Error(response.message);
            }
            likedBlogs[id] = today;
            localStorage.setItem(STORAGE_KEY_FOR_BLOG_LIKES, JSON.stringify(likedBlogs));
            // console.log(`Like incremented for blog post with ID: ${id}`);
        }
        else {
            const storedBlogs = localStorage.getItem(STORAGE_KEY_FOR_BLOG_VIEWS);
            let viewedBlogs: ViewedBlogs = {};
            try {
                viewedBlogs = storedBlogs ? JSON.parse(storedBlogs) : {};
            } catch {
                localStorage.removeItem(STORAGE_KEY_FOR_BLOG_VIEWS);
            }
            viewedBlogs = Object.fromEntries(
                Object.entries(viewedBlogs).filter(([_, date]) => date === today)
            );
            if (viewedBlogs[id] === today) {
                // console.log(`View already incremented for blog post with ID: ${id}`);
                return;
            }
            const response: ViewResponse = await incrementViewInDB(id, false);
            if (response.error) {
                throw new Error(response.message);
            }
            viewedBlogs[id] = today;
            localStorage.setItem(STORAGE_KEY_FOR_BLOG_VIEWS, JSON.stringify(viewedBlogs));
            // console.log(`View incremented for blog post with ID: ${id}`);
        }
    } catch (error) {
        console.error('[Blog View Tracking Error]:', {
            blogId: id,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
}

const isLocalStorageAvailable = (): boolean => {
    try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

export { incrementView, type ViewResponse };