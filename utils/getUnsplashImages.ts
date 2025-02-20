"use server";

interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
        small: string;
    };
    user: {
        name: string;
        username: string;
    };
    links: {
        html: string;
    };
    description: string | null;
    alt_description: string | null;
}

interface UnsplashResponse {
    total: number;
    total_pages: number;
    results: UnsplashImage[];
}

export async function fetchUnsplashImages(
    query: string,
    page: number = 1,
    perPage: number = 9
): Promise<{
    images: UnsplashImage[];
    hasMore: boolean;
    totalPages: number;
}> {
    if (!query.trim()) {
        throw new Error("Search query is required");
    }

    const client_id = process.env.UNSPLASH_ACCESS_KEY;
    if (!client_id) {
        throw new Error("Unsplash API Access Key is missing");
    }

    try {
        // Encode the query parameters to handle special characters
        const encodedQuery = encodeURIComponent(query);
        const url = new URL("https://api.unsplash.com/search/photos");

        // Add search parameters
        url.searchParams.append("query", encodedQuery);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("per_page", perPage.toString());
        url.searchParams.append("client_id", client_id);

        const response = await fetch(url.toString(), {
            headers: {
                "Accept-Version": "v1",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Unsplash API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: errorBody
            });

            if (response.status === 403) {
                throw new Error("API rate limit exceeded. Please try again later.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key or unauthorized access.");
            }

            throw new Error(`Failed to fetch images: ${response.statusText}`);
        }

        const data: UnsplashResponse = await response.json();

        // Map the response to include only the data we need
        const images = data.results.map((img): UnsplashImage => ({
            id: img.id,
            urls: {
                regular: img.urls.regular,
                small: img.urls.small
            },
            user: {
                name: img.user.name,
                username: img.user.username
            },
            links: {
                html: img.links.html
            },
            description: img.description,
            alt_description: img.alt_description
        }));

        return {
            images,
            hasMore: page < data.total_pages,
            totalPages: data.total_pages
        };
    } catch (error) {
        // Log the error for debugging but send a cleaner message to the client
        console.error("Error fetching Unsplash images:", error);

        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("Failed to fetch images. Please try again later.");
    }
}