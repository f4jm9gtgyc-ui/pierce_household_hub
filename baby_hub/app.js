const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabaseClient = SUPABASE_URL.includes("YOUR_") ? null : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEY = "pregnancy_dashboard_state_v1";

const babyDevelopment = {
  4: ["0.04 oz", "0.04 in", "Poppy Seed", "Early neural tube development begins.", "The earliest structures are starting to form."],
  8: ["0.04 oz", "0.63 in", "Raspberry", "Tiny arms and legs are forming.", "Major organs are beginning their early development."],
  12: ["0.5 oz", "2.1 in", "Lime", "Reflexes are developing.", "Baby is starting to look more recognizably baby-shaped, because biology enjoys drama."],
  16: ["3.5 oz", "4.6 in", "Avocado", "Facial muscles are becoming more active.", "Baby is growing quickly and practicing tiny movements."],
  20: ["10.6 oz", "6.5 in", "Banana", "Movement may become easier to notice.", "The halfway point is here, which somehow feels both huge and wildly premature."],
  24: ["~1.3 lbs", "~12 in", "Corn Cob", "Hearing is becoming more developed.", "Baby is gaining weight steadily and developing facial features."],
  28: ["~2.2 lbs", "~14.8 in", "Eggplant", "Eyes may open and close.", "Baby is adding body fat and continuing brain development."],
  32: ["~3.8 lbs", "~16.7 in", "Squash", "Bones are hardening.", "Baby is growing fast and taking up more room, as tiny tenants do."],
  36: ["~5.8 lbs", "~18.7 in", "Romaine Lettuce", "Lungs are continuing to mature.", "Baby is preparing for birth and getting snug."],
  40: ["~7.6 lbs", "~20.2 in", "Small Pumpkin", "Full-term development is complete.", "Baby is ready for the big debut."],
};

