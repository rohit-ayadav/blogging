import React from 'react';
import { BlogPostType } from '@/types/blogs-types';

const RenderContent = (post: BlogPostType) => {
    const makeZlink = (content: string) => {
        const heading = content.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/g);
        if (heading) {
            heading.forEach((h) => {
                const text = h.match(/>(.*?)</);
                if (text) {
                    const id = text[1]
                        .replace(/ /g, '-')
                        .replace(/[^a-zA-Z0-9-]/g, '')
                        .toLowerCase()
                        .trim();
                    content = content.replace(h, `<a id="${id}">${h}</a>`);
                }
            });
        }
        return content;
    };

    // Process the content with custom styles
    const addCustomStyles = (content: string) => {
        // Add styles to headings
        content = content.replace(
            /<h1(.*?)>(.*?)<\/h1>/g,
            '<h1 class="text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100">$2</h1>'
        );
        content = content.replace(
            /<h2(.*?)>(.*?)<\/h2>/g,
            '<h2 class="text-3xl font-semibold mb-4 mt-6 text-gray-800 dark:text-gray-200">$2</h2>'
        );
        content = content.replace(
            /<h3(.*?)>(.*?)<\/h3>/g,
            '<h3 class="text-2xl font-medium mb-3 mt-5 text-gray-800 dark:text-gray-200">$2</h3>'
        );

        // Style paragraphs
        content = content.replace(
            /<p>(.*?)<\/p>/g,
            '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">$1</p>'
        );

        // Style links
        content = content.replace(
            /<a(.*?)>(.*?)<\/a>/g,
            '<a class="text-blue-600 dark:text-blue-400 hover:underline"$1>$2</a>'
        );

        // Style lists
        content = content.replace(
            /<ul>(.*?)<\/ul>/g,
            '<ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">$1</ul>'
        );
        content = content.replace(
            /<ol>(.*?)<\/ol>/g,
            '<ol class="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300">$1</ol>'
        );

        // Style list items
        content = content.replace(
            /<li>(.*?)<\/li>/g,
            '<li class="mb-2">$1</li>'
        );

        // Style blockquotes
        content = content.replace(
            /<blockquote>`?(.*?)`?<\/blockquote>/g,
            '<blockquote class="pl-4 border-l-4 border-gray-300 dark:border-gray-700 italic my-4 text-gray-600 dark:text-gray-400">$1</blockquote>'
        );


        // Style code blocks
        content = content.replace(
            /<pre>(.*?)<\/pre>/g,
            '<pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4">$1</pre>'
        );
        content = content.replace(
            /<code>(.*?)<\/code>/g,
            '<code class="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 font-mono text-sm">$1</code>'
        );

        return content;
    };

    return (
        <div
            className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: addCustomStyles(makeZlink(post.content)) }}
        />
    );
};

export default RenderContent;