const mapToLanguage = (doc, lang = "en") => ({
  ...doc,
  title: doc.title?.[lang] ?? doc.title.en,
  description: doc.description?.[lang] ?? doc.description.en,
  category: doc.category?.[lang] ?? doc.category.en,
  venue: doc.venue?.[lang] ?? doc.venue.en,
  tags: doc.tags?.map((t) => t[lang] ?? t.en),
});

export default mapToLanguage;
