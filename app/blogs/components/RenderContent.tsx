import { BlogPostType } from '@/types/blogs-types'
import React from 'react'
// render content of the blog post , make zlink for heading and paragraph
const makeZlink = (content: string) => {
    const heading = content.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/g); // get all headings
    if (heading) {
        heading.forEach((h) => {
            const text = h.match(/>(.*?)</); // get text between heading tags
            if (text) {
                const id = text[1].replace(/ /g, '-') // replace spaces with hyphens
                    .replace(/[^a-zA-Z0-9-]/g, '') // remove special characters
                    .toLowerCase() // create id from text
                    .trim();
                content = content.replace(h, `<a id="${id}">${h}</a>`); // add id to heading
                // add style to heading that it will not show color and underline
                content = content.replace(
                    h,
                    h.replace('">', '" style="color:inherit;text-decoration:none;">')
                );
            }
        });
    }
    return content;
};
const RenderContent = (post: BlogPostType) => {
    return (
        <div>
            <div
                className="prose lg:prose-lg dark:prose-dark"
                dangerouslySetInnerHTML={{ __html: makeZlink(post.content) }}
            />
        </div>
    )
}

export default RenderContent
