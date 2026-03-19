/**
 * Shop Service — business logic layer
 */
import type {
  ShopProduct, WishlistItem,
  MerchantProduct, MerchantOrder, ShopFrontProduct, CustomerOrder,
  SalesChartDataPoint, CategoryDataPoint, MerchantChartDataPoint,
  ShopDashboardOrder, MerchantFulfillmentData, InventoryItem,
  ProductDetailData, CartItem, OrderTrackingData, ProductReviewDetail,
} from "@/backend/models";
import {
  MOCK_SHOP_PRODUCTS,
  MOCK_WISHLIST,
  MOCK_MERCHANT_PRODUCTS,
  MOCK_MERCHANT_ORDERS,
  MOCK_SHOPFRONT_PRODUCTS,
  MOCK_CUSTOMER_ORDERS,
  MOCK_SHOP_SALES_DATA,
  MOCK_SHOP_CATEGORY_DATA,
  MOCK_MERCHANT_ANALYTICS_DATA,
  MOCK_SHOP_DASHBOARD_ORDERS,
  MOCK_MERCHANT_FULFILLMENT,
  MOCK_INVENTORY,
  MOCK_CART_ITEMS,
  MOCK_ORDER_TRACKING,
  MOCK_PRODUCT_REVIEWS,
} from "@/backend/api/mock";
import { USE_SUPABASE, sbRead, sb, currentUserId } from "./_sb";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

function mapProduct(d: any): ShopProduct {
  return {
    id: d.id, name: d.name, category: d.category, description: d.description,
    price: d.price, oldPrice: d.old_price, stock: d.stock, sales: d.sales,
    rating: d.rating, reviews: d.reviews, image: d.image || "",
    inStock: d.in_stock,
  };
}

