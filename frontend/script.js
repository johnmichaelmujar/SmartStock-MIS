"use strict";
const API_URL = "http://localhost:5000/api";

async function checkBackendConnection() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    console.log("Backend says:", data.message);
  } catch (error) {
    console.error("Could not connect to the backend:", error);
  }
}
checkBackendConnection();

const PROD_KEY = "palengke_products";
const SALES_KEY = "palengke_sales";
const EXP_KEY = "palengke_expenses";
const VER_KEY = "palengke_version";
const CURR_VER = "v17";
// const CREDS = { username: "admin", password: "admin123" };
const LOW_STOCK = 10;

const CAT_COLORS = {
  "Canned Goods": "badge-orange",
  "Instant Noodles": "badge-red",
  Beverages: "badge-blue",
  Dairy: "badge-green",
  Condiments: "badge-orange",
  Snacks: "badge-gray",
  "Personal Care": "badge-blue",
  "Rice & Grains": "badge-green",
  Others: "badge-gray",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ── State ──────────────────────────────────────────────── */
let products = [];
let sales = [];
let expenses = [];
let editingId = null;
let deleteTarget = null;
let deleteSaleId = null;
let salesChartMode = "revenue"; // 'revenue' | 'units'
let dashChartMode = "revenue"; // 'revenue' | 'units'

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginPage").classList.add("active");
  document.getElementById("appPage").classList.remove("active");
  loadData();
  loadAppearance();
  updateTopbarDate();
  setInterval(updateTopbarDate, 60000);
  if (sessionStorage.getItem("palengke_auth") === "1") showApp();
});

