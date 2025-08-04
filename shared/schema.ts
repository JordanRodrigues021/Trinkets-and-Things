import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(), // 'functional', 'artistic', 'prototypes'
  colors: text("colors").array().notNull(),
  disabledColors: text("disabled_colors").array().notNull().default(sql`'{}'`),
  images: text("images").array().notNull(),
  featured: integer("featured").default(0), // 0 = normal, 1 = featured, 2 = popular
  customizable: integer("customizable").default(0), // 0 = not customizable, 1 = customizable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Mystery boxes table
export const mysteryBoxes = pgTable("mystery_boxes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  contents: text("contents").notNull(),
  rarity: text("rarity").notNull(), // 'uncommon', 'rare', 'super-rare'
  features: text("features").array().notNull(),
  isActive: integer("is_active").notNull().default(1),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMysteryBoxSchema = createInsertSchema(mysteryBoxes).omit({
  id: true,
  createdAt: true,
});

export type InsertMysteryBox = z.infer<typeof insertMysteryBoxSchema>;
export type MysteryBox = typeof mysteryBoxes.$inferSelect;

// Keep existing user types for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Ecommerce tables
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  subtotalAmount: decimal("subtotal_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  couponCode: text("coupon_code"), // Applied coupon code
  paymentMethod: text("payment_method").notNull(), // 'cash', 'upi'
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'confirmed', 'cancelled'
  orderStatus: text("order_status").notNull().default("placed"), // 'placed', 'confirmed', 'ready', 'completed', 'cancelled'
  shippingAddress: text("shipping_address").notNull().default("Pickup from A Level Classroom at Don Bosco International School"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
  selectedColor: text("selected_color").notNull(),
  customName: text("custom_name"), // For customizable products
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Promotional banners table
export const banners = pgTable("banners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  buttonText: text("button_text"), // Optional button text
  buttonLink: text("button_link"), // Optional button link
  backgroundColor: text("background_color").notNull().default("#3B82F6"), // Hex color
  textColor: text("text_color").notNull().default("#FFFFFF"), // Hex color
  isActive: integer("is_active").notNull().default(1), // 0 = inactive, 1 = active
  priority: integer("priority").notNull().default(0), // Higher number = higher priority
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"), // Optional end date
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(), // 'percentage' or 'fixed'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }), // Optional minimum order
  maxUses: integer("max_uses"), // Optional usage limit
  currentUses: integer("current_uses").notNull().default(0),
  isActive: integer("is_active").notNull().default(1), // 0 = inactive, 1 = active
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"), // Optional end date
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  rating: integer("rating").notNull(),
  reviewText: text("review_text").notNull(),
  productPurchased: text("product_purchased"), // Which product they bought
  profilePictureUrl: text("profile_picture_url"), // Optional profile picture
  isApproved: integer("is_approved").notNull().default(0), // 0 = pending, 1 = approved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Custom sections table for enhanced category management
export const customSections = pgTable("custom_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: integer("is_active").notNull().default(1), // 0 = inactive, 1 = active
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Section products table for linking products to custom sections
export const sectionProducts = pgTable("section_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectionId: varchar("section_id").notNull().references(() => customSections.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for ecommerce
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
  createdAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCustomSectionSchema = createInsertSchema(customSections).omit({
  id: true,
  createdAt: true,
});

export const insertSectionProductSchema = createInsertSchema(sectionProducts).omit({
  id: true,
  createdAt: true,
});

// Types for ecommerce
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof banners.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertCustomSection = z.infer<typeof insertCustomSectionSchema>;
export type CustomSection = typeof customSections.$inferSelect;
export type InsertSectionProduct = z.infer<typeof insertSectionProductSchema>;
export type SectionProduct = typeof sectionProducts.$inferSelect;
