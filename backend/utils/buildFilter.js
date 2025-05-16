const buildFilter = ({
  q,
  category,
  tag,
  dateFrom,
  dateTo,
  minPrice,
  maxPrice,
}) => {
  const filter = {};

  if (q) {
    const rx = new RegExp(q, "i");
    filter.$or = [
      { "title.en": { $regex: rx } },
      { "title.ar": { $regex: rx } },
      { "description.en": { $regex: rx } },
      { "description.ar": { $regex: rx } },
      { "category.en": { $regex: rx } },
      { "category.ar": { $regex: rx } },
      { "tags.en": { $regex: rx } },
      { "tags.ar": { $regex: rx } },
    ];
  }

  if (category) {
    const rx = new RegExp(`^${category}$`, "i");
    filter.$or = [
      ...(filter.$or || []),
      { "category.en": { $regex: rx } },
      { "category.ar": { $regex: rx } },
    ];
  }

  if (tag) {
    const rx = new RegExp(`^${tag}$`, "i");
    filter.$or = [
      ...(filter.$or || []),
      { "tags.en": { $regex: rx } },
      { "tags.ar": { $regex: rx } },
    ];
  }

  if (dateFrom || dateTo) {
    filter.eventDate = {};
    if (dateFrom) filter.eventDate.$gte = new Date(dateFrom);
    if (dateTo) filter.eventDate.$lte = new Date(dateTo);
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = +minPrice;
    if (maxPrice) filter.price.$lte = +maxPrice;
  }

  return filter;
};

export default buildFilter;
