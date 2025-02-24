const isValidSlug = (slug: string) => {
  let processedSlug = slug.toLowerCase();
  processedSlug = processedSlug.replace(/[^a-z0-9-]/g, "");
  processedSlug = processedSlug.replace(/^-+|-+$/g, "");
  return /^[a-z0-9]+(?:-*[a-z0-9]+)*$/.test(processedSlug);
};

export function isValidSEOSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

const makeValidSlug = (slug: string) => {
  let processedSlug = slug
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
    .replace(/-{2,}/g, "-")
    .replace(/_{2,}/g, "_")
    .replace(/^-+|-+$/g, "");
  return processedSlug;
};

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "on", "in", "with", "to", "for", "at", "by",
  "of", "up", "off", "over", "under", "into", "onto", "as", "so", "than", "that", "this", "these", "those"
]);
export function generateSeoSlug(title: string, uniqueId?: string | number): string {
  return title
    .slice(0, 70)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(word => !STOP_WORDS.has(word))
    .join('-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    + (uniqueId ? `-${uniqueId}` : '');
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export { isValidSlug, makeValidSlug, isValidUrl, isValidEmail };
