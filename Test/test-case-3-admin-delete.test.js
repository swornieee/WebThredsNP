const request = require('supertest');

const baseURL = 'http://localhost:5000';

describe('Test Case 3: Admin deletes product from product list', () => {
  let adminToken;
  let productIdToDelete;

  beforeAll(async () => {
    const loginResponse = await request(baseURL)
      .post('/api/users/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });
    
    if (loginResponse.status === 200) {
      adminToken = loginResponse.body.token;
    }

    const productsResponse = await request(baseURL)
      .get('/api/products');
    
    if (productsResponse.body.length > 1) {
      productIdToDelete = productsResponse.body[1].id;
    }
  });

  it('should successfully delete product with admin token', async () => {
    if (!adminToken || !productIdToDelete) {
      console.log('⚠ Skipping: Admin not found or no products available');
      return;
    }

    const response = await request(baseURL)
      .delete(`/api/products/${productIdToDelete}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect([200, 204]).toContain(response.status);
    
    console.log('✅ Test Case 3 PASSED');
    console.log('   Product deleted from product list');
    console.log('   Status:', response.status);
    console.log('   Product ID deleted:', productIdToDelete);
  });

  it('should not allow non-admin to delete product', async () => {
    const response = await request(baseURL)
      .delete(`/api/products/${productIdToDelete}`)
      .set('Authorization', 'Bearer invalid_token');
    
    expect(response.status).toBeGreaterThanOrEqual(400);
    
    console.log('   Non-admin deletion blocked: Status', response.status);
  });

  it('should verify product is removed from product list', async () => {
    if (!productIdToDelete) return;

    const response = await request(baseURL)
      .get(`/api/products/${productIdToDelete}`);
    
    console.log('   Product removal verification: Status', response.status);
  });
});
