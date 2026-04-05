export const sampleListings = [
  {
    slug: "sunset-cottage-coast",
    title: "Sunset Cottage by the Coast",
    location: "Big Sur, California",
    pricePerNight: 289,
    guests: 4,
    bedrooms: 2,
    baths: 1,
    description:
      "A warm, wood-accented retreat with ocean views and a private deck for morning coffee.",
  },
  {
    slug: "urban-loft-downtown",
    title: "Modern Loft Downtown",
    location: "Portland, Oregon",
    pricePerNight: 165,
    guests: 2,
    bedrooms: 1,
    baths: 1,
    description:
      "Walkable to cafes and galleries. Floor-to-ceiling windows and a fully equipped kitchen.",
  },
  {
    slug: "mountain-view-chalet",
    title: "Mountain View Chalet",
    location: "Aspen, Colorado",
    pricePerNight: 412,
    guests: 8,
    bedrooms: 4,
    baths: 3,
    description:
      "Spacious chalet near trails with a stone fireplace and hot tub under the stars.",
  },
  {
    slug: "garden-bungalow",
    title: "Garden Bungalow",
    location: "Austin, Texas",
    pricePerNight: 142,
    guests: 3,
    bedrooms: 1,
    baths: 1,
    description:
      "Quiet neighborhood, fenced garden, and fast Wi‑Fi—ideal for remote work getaways.",
  },
];

export function getListingBySlug(slug) {
  return sampleListings.find((l) => l.slug === slug) ?? null;
}
