export const categoryDetails = {
  food: {
    key: "food",
    label: "Food & Drinks",
    emoji: "🍕",
    description: "Comfort foods, snacks, and sweet cravings.",
    accent: "from-orange-400 to-rose-400",
    preview: "Pizza",
  },
  animals: {
    key: "animals",
    label: "Animals",
    emoji: "🐾",
    description: "Wild picks, house pets, and zoo favorites.",
    accent: "from-sky-400 via-cyan-400 to-blue-500",
    preview: "Lion",
  },
  movies: {
    key: "movies",
    label: "Movies & TV",
    emoji: "🎬",
    description: "Big screen classics and binge-worthy picks.",
    accent: "from-violet-500 to-fuchsia-500",
    preview: "Titanic",
  },
  places: {
    key: "places",
    label: "Places",
    emoji: "🌍",
    description: "Everyday locations people can picture right away.",
    accent: "from-sky-400 to-emerald-400",
    preview: "Beach",
  },
  jobs: {
    key: "jobs",
    label: "Jobs",
    emoji: "💼",
    description: "Popular professions with easy party-game clues.",
    accent: "from-fuchsia-400 via-pink-500 to-violet-500",
    preview: "Doctor",
  },
  objects: {
    key: "objects",
    label: "Objects",
    emoji: "📱",
    description: "Common things you see, hold, or use every day.",
    accent: "from-indigo-500 to-sky-400",
    preview: "Phone",
  },
  sports: {
    key: "sports",
    label: "Sports",
    emoji: "🏀",
    description: "Fast, familiar, and great for energetic clues.",
    accent: "from-emerald-300 via-teal-300 to-lime-300",
    preview: "Football",
  },
  hobbies: {
    key: "hobbies",
    label: "Hobbies & Activities",
    emoji: "🎨",
    description: "Fun things people do for joy, skill, or chaos.",
    accent: "from-lime-400 to-amber-300",
    preview: "Painting",
  },
  famous_people: {
    key: "famous_people",
    label: "Famous People",
    emoji: "⭐",
    description: "Celebrities, athletes, and names everybody recognizes.",
    accent: "from-amber-400 via-rose-400 to-pink-500",
    preview: "Messi",
  },
  brands: {
    key: "brands",
    label: "Brands",
    emoji: "🛍️",
    description: "Big company names, iconic products, and everyday labels.",
    accent: "from-cyan-400 via-sky-500 to-indigo-500",
    preview: "Nike",
  },
  vehicles: {
    key: "vehicles",
    label: "Vehicles",
    emoji: "🚗",
    description: "Things that move people fast, slow, or somewhere in between.",
    accent: "from-red-400 via-orange-400 to-amber-300",
    preview: "Car",
  },
  technology: {
    key: "technology",
    label: "Technology",
    emoji: "💻",
    description: "Digital tools, gadgets, and tech everyone talks about.",
    accent: "from-slate-500 via-indigo-500 to-cyan-400",
    preview: "Laptop",
  },
  countries: {
    key: "countries",
    label: "Countries",
    emoji: "🌐",
    description: "Places around the world that are easy to clue and debate.",
    accent: "from-emerald-400 via-teal-400 to-cyan-500",
    preview: "India",
  },
};

function formatCategoryLabel(categoryKey) {
  return categoryKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getCategoryDetail(categoryKey) {
  return (
    categoryDetails[categoryKey] ?? {
      key: categoryKey,
      label: formatCategoryLabel(categoryKey),
      emoji: "🎲",
      description: "A surprise category picked for this round.",
      accent: "from-violet-500 to-fuchsia-500",
      preview: formatCategoryLabel(categoryKey),
    }
  );
}
