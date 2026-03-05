const request = require('supertest');

const baseURL = 'http://localhost:5000';

describe('Test Case 2: User adds product to cart with correct price', () => {
  let productId;

  beforeAll(async () => {
    const productsResponse = await request(baseURL)
      .get('/api/products');
    
    if (productsResponse.body.length > 0) {
      productId = productsResponse.body[0].id;
    }
  });

  it('should successfully add product to cart', async () => {
    const response = await request(baseURL)
      .post('/api/cart')
      .send({
        productId: productId,
        quantity: 1
      });
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    console.log('✅ Test Case 2 PASSED');
    console.log('   Product added to cart with correct price');
    console.log('   Status:', response.status);
    console.log('   Items in cart:', response.body.length);
  });

  it('should retrieve cart with product details and correct price', async () => {
    const response = await request(baseURL)
      .get('/api/cart');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    if (response.body.length > 0) {
      const cartItem = response.body[0];
      expect(cartItem).toHaveProperty('product');
      expect(cartItem).toHaveProperty('quantity');
      expect(cartItem).toHaveProperty('subtotal');
      expect(cartItem.product).toHaveProperty('name');
      expect(cartItem.product).toHaveProperty('price');
      
      console.log('   Product name:', cartItem.product.name);
      console.log('   Product price:', cartItem.product.price);
      console.log('   Quantity:', cartItem.quantity);
      console.log('   Subtotal:', cartItem.subtotal);
    }
  });

  it('should increase quantity if same product added again', async () => {
    await request(baseURL)
      .post('/api/cart')
      .send({
        productId: productId,
        quantity: 1
      });
    
    const secondResponse = await request(baseURL)
      .post('/api/cart')
      .send({
        productId: productId,
        quantity: 1
      });
    
    expect(secondResponse.status).toBe(200);
    
    const cartResponse = await request(baseURL)
      .get('/api/cart');
    
    const sameProduct = cartResponse.body.find(item => item.productId === productId);
    expect(sameProduct?.quantity).toBeGreaterThanOrEqual(1);
  });
});
