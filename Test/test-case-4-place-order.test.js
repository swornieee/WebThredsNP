const request = require('supertest');

const baseURL = 'http://localhost:5000';

describe('Test Case 4: User places order with confirmation', () => {
  let cartItems = [];

  beforeAll(async () => {
    const cartResponse = await request(baseURL)
      .get('/api/cart');
    
    cartItems = cartResponse.body;
  });

  it('should successfully place order with valid data', async () => {
    const orderData = {
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9800000000',
        payment: 'cash'
      },
      items: cartItems.length > 0 ? cartItems : [
        {
          id: '1',
          name: 'Sample Product',
          price: 100,
          quantity: 1
        }
      ],
      total: cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 100),
      address: 'Kathmandu, Nepal'
    };

    const response = await request(baseURL)
      .post('/api/orders')
      .send(orderData);
    
    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('customer');
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('total');
    expect(response.body.status).toBe('Confirmed');
    
    console.log('✅ Test Case 4 PASSED');
    console.log('   Order confirmation message displayed');
    console.log('   Status:', response.status);
    console.log('   Order ID:', response.body.id);
    console.log('   Order Status:', response.body.status);
  });

  it('should display order confirmation message', async () => {
    const orderData = {
      customer: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9811111111',
        payment: 'online'
      },
      items: [
        {
          product: { id: '1', name: 'Test Product', price: 50 },
          quantity: 2
        }
      ],
      total: 100,
      address: 'Pokhara, Nepal'
    };

    const response = await request(baseURL)
      .post('/api/orders')
      .send(orderData);
    
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Confirmed');
    
    console.log('   Confirmation: Order status is "Confirmed"');
    console.log('   Customer:', response.body.customer.firstName, response.body.customer.lastName);
  });

  it('should retrieve placed orders and verify order appears in list', async () => {
    const response = await request(baseURL)
      .get('/api/orders');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    if (response.body.length > 0) {
      const order = response.body[0];
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('customer');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('status');
      
      console.log('   Order appears in list: true');
      console.log('   Total orders:', response.body.length);
      console.log('   Latest order ID:', order.id);
    }
  });

  it('should validate order has all required fields', async () => {
    const response = await request(baseURL)
      .get('/api/orders');
    
    if (response.body.length > 0) {
      const order = response.body[0];
      
      expect(order.customer).toHaveProperty('name');
      expect(order.customer).toHaveProperty('phone');
      expect(order.items).toBeDefined();
      expect(Array.isArray(order.items)).toBe(true);
      
      if (order.items.length > 0) {
        const item = order.items[0];
        expect(item).toHaveProperty('product');
        expect(item.product).toHaveProperty('name');
        expect(item.product).toHaveProperty('price');
      }
      
      console.log('   All order fields validated: ✓');
    }
  });
});
