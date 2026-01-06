/**
 * Test Script for Authentication Token Flow
 * 
 * This script can be run in browser console to test authentication
 * and token handling manually.
 */

// Test authentication token flow
window.testAuth = {
  
  // 1. Test token storage and retrieval
  testTokenStorage: () => {
    console.log('=== TESTING TOKEN STORAGE ===');
    
    // Test set tokens
    const testToken = 'test_token_' + Date.now();
    sessionStorage.setItem('authToken', testToken);
    localStorage.setItem('authToken', testToken + '_local');
    
    // Test retrieval (same logic as interceptor)
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    
    console.log('Session Token:', sessionStorage.getItem('authToken'));
    console.log('Local Token:', localStorage.getItem('authToken'));
    console.log('Retrieved Token:', token);
    console.log('✅ Token storage test completed');
    
    // Clean up
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
  },

  // 2. Test API interceptor behavior
  testAPIInterceptor: async () => {
    console.log('=== TESTING API INTERCEPTOR ===');
    
    // Set a test token
    const testToken = 'Bearer_test_token_12345';
    sessionStorage.setItem('authToken', testToken);
    
    try {
      // Make a test API call to see interceptor behavior
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await fetch('/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Test API call made - check Network tab for Authorization header');
      
    } catch (error) {
      console.log('Test API call failed (expected) - check Network tab for headers');
    }
    
    // Clean up
    sessionStorage.removeItem('authToken');
  },

  // 3. Test login flow simulation
  simulateLoginFlow: () => {
    console.log('=== SIMULATING LOGIN FLOW ===');
    
    // Mock successful login response
    const mockLoginResult = {
      success: true,
      token: {
        token: 'mock_jwt_token_' + Date.now(),
        authenticated: true
      },
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
      }
    };
    
    console.log('Mock login result:', mockLoginResult);
    
    // Simulate token storage (like useLogin hook does)
    if (mockLoginResult.success && mockLoginResult.token.authenticated) {
      if (mockLoginResult.token.token) {
        sessionStorage.setItem('authToken', mockLoginResult.token.token);
        console.log('✅ Token stored in sessionStorage');
        
        // Simulate API call after login
        const storedToken = sessionStorage.getItem('authToken');
        console.log('✅ Token retrieved for API call:', storedToken ? '***' : 'NOT FOUND');
      }
    }
    
    console.log('✅ Login flow simulation completed');
  },

  // 4. Test full auth cycle
  testFullAuthCycle: async () => {
    console.log('=== FULL AUTH CYCLE TEST ===');
    
    // Step 1: Clear all tokens
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    console.log('1️⃣ Cleared all tokens');
    
    // Step 2: Simulate login
    const token = 'test_full_cycle_' + Date.now();
    sessionStorage.setItem('authToken', token);
    console.log('2️⃣ Simulated login - token stored');
    
    // Step 3: Test token retrieval (interceptor logic)
    const retrievedToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    console.log('3️⃣ Token retrieved:', retrievedToken ? 'SUCCESS' : 'FAILED');
    
    // Step 4: Simulate logout
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    console.log('4️⃣ Simulated logout - tokens cleared');
    
    // Step 5: Verify cleanup
    const finalToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    console.log('5️⃣ Cleanup verified:', finalToken ? 'FAILED' : 'SUCCESS');
    
    console.log('✅ Full auth cycle test completed');
  },

  // 5. Debug current auth state
  debugCurrentState: () => {
    console.log('=== CURRENT AUTH STATE ===');
    console.log('Session Token:', sessionStorage.getItem('authToken') || 'NOT_SET');
    console.log('Local Token:', localStorage.getItem('authToken') || 'NOT_SET');
    console.log('Cookies:', document.cookie || 'NONE');
    
    // Check if any auth-related elements exist
    const authDebugComponent = document.querySelector('[data-testid="auth-debug"]');
    console.log('Auth Debug Component:', authDebugComponent ? 'PRESENT' : 'NOT_FOUND');
    
    console.log('✅ Current state debug completed');
  },

  // Run all tests
  runAllTests: async () => {
    console.log('🚀 STARTING ALL AUTH TESTS');
    console.log('=====================================');
    
    window.testAuth.testTokenStorage();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    window.testAuth.simulateLoginFlow();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await window.testAuth.testFullAuthCycle();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    window.testAuth.debugCurrentState();
    
    console.log('=====================================');
    console.log('✅ ALL AUTH TESTS COMPLETED');
  }
};

console.log('🔧 Auth Test Utils Loaded!');
console.log('Available commands:');
console.log('- testAuth.runAllTests() - Run all tests');
console.log('- testAuth.testTokenStorage() - Test token storage');
console.log('- testAuth.simulateLoginFlow() - Test login simulation');
console.log('- testAuth.testFullAuthCycle() - Test complete flow');
console.log('- testAuth.debugCurrentState() - Debug current state');
