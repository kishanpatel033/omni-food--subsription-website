

///////////////////////////////////////////////////////////
// Set current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

///////////////////////////////////////////////////////////
// Make mobile navigation work

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");

    // Allow normal navigation for other pages (example: admin/index.html)
    if (!href || (href !== "#" && !href.startsWith("#"))) return;

    e.preventDefault();

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

///////////////////////////////////////////////////////////
// Sticky navigation

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js

///////////////////////////////////////////////////////////
// Meals section: render from admin recipes data

const RECIPES_STORAGE_KEY = "omini_recipes";
const typeClassMap = {
  vegetarian: "tag--vegetarian",
  vegan: "tag--vegan",
  paleo: "tag--paleo",
};

const defaultRecipes = [
  {
    id: "r1",
    name: "Japanese Gyozas",
    type: "vegetarian",
    calories: 650,
    nutriScore: 74,
    rating: 4.9,
    image: "img/meals/meal-1.jpg",
  },
  {
    id: "r2",
    name: "Avocado Salad",
    type: "vegan",
    calories: 400,
    nutriScore: 92,
    rating: 4.8,
    image: "img/meals/meal-2.jpg",
  },
];

function getSavedRecipes() {
  const saved = localStorage.getItem(RECIPES_STORAGE_KEY);
  if (!saved) return defaultRecipes;
  try {
    return JSON.parse(saved);
  } catch (error) {
    return defaultRecipes;
  }
}

function normalizeTypeLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function normalizeRecipeImagePath(imagePath) {
  if (!imagePath) return "img/meals/meal-1.jpg";
  return imagePath.replace("../", "");
}

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function recipeCardMarkup(recipe) {
  const tagClass = typeClassMap[recipe.type] || "tag--vegetarian";
  const imagePath = normalizeRecipeImagePath(recipe.image);
  return `
    <div class="meal">
      <img src="${imagePath}" class="meal-img" alt="${escapeHtml(recipe.name)}" />
      <div class="meal-content">
        <div class="meal-tags">
          <span class="tag ${tagClass}">${normalizeTypeLabel(recipe.type)}</span>
        </div>
        <p class="meal-title">${escapeHtml(recipe.name)}</p>
        <ul class="meal-attributes">
          <li class="meal-attribute">
            <ion-icon class="meal-icon" name="flame-outline"></ion-icon>
            <span><strong>${recipe.calories}</strong> calories</span>
          </li>
          <li class="meal-attribute">
            <ion-icon class="meal-icon" name="restaurant-outline"></ion-icon>
            <span>NutriScore &reg; <strong>${recipe.nutriScore}</strong></span>
          </li>
          <li class="meal-attribute">
            <ion-icon class="meal-icon" name="star-outline"></ion-icon>
            <span><strong>${recipe.rating}</strong> rating</span>
          </li>
        </ul>
      </div>
    </div>
  `;
}

const recipes = getSavedRecipes();
const featuredRecipesListEl = document.getElementById("featured-recipes-list");
const allRecipesListEl = document.getElementById("all-recipes-list");
const allRecipesPanelEl = document.getElementById("all-recipes-panel");
const seeAllRecipesBtnEl = document.getElementById("see-all-recipes-btn");

if (featuredRecipesListEl) {
  featuredRecipesListEl.innerHTML = recipes
    .slice(0, 2)
    .map(function (recipe) {
      return recipeCardMarkup(recipe);
    })
    .join("");
}

if (allRecipesListEl) {
  allRecipesListEl.innerHTML = recipes
    .map(function (recipe) {
      return recipeCardMarkup(recipe);
    })
    .join("");
}

if (seeAllRecipesBtnEl && allRecipesPanelEl) {
  seeAllRecipesBtnEl.addEventListener("click", function () {
    allRecipesPanelEl.classList.remove("hidden");
    allRecipesPanelEl.scrollIntoView({ behavior: "smooth" });
  });
}

///////////////////////////////////////////////////////////
// Pricing payment section interactions

const paymentSectionEl = document.querySelector(".payment-section");
const selectedPlanEl = document.querySelector(".selected-plan");
const paymentTriggers = document.querySelectorAll(".payment-trigger");
const paymentTabs = document.querySelectorAll(".payment-tab");
const paymentContents = document.querySelectorAll(".payment-content");

if (paymentSectionEl && selectedPlanEl && paymentTriggers.length > 0) {
  paymentTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const selectedPlan = trigger.dataset.plan || "Starter";
      selectedPlanEl.textContent = selectedPlan;
      paymentSectionEl.classList.remove("hidden");
      paymentSectionEl.scrollIntoView({ behavior: "smooth" });
    });
  });
}

if (paymentTabs.length > 0 && paymentContents.length > 0) {
  paymentTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const method = tab.dataset.method;
      paymentTabs.forEach(function (item) {
        item.classList.remove("payment-tab--active");
      });
      tab.classList.add("payment-tab--active");

      paymentContents.forEach(function (content) {
        content.classList.toggle(
          "payment-content--active",
          content.dataset.content === method
        );
      });
    });
  });
}

const paymentFormEl = document.querySelector(".payment-form");
if (paymentFormEl) {
  paymentFormEl.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Demo only: no payment was processed and no card data is stored.");
    paymentFormEl.reset();
  });
}
