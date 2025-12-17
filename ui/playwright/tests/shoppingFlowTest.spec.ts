import { test, expect } from "@playwright/test";

test.describe("AutomationExercise E-Commerce Tests", () => {
  test("Should navigate to home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Automation Exercise/i);
    const logo = page.locator('img[alt="Website for automation practice"]');
    await expect(logo).toBeVisible();
  });

  test("Should display all products on products page", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("text=All Products")).toBeVisible();
    const productLinks = page.locator('.single-products');
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Should add product to cart successfully", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("text=All Products")).toBeVisible();
    
    // Click on first product's add to cart button
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.locator('a[href*="add_to_cart"]').click();
    
    // Verify success message or cart badge
    const successMsg = page.locator("text=Added To Cart").first();
    await expect(successMsg).toBeVisible();
  });

  test("Should view shopping cart with items", async ({ page }) => {
    await page.goto("/products");
    
    // Add product to cart
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.locator('a[href*="add_to_cart"]').click();
    
    // Navigate to cart
    await page.goto("/view_cart");
    await expect(page.locator("text=Shopping Cart")).toBeVisible();
    
    // Verify product is in cart
    const cartItems = page.locator('table tbody tr');
    await expect(cartItems.first()).toBeVisible();
  });

  test("Should proceed to checkout", async ({ page }) => {
    await page.goto("/products");
    
    // Add product
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.locator('a[href*="add_to_cart"]').click();
    
    // Go to cart
    await page.goto("/view_cart");
    
    // Click proceed to checkout
    await page.locator("text=Proceed To Checkout").click();
    
    // Should be on checkout page
    await expect(page.locator("text=Address Details|Billing Address")).toBeVisible({ timeout: 5000 });
  });

  test("Should navigate through product search", async ({ page }) => {
    await page.goto("/products");
    
    // Search for a product
    const searchBox = page.locator('input[placeholder="Search Products"]');
    await searchBox.fill("Blue");
    await page.locator('button[id="submit_search"]').click();
    
    // Verify search results
    const results = page.locator('.single-products');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Should handle product detail page", async ({ page }) => {
    await page.goto("/products");
    
    // Click on first product view
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.locator('a[href*="product_details"]').first().click();
    
    // Verify product details are visible
    await expect(page.locator('.product-details')).toBeVisible();
    const productName = page.locator('.product-details h2');
    await expect(productName).toBeVisible();
  });

  test("Should verify product review functionality", async ({ page }) => {
    await page.goto("/products");
    
    // Click on product
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.locator('a[href*="product_details"]').first().click();
    
    // Fill review form
    const reviewName = page.locator('input[name="reviewer_name"]');
    const reviewEmail = page.locator('input[name="reviewer_email"]');
    const reviewText = page.locator('textarea[name="review"]');
    
    if (await reviewName.isVisible()) {
      await reviewName.fill("Test User");
      await reviewEmail.fill("test@example.com");
      await reviewText.fill("Great product!");
      
      await page.locator('button#button-review').click();
      
      // Verify success message
      const successMsg = page.locator('text=Thank you for your review');
      await expect(successMsg).toBeVisible({ timeout: 5000 });
    }
  });
});
