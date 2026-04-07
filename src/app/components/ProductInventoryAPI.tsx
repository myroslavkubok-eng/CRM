/**
 * PRODUCT INVENTORY MANAGEMENT API
 * 
 * This file demonstrates how to integrate the product inventory system
 * with the checkout process and other parts of the application.
 */

// Example: How to use sellProduct function from ProductsTab
// This function should be exported and called when a product is purchased

/**
 * sellProduct function - Automatically decreases stock when product is sold
 * 
 * @param productId - The ID of the product being sold
 * @param quantity - How many units are being sold
 * @returns Object with success status and message
 * 
 * Example usage:
 */

// In CheckoutModal.tsx or any payment confirmation component:
export const handleProductPurchase = (
  productId: string, 
  quantity: number,
  sellProductFn: (id: string, qty: number) => { success: boolean; message: string }
) => {
  // Before processing payment, check if product is in stock
  const result = sellProductFn(productId, quantity);
  
  if (!result.success) {
    // Stock not available - show error to user
    console.error(result.message);
    return {
      canProceed: false,
      error: result.message
    };
  }
  
  // Stock is available and has been decreased
  // Proceed with payment
  console.log('Stock updated successfully, proceeding with payment...');
  return {
    canProceed: true,
    message: result.message
  };
};

/**
 * Example integration with CheckoutModal:
 * 
 * 1. Pass sellProduct function as prop to CheckoutModal:
 *    <CheckoutModal 
 *      onSellProduct={sellProduct}
 *      products={selectedProducts}
 *    />
 * 
 * 2. In CheckoutModal, before payment confirmation:
 *    const handlePayment = () => {
 *      // Check stock for all products
 *      for (const item of cartItems) {
 *        const result = onSellProduct(item.productId, item.quantity);
 *        if (!result.success) {
 *          toast.error(result.message);
 *          return;
 *        }
 *      }
 *      // All products in stock, process payment
 *      processPayment();
 *    }
 * 
 * 3. Stock validation before adding to cart:
 *    const addToCart = (product) => {
 *      if (product.stock === 0) {
 *        toast.error('Product is out of stock!');
 *        return;
 *      }
 *      if (product.stock < requestedQuantity) {
 *        toast.error(`Only ${product.stock} items available!`);
 *        return;
 *      }
 *      // Add to cart
 *    }
 */

/**
 * INVENTORY ALERTS SYSTEM
 * 
 * The system automatically shows visual indicators:
 * - GREEN badge: Stock >= 10 (Normal stock)
 * - ORANGE badge + warning: Stock < 10 (Low stock - restock soon!)
 * - RED badge + alert: Stock === 0 (Out of stock - restock required!)
 * 
 * Products with low/no stock are highlighted with colored borders
 * and the product image is grayed out when out of stock.
 */

/**
 * RESTOCK WORKFLOW
 * 
 * 1. Owner/Admin clicks the TrendingUp icon button on any product
 * 2. RestockModal opens showing current stock level
 * 3. Can choose to ADD or REMOVE stock
 * 4. Enter quantity
 * 5. Preview shows the new stock level with color coding
 * 6. Confirm to update inventory
 * 
 * The system prevents:
 * - Removing more stock than available
 * - Negative stock values
 * - Selling out-of-stock products
 */

/**
 * ADDING NEW PRODUCTS
 * 
 * When creating a new product, the owner must specify:
 * - Product photo (optional, max 5MB)
 * - Product name
 * - Price + Currency (all 20 currencies supported)
 * - Initial stock quantity (required)
 * - Description
 * 
 * The initial stock is set when the product is created.
 */

export const STOCK_LEVELS = {
  CRITICAL: 0,      // Out of stock
  LOW: 10,          // Low stock warning threshold
  NORMAL: 10,       // Normal stock level
} as const;

export type StockLevel = 'critical' | 'low' | 'normal';

export const getStockLevel = (stock: number): StockLevel => {
  if (stock === STOCK_LEVELS.CRITICAL) return 'critical';
  if (stock < STOCK_LEVELS.LOW) return 'low';
  return 'normal';
};

export const getStockColor = (level: StockLevel): string => {
  switch (level) {
    case 'critical': return 'red';
    case 'low': return 'orange';
    case 'normal': return 'green';
  }
};
