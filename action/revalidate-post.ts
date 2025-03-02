"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBlog(slug: string) {
    revalidatePath(`/blogs/${slug}`);
}
