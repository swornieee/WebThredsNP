const request = require('supertest');

const baseURL = 'http://localhost:5000';

describe('Test Case 1: User enters correct login details', () => {
  
  it('should successfully login with correct email and password', async () => {
    const response = await request(baseURL)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('test@example.com');
    
    console.log('✅ Test Case 1 PASSED');
    console.log('   User logs in successfully');
    console.log('   Status:', response.status);
    console.log('   Token received:', !!response.body.token);
  });

  it('should reject login with incorrect password', async () => {
    const response = await request(baseURL)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
  });

  it('should reject login with non-existent email', async () => {
    const response = await request(baseURL)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(401);
  });
});
