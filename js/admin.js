// Omnifood admin panel: CRUD, search, filter and pagination for recipes and users.
// Data is persisted in localStorage (no backend needed for the demo).
const KEYS = { recipes: "omini_recipes", users: "omini_users" };
const PAGE_SIZE = 5;

const seed = {
  recipes: [
    { id: "r1", name: "Japanese Gyozas", type: "vegetarian", calories: 650, nutriScore: 74, rating: 4.9, image: "../img/meals/meal-1.jpg" },
    { id: "r2", name: "Avocado Salad", type: "vegan", calories: 400, nutriScore: 92, rating: 4.8, image: "../img/meals/meal-2.jpg" },
  ],
  users: [
    { id: "u1", name: "Dave Bryson", email: "dave@example.com", role: "customer" },
    { id: "u2", name: "Ben Hadley", email: "ben@example.com", role: "manager" },
    { id: "u3", name: "Admin User", email: "admin@omnifood.com", role: "admin" },
  ],
};

const $ = (id) => document.getElementById(id);
const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const load = (name) => {
  try {
    return JSON.parse(localStorage.getItem(KEYS[name])) || seed[name];
  } catch {
    return seed[name];
  }
};
const save = (name, data) => localStorage.setItem(KEYS[name], JSON.stringify(data));

const state = {
  recipes: { data: load("recipes"), page: 1 },
  users: { data: load("users"), page: 1 },
};

function toast(message, type = "success") {
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.textContent = message;
  $("toast-stack").appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function paginate(name, items, listEl, pagerEl, renderItem) {
  const s = state[name];
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  s.page = Math.min(s.page, pages);
  const slice = items.slice((s.page - 1) * PAGE_SIZE, s.page * PAGE_SIZE);
  listEl.innerHTML = slice.length ? slice.map(renderItem).join("") : "<p>No results found.</p>";
  pagerEl.innerHTML = `
    <button type="button" class="admin-page-btn" data-dir="-1" ${s.page === 1 ? "disabled" : ""}>Prev</button>
    <span class="admin-page-indicator">Page ${s.page} of ${pages}</span>
    <button type="button" class="admin-page-btn" data-dir="1" ${s.page === pages ? "disabled" : ""}>Next</button>`;
}

function renderMetrics() {
  const { recipes, users } = state;
  $("metric-recipes").textContent = recipes.data.length;
  $("metric-users").textContent = users.data.length;
  const avg = recipes.data.length
    ? recipes.data.reduce((sum, r) => sum + Number(r.rating), 0) / recipes.data.length
    : 0;
  $("metric-rating").textContent = avg.toFixed(1);
}

function renderRecipes() {
  const q = $("recipe-search").value.trim().toLowerCase();
  const type = $("recipe-type-filter").value;
  const items = state.recipes.data.filter(
    (r) => r.name.toLowerCase().includes(q) && (type === "all" || r.type === type)
  );
  paginate("recipes", items, $("recipe-list-admin"), $("recipe-pagination"), (r) => `
    <div class="admin-item">
      <div><strong>${esc(r.name)}</strong>
        <p>${esc(r.type)} · ${esc(r.calories)} kcal · NutriScore ${esc(r.nutriScore)} · ★ ${esc(r.rating)}</p></div>
      <div class="admin-actions">
        <button class="btn btn--outline" data-action="edit-recipe" data-id="${esc(r.id)}">Edit</button>
        <button class="btn btn--outline" data-action="delete-recipe" data-id="${esc(r.id)}">Delete</button>
      </div>
    </div>`);
  renderMetrics();
}

function renderUsers() {
  const q = $("user-search").value.trim().toLowerCase();
  const role = $("user-role-filter").value;
  const items = state.users.data.filter(
    (u) => (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) && (role === "all" || u.role === role)
  );
  paginate("users", items, $("user-list-admin"), $("user-pagination"), (u) => `
    <div class="admin-item">
      <div><strong>${esc(u.name)}</strong><p>${esc(u.email)} <span class="admin-role">${esc(u.role)}</span></p></div>
      <div class="admin-actions">
        <button class="btn btn--outline" data-action="edit-user" data-id="${esc(u.id)}">Edit</button>
        <button class="btn btn--outline" data-action="delete-user" data-id="${esc(u.id)}">Delete</button>
      </div>
    </div>`);
  renderMetrics();
}

// Generic upsert: updates the record if the hidden id field is set, otherwise creates one.
function upsert(name, idField, record) {
  const s = state[name];
  const id = $(idField).value;
  if (id) {
    s.data = s.data.map((x) => (x.id === id ? { ...record, id } : x));
    toast("Updated successfully", "info");
  } else {
    s.data.push({ ...record, id: `${name[0]}${Date.now()}` });
    toast("Created successfully");
  }
  save(name, s.data);
}

$("recipe-form").addEventListener("submit", (e) => {
  e.preventDefault();
  upsert("recipes", "recipe-id", {
    name: $("recipe-name").value.trim(),
    type: $("recipe-type").value,
    calories: Number($("recipe-calories").value),
    nutriScore: Number($("recipe-nutriscore").value),
    rating: Number($("recipe-rating").value),
    image: $("recipe-image").value.trim(),
  });
  e.target.reset();
  $("recipe-id").value = "";
  $("recipe-image").value = "../img/meals/meal-1.jpg";
  renderRecipes();
});

$("user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("user-email").value.trim().toLowerCase();
  const dupe = state.users.data.some((u) => u.email.toLowerCase() === email && u.id !== $("user-id").value);
  if (dupe) return toast("A user with this email already exists", "warning");
  upsert("users", "user-id", { name: $("user-name").value.trim(), email, role: $("user-role").value });
  e.target.reset();
  $("user-id").value = "";
  renderUsers();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action], .admin-page-btn");
  if (!btn) return;
  if (btn.classList.contains("admin-page-btn")) {
    const name = btn.closest("#recipe-pagination") ? "recipes" : "users";
    state[name].page += Number(btn.dataset.dir);
    return name === "recipes" ? renderRecipes() : renderUsers();
  }
  const { action, id } = btn.dataset;
  if (action === "edit-recipe") {
    const r = state.recipes.data.find((x) => x.id === id);
    $("recipe-id").value = r.id; $("recipe-name").value = r.name; $("recipe-type").value = r.type;
    $("recipe-calories").value = r.calories; $("recipe-nutriscore").value = r.nutriScore;
    $("recipe-rating").value = r.rating; $("recipe-image").value = r.image;
    $("recipe-form").scrollIntoView({ behavior: "smooth" });
  } else if (action === "edit-user") {
    const u = state.users.data.find((x) => x.id === id);
    $("user-id").value = u.id; $("user-name").value = u.name; $("user-email").value = u.email; $("user-role").value = u.role;
    $("user-form").scrollIntoView({ behavior: "smooth" });
  } else if (action === "delete-recipe" || action === "delete-user") {
    const name = action === "delete-recipe" ? "recipes" : "users";
    if (!confirm("Delete this item?")) return;
    state[name].data = state[name].data.filter((x) => x.id !== id);
    save(name, state[name].data);
    toast("Deleted", "warning");
    name === "recipes" ? renderRecipes() : renderUsers();
  }
});

["recipe-search", "recipe-type-filter"].forEach((id) =>
  $(id).addEventListener("input", () => { state.recipes.page = 1; renderRecipes(); }));
["user-search", "user-role-filter"].forEach((id) =>
  $(id).addEventListener("input", () => { state.users.page = 1; renderUsers(); }));

renderRecipes();
renderUsers();