const defaultState = {
  profile: { due_date: "" },
  checklist: [
    { id: crypto.randomUUID(), category: "Nursery", item_name: "Crib", completed: false },
    { id: crypto.randomUUID(), category: "Nursery", item_name: "Mattress", completed: false },
    { id: crypto.randomUUID(), category: "Nursery", item_name: "Monitor", completed: false },
    { id: crypto.randomUUID(), category: "Nursery", item_name: "Dresser", completed: false },
    { id: crypto.randomUUID(), category: "Feeding", item_name: "Bottles", completed: false },
    { id: crypto.randomUUID(), category: "Feeding", item_name: "Pump", completed: false },
    { id: crypto.randomUUID(), category: "Feeding", item_name: "Formula", completed: false },
    { id: crypto.randomUUID(), category: "Feeding", item_name: "Nursing Supplies", completed: false },
    { id: crypto.randomUUID(), category: "Travel", item_name: "Car Seat", completed: false },
    { id: crypto.randomUUID(), category: "Travel", item_name: "Stroller", completed: false },
    { id: crypto.randomUUID(), category: "Travel", item_name: "Diaper Bag", completed: false },
  ],
  expenses: [],
  settings: { monthly_budget: 0 },
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultState);
  try { return { ...structuredClone(defaultState), ...JSON.parse(saved) }; }
  catch { return structuredClone(defaultState); }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function getPregnancyStats(dueDateValue) {
  if (!dueDateValue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${dueDateValue}T00:00:00`);
  const conceptionStart = new Date(dueDate);
  conceptionStart.setDate(dueDate.getDate() - 280);
  const diffDays = Math.round((today - conceptionStart) / 86400000);
  const daysRemaining = Math.max(0, Math.round((dueDate - today) / 86400000));
  const totalDays = 280;
  const clamped = Math.min(Math.max(diffDays, 0), totalDays);
  const week = Math.floor(clamped / 7);
  const day = clamped % 7;
  const percent = Math.round((clamped / totalDays) * 100);
  let trimester = "First Trimester";
  if (week >= 28) trimester = "Third Trimester";
  else if (week >= 14) trimester = "Second Trimester";
  return { week, day, daysRemaining, percent, trimester };
}

function nearestDevelopment(week) {
  const key = Object.keys(babyDevelopment).map(Number).reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev, 24);
  return { week: key, data: babyDevelopment[key] };
}

function renderProfile() {
  document.getElementById("dueDate").value = state.profile.due_date || "";
  const stats = getPregnancyStats(state.profile.due_date);
  const fallback = "—";
  if (!stats) {
    ["daysRemaining", "babySize", "overviewWeek", "overviewTrimester", "overviewPercent"].forEach(id => document.getElementById(id).textContent = fallback);
    document.getElementById("weekDay").textContent = "Set your due date";
    document.getElementById("trimester").textContent = "Trimester appears here";
    document.getElementById("progressPercent").textContent = "0%";
    document.getElementById("progressRing").style.setProperty("--progress", 0);
    document.getElementById("pregnancyBar").style.width = "0%";
    return;
  }
  const dev = nearestDevelopment(stats.week);
  const [weight, length, size, milestone, summary] = dev.data;
  document.getElementById("weekDay").textContent = `Week ${stats.week} Day ${stats.day}`;
  document.getElementById("trimester").textContent = stats.trimester;
  document.getElementById("daysRemaining").textContent = stats.daysRemaining;
  document.getElementById("countdownText").textContent = stats.daysRemaining === 1 ? "Day until due date" : "Days until due date";
  document.getElementById("babySize").textContent = size;
  document.getElementById("progressPercent").textContent = `${stats.percent}%`;
  document.getElementById("progressRing").style.setProperty("--progress", stats.percent);
  document.getElementById("pregnancyBar").style.width = `${stats.percent}%`;
  document.getElementById("overviewWeek").textContent = `Week ${stats.week} Day ${stats.day}`;
  document.getElementById("overviewTrimester").textContent = stats.trimester;
  document.getElementById("overviewPercent").textContent = `${stats.percent}%`;
  document.getElementById("developmentTitle").textContent = `Week ${stats.week} Development`;
  document.getElementById("babyWeight").textContent = weight;
  document.getElementById("babyLength").textContent = length;
  document.getElementById("babyMilestone").textContent = milestone;
  document.getElementById("babySummary").textContent = summary;
}

function renderChecklist() {
  const container = document.getElementById("checklistGroups");
  container.innerHTML = "";
  const categories = ["Nursery", "Feeding", "Travel"];
  const total = state.checklist.length || 1;
  const done = state.checklist.filter(i => i.completed).length;
  const overall = Math.round((done / total) * 100);
  document.getElementById("overallChecklist").textContent = `${overall}%`;
  document.getElementById("checklistPill").textContent = `${overall}% done`;

  categories.forEach(category => {
    const items = state.checklist.filter(item => item.category === category);
    const categoryDone = items.filter(item => item.completed).length;
    const categoryPercent = items.length ? Math.round((categoryDone / items.length) * 100) : 0;
    const group = document.createElement("div");
    group.className = "checklist-group";
    group.innerHTML = `<h3>${category}</h3><div class="progress-bar"><span style="width:${categoryPercent}%"></span></div>`;
    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "check-item";
      row.innerHTML = `<label><input type="checkbox" ${item.completed ? "checked" : ""} data-id="${item.id}">${item.item_name}</label><button class="icon-btn" data-delete="${item.id}">×</button>`;
      group.appendChild(row);
    });
    container.appendChild(group);
  });
}

function renderBudget() {
  document.getElementById("monthlyBudget").value = state.settings.monthly_budget || "";
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthly = state.expenses.filter(exp => {
    const d = new Date(`${exp.expense_date}T00:00:00`);
    return d.getMonth() === month && d.getFullYear() === year;
  }).reduce((sum, exp) => sum + Number(exp.amount), 0);
  const total = state.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const budget = Number(state.settings.monthly_budget || 0);
  const remaining = budget - monthly;
  document.getElementById("monthlySpend").textContent = money(monthly);
  document.getElementById("totalSpend").textContent = money(total);
  document.getElementById("budgetVsActual").textContent = `${money(monthly)} / ${money(budget)}`;
  document.getElementById("budgetRemaining").textContent = `${money(remaining)} left`;

  const categoryTotals = {};
  state.expenses.forEach(exp => categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount));
  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  document.getElementById("largestCategory").textContent = entries[0]?.[0] || "—";

  const chart = document.getElementById("categoryChart");
  chart.innerHTML = "";
  const max = Math.max(...entries.map(e => e[1]), 1);
  entries.forEach(([category, amount]) => {
    const row = document.createElement("div");
    row.className = "chart-row";
    row.innerHTML = `<span>${category}</span><div class="chart-bar"><span style="width:${(amount / max) * 100}%"></span></div><strong>${money(amount)}</strong>`;
    chart.appendChild(row);
  });

  const list = document.getElementById("expenseList");
  list.innerHTML = "";
  state.expenses.slice().reverse().forEach(exp => {
    const item = document.createElement("div");
    item.className = "expense-item";
    item.innerHTML = `<div><strong>${exp.category} · ${money(exp.amount)}</strong><p>${exp.expense_date} ${exp.notes ? "· " + exp.notes : ""}</p></div><button class="ghost-btn" data-edit-expense="${exp.id}">Edit</button><button class="icon-btn" data-delete-expense="${exp.id}">×</button>`;
    list.appendChild(item);
  });
}

async function syncToSupabase() {
  if (!supabaseClient) return;
  // Intentionally light-touch. Add auth and row-level user ownership before production use.
  console.info("Supabase client configured. Wire CRUD calls here after running the SQL schema.");
}

function renderAll() {
  renderProfile();
  renderChecklist();
  renderBudget();
  syncToSupabase();
}

document.getElementById("profileForm").addEventListener("submit", e => {
  e.preventDefault();
  state.profile.due_date = document.getElementById("dueDate").value;
  saveState(); renderAll();
});

document.getElementById("checklistGroups").addEventListener("change", e => {
  const id = e.target.dataset.id;
  if (!id) return;
  state.checklist = state.checklist.map(item => item.id === id ? { ...item, completed: e.target.checked } : item);
  saveState(); renderAll();
});

document.getElementById("checklistGroups").addEventListener("click", e => {
  const id = e.target.dataset.delete;
  if (!id) return;
  state.checklist = state.checklist.filter(item => item.id !== id);
  saveState(); renderAll();
});

document.getElementById("checklistForm").addEventListener("submit", e => {
  e.preventDefault();
  const itemName = document.getElementById("checklistItem").value.trim();
  if (!itemName) return;
  state.checklist.push({ id: crypto.randomUUID(), category: document.getElementById("checklistCategory").value, item_name: itemName, completed: false });
  document.getElementById("checklistItem").value = "";
  saveState(); renderAll();
});

document.getElementById("budgetSettingsForm").addEventListener("submit", e => {
  e.preventDefault();
  state.settings.monthly_budget = Number(document.getElementById("monthlyBudget").value || 0);
  saveState(); renderAll();
});

document.getElementById("expenseDate").valueAsDate = new Date();
document.getElementById("expenseForm").addEventListener("submit", e => {
  e.preventDefault();
  state.expenses.push({
    id: crypto.randomUUID(),
    category: document.getElementById("expenseCategory").value,
    amount: Number(document.getElementById("expenseAmount").value),
    expense_date: document.getElementById("expenseDate").value,
    notes: document.getElementById("expenseNotes").value.trim(),
  });
  e.target.reset();
  document.getElementById("expenseDate").valueAsDate = new Date();
  saveState(); renderAll();
});

document.getElementById("expenseList").addEventListener("click", e => {
  const deleteId = e.target.dataset.deleteExpense;
  const editId = e.target.dataset.editExpense;
  if (deleteId) {
    state.expenses = state.expenses.filter(exp => exp.id !== deleteId);
    saveState(); renderAll();
  }
  if (editId) {
    const exp = state.expenses.find(item => item.id === editId);
    if (!exp) return;
    const amount = prompt("Update amount", exp.amount);
    const notes = prompt("Update notes", exp.notes || "");
    if (amount !== null) exp.amount = Number(amount);
    if (notes !== null) exp.notes = notes;
    saveState(); renderAll();
  }
});

document.getElementById("themeToggle").addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = dark ? "" : "dark";
  localStorage.setItem("pregnancy_dashboard_theme", dark ? "" : "dark");
});

document.documentElement.dataset.theme = localStorage.getItem("pregnancy_dashboard_theme") || "";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(console.warn);
}

renderAll();
