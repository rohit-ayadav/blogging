"use server";

export async function fetchUnsplashImages(query: string, count = 5): Promise<string[]> {
    console.log(`Fetching images for query: ${query}`);
    const client_id = process.env.UNSPLASH_ACCESS_KEY;
    if (!client_id) throw new Error("Unsplash API Access Key is missing");
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${client_id}`
    );
    if (!res.ok) throw new Error("Failed to fetch images");
    const data = await res.json();
    // console.log(`Response from Unsplash API: ${JSON.stringify(data)}`);
    const responseData = data.results.map((img: { urls: { regular: string } }) => img.urls.regular);
    const images = responseData;
    return images;
}
