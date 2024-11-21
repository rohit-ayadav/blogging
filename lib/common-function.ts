const isValidSlug = (slug: string) => {
  let processedSlug = slug.toLowerCase(); // Convert to lowercase
  processedSlug = processedSlug.replace(/[^a-z0-9-]/g, ""); // Remove invalid characters
  processedSlug = processedSlug.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  return /^[a-z0-9]+(?:-*[a-z0-9]+)*$/.test(processedSlug);
};

const makeValidSlug = (slug: string) => {
  let processedSlug = slug
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove special characters
    .toLowerCase() // Convert to lowercase
    .replace(/-{2,}/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/_{2,}/g, "_") // Replace multiple underscores with a single underscore
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  return processedSlug;
};

export { isValidSlug, makeValidSlug };
