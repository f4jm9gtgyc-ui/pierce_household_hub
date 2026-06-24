export const DEVELOPMENT_BY_WEEK = {
  4: ["<0.1 oz", "<0.1 in", "The earliest structures are forming.", "Tiny Tenant has officially filed the paperwork."],
  8: ["~0.04 oz", "~0.6 in", "Major organs are beginning to form.", "A tiny blueprint is under active construction."],
  12: ["~0.5 oz", "~2.1 in", "Reflexes and facial features continue developing.", "The tenant is small, dramatic, and very busy."],
  16: ["~3.5 oz", "~4.6 in", "Movement may begin soon.", "Baby is growing quickly and practicing tiny motions."],
  20: ["~10.5 oz", "~6.5 in", "Hearing and movement are becoming more noticeable.", "Halfway-ish. The calendar is now emotionally loaded."],
  24: ["~1.3 lbs", "~12 in", "Hearing is becoming more developed.", "Baby is gaining weight steadily and developing facial features."],
  28: ["~2.2 lbs", "~14.8 in", "Eyes may open and close.", "The third trimester has entered the chat."],
  32: ["~3.8 lbs", "~16.7 in", "Baby is practicing breathing movements.", "Growth mode is fully activated."],
  36: ["~5.8 lbs", "~18.7 in", "Baby is gaining fat and preparing for birth.", "Move-in day is getting suspiciously close."],
  40: ["~7.5 lbs", "~20 in", "Baby is considered full term around this stage.", "Final walkthrough pending."]
};

export const SIZE_BY_WEEK = [
  [4, "Poppy Seed"], [5, "Sesame Seed"], [6, "Lentil"], [7, "Blueberry"], [8, "Raspberry"], [9, "Grape"], [10, "Kumquat"], [11, "Fig"], [12, "Lime"], [13, "Lemon"], [14, "Peach"], [15, "Apple"], [16, "Avocado"], [17, "Turnip"], [18, "Bell Pepper"], [19, "Mango"], [20, "Banana"], [21, "Carrot"], [22, "Papaya"], [23, "Grapefruit"], [24, "Corn Cob"], [25, "Rutabaga"], [26, "Scallion Bundle"], [27, "Cauliflower"], [28, "Eggplant"], [29, "Butternut Squash"], [30, "Cabbage"], [31, "Coconut"], [32, "Jicama"], [33, "Pineapple"], [34, "Cantaloupe"], [35, "Honeydew"], [36, "Romaine Lettuce"], [37, "Swiss Chard"], [38, "Leek"], [39, "Watermelon"], [40, "Small Pumpkin"]
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
  return { daysPregnant, daysRemaining, week, day, percent, trimester, size: getBabySize(week) };
}

export function getBabySize(week) {
  let size = "Tiny blueprint";
  for (const [minWeek, label] of SIZE_BY_WEEK) if (week >= minWeek) size = label;
  return size;
}

export function getDevelopment(week) {
  const weeks = Object.keys(DEVELOPMENT_BY_WEEK).map(Number).sort((a, b) => a - b);
  let match = weeks[0];
  weeks.forEach((candidate) => { if (week >= candidate) match = candidate; });
  return DEVELOPMENT_BY_WEEK[match];
}