function updateTopbarDate() {
  const el = document.getElementById("topbarDate");
  if (!el) return;
  el.textContent = new Date().toLocaleDateString("en-PH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ══════════════════════════════════════════════
   DATA — LocalStorage
══════════════════════════════════════════════ */
function loadData() {
  try {
    if (localStorage.getItem(VER_KEY) !== CURR_VER) {
      localStorage.removeItem(PROD_KEY);
      localStorage.removeItem(SALES_KEY);
      localStorage.removeItem("palengke_profile");
      localStorage.setItem(VER_KEY, CURR_VER);
    }
    const rp = localStorage.getItem(PROD_KEY);
    const rs = localStorage.getItem(SALES_KEY);
    products = rp ? JSON.parse(rp) : seedProducts();
    sales = rs ? JSON.parse(rs) : seedSales();
    const re = localStorage.getItem(EXP_KEY);
    if (re) {
      const parsed = JSON.parse(re);
      // Remove any July records (leftover from old seed)
      expenses = parsed.filter((e) => !e.date.includes("-07-"));
      localStorage.setItem(EXP_KEY, JSON.stringify(expenses));
    } else {
      expenses = seedExpenses();
    }
    // Seed default profile name if not set
    if (!localStorage.getItem("palengke_profile")) {
      localStorage.setItem(
        "palengke_profile",
        JSON.stringify({ name: "Admin", role: "Store Manager" }),
      );
    }
  } catch {
    products = seedProducts();
    sales = seedSales();
  }
}

function saveProducts() {
  localStorage.setItem(PROD_KEY, JSON.stringify(products));
}
function saveSales() {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}
function saveExpenses() {
  localStorage.setItem(EXP_KEY, JSON.stringify(expenses));
}

/* ── Seed Products (113 items) ────────────────────────── */
function seedProducts() {
  const p = [
    // CANNED GOODS (16)
    {
      id: uid(),
      name: "Argentina Corned Beef 150g",
      category: "Canned Goods",
      price: 48,
      qty: 80,
      dateAdded: today(),
      expiry: "2027-06-30",
    },
    {
      id: uid(),
      name: "Argentina Corned Beef 260g",
      category: "Canned Goods",
      price: 82,
      qty: 55,
      dateAdded: today(),
      expiry: "2027-08-31",
    },
    {
      id: uid(),
      name: "Century Tuna Flakes in Oil",
      category: "Canned Goods",
      price: 32,
      qty: 9,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Century Tuna Hot & Spicy",
      category: "Canned Goods",
      price: 32,
      qty: 40,
      dateAdded: today(),
      expiry: "2027-03-31",
    },
    {
      id: uid(),
      name: "Mega Sardines in Tomato Sauce",
      category: "Canned Goods",
      price: 18,
      qty: 120,
      dateAdded: today(),
      expiry: "2027-01-31",
    },
    {
      id: uid(),
      name: "Ligo Sardines in Oil",
      category: "Canned Goods",
      price: 20,
      qty: 95,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Del Monte Tomato Sauce 250g",
      category: "Canned Goods",
      price: 22,
      qty: 60,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Hunt's Pork & Beans 230g",
      category: "Canned Goods",
      price: 28,
      qty: 50,
      dateAdded: today(),
      expiry: "2027-02-28",
    },
    {
      id: uid(),
      name: "San Marino Corned Tuna",
      category: "Canned Goods",
      price: 28,
      qty: 45,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Delimondo Corned Beef 380g",
      category: "Canned Goods",
      price: 165,
      qty: 20,
      dateAdded: today(),
      expiry: "2027-05-31",
    },
    {
      id: uid(),
      name: "555 Sardines Spanish Style",
      category: "Canned Goods",
      price: 22,
      qty: 75,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Purefoods Liver Spread 165g",
      category: "Canned Goods",
      price: 38,
      qty: 35,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Reno Liver Spread 85g",
      category: "Canned Goods",
      price: 22,
      qty: 60,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Del Monte Fruit Cocktail 432g",
      category: "Canned Goods",
      price: 65,
      qty: 30,
      dateAdded: today(),
      expiry: "2027-04-30",
    },
    {
      id: uid(),
      name: "Jolly Mushroom Pieces 400g",
      category: "Canned Goods",
      price: 42,
      qty: 28,
      dateAdded: today(),
      expiry: "2027-01-31",
    },
    {
      id: uid(),
      name: "UFC Spaghetti Sauce Sweet",
      category: "Canned Goods",
      price: 35,
      qty: 55,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    // INSTANT NOODLES (13)
    {
      id: uid(),
      name: "Lucky Me Pancit Canton Original",
      category: "Instant Noodles",
      price: 15,
      qty: 200,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Lucky Me Pancit Canton Chilimansi",
      category: "Instant Noodles",
      price: 15,
      qty: 180,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Lucky Me Chicken Noodle Soup",
      category: "Instant Noodles",
      price: 14,
      qty: 150,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Lucky Me Sweet & Spicy",
      category: "Instant Noodles",
      price: 15,
      qty: 160,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Lucky Me Superior Chicken",
      category: "Instant Noodles",
      price: 14,
      qty: 130,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Lucky Me Pancit Canton Batchoy",
      category: "Instant Noodles",
      price: 15,
      qty: 140,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Nissin Cup Noodles Seafood",
      category: "Instant Noodles",
      price: 28,
      qty: 7,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    {
      id: uid(),
      name: "Nissin Cup Noodles Beef",
      category: "Instant Noodles",
      price: 28,
      qty: 60,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Payless Beef Flavor",
      category: "Instant Noodles",
      price: 10,
      qty: 220,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Quickchow Instant Mami Beef",
      category: "Instant Noodles",
      price: 12,
      qty: 90,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Maruchan Ramen Chicken",
      category: "Instant Noodles",
      price: 18,
      qty: 45,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Monde Nissin Batchoy Flavor",
      category: "Instant Noodles",
      price: 13,
      qty: 100,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Koka Purple Wheat Noodles",
      category: "Instant Noodles",
      price: 35,
      qty: 5,
      dateAdded: today(),
      expiry: "2026-05-31",
    },
    // BEVERAGES (14)
    {
      id: uid(),
      name: "Nescafe 3-in-1 Original 10s",
      category: "Beverages",
      price: 38,
      qty: 75,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Nescafe Classic Sachet 2g",
      category: "Beverages",
      price: 6,
      qty: 300,
      dateAdded: today(),
      expiry: "2027-03-31",
    },
    {
      id: uid(),
      name: "Milo Sachet 22g",
      category: "Beverages",
      price: 9,
      qty: 250,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Milo Activ-Go Pouch 1kg",
      category: "Beverages",
      price: 285,
      qty: 12,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "San Miguel Beer Pale 330ml",
      category: "Beverages",
      price: 55,
      qty: 4,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Red Horse Beer 500ml",
      category: "Beverages",
      price: 65,
      qty: 24,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Coca-Cola Mismo 237ml",
      category: "Beverages",
      price: 22,
      qty: 48,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Royal Tru-Orange 1L",
      category: "Beverages",
      price: 42,
      qty: 36,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    {
      id: uid(),
      name: "C2 Green Tea Apple 230ml",
      category: "Beverages",
      price: 18,
      qty: 55,
      dateAdded: today(),
      expiry: "2026-05-15",
    },
    {
      id: uid(),
      name: "Gatorade Lemon-Lime 500ml",
      category: "Beverages",
      price: 45,
      qty: 30,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Kopiko Brown Coffee 30s",
      category: "Beverages",
      price: 72,
      qty: 40,
      dateAdded: today(),
      expiry: "2027-01-31",
    },
    {
      id: uid(),
      name: "Tang Orange Juice Sachet",
      category: "Beverages",
      price: 5,
      qty: 500,
      dateAdded: today(),
      expiry: "2027-06-30",
    },
    {
      id: uid(),
      name: "Nestea Iced Tea Lemon Sachet",
      category: "Beverages",
      price: 5,
      qty: 400,
      dateAdded: today(),
      expiry: "2027-05-31",
    },
    {
      id: uid(),
      name: "Ovaltine Classic 300g",
      category: "Beverages",
      price: 112,
      qty: 18,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    // DAIRY (10)
    {
      id: uid(),
      name: "Eden Cheese 165g",
      category: "Dairy",
      price: 65,
      qty: 30,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    {
      id: uid(),
      name: "Eden Cheese 440g",
      category: "Dairy",
      price: 148,
      qty: 15,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Magnolia Fresh Milk 1L",
      category: "Dairy",
      price: 92,
      qty: 8,
      dateAdded: today(),
      expiry: "2026-03-25",
    },
    {
      id: uid(),
      name: "Alaska Evaporated Milk 370ml",
      category: "Dairy",
      price: 42,
      qty: 48,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Nestle Condensed Milk 300ml",
      category: "Dairy",
      price: 38,
      qty: 55,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Bear Brand Powdered Milk 300g",
      category: "Dairy",
      price: 135,
      qty: 22,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Anchor Full Cream Milk 400g",
      category: "Dairy",
      price: 195,
      qty: 10,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Magnolia Butter 225g",
      category: "Dairy",
      price: 82,
      qty: 20,
      dateAdded: today(),
      expiry: "2026-05-31",
    },
    {
      id: uid(),
      name: "Nestle All Purpose Cream 250ml",
      category: "Dairy",
      price: 55,
      qty: 35,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Selecta Ice Cream Vanilla 750ml",
      category: "Dairy",
      price: 185,
      qty: 6,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    // CONDIMENTS (12)
    {
      id: uid(),
      name: "UFC Banana Ketchup 320g",
      category: "Condiments",
      price: 42,
      qty: 50,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Jufran Banana Sauce 320g",
      category: "Condiments",
      price: 45,
      qty: 40,
      dateAdded: today(),
      expiry: "2027-01-31",
    },
    {
      id: uid(),
      name: "Datu Puti Vinegar 1L",
      category: "Condiments",
      price: 32,
      qty: 45,
      dateAdded: today(),
      expiry: "2027-06-30",
    },
    {
      id: uid(),
      name: "Datu Puti Soy Sauce 1L",
      category: "Condiments",
      price: 38,
      qty: 50,
      dateAdded: today(),
      expiry: "2027-03-31",
    },
    {
      id: uid(),
      name: "Silver Swan Soy Sauce 1L",
      category: "Condiments",
      price: 40,
      qty: 38,
      dateAdded: today(),
      expiry: "2027-02-28",
    },
    {
      id: uid(),
      name: "Mama Sita's Kare-Kare Mix 50g",
      category: "Condiments",
      price: 22,
      qty: 65,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Mama Sita's Adobo Mix",
      category: "Condiments",
      price: 18,
      qty: 70,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Maggi Magic Sarap 8g",
      category: "Condiments",
      price: 5,
      qty: 400,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Knorr Sinigang Mix 44g",
      category: "Condiments",
      price: 18,
      qty: 80,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Ajinomoto Vetsin 100g",
      category: "Condiments",
      price: 22,
      qty: 90,
      dateAdded: today(),
      expiry: "2027-05-31",
    },
    {
      id: uid(),
      name: "Lorins Patis Fish Sauce 340ml",
      category: "Condiments",
      price: 30,
      qty: 35,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Lee Kum Kee Oyster Sauce 255g",
      category: "Condiments",
      price: 58,
      qty: 28,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    // SNACKS (16)
    {
      id: uid(),
      name: "Sky Flakes Plain Crackers 250g",
      category: "Snacks",
      price: 35,
      qty: 85,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Rebisco Crackers 250g",
      category: "Snacks",
      price: 30,
      qty: 100,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Oishi Prawn Crackers 90g",
      category: "Snacks",
      price: 28,
      qty: 60,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Oishi Pillows Choco 38g",
      category: "Snacks",
      price: 12,
      qty: 120,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    {
      id: uid(),
      name: "Piattos Cheese 85g",
      category: "Snacks",
      price: 32,
      qty: 70,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Jack 'n Jill Chippy BBQ 110g",
      category: "Snacks",
      price: 28,
      qty: 55,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Richeese Cheese Puff 65g",
      category: "Snacks",
      price: 22,
      qty: 80,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Clover Chips 85g",
      category: "Snacks",
      price: 20,
      qty: 95,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    {
      id: uid(),
      name: "Hansel Filled Choco 150g",
      category: "Snacks",
      price: 38,
      qty: 45,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Fita Crackers 250g",
      category: "Snacks",
      price: 32,
      qty: 60,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Nova Country Cheddar 78g",
      category: "Snacks",
      price: 22,
      qty: 75,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Lala Butter Cookies 100g",
      category: "Snacks",
      price: 28,
      qty: 50,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
    {
      id: uid(),
      name: "Monde Mamon 10s",
      category: "Snacks",
      price: 45,
      qty: 3,
      dateAdded: today(),
      expiry: "2026-04-15",
    },
    {
      id: uid(),
      name: "Nips Chocolate Candy 30g",
      category: "Snacks",
      price: 18,
      qty: 150,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Cloud 9 Chocolate Bar 26g",
      category: "Snacks",
      price: 12,
      qty: 200,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Mentos Mint Candy Roll",
      category: "Snacks",
      price: 15,
      qty: 80,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    // PERSONAL CARE (14)
    {
      id: uid(),
      name: "Palmolive Shampoo Sachet 12ml",
      category: "Personal Care",
      price: 7,
      qty: 300,
      dateAdded: today(),
      expiry: "2027-06-30",
    },
    {
      id: uid(),
      name: "Palmolive Conditioner Sachet",
      category: "Personal Care",
      price: 7,
      qty: 250,
      dateAdded: today(),
      expiry: "2027-05-31",
    },
    {
      id: uid(),
      name: "Head & Shoulders Sachet 10ml",
      category: "Personal Care",
      price: 9,
      qty: 200,
      dateAdded: today(),
      expiry: "2027-04-30",
    },
    {
      id: uid(),
      name: "Cream Silk Sachet 10ml",
      category: "Personal Care",
      price: 7,
      qty: 220,
      dateAdded: today(),
      expiry: "2027-03-31",
    },
    {
      id: uid(),
      name: "Safeguard Bar Soap 135g",
      category: "Personal Care",
      price: 38,
      qty: 80,
      dateAdded: today(),
      expiry: "2027-08-31",
    },
    {
      id: uid(),
      name: "Dove Bar Soap 135g",
      category: "Personal Care",
      price: 45,
      qty: 60,
      dateAdded: today(),
      expiry: "2027-07-31",
    },
    {
      id: uid(),
      name: "Colgate Toothpaste 75ml",
      category: "Personal Care",
      price: 52,
      qty: 45,
      dateAdded: today(),
      expiry: "2027-02-28",
    },
    {
      id: uid(),
      name: "Hapee Toothpaste 115g",
      category: "Personal Care",
      price: 35,
      qty: 55,
      dateAdded: today(),
      expiry: "2027-01-31",
    },
    {
      id: uid(),
      name: "Surf Powder Detergent 66g",
      category: "Personal Care",
      price: 12,
      qty: 150,
      dateAdded: today(),
      expiry: "2027-06-30",
    },
    {
      id: uid(),
      name: "Ariel Powder Detergent 66g",
      category: "Personal Care",
      price: 14,
      qty: 130,
      dateAdded: today(),
      expiry: "2027-05-31",
    },
    {
      id: uid(),
      name: "Downy Fabric Conditioner Sachet",
      category: "Personal Care",
      price: 8,
      qty: 200,
      dateAdded: today(),
      expiry: "2027-04-30",
    },
    {
      id: uid(),
      name: "Zonrox Bleach 250ml",
      category: "Personal Care",
      price: 22,
      qty: 40,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Sandblock SPF50 Sachet",
      category: "Personal Care",
      price: 12,
      qty: 5,
      dateAdded: today(),
      expiry: "2026-06-30",
    },
    {
      id: uid(),
      name: "Biogesic Paracetamol 500mg",
      category: "Personal Care",
      price: 12,
      qty: 8,
      dateAdded: today(),
      expiry: "2027-09-30",
    },
    // RICE & GRAINS (8)
    {
      id: uid(),
      name: "White King Rice 2kg",
      category: "Rice & Grains",
      price: 115,
      qty: 6,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Sinandomeng Rice 5kg",
      category: "Rice & Grains",
      price: 265,
      qty: 18,
      dateAdded: today(),
      expiry: "2027-01-31",
    },
    {
      id: uid(),
      name: "Jasmine Rice Premium 2kg",
      category: "Rice & Grains",
      price: 135,
      qty: 12,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Quaker Oats Quick Cook 800g",
      category: "Rice & Grains",
      price: 168,
      qty: 20,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Harina Flour 1kg",
      category: "Rice & Grains",
      price: 52,
      qty: 35,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "White Sugar 1kg",
      category: "Rice & Grains",
      price: 68,
      qty: 40,
      dateAdded: today(),
      expiry: "2027-12-31",
    },
    {
      id: uid(),
      name: "Brown Sugar 1kg",
      category: "Rice & Grains",
      price: 72,
      qty: 30,
      dateAdded: today(),
      expiry: "2027-11-30",
    },
    {
      id: uid(),
      name: "Iodized Salt 250g",
      category: "Rice & Grains",
      price: 15,
      qty: 100,
      dateAdded: today(),
      expiry: "2028-06-30",
    },
    // OTHERS (10)
    {
      id: uid(),
      name: "Minola Cooking Oil 1L",
      category: "Others",
      price: 88,
      qty: 25,
      dateAdded: today(),
      expiry: "2026-09-30",
    },
    {
      id: uid(),
      name: "Baguio Vegetable Oil 1L",
      category: "Others",
      price: 82,
      qty: 30,
      dateAdded: today(),
      expiry: "2026-10-31",
    },
    {
      id: uid(),
      name: "Spam Classic 340g",
      category: "Others",
      price: 195,
      qty: 14,
      dateAdded: today(),
      expiry: "2027-03-31",
    },
    {
      id: uid(),
      name: "Knorr Chicken Cube 10g",
      category: "Others",
      price: 5,
      qty: 350,
      dateAdded: today(),
      expiry: "2026-11-30",
    },
    {
      id: uid(),
      name: "Ricoa Flat Tops Chocolate 50g",
      category: "Others",
      price: 18,
      qty: 95,
      dateAdded: today(),
      expiry: "2026-08-31",
    },
    {
      id: uid(),
      name: "Wrigley's Doublemint Gum",
      category: "Others",
      price: 8,
      qty: 120,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    {
      id: uid(),
      name: "Scotch Tape 1 inch",
      category: "Others",
      price: 22,
      qty: 30,
      dateAdded: today(),
      expiry: "2028-01-01",
    },
    {
      id: uid(),
      name: "Ballpen Black BIC",
      category: "Others",
      price: 12,
      qty: 50,
      dateAdded: today(),
      expiry: "2028-01-01",
    },
    {
      id: uid(),
      name: "Plastic Bag Medium 100pcs",
      category: "Others",
      price: 45,
      qty: 20,
      dateAdded: today(),
      expiry: "2028-01-01",
    },
    {
      id: uid(),
      name: "Century Tuna Chunks in Water",
      category: "Canned Goods",
      price: 32,
      qty: 38,
      dateAdded: today(),
      expiry: "2026-12-31",
    },
    // OUT OF STOCK items
    {
      id: uid(),
      name: "Birch Tree Full Cream Milk 900g",
      category: "Dairy",
      price: 185,
      qty: 0,
      dateAdded: today(),
      expiry: "2026-04-30",
    },
    {
      id: uid(),
      name: "Purefoods Hotdog 1kg",
      category: "Others",
      price: 145,
      qty: 0,
      dateAdded: today(),
      expiry: "2026-04-30",
    },
    {
      id: uid(),
      name: "Argentina Corned Beef 380g",
      category: "Canned Goods",
      price: 95,
      qty: 0,
      dateAdded: today(),
      expiry: "2027-06-30",
    },
    {
      id: uid(),
      name: "Koka Instant Noodles Curry",
      category: "Instant Noodles",
      price: 25,
      qty: 0,
      dateAdded: today(),
      expiry: "2026-06-15",
    },
    {
      id: uid(),
      name: "C2 Apple Juice 230ml",
      category: "Beverages",
      price: 18,
      qty: 0,
      dateAdded: today(),
      expiry: "2026-04-30",
    },
    {
      id: uid(),
      name: "Palmolive Body Wash 200ml",
      category: "Personal Care",
      price: 95,
      qty: 0,
      dateAdded: today(),
      expiry: "2027-03-31",
    },
    {
      id: uid(),
      name: "Kopiko Blanca Coffee 30g",
      category: "Beverages",
      price: 12,
      qty: 2,
      dateAdded: today(),
      expiry: "2026-04-15",
    },
    {
      id: uid(),
      name: "Selecta Cornetto Vanilla",
      category: "Dairy",
      price: 35,
      qty: 3,
      dateAdded: today(),
      expiry: "2026-04-20",
    },
    {
      id: uid(),
      name: "Lucky Me Bulalo Flavor",
      category: "Instant Noodles",
      price: 15,
      qty: 4,
      dateAdded: today(),
      expiry: "2026-07-31",
    },
  ];
  localStorage.setItem(PROD_KEY, JSON.stringify(p));
  return p;
}

/* ── Seed Sales (210+ sample transactions Aug–Mar) ── */
function seedSales() {
  const products_list = [
    {
      name: "Lucky Me Pancit Canton Original",
      cat: "Instant Noodles",
      price: 15,
    },
    { name: "Nescafe 3-in-1 Original 10s", cat: "Beverages", price: 38 },
    { name: "Milo Sachet 22g", cat: "Beverages", price: 9 },
    { name: "Argentina Corned Beef 150g", cat: "Canned Goods", price: 48 },
    { name: "Rebisco Crackers 250g", cat: "Snacks", price: 30 },
    { name: "Sky Flakes Plain Crackers 250g", cat: "Snacks", price: 35 },
    { name: "Coca-Cola Mismo 237ml", cat: "Beverages", price: 22 },
    { name: "Palmolive Shampoo Sachet 12ml", cat: "Personal Care", price: 7 },
    { name: "Mega Sardines in Tomato Sauce", cat: "Canned Goods", price: 18 },
    { name: "Maggi Magic Sarap 8g", cat: "Condiments", price: 5 },
    { name: "UFC Banana Ketchup 320g", cat: "Condiments", price: 42 },
    { name: "Oishi Prawn Crackers 90g", cat: "Snacks", price: 28 },
    { name: "Eden Cheese 165g", cat: "Dairy", price: 65 },
    { name: "Surf Powder Detergent 66g", cat: "Personal Care", price: 12 },
    { name: "White Sugar 1kg", cat: "Rice & Grains", price: 68 },
    { name: "Nestea Iced Tea Lemon 25g", cat: "Beverages", price: 10 },
    { name: "555 Sardines Spanish Style", cat: "Canned Goods", price: 22 },
    { name: "Knorr Chicken Cube 10g", cat: "Condiments", price: 6 },
    { name: "Nescafe Classic Sachet 2g", cat: "Beverages", price: 8 },
    { name: "Payless Beef Flavor", cat: "Instant Noodles", price: 14 },
    { name: "Cream Silk Sachet 10ml", cat: "Personal Care", price: 9 },
    { name: "Cloud 9 Chocolate Bar", cat: "Snacks", price: 15 },
    { name: "Head & Shoulders Sachet 12ml", cat: "Personal Care", price: 10 },
    { name: "Tang Orange Juice 25g", cat: "Beverages", price: 8 },
    { name: "Palmolive Conditioner Sachet", cat: "Personal Care", price: 7 },
    { name: "Del Monte Tomato Sauce 250g", cat: "Canned Goods", price: 22 },
    { name: "Kopiko Brown Coffee 30g", cat: "Beverages", price: 12 },
    { name: "Monde Mamon 10s", cat: "Snacks", price: 55 },
    { name: "Bear Brand Powdered Milk 33g", cat: "Dairy", price: 18 },
    { name: "Magnolia Fresh Milk 1L", cat: "Dairy", price: 82 },
  ];

  // Dynamic months: last 8 months ending this month — Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar
  const now = new Date();
  const months = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${yr}-${mo}`);
  }
  // idx: 0=Aug, 1=Sep, 2=Oct, 3=Nov, 4=Dec, 5=Jan, 6=Feb, 7=Mar
  // Aug & Oct = matumal months, Nov +80%, Dec +180%
  const baseTx = [28, 65, 30, 45, 50, 58, 55, 40];
  const qtyMult = [0.7, 1.7, 0.7, 1.8, 2.8, 1.5, 1.4, 1.2];

  const txPerMonth = baseTx.map((base, i) => {
    if (i === 3) return Math.round(base * 1.8); // November: 80% more transactions
    if (i === 4) return Math.round(base * 2.8); // December: 180% more transactions
    return base;
  });

  const generated = [];
  months.forEach((ym, mi) => {
    const [yr, mo] = ym.split("-").map(Number);
    const isCurrentMonth =
      yr === now.getFullYear() && mo === now.getMonth() + 1;
    const maxDay = isCurrentMonth
      ? now.getDate()
      : new Date(yr, mo, 0).getDate();
    const count = txPerMonth[mi] + Math.floor(Math.random() * 8);
    for (let t = 0; t < count; t++) {
      const day = 1 + Math.floor(Math.random() * (maxDay - 1));
      const item =
        products_list[Math.floor(Math.random() * products_list.length)];
      // Base qty, boosted further for Nov & Dec
      const baseQty = 3 + Math.floor(Math.random() * (mi < 4 ? 8 : 15));
      const qty = Math.round(baseQty * qtyMult[mi]);
      generated.push({
        id: uid(),
        productName: item.name,
        category: item.cat,
        qty,
        price: item.price,
        total: qty * item.price,
        datetime: new Date(
          yr,
          mo - 1,
          day,
          7 + Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 60),
        ).toISOString(),
      });
    }
  });

  localStorage.setItem(SALES_KEY, JSON.stringify(generated));
  return generated;
}

/* ── Helpers ─────────────────────────────────────────────── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function peso(n) {
  return (
    "₱" +
    parseFloat(n)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
function shortNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return parseFloat(n).toFixed(0);
}
function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function fmtDatetime(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
  );
}
function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-");
  return MONTHS[parseInt(m) - 1] + " " + y;
}

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */
function togglePw() {
  const i = document.getElementById("loginPass");
  const e = document.getElementById("eyeIcon");
  i.type = i.type === "password" ? "text" : "password";
  e.className = i.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
}
async function doLogin() {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;
  const err = document.getElementById("loginError");

  if (!u || !p) {
    err.textContent = "Please fill in all fields.";
    err.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: u, password: p }),
    });

    const data = await response.json();

    if (data.success) {
      err.classList.add("hidden");

      sessionStorage.setItem("palengke_auth", "1");

      sessionStorage.setItem("user_name", data.user.name);
      sessionStorage.setItem("user_role", data.user.role);

      showApp();
    } else {
      err.textContent = data.message;
      err.classList.remove("hidden");
      document.getElementById("loginPass").value = "";
    }
  } catch (error) {
    console.error("Login communication error:", error);
    err.textContent = "Server connection lost. Please try again later.";
    err.classList.remove("hidden");
  }
}

document.addEventListener("keydown", (e) => {
  if (
    document.getElementById("loginPage").classList.contains("active") &&
    e.key === "Enter"
  )
    doLogin();
});

function doLogout() {
  sessionStorage.removeItem("palengke_auth");
  document.getElementById("appPage").classList.remove("active");
  document.getElementById("loginPage").classList.add("active");
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
  document.getElementById("loginError").classList.add("hidden");
  closeSidebar();
}

// ── FORGOT PASSWORD ──────────────────────────────────────────
const RESET_CODE = "admin123";

function openForgotModal() {
  document.getElementById("resetCodeInput").value = "";
  document.getElementById("resetCodeError").classList.add("hidden");
  document.getElementById("forgotStep1Modal").classList.remove("hidden");
}

function closeForgotModals() {
  document.getElementById("forgotStep1Modal").classList.add("hidden");
  document.getElementById("forgotStep2Modal").classList.add("hidden");
  document.getElementById("resetCodeInput").value = "";
  document.getElementById("newResetPassInput").value = "";
  document.getElementById("confirmResetPassInput").value = "";
  document.getElementById("resetCodeError").classList.add("hidden");
  document.getElementById("resetPassError").classList.add("hidden");
}

function verifyResetCode() {
  const code = document.getElementById("resetCodeInput").value.trim();
  const errEl = document.getElementById("resetCodeError");
  if (code !== RESET_CODE) {
    errEl.innerHTML =
      '<i class="fas fa-circle-exclamation"></i> Invalid reset code. Please try again.';
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");
  document.getElementById("forgotStep1Modal").classList.add("hidden");
  document.getElementById("newResetPassInput").value = "";
  document.getElementById("confirmResetPassInput").value = "";
  document.getElementById("resetPassError").classList.add("hidden");
  document.getElementById("forgotStep2Modal").classList.remove("hidden");
}

function saveResetPassword() {
  const newPw = document.getElementById("newResetPassInput").value;
  const confPw = document.getElementById("confirmResetPassInput").value;
  const errEl = document.getElementById("resetPassError");
  if (newPw.length < 6) {
    errEl.innerHTML =
      '<i class="fas fa-circle-exclamation"></i> Password must be at least 6 characters.';
    errEl.classList.remove("hidden");
    return;
  }
  if (newPw !== confPw) {
    errEl.innerHTML =
      '<i class="fas fa-circle-exclamation"></i> Passwords do not match.';
    errEl.classList.remove("hidden");
    return;
  }
  CREDS.password = newPw;
  closeForgotModals();
  showToast(
    "✅ Password reset successfully! Please log in with your new password.",
  );
}
// ─────────────────────────────────────────────────────────────

function showApp() {
  document.getElementById("loginPage").classList.remove("active");
  document.getElementById("appPage").classList.add("active");
  syncSidebarUser();
  setTimeout(
    () => navigate("dashboard", document.querySelector(".nav-item")),
    50,
  );
  fetchProducts();
}

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */
function navigate(view, el) {
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  if (el) el.classList.add("active");
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  const t = document.getElementById("view-" + view);
  if (t) t.classList.add("active");
  const titles = {
    dashboard: "Dashboard",
    inventory: "Inventory Management",
    sales: "Sales",
    finance: "Finance",
    settings: "Settings",
  };
  document.getElementById("topbarTitle").textContent = "Salak Sari-Sari Store";
  if (view === "dashboard") renderDashboard();
  if (view === "inventory") fetchProducts();
  if (view === "sales") renderSalesPage();
  if (view === "finance") renderFinancePage();
  if (view === "settings") {
    renderSettings();
    switchSettingsTab("security", document.querySelector(".settings-nav-item"));
  }
  if (window.innerWidth <= 768) closeSidebar();
}

function toggleSidebar() {
  const s = document.getElementById("sidebar");
  const o = document.getElementById("sidebarOverlay");
  if (s.classList.contains("open")) {
    closeSidebar();
  } else {
    s.classList.add("open");
    o.classList.add("open");
  }
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("open");
}

/* ══════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════ */
function renderDashboard() {
  const total = products.length;
  const totalRev = sales.reduce((s, x) => s + Number(x.total), 0);
  const totalExp = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const netProfit = totalRev - totalExp;
  const profitColor = netProfit >= 0 ? "var(--green)" : "var(--red)";
  const profitBg = netProfit >= 0 ? "var(--green-light)" : "var(--red-light)";

  // Greeting
  const hr = new Date().getHours();
  const greet =
    hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const profile = settingsGetProfile();
  const displayName = profile.name || "Admin";
  document.getElementById("dashGreeting").textContent =
    `${greet}, ${displayName}! Here's your store summary.`;

  // Stat cards
  document.getElementById("dashCards").innerHTML = `
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas fa-boxes-stacked"></i></div>
      <div class="big-stat-value">${total}</div>
      <div class="big-stat-label">Total Products</div>
    </div>
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas fa-peso-sign"></i></div>
      <div class="big-stat-value">₱${shortNum(totalRev)}</div>
      <div class="big-stat-label">Total Sales Revenue</div>
    </div>
    <div class="big-stat-card" style="border-top:4px solid var(--red)">
      <div class="big-stat-icon" style="background:var(--red-light);color:var(--red)"><i class="fas fa-receipt"></i></div>
      <div class="big-stat-value" style="color:var(--red)">₱${shortNum(totalExp)}</div>
      <div class="big-stat-label">Total Expenses</div>
    </div>
    <div class="big-stat-card" style="border-top:4px solid ${profitColor}">
      <div class="big-stat-icon" style="background:${profitBg};color:${profitColor}"><i class="fas fa-chart-line"></i></div>
      <div class="big-stat-value" style="color:${profitColor}">${netProfit >= 0 ? "" : "−"}₱${shortNum(Math.abs(netProfit))}</div>
      <div class="big-stat-label">Net Profit (All Time)</div>
    </div>
  `;

  // Monthly sales bar chart
  renderMonthlyBarChart(
    "dashMonthlySalesChart",
    "dashMonthlySalesLabels",
    "dashTotalSalesLabel",
    dashChartMode,
  );

  // Top products horizontal bar
  renderTopProductsChart("dashTopProductsChart", dashChartMode);

  // Low stock alerts
  const low = products.filter((p) => p.qty <= LOW_STOCK);
  const alertEl = document.getElementById("dashLowStock");
  // Update panel head count
  const lowHead = alertEl.closest(".panel")?.querySelector(".panel-head");
  if (lowHead) {
    // remove old badge if any
    const oldBadge = lowHead.querySelector(".panel-tag");
    if (oldBadge) oldBadge.remove();
    const badge = document.createElement("span");
    badge.className = "panel-tag" + (low.length > 0 ? " danger" : "");
    badge.textContent = low.length > 0 ? low.length + " items" : "All Good";
    lowHead.appendChild(badge);
  }
  alertEl.innerHTML =
    low.length === 0
      ? `<div class="alert-empty"><i class="fas fa-circle-check" style="color:var(--green);margin-right:.4rem"></i>All stock levels are good! No items below threshold.</div>`
      : low
          .sort((a, b) => a.qty - b.qty)
          .map(
            (p, i) => `
        <div class="alert-card">
          <div class="alert-rank">${i + 1}</div>
          <div class="alert-card-body">
            <div class="alert-card-name">${escHtml(p.name)}</div>
            <div class="alert-card-cat">${p.category}</div>
          </div>
          <div class="alert-card-badge ${p.qty === 0 ? "zero" : "low"}">${p.qty === 0 ? "Out of Stock" : p.qty + " left"}</div>
        </div>`,
          )
          .join("");

  // Slow movers
  renderSlowMovers("dashSlowMoversChart", "dashSlowCount");
}

/* ── Bar Chart Helpers ──────────────────────────────────── */
function getMonthlyData(mode) {
  // Build last 8 months
  const now = new Date();
  const months = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  const data = {};
  months.forEach((m) => (data[m] = 0));
  sales.forEach((s) => {
    const k = monthKey(s.datetime);
    if (data[k] !== undefined)
      data[k] += mode === "revenue" ? Number(s.total) : Number(s.qty);
  });
  return { months, data };
}

function renderMonthlyBarChart(chartId, labelsId, tagId, mode) {
  const { months, data } = getMonthlyData(mode);
  const vals = months.map((m) => data[m]);
  const maxV = Math.max(...vals, 1);
  const CHART_H = 140; // px — matches container minus label space
  const totalRevAll = sales.reduce((s, x) => s + Number(x.total), 0);
  const totalUnitsAll = sales.reduce((s, x) => s + Number(x.qty), 0);

  const chartEl = document.getElementById(chartId);
  const labelsEl = document.getElementById(labelsId);
  const tagEl = document.getElementById(tagId);
  if (!chartEl) return;

  if (tagEl)
    tagEl.textContent =
      mode === "revenue"
        ? "Total: ₱" + shortNum(totalRevAll)
        : "Total: " + totalUnitsAll + " units";

  chartEl.innerHTML = vals
    .map((v, i) => {
      const barH =
        maxV > 0
          ? Math.max(Math.round((v / maxV) * CHART_H), v > 0 ? 4 : 0)
          : 0;
      const label =
        mode === "revenue"
          ? v > 0
            ? "₱" + shortNum(v)
            : "—"
          : v > 0
            ? v + "u"
            : "—";
      const isGrowing = i > 0 && v > vals[i - 1];
      const trend =
        i > 0 ? (v > vals[i - 1] ? "↑" : v < vals[i - 1] ? "↓" : "") : "";
      return `
      <div class="bar-item" title="${monthLabel(months[i])}: ${mode === "revenue" ? peso(v) : v + " units"}">
        <div class="bar-val">${label}</div>
        <div class="bar-fill${isGrowing ? " accent" : ""}" style="height:${barH}px"></div>
      </div>`;
    })
    .join("");

  if (labelsEl) {
    labelsEl.innerHTML = months
      .map(
        (m) => `
      <div class="bar-label-item">${MONTHS[parseInt(m.split("-")[1]) - 1]}</div>`,
      )
      .join("");
  }
}

function renderTopProductsChart(elId, mode = "revenue") {
  const el = document.getElementById(elId);
  if (!el) return;
  const totals = {};
  sales.forEach((s) => {
    const v = mode === "revenue" ? Number(s.total) : Number(s.qty);
    totals[s.productName] = (totals[s.productName] || 0) + v;
  });
  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxV = sorted[0]?.[1] || 1;
  el.innerHTML =
    sorted.length === 0
      ? `<div class="alert-empty">No sales data yet.</div>`
      : sorted
          .map(
            ([name, val], i) => `
        <div class="hbar-row">
          <div class="hbar-rank">${i + 1}</div>
          <div class="hbar-name" title="${escHtml(name)}">${escHtml(name)}</div>
          <div class="hbar-wrap"><div class="hbar-fill" style="width:${((val / maxV) * 100).toFixed(1)}%"></div></div>
          <div class="hbar-val">${mode === "revenue" ? "₱" + shortNum(val) : val + " u"}</div>
        </div>`,
          )
          .join("");
}

// INVENTORY — CRUD
const API_BASE = "http://localhost:5000/api";

// Synchronizes state with the database and refreshes your layout grid
async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const databaseRows = await response.json();

    // Map and sanitize MySQL data types so your UI formatting features don't crash
    products = databaseRows.map((p) => ({
      ...p,
      id: Number(p.id), // Ensure ID is a number
      price: parseFloat(p.price), // Convert string decimal ("48.00") to float number (48.00)
      qty: parseInt(p.qty, 10), // Ensure quantity is an integer
    }));

    // Success! Now draw the updated data onto the screen
    renderTable();
  } catch (error) {
    console.error("Error synchronization failed:", error);
    showToast("Could not sync data with server.");
  }
}

function renderTable() {
  const search = (
    document.getElementById("searchInput")?.value || ""
  ).toLowerCase();
  const catFilt = document.getElementById("filterCat")?.value || "";
  const stockFilt = document.getElementById("filterStock")?.value || "";
  const tbody = document.getElementById("tableBody");
  const empty = document.getElementById("emptyTable");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30days = new Date(today);
  in30days.setDate(today.getDate() + 30);

  // Filter products based on search inputs and dropdown choices
  let filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search);
    const matchCat = !catFilt || p.category === catFilt;
    const expiryDate = p.expiry ? new Date(p.expiry) : null;
    const matchStock =
      !stockFilt ||
      (stockFilt === "low" && p.qty > 0 && p.qty <= 10) ||
      (stockFilt === "ok" && p.qty > 10) ||
      (stockFilt === "zero" && p.qty === 0) ||
      (stockFilt === "expiry" && expiryDate && expiryDate <= in30days);
    return matchSearch && matchCat && matchStock;
  });

  // Handle empty state display
  if (!filtered.length) {
    tbody.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  // Sort alphabetically by name
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  // Map elements into clean HTML strings
  tbody.innerHTML = filtered
    .map((p, i) => {
      const expiryDate = p.expiry ? new Date(p.expiry) : null;
      const isExpired = expiryDate && expiryDate < today;
      const isNearExpiry = expiryDate && !isExpired && expiryDate <= in30days;

      const expiryCell = p.expiry
        ? `<span style="font-weight:600;color:${isExpired ? "var(--red)" : isNearExpiry ? "#d97706" : "var(--text-mid)"}">
           ${new Date(p.expiry).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
         </span>
         ${isExpired ? '<span class="badge badge-red" style="margin-left:.3rem"><i class="fas fa-skull-crossbones"></i> Expired</span>' : ""}
         ${isNearExpiry ? '<span class="badge" style="margin-left:.3rem;background:#fef3c7;color:#92400e"><i class="fas fa-clock"></i> Near Expiry</span>' : ""}`
        : '<span style="color:var(--text-muted)">—</span>';

      return `
    <tr class="${isExpired ? "row-expired" : isNearExpiry ? "row-near-expiry" : p.qty <= 10 ? "row-low" : ""}">
      <td>${i + 1}</td>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge">${p.category}</span></td>
      <td>₱${p.price.toFixed(2)}</td>
      <td>
        <span style="font-weight:700;color:${p.qty <= 10 ? "var(--red)" : "var(--green-dark)"}">${p.qty}</span>
        ${
          p.qty === 0
            ? '<span class="badge badge-red" style="margin-left:.3rem"><i class="fas fa-ban"></i> Out of Stock</span>'
            : p.qty <= 10
              ? '<span class="badge badge-red" style="margin-left:.3rem"><i class="fas fa-circle-exclamation"></i> Low</span>'
              : ""
        }
      </td>
      <td>${expiryCell}</td>
      <td>${new Date(p.dateAdded).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-edit" onclick="editProduct('${p.id}')"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-danger" onclick="openDeleteModal('${p.id}')"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </td>
    </tr>`;
    })
    .join("");
}

// Handles both dynamic insertion and updates across database records
async function submitProduct() {
  const name = document.getElementById("fName").value.trim();
  const cat = document.getElementById("fCategory").value;
  const price = parseFloat(document.getElementById("fPrice").value);
  const qty = parseInt(document.getElementById("fQty").value, 10);
  const expiry = document.getElementById("fExpiry").value || null;
  const errEl = document.getElementById("formError");
  const errs = [];

  if (!name) errs.push("Product name is required.");
  if (!cat) errs.push("Category is required.");
  if (isNaN(price) || price < 0) errs.push("Enter a valid price (≥ 0).");
  if (isNaN(qty) || qty < 0) errs.push("Enter a valid quantity (≥ 0).");

  if (errs.length) {
    errEl.innerHTML =
      '<i class="fas fa-circle-exclamation"></i> ' + errs.join(" ");
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");

  try {
    if (editingId) {
      // UPDATE EXISTENCE FLOW
      const response = await fetch(`${API_BASE}/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category: cat, price, qty, expiry }),
      });
      const data = await response.json();
      if (data.success) showToast("Product updated!");
    } else {
      // NEW REGISTRATION FLOW
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: cat,
          price,
          qty,
          expiry,
          dateAdded: new Date().toISOString().split("T")[0], // Formats cleanly to YYYY-MM-DD
        }),
      });
      const data = await response.json();
      if (data.success) showToast("Product added!");
    }

    cancelForm();
    await fetchProducts(); // Pull clean database rows and trigger renderTable
  } catch (error) {
    console.error("Save operation failed:", error);
    showToast("Error processing save request.");
  }
}

function editProduct(id) {
  // Convert id argument explicitly to a number to align with MySQL schema configuration
  const targetId = Number(id);
  const p = products.find((x) => x.id === targetId);
  if (!p) return;

  editingId = targetId;
  document.getElementById("fName").value = p.name;
  document.getElementById("fCategory").value = p.category;
  document.getElementById("fPrice").value = p.price;
  document.getElementById("fQty").value = p.qty;

  // Format dates cleanly down to YYYY-MM-DD strings for standard input binders
  document.getElementById("fExpiry").value = p.expiry
    ? p.expiry.split("T")[0]
    : "";
  document.getElementById("fId").value = targetId;

  document.getElementById("formTitle").innerHTML =
    '<i class="fas fa-pen-to-square"></i> Edit Product';
  document.getElementById("submitBtn").innerHTML =
    '<i class="fas fa-floppy-disk"></i> Update Product';
  document.getElementById("cancelBtn").style.display = "inline-flex";
  document
    .getElementById("productForm")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelForm() {
  editingId = null;
  ["fName", "fPrice", "fQty", "fId", "fExpiry"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("fCategory").value = "";
  document.getElementById("formError").classList.add("hidden");
  document.getElementById("formTitle").innerHTML =
    '<i class="fas fa-plus-circle"></i> Add New Product';
  document.getElementById("submitBtn").innerHTML =
    '<i class="fas fa-floppy-disk"></i> Save Product';
  document.getElementById("cancelBtn").style.display = "none";
}

function openDeleteModal(id) {
  deleteTarget = Number(id);
  const p = products.find((x) => x.id === deleteTarget);
  document.getElementById("deleteMsg").textContent = p
    ? `Delete "${p.name}"? This cannot be undone.`
    : "This cannot be undone.";
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
  deleteTarget = null;
  document.getElementById("deleteModal").classList.add("hidden");
}

async function confirmDelete() {
  if (!deleteTarget) return;

  try {
    const response = await fetch(`${API_BASE}/products/${deleteTarget}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (data.success) {
      closeDeleteModal();
      await fetchProducts(); // Refresh data rows immediately
      showToast("Product deleted.");
    }
  } catch (error) {
    console.error("Deletion operation abort:", error);
    showToast("Failed to complete removal action.");
  }
}

/* ══════════════════════════════════════════════
   SALES MODULE
══════════════════════════════════════════════ */
async function fetchSales() {
  try {
    const response = await fetch(`${API_BASE}/sales`);
    const databaseRows = await response.json();

    // Convert string-formatted SQL results cleanly into client-side data types
    sales = databaseRows.map((s) => ({
      ...s,
      id: Number(s.id),
      qty: parseInt(s.qty, 10),
      price: parseFloat(s.price),
      total: parseFloat(s.total),
    }));

    // Re-trigger layout engine elements
    renderSalesPage();
  } catch (error) {
    console.error("Failed to synchronize transaction ledger:", error);
    showToast("Could not sync sales logs with server.");
  }
}

function renderSalesPage() {
  renderSalesCards();
  populateSaleProductDropdown();
  populateSaleMonthFilter();
  renderSalesTable();
}

function renderSalesCards() {
  const totalRev = sales.reduce((s, x) => s + Number(x.total), 0);
  const totalUnits = sales.reduce((s, x) => s + Number(x.qty), 0);

  // Current month tracking logic
  const now = new Date();
  const thisMo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const moSales = sales.filter((s) => monthKey(s.datetime) === thisMo);
  const moRev = moSales.reduce((s, x) => s + Number(x.total), 0);
  const txCount = sales.length;

  document.getElementById("salesCards").innerHTML = `
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas fa-peso-sign"></i></div>
      <div class="big-stat-value">₱${shortNum(totalRev)}</div>
      <div class="big-stat-label">Total Revenue</div>
    </div>
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas fa-chart-line"></i></div>
      <div class="big-stat-value">₱${shortNum(moRev)}</div>
      <div class="big-stat-label">This Month</div>
    </div>
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas fa-basket-shopping"></i></div>
      <div class="big-stat-value">${totalUnits.toLocaleString()}</div>
      <div class="big-stat-label">Units Sold</div>
    </div>
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas fa-receipt"></i></div>
      <div class="big-stat-value">${txCount}</div>
      <div class="big-stat-label">Total Transactions</div>
    </div>
  `;
}

/* ── SEARCHABLE PRODUCT COMBO DROPDOWN ────────────────────────────── */
let comboCloseTimer = null;

function populateSaleProductDropdown() {
  filterProductDropdown();
}

function openProductDropdown() {
  const wrap = document.getElementById("saleProductWrap");
  const list = document.getElementById("saleProductList");
  wrap.classList.add("open");
  list.classList.remove("hidden");
  renderComboOptions(document.getElementById("saleProductSearch").value);
}

function scheduleCloseDropdown() {
  comboCloseTimer = setTimeout(() => closeProductDropdown(), 180);
}

function closeProductDropdown() {
  const wrap = document.getElementById("saleProductWrap");
  const list = document.getElementById("saleProductList");
  wrap.classList.remove("open");
  list.classList.add("hidden");
}

function filterProductDropdown() {
  const q = (
    document.getElementById("saleProductSearch").value || ""
  ).toLowerCase();
  renderComboOptions(q);
}

function renderComboOptions(query) {
  const list = document.getElementById("saleProductList");
  const filtered = products.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query),
  );
  if (!filtered.length) {
    list.innerHTML = `<div class="combo-empty"><i class="fas fa-magnifying-glass"></i> No products found</div>`;
    return;
  }
  list.innerHTML = filtered
    .map((p) => {
      const stockClass = p.qty === 0 ? "zero" : p.qty <= 10 ? "low" : "ok";
      const stockLabel =
        p.qty === 0
          ? "Out of Stock"
          : p.qty <= 10
            ? `${p.qty} left`
            : `${p.qty} in stock`;
      return `<div class="combo-option${p.qty === 0 ? " out-of-stock" : ""}"
      onmousedown="selectComboProduct('${p.id}','${escHtml(p.name)}',${p.price},${p.qty})"
    >
      <span>${escHtml(p.name)}</span>
      <span class="combo-option-stock ${stockClass}">${stockLabel}</span>
    </div>`;
    })
    .join("");
}

function selectComboProduct(id, name, price, qty) {
  if (qty === 0) return;
  clearTimeout(comboCloseTimer);
  document.getElementById("saleProduct").value = id;
  document.getElementById("saleProductSearch").value = name;
  document.getElementById("salePrice").value = price;
  document.getElementById("saleQty").value = "";
  updateSaleTotal();
  closeProductDropdown();
}

function onSaleProductChange() {
  updateSaleTotal();
}

function updateSaleTotal() {
  const qty = parseFloat(document.getElementById("saleQty").value) || 0;
  const price = parseFloat(document.getElementById("salePrice").value) || 0;
  document.getElementById("saleTotalDisplay").textContent =
    "₱ " + (qty * price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ── DYNAMIC ASYNC TRANSACTION RECORDING ────────────────────────────
async function recordSale(event) {
  // Prevent stealth form submission page refreshes
  if (event) event.preventDefault();

  console.log("recordSale() function successfully triggered!");

  const pidEl = document.getElementById("saleProduct");
  const qtyEl = document.getElementById("saleQty");
  const priceEl = document.getElementById("salePrice");
  const errEl = document.getElementById("saleError");

  // Checkpoint 1: Verify all required DOM elements are found
  if (!pidEl || !qtyEl || !priceEl || !errEl) {
    console.error(
      "❌ DOM Error: Missing one or more required HTML input elements!",
      {
        saleProduct: !!pidEl,
        saleQty: !!qtyEl,
        salePrice: !!priceEl,
        saleError: !!errEl,
      },
    );
    return;
  }

  const pid = pidEl.value;
  const qty = parseInt(qtyEl.value, 10);
  const price = parseFloat(priceEl.value);
  const errs = [];

  console.log("📥 Values collected from inputs:", { pid, qty, price });

  // Checkpoint 2: Validation Rule Checks
  if (!pid) {
    errs.push("Please select a valid product from the dropdown list.");
  }
  if (isNaN(qty) || qty < 1) {
    errs.push("Quantity must be a number equal to or greater than 1.");
  }
  if (isNaN(price) || price < 0) {
    errs.push("Enter a valid unit price.");
  }

  // Safely find product to match database primary IDs
  const prod = products.find((p) => p.id === Number(pid));
  if (!prod && pid) {
    errs.push(
      "Selected product is invalid or could not be verified in stock registry.",
    );
  } else if (prod && qty > prod.qty) {
    errs.push(`Insufficient stock. Only ${prod.qty} units left.`);
  }

  if (errs.length) {
    console.warn("⚠️ Client-side validation blocked submission:", errs);
    errEl.innerHTML =
      '<i class="fas fa-circle-exclamation"></i> ' + errs.join(" ");
    errEl.classList.remove("hidden");
    return; // This is where it was silently exiting!
  }
  errEl.classList.add("hidden");

  console.log(
    "🚀 Validation clean! Compiling transaction payload for:",
    prod.name,
  );

  const transactionPayload = {
    productId: prod.id,
    productName: prod.name,
    category: prod.category,
    qty,
    price,
    total: qty * price,
    datetime: new Date().toISOString(),
  };

  try {
    console.log("📡 Dispatching POST network request to server...");
    const response = await fetch(`${API_BASE}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionPayload),
    });

    console.log("📥 Server responded with HTTP status code:", response.status);
    const data = await response.json();
    console.log("📦 Server body response metadata payload:", data);

    if (data.success) {
      showToast(`Sale recorded! ₱${(qty * price).toFixed(2)} — ${prod.name}`);

      // Clear tracking form inputs
      pidEl.value = "";
      document.getElementById("saleProductSearch").value = "";
      qtyEl.value = "";
      priceEl.value = "";
      document.getElementById("saleTotalDisplay").textContent = "₱ 0.00";

      // Synchronize changes to tables
      await fetchProducts();
      await fetchSales();
    } else {
      showToast(data.message || "Failed to finalize transaction logs.");
    }
  } catch (error) {
    console.error(
      "❌ Network transmission down or server script crashed:",
      error,
    );
    showToast("Server connection error during processing.");
  }
}

/* ── VISUAL ANALYTICS & FILTERS ──────────────────────────────────── */
function setSalesChartMode(mode, btn) {
  salesChartMode = mode;
  document
    .querySelectorAll("#view-sales .chart-tab")
    .forEach((t) => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderSalesCharts();
}

function setDashChartMode(mode, btn) {
  dashChartMode = mode;
  document
    .querySelectorAll("#view-dashboard .chart-tab")
    .forEach((t) => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderMonthlyBarChart(
    "dashMonthlySalesChart",
    "dashMonthlySalesLabels",
    "dashTotalSalesLabel",
    dashChartMode,
  );
  renderTopProductsChart("dashTopProductsChart", dashChartMode);
}

function renderSalesCharts() {
  renderMonthlyBarChart(
    "salesMonthlyChart",
    "salesMonthlyLabels",
    null,
    salesChartMode,
  );
  const el = document.getElementById("salesTopChart");
  if (!el) return;
  const totals = {};
  sales.forEach((s) => {
    const v = salesChartMode === "revenue" ? Number(s.total) : Number(s.qty);
    totals[s.productName] = (totals[s.productName] || 0) + v;
  });
  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxV = sorted[0]?.[1] || 1;
  el.innerHTML =
    sorted.length === 0
      ? `<div class="alert-empty">No sales data yet.</div>`
      : sorted
          .map(
            ([name, val], i) => `
        <div class="hbar-row">
          <div class="hbar-rank">${i + 1}</div>
          <div class="hbar-name" title="${escHtml(name)}">${escHtml(name)}</div>
          <div class="hbar-wrap"><div class="hbar-fill accent" style="width:${((val / maxV) * 100).toFixed(1)}%"></div></div>
          <div class="hbar-val">${salesChartMode === "revenue" ? "₱" + shortNum(val) : val + " u"}</div>
        </div>`,
          )
          .join("");
}

function populateSaleMonthFilter() {
  const sel = document.getElementById("saleFilterMonth");
  const cur = sel.value;
  const keys = [...new Set(sales.map((s) => monthKey(s.datetime)))]
    .sort()
    .reverse();
  sel.innerHTML =
    '<option value="">All Months</option>' +
    keys.map((k) => `<option value="${k}">${monthLabel(k)}</option>`).join("");
  if (cur) sel.value = cur;
}

function renderSalesTable() {
  const search = (
    document.getElementById("saleSearch")?.value || ""
  ).toLowerCase();
  const moFilt = document.getElementById("saleFilterMonth")?.value || "";
  const catFilt = document.getElementById("saleFilterCat")?.value || "";
  const tbody = document.getElementById("salesTableBody");
  const empty = document.getElementById("emptySales");

  let filtered = [...sales]
    .filter(
      (s) =>
        (s.productName.toLowerCase().includes(search) ||
          s.category.toLowerCase().includes(search)) &&
        (!moFilt || monthKey(s.datetime) === moFilt) &&
        (!catFilt || s.category === catFilt),
    )
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  if (!filtered.length) {
    tbody.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  tbody.innerHTML = filtered
    .map(
      (s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="font-size:.82rem">${fmtDatetime(s.datetime)}</td>
      <td><strong>${escHtml(s.productName)}</strong></td>
      <td><span class="badge ${CAT_COLORS[s.category] || "badge-gray"}">${s.category}</span></td>
      <td style="font-weight:700">${s.qty}</td>
      <td>${peso(s.price)}</td>
      <td style="font-weight:800;color:var(--green-dark)">${peso(s.total)}</td>
      <td>
        <button class="btn btn-danger" onclick="openDeleteSaleModal('${s.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>`,
    )
    .join("");
}

// ── DYNAMIC ASYNC SINGLE TRANSACTION REMOVAL ───────────────────────
function openDeleteSaleModal(id) {
  deleteSaleId = Number(id); // Cast explicitly to alignment match MySQL INT type
  document.getElementById("deleteSaleModal").classList.remove("hidden");
}

function closeDeleteSaleModal() {
  deleteSaleId = null;
  document.getElementById("deleteSaleModal").classList.add("hidden");
}

async function confirmDeleteSale() {
  if (!deleteSaleId) return;

  try {
    const response = await fetch(`${API_BASE}/sales/${deleteSaleId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (data.success) {
      closeDeleteSaleModal();

      // Update inventory list state and logs UI components instantly
      await fetchProducts();
      await fetchSales();
      showToast("Sale deleted. Stock restored.");
    }
  } catch (error) {
    console.error("Deletion operation halted:", error);
    showToast("Failed to complete record removal.");
  }
}

// ── DYNAMIC ASYNC BULK TRANSACTION CLEARING ──────────────────────
function openClearAllModal() {
  document.getElementById("clearAllCount").textContent =
    sales.length + " record" + (sales.length !== 1 ? "s" : "");
  document.getElementById("clearConfirmCheck").checked = false;
  document.getElementById("clearConfirmBtn").disabled = true;
  document.getElementById("clearAllModal").classList.remove("hidden");
}

function closeClearAllModal() {
  document.getElementById("clearAllModal").classList.add("hidden");
}

function toggleClearBtn() {
  const checked = document.getElementById("clearConfirmCheck").checked;
  document.getElementById("clearConfirmBtn").disabled = !checked;
}

async function confirmClearAll() {
  try {
    const response = await fetch(`${API_BASE}/sales`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (data.success) {
      closeClearAllModal();

      // Fully refresh structural tracking elements on screen
      await fetchProducts();
      await fetchSales();
      showToast("All sales cleared. Stock restored.");
    }
  } catch (error) {
    console.error("Purging process aborted:", error);
    showToast("Failed to safely reset transaction history.");
  }
}

function clearAllSales() {
  openClearAllModal();
}

/* ══════════════════════════════════════════════
    SLOW MOVERS REPORT GENERATION
══════════════════════════════════════════════ */
function getSlowMovers() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const recentSales = sales.filter((s) => new Date(s.datetime) >= cutoff);
  const recentTotals = {};
  recentSales.forEach((s) => {
    recentTotals[s.productName] =
      (recentTotals[s.productName] || 0) + Number(s.qty);
  });
  return products
    .map((p) => ({
      name: p.name,
      category: p.category,
      qty: p.qty,
      soldLast30: recentTotals[p.name] || 0,
    }))
    .filter((p) => p.soldLast30 === 0)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);
}

function renderSlowMovers(chartId, countId) {
  const el = document.getElementById(chartId);
  const countEl = document.getElementById(countId);
  if (!el) return;
  const slow = getSlowMovers();
  if (countEl) {
    countEl.textContent =
      slow.length + " item" + (slow.length !== 1 ? "s" : "");
  }
  if (!slow.length) {
    el.innerHTML = `<div class="slow-empty"><i class="fas fa-circle-check"></i>All products have recent sales — great job!</div>`;
    return;
  }
  const maxQty = Math.max(...slow.map((p) => p.qty), 1);
  el.innerHTML = slow
    .map(
      (p, i) => `
    <div class="hbar-row">
      <div class="hbar-rank" style="background:var(--red-light);color:var(--red)">${i + 1}</div>
      <div class="hbar-name" title="${escHtml(p.name)}">${escHtml(p.name)}</div>
      <div class="hbar-wrap">
        <div class="hbar-fill accent" style="width:${((p.qty / maxQty) * 100).toFixed(1)}%"></div>
      </div>
      <div class="hbar-val" style="color:var(--red)">${p.qty} stk</div>
    </div>`,
    )
    .join("");
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 3000);
}

/* ══════════════════════════════════════════════
   SETTINGS — Theme & Dark Mode
══════════════════════════════════════════════ */
const THEME_KEY = "palengke_theme";

const ALL_THEMES = [
  "green",
  "ocean",
  "sunset",
  "aurora",
  "royal",
  "fire",
  "mint",
  "dusk",
];

function loadAppearance() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "green";

  applyThemeClass(savedTheme);
}

function renderSettings() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "green";

  // Sync active swatch
  document.querySelectorAll(".theme-swatch").forEach((s) => {
    s.classList.toggle("active", s.dataset.theme === savedTheme);
  });

  // Load username display
  const ud = document.getElementById("usernameDisplay");
  if (ud) ud.textContent = CREDS.username;

  // Sync sidebar user info
  syncSidebarUser();
}

function syncSidebarUser() {
  const profile = settingsGetProfile();
  const nameEl = document.getElementById("sidebarUserName");
  const roleEl = document.getElementById("sidebarUserRole");
  if (nameEl) nameEl.textContent = profile.name || "Admin";
  if (roleEl) roleEl.textContent = profile.role || "Store Manager";
}

function applyTheme(theme, el) {
  applyThemeClass(theme);
  localStorage.setItem(THEME_KEY, theme);
  // Update active swatch UI
  document
    .querySelectorAll(".theme-swatch")
    .forEach((s) => s.classList.remove("active"));
  if (el) el.classList.add("active");
  showToast("Theme applied!");
}

function applyThemeClass(theme) {
  ALL_THEMES.forEach((t) => document.body.classList.remove("theme-" + t));
  if (theme !== "green") document.body.classList.add("theme-" + theme);
}

function resetTheme() {
  applyThemeClass("green");
  localStorage.setItem(THEME_KEY, "green");
  renderSettings();
  showToast("Theme reset to default.");
}

/* ── Modal overlay close ──────────────────────────────── */
document.getElementById("deleteModal")?.addEventListener("click", function (e) {
  if (e.target === this) closeDeleteModal();
});
document
  .getElementById("deleteSaleModal")
  ?.addEventListener("click", function (e) {
    if (e.target === this) closeDeleteSaleModal();
  });
document
  .getElementById("clearAllModal")
  ?.addEventListener("click", function (e) {
    if (e.target === this) closeClearAllModal();
  });

/* ══════════════════════════════════════════════
   SETTINGS — PROFILE, SECURITY, NAV
══════════════════════════════════════════════ */

const PROFILE_KEY = "palengke_profile";

/* ── Settings Tab Navigation ─────────────── */
function switchSettingsTab(tab, el) {
  document
    .querySelectorAll(".settings-nav-item")
    .forEach((i) => i.classList.remove("active"));
  if (el) el.classList.add("active");
  document
    .querySelectorAll(".settings-tab")
    .forEach((t) => t.classList.remove("active"));
  const panel = document.getElementById("stab-" + tab);
  if (panel) panel.classList.add("active");
}

/* ── Profile Picture ─────────────────────── */
function handleProfilePicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  processPicFile(file);
}

function picDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById("picDropzone")?.classList.add("dragover");
}

function picDragLeave(event) {
  event.preventDefault();
  document.getElementById("picDropzone")?.classList.remove("dragover");
}

function picDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById("picDropzone")?.classList.remove("dragover");
  const file = event.dataTransfer?.files?.[0];
  if (file) processPicFile(file);
}

function processPicFile(file) {
  const errEl = document.getElementById("picUploadError");
  const errMsg = document.getElementById("picUploadErrorMsg");

  // Validate type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    errMsg.textContent =
      "Invalid file type. Please use JPG, PNG, WEBP, or GIF.";
    errEl.classList.remove("hidden");
    return;
  }
  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errMsg.textContent = "File too large. Maximum size is 5MB.";
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");

  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem("palengke_profile_pic", e.target.result);
    applyProfilePic(e.target.result);
    showToast("Profile picture updated!");
  };
  reader.readAsDataURL(file);
}

function applyProfilePic(dataUrl) {
  const avatar = document.getElementById("profilePicAvatar");
  const img = document.getElementById("profilePicImg");
  const removeBtn = document.getElementById("removePicBtn");
  const sideAvatar = document.querySelector(".user-avatar");
  if (dataUrl) {
    if (avatar) avatar.classList.add("hidden");
    if (img) {
      img.src = dataUrl;
      img.classList.remove("hidden");
    }
    if (removeBtn) removeBtn.style.display = "inline-flex";
    if (sideAvatar)
      sideAvatar.innerHTML = `<img src="${dataUrl}" style="width:36px;height:36px;border-radius:10px;object-fit:cover"/>`;
  } else {
    if (avatar) avatar.classList.remove("hidden");
    if (img) {
      img.src = "";
      img.classList.add("hidden");
    }
    if (removeBtn) removeBtn.style.display = "none";
    if (sideAvatar) sideAvatar.innerHTML = `<i class="fas fa-user-tie"></i>`;
  }
}

function removeProfilePic() {
  localStorage.removeItem("palengke_profile_pic");
  applyProfilePic(null);
  const input = document.getElementById("profilePicInput");
  if (input) input.value = "";
  const errEl = document.getElementById("picUploadError");
  if (errEl) errEl.classList.add("hidden");
  showToast("Profile picture removed.");
}

/* ── Profile Fields ──────────────────────── */
function settingsGetProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch {
    return {};
  }
}

function toggleProfileEdit(field) {
  const displayRow = document.getElementById(field + "DisplayRow");
  const editRow = document.getElementById(field + "EditRow");
  const input = document.getElementById(field + "Input");
  const display = document.getElementById(field + "Display");

  if (!displayRow || !editRow) return;

  // Pre-fill input with current displayed value
  if (input && display) {
    const cur = display.textContent.trim();
    if (field === "address") {
      input.value = cur === "No address set" ? "" : cur;
    } else {
      input.value = cur;
    }
  }

  displayRow.classList.add("hidden");
  editRow.classList.remove("hidden");
  if (input) setTimeout(() => input.focus(), 50);
}

function cancelProfileEdit(field) {
  const displayRow = document.getElementById(field + "DisplayRow");
  const editRow = document.getElementById(field + "EditRow");
  if (displayRow) displayRow.classList.remove("hidden");
  if (editRow) editRow.classList.add("hidden");
}

function saveProfileField(field) {
  const input = document.getElementById(field + "Input");
  const display = document.getElementById(field + "Display");
  if (!input || !display) return;
  const val = input.value.trim();

  if (field === "address") {
    if (val) {
      display.textContent = val;
      display.classList.remove("muted");
    } else {
      display.textContent = "No address set";
      display.classList.add("muted");
    }
  } else if (field === "name") {
    display.textContent = val || "Admin";
    const userName = document.querySelector(".user-name");
    if (userName) userName.textContent = val || "Admin";
  }

  const profile = settingsGetProfile();
  profile[field] = val;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

  syncSidebarUser();
  cancelProfileEdit(field);
  showToast("Profile updated!");
}

/* ── Security Fields ─────────────────────── */
function toggleSecurityEdit(field) {
  const editRow = document.getElementById(field + "EditRow");
  if (!editRow) return;

  const isHidden = editRow.classList.contains("hidden");

  if (isHidden) {
    editRow.classList.remove("hidden");
    if (field === "username") {
      const input = document.getElementById("usernameInput");
      if (input) {
        input.value = CREDS.username;
        setTimeout(() => input.focus(), 50);
      }
    } else {
      const cp = document.getElementById("currentPassInput");
      const np = document.getElementById("newPassInput");
      const cf = document.getElementById("confirmPassInput");
      const er = document.getElementById("passwordEditError");
      if (cp) cp.value = "";
      if (np) np.value = "";
      if (cf) cf.value = "";
      if (er) er.classList.add("hidden");
      setTimeout(() => cp && cp.focus(), 50);
    }
  } else {
    editRow.classList.add("hidden");
  }
}

function cancelSecurityEdit(field) {
  const editRow = document.getElementById(field + "EditRow");
  if (editRow) editRow.classList.add("hidden");
  if (field === "password") {
    const er = document.getElementById("passwordEditError");
    if (er) er.classList.add("hidden");
  }
}

function saveSecurityField(field) {
  if (field === "username") {
    const input = document.getElementById("usernameInput");
    const val = input ? input.value.trim() : "";
    if (!val) {
      showToast("Username cannot be empty.");
      return;
    }
    CREDS.username = val;
    const display = document.getElementById("usernameDisplay");
    if (display) display.textContent = val;
    cancelSecurityEdit("username");
    showToast("Username updated!");
  } else if (field === "password") {
    const cur = document.getElementById("currentPassInput")?.value || "";
    const newPw = document.getElementById("newPassInput")?.value || "";
    const confirm = document.getElementById("confirmPassInput")?.value || "";
    const errEl = document.getElementById("passwordEditError");

    if (cur !== CREDS.password) {
      if (errEl) {
        errEl.innerHTML =
          '<i class="fas fa-circle-exclamation"></i> Current password is incorrect.';
        errEl.classList.remove("hidden");
      }
      return;
    }
    if (newPw.length < 6) {
      if (errEl) {
        errEl.innerHTML =
          '<i class="fas fa-circle-exclamation"></i> New password must be at least 6 characters.';
        errEl.classList.remove("hidden");
      }
      return;
    }
    if (newPw !== confirm) {
      if (errEl) {
        errEl.innerHTML =
          '<i class="fas fa-circle-exclamation"></i> Passwords do not match.';
        errEl.classList.remove("hidden");
      }
      return;
    }
    if (errEl) errEl.classList.add("hidden");
    CREDS.password = newPw;
    cancelSecurityEdit("password");
    showToast("Password updated successfully!");
  }
}

function toggleFieldPw(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
  if (icon)
    icon.className =
      input.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
}
/* ═══════════════════════════════════════════════════════════
   REPORTS
═══════════════════════════════════════════════════════════ */
function renderReportsPage() {
  // Set default date values if empty
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = today.slice(0, 7);
  if (!document.getElementById("rDailyDate").value)
    document.getElementById("rDailyDate").value = today;
  if (!document.getElementById("rMonthlyMonth").value)
    document.getElementById("rMonthlyMonth").value = thisMonth;
  if (!document.getElementById("rRangeFrom").value)
    document.getElementById("rRangeFrom").value = thisMonth + "-01";
  if (!document.getElementById("rRangeTo").value)
    document.getElementById("rRangeTo").value = today;
  // Hide all previews
  document
    .querySelectorAll(".report-preview")
    .forEach((el) => el.classList.add("hidden"));
}

function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function fmtMonthLabel(ym) {
  const [y, m] = ym.split("-");
  return new Date(y, m - 1, 1).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}

function reportTableHTML(headers, rows, totalsRow) {
  const ths = headers.map((h) => `<th>${h}</th>`).join("");
  const trs =
    rows.length === 0
      ? `<tr><td colspan="${headers.length}" style="text-align:center;color:#999;padding:1.5rem">No data found.</td></tr>`
      : rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("");
  const foot = totalsRow
    ? `<tfoot><tr>${totalsRow.map((c) => `<th>${c}</th>`).join("")}</tr></tfoot>`
    : "";
  return `<div class="report-table-wrap"><table class="report-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody>${foot}</table></div>`;
}

function generateReport(type) {
  // Map type to preview element ID
  const previewIds = {
    daily: "rDailyPreview",
    monthly: "rMonthlyPreview",
    inventory: "rInventoryPreview",
    outofstock: "rOutofstockPreview",
  };
  const previewEl = document.getElementById(previewIds[type]);
  if (!previewEl) return;

  // Toggle: if already visible and has content, hide it
  if (!previewEl.classList.contains("hidden") && previewEl.innerHTML.trim()) {
    previewEl.classList.add("hidden");
    previewEl.innerHTML = "";
    return;
  }

  let html = "";
  let summary = "";

  if (type === "daily") {
    const date = document.getElementById("rDailyDate").value;
    if (!date) {
      showToast("Please select a date.");
      return;
    }
    const daySales = sales.filter((s) => s.datetime.startsWith(date));
    const total = daySales.reduce((sum, s) => sum + Number(s.total), 0);
    const units = daySales.reduce((sum, s) => sum + Number(s.qty), 0);
    summary = `<div class="rp-summary"><span><i class="fas fa-receipt"></i> ${daySales.length} transactions</span><span><i class="fas fa-box"></i> ${units} units</span><span><i class="fas fa-peso-sign"></i> ${peso(total)}</span></div>`;
    const rows = daySales.map((s, i) => [
      i + 1,
      fmtDatetime(s.datetime),
      escHtml(s.productName),
      s.category,
      s.qty,
      peso(s.price),
      `<strong>${peso(s.total)}</strong>`,
    ]);
    html =
      summary +
      reportTableHTML(
        [
          "#",
          "Date & Time",
          "Product",
          "Category",
          "Qty",
          "Unit Price",
          "Total",
        ],
        rows,
        [
          "",
          "",
          "",
          "<strong>TOTAL</strong>",
          "<strong>" + units + "</strong>",
          "",
          `<strong>${peso(total)}</strong>`,
        ],
      );
  } else if (type === "monthly") {
    const month = document.getElementById("rMonthlyMonth").value;
    if (!month) {
      showToast("Please select a month.");
      return;
    }
    const moSales = sales.filter((s) => s.datetime.startsWith(month));
    const total = moSales.reduce((sum, s) => sum + Number(s.total), 0);
    const units = moSales.reduce((sum, s) => sum + Number(s.qty), 0);
    summary = `<div class="rp-summary"><span><i class="fas fa-receipt"></i> ${moSales.length} transactions</span><span><i class="fas fa-box"></i> ${units} units</span><span><i class="fas fa-peso-sign"></i> ${peso(total)}</span></div>`;
    const rows = moSales.map((s, i) => [
      i + 1,
      fmtDatetime(s.datetime),
      escHtml(s.productName),
      s.category,
      s.qty,
      peso(s.price),
      `<strong>${peso(s.total)}</strong>`,
    ]);
    html =
      summary +
      reportTableHTML(
        [
          "#",
          "Date & Time",
          "Product",
          "Category",
          "Qty",
          "Unit Price",
          "Total",
        ],
        rows,
        [
          "",
          "",
          "",
          "<strong>TOTAL</strong>",
          "<strong>" + units + "</strong>",
          "",
          `<strong>${peso(total)}</strong>`,
        ],
      );
  } else if (type === "product") {
    const catFilt = document.getElementById("rProductCat").value;
    const totals = {};
    sales.forEach((s) => {
      if (catFilt && s.category !== catFilt) return;
      if (!totals[s.productName])
        totals[s.productName] = { cat: s.category, qty: 0, revenue: 0 };
      totals[s.productName].qty += Number(s.qty);
      totals[s.productName].revenue += Number(s.total);
    });
    const sorted = Object.entries(totals).sort(
      (a, b) => b[1].revenue - a[1].revenue,
    );
    const grandRev = sorted.reduce((s, e) => s + e[1].revenue, 0);
    const grandQty = sorted.reduce((s, e) => s + e[1].qty, 0);
    summary = `<div class="rp-summary"><span><i class="fas fa-box"></i> ${sorted.length} products</span><span><i class="fas fa-peso-sign"></i> ${peso(grandRev)}</span></div>`;
    const rows = sorted.map(([name, d], i) => [
      i + 1,
      escHtml(name),
      d.cat,
      d.qty,
      `<strong>${peso(d.revenue)}</strong>`,
    ]);
    html =
      summary +
      reportTableHTML(
        ["#", "Product", "Category", "Units Sold", "Total Revenue"],
        rows,
        [
          "",
          "<strong>TOTAL</strong>",
          "",
          "<strong>" + grandQty + "</strong>",
          `<strong>${peso(grandRev)}</strong>`,
        ],
      );
  } else if (type === "inventory") {
    const catFilt = document.getElementById("rInvCat").value;
    let prods = [...products];
    if (catFilt) prods = prods.filter((p) => p.category === catFilt);
    prods.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
    );
    const totalQty = prods.reduce((s, p) => s + Number(p.qty), 0);
    const totalVal = prods.reduce(
      (s, p) => s + Number(p.qty) * Number(p.price),
      0,
    );
    summary = `<div class="rp-summary"><span><i class="fas fa-boxes-stacked"></i> ${prods.length} products</span><span><i class="fas fa-layer-group"></i> ${totalQty} total units</span><span><i class="fas fa-peso-sign"></i> ${peso(totalVal)} inventory value</span></div>`;
    const rows = prods.map((p, i) => [
      i + 1,
      escHtml(p.name),
      p.category,
      peso(p.price),
      `<span class="${p.qty === 0 ? "rbadge-zero" : p.qty <= 10 ? "rbadge-low" : "rbadge-ok"}">${p.qty}</span>`,
      `<strong>${peso(Number(p.qty) * Number(p.price))}</strong>`,
    ]);
    html =
      summary +
      reportTableHTML(
        ["#", "Product", "Category", "Unit Price", "Stock", "Stock Value"],
        rows,
        [
          "",
          "<strong>TOTAL</strong>",
          "",
          "",
          "<strong>" + totalQty + "</strong>",
          `<strong>${peso(totalVal)}</strong>`,
        ],
      );
  } else if (type === "outofstock") {
    const threshold = Number(document.getElementById("rOosThreshold").value);
    const low = products
      .filter((p) => Number(p.qty) <= threshold)
      .sort((a, b) => a.qty - b.qty);
    summary = `<div class="rp-summary"><span><i class="fas fa-ban"></i> ${low.length} products ${threshold === 0 ? "out of stock" : "at or below " + threshold + " units"}</span></div>`;
    const rows = low.map((p, i) => [
      i + 1,
      escHtml(p.name),
      p.category,
      peso(p.price),
      `<span class="${p.qty === 0 ? "rbadge-zero" : "rbadge-low"}">${p.qty === 0 ? "Out of Stock" : p.qty + " left"}</span>`,
    ]);
    html =
      summary +
      reportTableHTML(
        ["#", "Product", "Category", "Unit Price", "Stock Status"],
        rows,
        null,
      );
  } else if (type === "bestselling") {
    const mode = document.getElementById("rBestMode").value;
    const topN = Number(document.getElementById("rBestTop").value);
    const totals = {};
    sales.forEach((s) => {
      if (!totals[s.productName])
        totals[s.productName] = { cat: s.category, qty: 0, revenue: 0 };
      totals[s.productName].qty += Number(s.qty);
      totals[s.productName].revenue += Number(s.total);
    });
    let sorted = Object.entries(totals).sort((a, b) =>
      mode === "revenue" ? b[1].revenue - a[1].revenue : b[1].qty - a[1].qty,
    );
    if (topN > 0) sorted = sorted.slice(0, topN);
    const grandRev = sorted.reduce((s, e) => s + e[1].revenue, 0);
    const grandQty = sorted.reduce((s, e) => s + e[1].qty, 0);
    summary = `<div class="rp-summary"><span><i class="fas fa-trophy"></i> ${sorted.length} products</span><span><i class="fas fa-peso-sign"></i> ${peso(grandRev)}</span></div>`;
    const rows = sorted.map(([name, d], i) => [
      `<span class="rp-rank">${i + 1}</span>`,
      escHtml(name),
      d.cat,
      d.qty,
      `<strong>${peso(d.revenue)}</strong>`,
    ]);
    html =
      summary +
      reportTableHTML(
        ["Rank", "Product", "Category", "Units Sold", "Revenue"],
        rows,
        [
          "",
          "<strong>TOTAL</strong>",
          "",
          "<strong>" + grandQty + "</strong>",
          `<strong>${peso(grandRev)}</strong>`,
        ],
      );
  } else if (type === "slowmoving") {
    const days = Number(document.getElementById("rSlowDays").value);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const soldRecently = new Set(
      sales
        .filter((s) => new Date(s.datetime) >= cutoff)
        .map((s) => s.productName),
    );
    const slow = products
      .filter((p) => !soldRecently.has(p.name))
      .sort((a, b) => a.qty - b.qty);
    summary = `<div class="rp-summary"><span><i class="fas fa-snail"></i> ${slow.length} slow-moving products (no sales in ${days} days)</span></div>`;
    const allTotals = {};
    sales.forEach((s) => {
      allTotals[s.productName] =
        (allTotals[s.productName] || 0) + Number(s.total);
    });
    const rows = slow.map((p, i) => [
      i + 1,
      escHtml(p.name),
      p.category,
      p.qty,
      peso(allTotals[p.name] || 0),
      `<span class="rbadge-low">Slow</span>`,
    ]);
    html =
      summary +
      reportTableHTML(
        [
          "#",
          "Product",
          "Category",
          "Current Stock",
          "Total Sales (All Time)",
          "Status",
        ],
        rows,
        null,
      );
  } else if (type === "daterange") {
    const from = document.getElementById("rRangeFrom").value;
    const to = document.getElementById("rRangeTo").value;
    if (!from || !to) {
      showToast("Please select both From and To dates.");
      return;
    }
    if (from > to) {
      showToast("From date must be before To date.");
      return;
    }
    const ranged = sales.filter(
      (s) => s.datetime.slice(0, 10) >= from && s.datetime.slice(0, 10) <= to,
    );
    const total = ranged.reduce((sum, s) => sum + Number(s.total), 0);
    const units = ranged.reduce((sum, s) => sum + Number(s.qty), 0);
    summary = `<div class="rp-summary"><span><i class="fas fa-calendar-range"></i> ${fmtDate(from)} – ${fmtDate(to)}</span><span><i class="fas fa-receipt"></i> ${ranged.length} transactions</span><span><i class="fas fa-peso-sign"></i> ${peso(total)}</span></div>`;
    const rows = ranged.map((s, i) => [
      i + 1,
      fmtDatetime(s.datetime),
      escHtml(s.productName),
      s.category,
      s.qty,
      peso(s.price),
      `<strong>${peso(s.total)}</strong>`,
    ]);
    html =
      summary +
      reportTableHTML(
        [
          "#",
          "Date & Time",
          "Product",
          "Category",
          "Qty",
          "Unit Price",
          "Total",
        ],
        rows,
        [
          "",
          "",
          "",
          "<strong>TOTAL</strong>",
          "<strong>" + units + "</strong>",
          "",
          `<strong>${peso(total)}</strong>`,
        ],
      );
  }

  previewEl.innerHTML = html;
  previewEl.classList.remove("hidden");
  previewEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function printReport(type) {
  const previewIds = {
    daily: "rDailyPreview",
    monthly: "rMonthlyPreview",
    inventory: "rInventoryPreview",
    outofstock: "rOutofstockPreview",
  };
  // Generate preview first (ensure it's visible with content)
  const previewEl = document.getElementById(previewIds[type]);
  // If hidden/empty, generate first
  if (
    !previewEl ||
    previewEl.classList.contains("hidden") ||
    !previewEl.innerHTML.trim()
  ) {
    // Temporarily bypass toggle to force generate
    if (previewEl) {
      previewEl.classList.add("hidden");
      previewEl.innerHTML = "";
    }
    generateReport(type);
  }
  const titles = {
    daily: "Daily Sales Report",
    monthly: "Monthly Sales Report",
    inventory: "Inventory Report",
    outofstock: "Out of Stock Report",
  };
  document.getElementById("reportPrintTitle").textContent =
    titles[type] || "Report";
  document.getElementById("reportPrintSub").textContent =
    "Generated: " + new Date().toLocaleString("en-PH");
  document.getElementById("reportPrintBody").innerHTML = previewEl
    ? previewEl.innerHTML
    : "";
  document.getElementById("reportPrintModal").classList.remove("hidden");
}

function doPrint() {
  const body = document.getElementById("reportPrintBody").innerHTML;
  const title = document.getElementById("reportPrintTitle").textContent;
  const sub = document.getElementById("reportPrintSub").textContent;
  const win = window.open("", "_blank");
  win.document
    .write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',sans-serif;padding:2rem;color:#222;font-size:13px}
    h1{font-size:1.3rem;margin-bottom:.2rem;color:#1a5c3f}
    .sub{font-size:.8rem;color:#666;margin-bottom:1.2rem}
    .rp-summary{display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1rem;padding:.6rem 1rem;background:#f0faf5;border-radius:8px;border:1px solid #c8e6c9}
    .rp-summary span{font-size:.82rem;font-weight:600;color:#1a5c3f}
    .report-table-wrap{overflow-x:auto}
    table{width:100%;border-collapse:collapse;font-size:.82rem}
    th{background:#1a5c3f;color:#fff;padding:.45rem .7rem;text-align:left;font-weight:600}
    td{padding:.4rem .7rem;border-bottom:1px solid #eee}
    tr:nth-child(even) td{background:#f9fafb}
    tfoot th{background:#f0faf5;color:#1a5c3f;border-top:2px solid #2d9e6b;padding:.45rem .7rem}
    .rbadge-ok{background:#e8f5e9;color:#2d9e6b;padding:.1rem .4rem;border-radius:4px;font-weight:700;font-size:.75rem}
    .rbadge-low{background:#fff3e0;color:#e65100;padding:.1rem .4rem;border-radius:4px;font-weight:700;font-size:.75rem}
    .rbadge-zero{background:#ffebee;color:#c62828;padding:.1rem .4rem;border-radius:4px;font-weight:700;font-size:.75rem}
    .rp-rank{background:#1a5c3f;color:#fff;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800}
    @media print{body{padding:1rem}}
  </style></head><body>
  <h1>${title}</h1><div class="sub">${sub}</div>
  ${body}
  </body></html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 400);
}

/* ═══════════════════════════════════════════════════════════
   SEED EXPENSES
═══════════════════════════════════════════════════════════ */
function seedExpenses() {
  const now = new Date();
  const cats = [
    "Utilities",
    "Rent",
    "Supplies",
    "Salaries",
    "Restocking",
    "Maintenance",
    "Transportation",
    "Others",
  ];
  const descs = {
    Utilities: [
      "Electricity Bill",
      "Water Bill",
      "Internet Bill",
      "Meralco Payment",
    ],
    Rent: ["Monthly Store Rent", "Storage Room Rent"],
    Supplies: [
      "Plastic Bags",
      "Price Tags & Labels",
      "Pens & Notepad",
      "Cleaning Supplies",
    ],
    Salaries: [
      "Staff Salary - Juan",
      "Staff Salary - Maria",
      "Part-time Worker Pay",
    ],
    Restocking: [
      "Restock Canned Goods",
      "Restock Beverages",
      "Restock Instant Noodles",
      "Restock Dairy",
    ],
    Maintenance: ["Refrigerator Repair", "Store Cleaning", "Aircon Service"],
    Transportation: [
      "Delivery Fee",
      "Jeepney Fare for Supplies",
      "Tricycle Fare",
    ],
    Others: ["Miscellaneous", "Office Supplies", "Emergency Fund"],
  };
  const amtRange = {
    Utilities: [400, 900],
    Rent: [2000, 3500],
    Supplies: [100, 400],
    Salaries: [1500, 3000],
    Restocking: [500, 1500],
    Maintenance: [200, 800],
    Transportation: [50, 250],
    Others: [100, 500],
  };
  const generated = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const isCurrentMonth = yr === now.getFullYear() && mo === now.getMonth();
    const maxDay = isCurrentMonth
      ? now.getDate()
      : new Date(yr, mo + 1, 0).getDate();
    const count = 4 + Math.floor(Math.random() * 4);
    for (let t = 0; t < count; t++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const descList = descs[cat];
      const desc = descList[Math.floor(Math.random() * descList.length)];
      const [min, max] = amtRange[cat];
      const amount = min + Math.floor(Math.random() * (max - min));
      const day = 1 + Math.floor(Math.random() * (maxDay - 1));
      const dateStr = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      generated.push({ id: uid(), desc, category: cat, amount, date: dateStr });
    }
  }
  localStorage.setItem(EXP_KEY, JSON.stringify(generated));
  return generated;
}

/* ═══════════════════════════════════════════════════════════
   EXPENSES PAGE
═══════════════════════════════════════════════════════════ */
function renderFinancePage() {
  // Default to expenses tab, reset to it each time
  switchFinanceTab("expenses", document.getElementById("ftab-btn-expenses"));
}

function switchFinanceTab(tab, btn) {
  document
    .querySelectorAll(".finance-tab")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".finance-tab-content")
    .forEach((c) => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const el = document.getElementById("ftab-" + tab);
  if (el) el.classList.add("active");
  if (tab === "expenses") renderExpensesPage();
  if (tab === "profit") renderProfitPage();
}

function renderExpensesPage() {
  // Set default date
  if (!document.getElementById("eDate").value)
    document.getElementById("eDate").value = new Date()
      .toISOString()
      .slice(0, 10);
  renderExpenseCards();
  renderExpensesMonthFilter();
  renderExpensesTable();
}

function renderExpenseCards() {
  const now = new Date();
  const thisMo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const totalAll = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalMo = expenses
    .filter((e) => e.date.startsWith(thisMo))
    .reduce((s, e) => s + Number(e.amount), 0);
  const countAll = expenses.length;
  const countMo = expenses.filter((e) => e.date.startsWith(thisMo)).length;
  const cards = [
    {
      icon: "fa-receipt",
      label: "Total Expenses",
      value: peso(totalAll),
      cls: "theme",
    },
    {
      icon: "fa-calendar-day",
      label: "This Month Expenses",
      value: peso(totalMo),
      cls: "theme",
    },
    {
      icon: "fa-list-check",
      label: "Total Transactions",
      value: countAll,
      cls: "theme",
    },
    {
      icon: "fa-calendar-check",
      label: "This Month Records",
      value: countMo,
      cls: "theme",
    },
  ];
  document.getElementById("expenseCards").innerHTML = cards
    .map(
      (c) => `
    <div class="big-stat-card theme">
      <div class="big-stat-icon theme"><i class="fas ${c.icon}"></i></div>
      <div class="big-stat-value">${c.value}</div>
      <div class="big-stat-label">${c.label}</div>
    </div>`,
    )
    .join("");
}

function renderExpensesMonthFilter() {
  const keys = [...new Set(expenses.map((e) => e.date.slice(0, 7)))]
    .sort()
    .reverse();
  const sel = document.getElementById("expFilterMonth");
  const cur = sel.value;
  sel.innerHTML =
    '<option value="">All Months</option>' +
    keys
      .map(
        (k) =>
          `<option value="${k}" ${k === cur ? "selected" : ""}>${fmtMonthLabel(k)}</option>`,
      )
      .join("");
}

function renderExpensesTable() {
  const search = (
    document.getElementById("expSearch").value || ""
  ).toLowerCase();
  const catFilt = document.getElementById("expFilterCat").value;
  const moFilt = document.getElementById("expFilterMonth").value;
  const filtered = expenses
    .filter(
      (e) =>
        (!search ||
          e.desc.toLowerCase().includes(search) ||
          e.category.toLowerCase().includes(search)) &&
        (!catFilt || e.category === catFilt) &&
        (!moFilt || e.date.startsWith(moFilt)),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const tbody = document.getElementById("expTableBody");
  const empty = document.getElementById("emptyExpenses");
  if (filtered.length === 0) {
    tbody.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  tbody.innerHTML = filtered
    .map(
      (e, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="font-size:.82rem">${fmtDate(e.date)}</td>
      <td><strong>${escHtml(e.desc)}</strong></td>
      <td><span class="badge badge-gray">${e.category}</span></td>
      <td style="font-weight:800;color:var(--red)"><strong>${peso(e.amount)}</strong></td>
      <td>
        <div style="display:flex;gap:.4rem">
          <button class="btn btn-sm" style="background:var(--green-light);color:var(--green);font-size:.75rem;padding:.3rem .65rem" onclick="editExpense('${e.id}')">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn btn-danger btn-sm" style="font-size:.75rem;padding:.3rem .65rem" onclick="openDeleteExpenseModal('${e.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`,
    )
    .join("");
}

function submitExpense() {
  const desc = document.getElementById("eDesc").value.trim();
  const cat = document.getElementById("eCat").value;
  const amount = parseFloat(document.getElementById("eAmount").value);
  const date = document.getElementById("eDate").value;
  const errEl = document.getElementById("expFormError");
  if (!desc || !cat || !date || isNaN(amount) || amount <= 0) {
    errEl.innerHTML =
      '<i class="fas fa-circle-exclamation"></i> Please fill in all fields correctly.';
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");
  const id = document.getElementById("eId").value;
  if (id) {
    const idx = expenses.findIndex((e) => e.id === id);
    if (idx > -1) expenses[idx] = { id, desc, category: cat, amount, date };
  } else {
    expenses.push({ id: uid(), desc, category: cat, amount, date });
  }
  saveExpenses();
  cancelExpenseForm();
  renderExpensesPage();
  showToast(id ? "Expense updated!" : "Expense added!");
}

function editExpense(id) {
  const e = expenses.find((x) => x.id === id);
  if (!e) return;
  document.getElementById("eDesc").value = e.desc;
  document.getElementById("eCat").value = e.category;
  document.getElementById("eAmount").value = e.amount;
  document.getElementById("eDate").value = e.date;
  document.getElementById("eId").value = e.id;
  document.getElementById("expFormTitle").innerHTML =
    '<i class="fas fa-pen"></i> Edit Expense';
  document.getElementById("expSubmitBtn").innerHTML =
    '<i class="fas fa-floppy-disk"></i> Update Expense';
  document.getElementById("expCancelBtn").style.display = "";
  document.getElementById("productForm") &&
    document.getElementById("productForm").scrollIntoView;
  document.getElementById("eDesc").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelExpenseForm() {
  document.getElementById("eDesc").value = "";
  document.getElementById("eCat").value = "";
  document.getElementById("eAmount").value = "";
  document.getElementById("eDate").value = new Date()
    .toISOString()
    .slice(0, 10);
  document.getElementById("eId").value = "";
  document.getElementById("expFormTitle").innerHTML =
    '<i class="fas fa-plus-circle"></i> Add New Expense';
  document.getElementById("expSubmitBtn").innerHTML =
    '<i class="fas fa-floppy-disk"></i> Save Expense';
  document.getElementById("expCancelBtn").style.display = "none";
  document.getElementById("expFormError").classList.add("hidden");
}

let deleteExpenseId = null;
function openDeleteExpenseModal(id) {
  deleteExpenseId = id;
  const e = expenses.find((x) => x.id === id);
  document.getElementById("deleteExpenseMsg").textContent = e
    ? `Delete "${e.desc}"? This cannot be undone.`
    : "This cannot be undone.";
  document.getElementById("deleteExpenseModal").classList.remove("hidden");
}
function confirmDeleteExpense() {
  expenses = expenses.filter((e) => e.id !== deleteExpenseId);
  saveExpenses();
  document.getElementById("deleteExpenseModal").classList.add("hidden");
  renderExpensesPage();
  showToast("Expense deleted.");
}

/* ═══════════════════════════════════════════════════════════
   PROFIT PAGE
═══════════════════════════════════════════════════════════ */
function renderProfitPage() {
  const now = new Date();
  const thisMo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totalRevenue = sales.reduce((s, x) => s + Number(x.total), 0);
  const totalExpenses = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const netProfit = totalRevenue - totalExpenses;
  const moRevenue = sales
    .filter((s) => s.datetime.startsWith(thisMo))
    .reduce((s, x) => s + Number(x.total), 0);
  const moExpenses = expenses
    .filter((e) => e.date.startsWith(thisMo))
    .reduce((s, x) => s + Number(x.amount), 0);
  const moProfit = moRevenue - moExpenses;

  const cards = [
    {
      icon: "fa-chart-line",
      label: "Total Revenue (All Time)",
      value: peso(totalRevenue),
      color: "var(--green)",
      bg: "var(--green-light)",
    },
    {
      icon: "fa-receipt",
      label: "Total Expenses (All Time)",
      value: peso(totalExpenses),
      color: "var(--red)",
      bg: "var(--red-light)",
    },
    {
      icon: "fa-peso-sign",
      label: "Net Profit (All Time)",
      value: peso(netProfit),
      color: netProfit >= 0 ? "var(--green)" : "var(--red)",
      bg: netProfit >= 0 ? "var(--green-light)" : "var(--red-light)",
    },
    {
      icon: "fa-calendar-day",
      label: "This Month Net Profit",
      value: peso(moProfit),
      color: moProfit >= 0 ? "var(--green)" : "var(--red)",
      bg: moProfit >= 0 ? "var(--green-light)" : "var(--red-light)",
    },
  ];
  document.getElementById("profitCards").innerHTML = cards
    .map(
      (c) => `
    <div class="big-stat-card" style="border-top:4px solid ${c.color}">
      <div class="big-stat-icon" style="background:${c.bg};color:${c.color}"><i class="fas ${c.icon}"></i></div>
      <div class="big-stat-value" style="color:${c.color}">${c.value}</div>
      <div class="big-stat-label">${c.label}</div>
    </div>`,
    )
    .join("");

  // Build all months present in either sales or expenses
  const allMonths = [
    ...new Set([
      ...sales.map((s) => s.datetime.slice(0, 7)),
      ...expenses.map((e) => e.date.slice(0, 7)),
    ]),
  ]
    .sort()
    .reverse();

  const tbody = document.getElementById("profitTableBody");
  const empty = document.getElementById("emptyProfit");
  if (allMonths.length === 0) {
    tbody.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  tbody.innerHTML = allMonths
    .map((mo) => {
      const rev = sales
        .filter((s) => s.datetime.startsWith(mo))
        .reduce((s, x) => s + Number(x.total), 0);
      const exp = expenses
        .filter((e) => e.date.startsWith(mo))
        .reduce((s, x) => s + Number(x.amount), 0);
      const net = rev - exp;
      const margin = rev > 0 ? ((net / rev) * 100).toFixed(1) : "0.0";
      const color = net >= 0 ? "var(--green-dark)" : "var(--red)";
      return `<tr>
      <td><strong>${fmtMonthLabel(mo)}</strong></td>
      <td style="color:var(--green-dark);font-weight:700">${peso(rev)}</td>
      <td style="color:var(--red);font-weight:700">${peso(exp)}</td>
      <td style="color:${color};font-weight:800">${net >= 0 ? "+" : ""}${peso(net)}</td>
      <td><span class="profit-margin ${net >= 0 ? "pos" : "neg"}">${margin}%</span></td>
    </tr>`;
    })
    .join("");

  // Expense breakdown by category
  const catTotals = {};
  expenses.forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
  });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCats[0]?.[1] || 1;
  document.getElementById("expCategoryBreakdown").innerHTML =
    sortedCats.length === 0
      ? '<p style="color:var(--text-muted);font-size:.85rem">No expense data.</p>'
      : sortedCats
          .map(
            ([cat, amt]) => `
      <div class="exp-cat-row">
        <div class="exp-cat-label">${cat}</div>
        <div class="exp-cat-bar-wrap">
          <div class="exp-cat-bar" style="width:${((amt / maxCat) * 100).toFixed(1)}%"></div>
        </div>
        <div class="exp-cat-val">${peso(amt)}</div>
      </div>`,
          )
          .join("");
}
