const isValidSlug = (slug: string) => {
  let processedSlug = slug.toLowerCase();
  processedSlug = processedSlug.replace(/[^a-z0-9-]/g, "");
  processedSlug = processedSlug.replace(/^-+|-+$/g, "");
  return /^[a-z0-9]+(?:-*[a-z0-9]+)*$/.test(processedSlug);
};

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
