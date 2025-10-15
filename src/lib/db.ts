import Database from "@tauri-apps/plugin-sql";
import { ProductFormData } from "@/types";

export const db = await Database.load("sqlite:data.db");

export function initDb() {
  db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT,
      price INTEGER NOT NULL DEFAULT 0,
      owner_name TEXT,
      owner_contact TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function getProducts() {
  // return products ordered by newest first
  const result = await db.select(
    "SELECT * FROM products ORDER BY datetime(created_at) DESC",
    []
  );
  return result;
}

export async function searchProducts(query: string) {
  // simple LIKE search on name and desc, newest first
  const term = `%${query}%`;
  const result = await db.select(
    "SELECT * FROM products WHERE name LIKE ? OR desc LIKE ? ORDER BY datetime(created_at) DESC",
    [term, term]
  );
  return result;
}

export async function addProduct(data: ProductFormData) {
  await db.execute(
    "INSERT INTO products (name, desc, price, owner_name, owner_contact) VALUES (?, ?, ?, ?, ?)",
    [
      data.product_name,
      data.product_desc,
      data.price * 100,
      data.name,
      data.contact,
    ]
  );
}

export async function deleteProduct(id: number) {
  await db.execute("DELETE FROM products WHERE id = ?", [id]);
}
