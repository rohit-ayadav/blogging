import nlp from "compromise";
function generateTagsFromContent(content: string) {
  const doc = nlp(content);
  const tags = doc.nouns().out("array");
  let uniqueTags = [...new Set(tags)];

  return uniqueTags.slice(0, 10);
}
export default generateTagsFromContent;
