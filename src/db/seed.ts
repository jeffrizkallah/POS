import { db } from "./index";
import { categories, products } from "./schema";

const CATEGORIES_DATA = [
  { name: "Hot Drinks", slug: "hot-drinks", icon: "Coffee", sortOrder: 1 },
  { name: "Cold Drinks", slug: "cold-drinks", icon: "GlassWater", sortOrder: 2 },
  { name: "Pastries", slug: "pastries", icon: "Croissant", sortOrder: 3 },
  { name: "Sandwiches", slug: "sandwiches", icon: "Sandwich", sortOrder: 4 },
  { name: "Desserts", slug: "desserts", icon: "Cake", sortOrder: 5 },
  { name: "Extras", slug: "extras", icon: "Plus", sortOrder: 6 },
];

const PRODUCTS_DATA: Record<string, Array<{ name: string; sku: string; price: string; stock: number }>> = {
  "hot-drinks": [
    { name: "Espresso", sku: "HD-001", price: "12.00", stock: 100 },
    { name: "Double Espresso", sku: "HD-002", price: "16.00", stock: 100 },
    { name: "Americano", sku: "HD-003", price: "15.00", stock: 100 },
    { name: "Cappuccino", sku: "HD-004", price: "18.00", stock: 100 },
    { name: "Latte", sku: "HD-005", price: "20.00", stock: 100 },
    { name: "Flat White", sku: "HD-006", price: "20.00", stock: 100 },
    { name: "Mocha", sku: "HD-007", price: "22.00", stock: 100 },
    { name: "Hot Chocolate", sku: "HD-008", price: "20.00", stock: 100 },
    { name: "Chai Latte", sku: "HD-009", price: "18.00", stock: 100 },
    { name: "Turkish Coffee", sku: "HD-010", price: "14.00", stock: 100 },
  ],
  "cold-drinks": [
    { name: "Iced Americano", sku: "CD-001", price: "18.00", stock: 100 },
    { name: "Iced Latte", sku: "CD-002", price: "22.00", stock: 100 },
    { name: "Iced Mocha", sku: "CD-003", price: "24.00", stock: 100 },
    { name: "Fresh Orange Juice", sku: "CD-004", price: "16.00", stock: 80 },
    { name: "Lemonade", sku: "CD-005", price: "14.00", stock: 80 },
    { name: "Mango Smoothie", sku: "CD-006", price: "22.00", stock: 60 },
    { name: "Berry Smoothie", sku: "CD-007", price: "22.00", stock: 60 },
    { name: "Mineral Water", sku: "CD-008", price: "5.00", stock: 200 },
  ],
  "pastries": [
    { name: "Butter Croissant", sku: "PA-001", price: "14.00", stock: 50 },
    { name: "Chocolate Croissant", sku: "PA-002", price: "16.00", stock: 50 },
    { name: "Blueberry Muffin", sku: "PA-003", price: "12.00", stock: 40 },
    { name: "Banana Bread", sku: "PA-004", price: "14.00", stock: 30 },
    { name: "Cinnamon Roll", sku: "PA-005", price: "16.00", stock: 30 },
    { name: "Scone", sku: "PA-006", price: "12.00", stock: 40 },
  ],
  "sandwiches": [
    { name: "Club Sandwich", sku: "SW-001", price: "32.00", stock: 30 },
    { name: "Grilled Chicken Wrap", sku: "SW-002", price: "28.00", stock: 30 },
    { name: "Beef Burger", sku: "SW-003", price: "35.00", stock: 25 },
    { name: "Veggie Wrap", sku: "SW-004", price: "26.00", stock: 25 },
    { name: "Tuna Sandwich", sku: "SW-005", price: "28.00", stock: 30 },
    { name: "Halloumi Sandwich", sku: "SW-006", price: "30.00", stock: 25 },
  ],
  "desserts": [
    { name: "Kunafa", sku: "DS-001", price: "22.00", stock: 20 },
    { name: "Cheesecake", sku: "DS-002", price: "25.00", stock: 20 },
    { name: "Chocolate Cake", sku: "DS-003", price: "25.00", stock: 20 },
    { name: "Tiramisu", sku: "DS-004", price: "28.00", stock: 15 },
    { name: "Crème Brûlée", sku: "DS-005", price: "26.00", stock: 15 },
  ],
  "extras": [
    { name: "Extra Shot", sku: "EX-001", price: "5.00", stock: 200 },
    { name: "Oat Milk", sku: "EX-002", price: "4.00", stock: 100 },
    { name: "Almond Milk", sku: "EX-003", price: "4.00", stock: 100 },
    { name: "Whipped Cream", sku: "EX-004", price: "3.00", stock: 100 },
    { name: "Caramel Syrup", sku: "EX-005", price: "3.00", stock: 100 },
  ],
};

export async function seedDatabase() {
  // Insert categories
  const insertedCategories = await db
    .insert(categories)
    .values(CATEGORIES_DATA)
    .returning();

  // Build slug -> id map
  const categoryMap = new Map(
    insertedCategories.map((c) => [c.slug, c.id])
  );

  // Insert products
  const allProducts = Object.entries(PRODUCTS_DATA).flatMap(
    ([slug, items]) =>
      items.map((item) => ({
        name: item.name,
        sku: item.sku,
        price: item.price,
        stockQuantity: item.stock,
        categoryId: categoryMap.get(slug)!,
      }))
  );

  await db.insert(products).values(allProducts);

  return {
    categories: insertedCategories.length,
    products: allProducts.length,
  };
}