export const shopService = {
  /** Get all products, optionally filtered by category */
  async getProducts(category?: string): Promise<ShopProduct[]> {
    if (USE_SUPABASE) {
      const key = `shop:products:${category || "all"}`;
      return sbRead(key, async () => {
        let q = sb().from("shop_products").select("*").order("sales", { ascending: false });
        if (category) q = q.eq("category", category);
        const { data, error } = await q;
        if (error) throw error;
        return (data || []).map(mapProduct);
      });
    }
    await delay();
    if (!category) return MOCK_SHOP_PRODUCTS;
    return MOCK_SHOP_PRODUCTS.filter((p) => p.category === category);
  },

  /** Get product by ID */
  async getProductById(id: string): Promise<ShopProduct | undefined> {
    if (USE_SUPABASE) {
      return sbRead(`shop:product:${id}`, async () => {
        const { data, error } = await sb().from("shop_products").select("*").eq("id", id).single();
        if (error) return undefined;
        return mapProduct(data);
      });
    }
    await delay();
    return MOCK_SHOP_PRODUCTS.find((p) => p.id === id);
  },

  /** Get user's wishlist */
  async getWishlist(): Promise<WishlistItem[]> {
    await delay();
    return MOCK_WISHLIST;
  },

  async getMerchantProducts(): Promise<MerchantProduct[]> {
    if (USE_SUPABASE) {
      return sbRead("shop:merchant-products", async () => {
        const userId = await currentUserId();
        const { data, error } = await sb().from("shop_products")
          .select("*")
          .eq("merchant_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map((d: any) => ({
          id: d.id, name: d.name, category: d.category, price: d.price,
          stock: d.stock, sales: d.sales, rating: d.rating, status: d.in_stock ? "active" : "inactive",
          image: d.image || "",
        }));
      });
    }
    await delay();
    return MOCK_MERCHANT_PRODUCTS;
  },

  async getMerchantOrders(): Promise<MerchantOrder[]> {
    if (USE_SUPABASE) {
      return sbRead("shop:merchant-orders", async () => {
        const userId = await currentUserId();
        const { data, error } = await sb().from("shop_orders")
          .select("*")
          .eq("merchant_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map((d: any) => ({
          id: d.id, customer: d.customer_name, items: d.items_count,
          total: d.total, status: d.status, date: d.created_at,
        }));
      });
    }
    await delay();
    return MOCK_MERCHANT_ORDERS;
  },

  async getShopFrontProducts(): Promise<ShopFrontProduct[]> {
    if (USE_SUPABASE) {
      return sbRead("shop:front", async () => {
        const { data, error } = await sb().from("shop_products")
          .select("*")
          .eq("in_stock", true)
          .order("sales", { ascending: false })
          .limit(20);
        if (error) throw error;
        return (data || []).map(mapProduct);
      });
    }
    await delay();
    return MOCK_SHOPFRONT_PRODUCTS;
  },

  async getCustomerOrders(): Promise<CustomerOrder[]> {
    if (USE_SUPABASE) {
      return sbRead("shop:my-orders", async () => {
        const userId = await currentUserId();
        const { data, error } = await sb().from("shop_orders")
          .select("*")
          .eq("customer_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map((d: any) => ({
          id: d.id, items: d.items_count, total: d.total,
          status: d.status, date: d.created_at, tracking: d.tracking,
        }));
      });
    }
    await delay();
    return MOCK_CUSTOMER_ORDERS;
  },

  // ─── Analytics (aggregation — keep mock for now, will be Supabase views/RPCs) ───
  async getShopSalesData(): Promise<SalesChartDataPoint[]> {
    await delay();
    return MOCK_SHOP_SALES_DATA;
  },

  async getShopCategoryData(): Promise<CategoryDataPoint[]> {
    await delay();
    return MOCK_SHOP_CATEGORY_DATA;
  },

  async getMerchantAnalyticsData(): Promise<MerchantChartDataPoint[]> {
    await delay();
    return MOCK_MERCHANT_ANALYTICS_DATA;
  },

  async getShopDashboardOrders(): Promise<ShopDashboardOrder[]> {
    await delay();
    return MOCK_SHOP_DASHBOARD_ORDERS;
  },

  async getMerchantFulfillment(): Promise<MerchantFulfillmentData> {
    await delay();
    return MOCK_MERCHANT_FULFILLMENT;
  },

  async getInventory(): Promise<InventoryItem[]> {
    if (USE_SUPABASE) {
      return sbRead("shop:inventory", async () => {
        const userId = await currentUserId();
        const { data, error } = await sb().from("shop_products")
          .select("id, name, sku, stock, threshold, category, price")
          .eq("merchant_id", userId)
          .order("stock", { ascending: true });
        if (error) throw error;
        return (data || []).map((d: any) => ({
          id: d.id, name: d.name, sku: d.sku || "", stock: d.stock,
          threshold: d.threshold || 10, category: d.category, price: d.price,
          status: d.stock <= 0 ? "out_of_stock" : d.stock <= (d.threshold || 10) ? "low_stock" : "in_stock",
        }));
      });
    }
    await delay();
    return MOCK_INVENTORY;
  },

  async getProductDetail(id: string): Promise<ProductDetailData> {
    await delay();
    const product = MOCK_SHOP_PRODUCTS.find(p => p.id === id) ?? MOCK_SHOP_PRODUCTS[0];
    return { ...product, reviews: MOCK_PRODUCT_REVIEWS };
  },

  async getCartItems(): Promise<CartItem[]> {
    await delay();
    return MOCK_CART_ITEMS;
  },

  async getOrderTracking(orderId: string): Promise<OrderTrackingData> {
    if (USE_SUPABASE) {
      return sbRead(`order-track:${orderId}`, async () => {
        const { data, error } = await sb().from("shop_orders")
          .select("*")
          .eq("id", orderId)
          .single();
        if (error) throw error;
        return {
          id: data.id, status: data.status, tracking: data.tracking,
          courier: data.courier, updatedAt: data.updated_at,
          steps: [], // TODO: order_tracking_steps table
        };
      });
    }
    await delay();
    return { ...MOCK_ORDER_TRACKING, id: orderId || MOCK_ORDER_TRACKING.id };
  },

  async getProductReviews(productId: string): Promise<ProductReviewDetail[]> {
    await delay();
    return MOCK_PRODUCT_REVIEWS;
  },
};
