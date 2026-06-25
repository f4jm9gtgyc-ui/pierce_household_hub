export const DEVELOPMENT_BY_WEEK = {
  4: {
    weight: "<0.1 oz",
    length: "<0.1 in",
    milestone: "The earliest structures are forming.",
    summary: "Tiny Tenant has officially filed the paperwork.",
    you: "You may be feeling totally normal, extra tired, or suspicious of every smell in the building.",
    image: "🌱",
    imageLabel: "Poppy Seed"
  },
  8: {
    weight: "~0.04 oz",
    length: "~0.6 in",
    milestone: "Major organs are beginning to form.",
    summary: "A tiny blueprint is under active construction.",
    you: "Fatigue, nausea, and food opinions may start acting like they own the place.",
    image: "🍇",
    imageLabel: "Raspberry"
  },
  12: {
    weight: "~0.5 oz",
    length: "~2.1 in",
    milestone: "Reflexes and facial features continue developing.",
    summary: "The tenant is small, dramatic, and very busy.",
    you: "Energy may start improving soon, though the body calendar is not exactly known for reliability."
    ,image: "🍋",
    imageLabel: "Lime"
  },
  16: {
    weight: "~3.5 oz",
    length: "~4.6 in",
    milestone: "Movement may begin soon.",
    summary: "Baby is growing quickly and practicing tiny motions.",
    you: "You may notice a growing bump and less tolerance for pants with ambition.",
    image: "🥑",
    imageLabel: "Avocado"
  },
  20: {
    weight: "~10.5 oz",
    length: "~6.5 in",
    milestone: "Hearing and movement are becoming more noticeable.",
    summary: "Halfway-ish. The calendar is now emotionally loaded.",
    you: "You may start feeling more movement and possibly more back or hip pressure.",
    image: "🍌",
    imageLabel: "Banana"
  },
  24: {
    weight: "~1.3 lbs",
    length: "~12 in",
    milestone: "Hearing is becoming more developed.",
    summary: "Baby is gaining weight steadily and developing facial features.",
    you: "You may notice stronger kicks, more heartburn, and a bladder with fewer civil rights.",
    image: "🌽",
    imageLabel: "Corn Cob"
  },
  28: {
    weight: "~2.2 lbs",
    length: "~14.8 in",
    milestone: "Eyes may open and close.",
    summary: "The third trimester has entered the chat.",
    you: "Sleep may get trickier, and appointments may become more frequent.",
    image: "🍆",
    imageLabel: "Eggplant"
  },
  32: {
    weight: "~3.8 lbs",
    length: "~16.7 in",
    milestone: "Baby is practicing breathing movements.",
    summary: "Growth mode is fully activated.",
    you: "You may feel more pressure, swelling, and a sudden need to organize tiny socks.",
    image: "🍍",
    imageLabel: "Pineapple"
  },
  36: {
    weight: "~5.8 lbs",
    length: "~18.7 in",
    milestone: "Baby is gaining fat and preparing for birth.",
    summary: "Move-in day is getting suspiciously close.",
    you: "You may feel heavier pressure, more Braxton Hicks, and strong nesting instincts.",
    image: "🥬",
    imageLabel: "Romaine Lettuce"
  },
  40: {
    weight: "~7.5 lbs",
    length: "~20 in",
    milestone: "Baby is considered full term around this stage.",
    summary: "Final walkthrough pending.",
    you: "You may be deeply ready for the tenant to stop using you as a studio apartment.",
    image: "🎃",
    imageLabel: "Small Pumpkin"
  }
};

export const SIZE_BY_WEEK = [
  [4, "Poppy Seed", "🌱"], [5, "Sesame Seed", "⚪"], [6, "Lentil", "🫘"], [7, "Blueberry", "🫐"], [8, "Raspberry", "🍇"], [9, "Grape", "🍇"], [10, "Kumquat", "🍊"], [11, "Fig", "🫒"], [12, "Lime", "🍋"], [13, "Lemon", "🍋"], [14, "Peach", "🍑"], [15, "Apple", "🍎"], [16, "Avocado", "🥑"], [17, "Turnip", "🥔"], [18, "Bell Pepper", "🫑"], [19, "Mango", "🥭"], [20, "Banana", "🍌"], [21, "Carrot", "🥕"], [22, "Papaya", "🥭"], [23, "Grapefruit", "🍊"], [24, "Corn Cob", "🌽"], [25, "Rutabaga", "🥔"], [26, "Scallion Bundle", "🌿"], [27, "Cauliflower", "🥦"], [28, "Eggplant", "🍆"], [29, "Butternut Squash", "🍠"], [30, "Cabbage", "🥬"], [31, "Coconut", "🥥"], [32, "Jicama", "🥔"], [33, "Pineapple", "🍍"], [34, "Cantaloupe", "🍈"], [35, "Honeydew", "🍈"], [36, "Romaine Lettuce", "🥬"], [37, "Swiss Chard", "🥬"], [38, "Leek", "🌿"], [39, "Watermelon", "🍉"], [40, "Small Pumpkin", "🎃"]
];

export function parseDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(value) {
  if (!value) return "—";
  return parseDate(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function calculatePregnancy(dueDateValue) {
  const dueDate = parseDate(dueDateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = 280;
  const start = new Date(dueDate);
  start.setDate(start.getDate() - totalDays);
  const daysPregnant = Math.min(Math.max(Math.floor((today - start) / 86400000), 0), totalDays);
  const daysRemaining = Math.max(0, Math.ceil((dueDate - today) / 86400000));
  const week = Math.floor(daysPregnant / 7);
  const day = daysPregnant % 7;
  const percent = Math.round((daysPregnant / totalDays) * 100);
  const trimester = week < 14 ? "First Trimester" : week < 28 ? "Second Trimester" : "Third Trimester";
  return { daysPregnant, daysRemaining, week, day, percent, trimester, size: getBabySize(week), sizeEmoji: getBabySizeEmoji(week) };
}

export function getBabySize(week) {
  let size = "Tiny blueprint";
  for (const [minWeek, label] of SIZE_BY_WEEK) if (week >= minWeek) size = label;
  return size;
}

export function getBabySizeEmoji(week) {
  let emoji = "🏠";
  for (const [minWeek, label, candidateEmoji] of SIZE_BY_WEEK) if (week >= minWeek) emoji = candidateEmoji;
  return emoji;
}

export function getDevelopment(week) {
  const weeks = Object.keys(DEVELOPMENT_BY_WEEK).map(Number).sort((a, b) => a - b);
  let match = weeks[0];
  weeks.forEach((candidate) => { if (week >= candidate) match = candidate; });
  return DEVELOPMENT_BY_WEEK[match];
}
