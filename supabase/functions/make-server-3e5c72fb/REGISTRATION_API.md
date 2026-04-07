# Registration API Documentation

## Overview
Endpoints for registering new users (clients and salon owners) in the Katia platform.

## Endpoints

### 1. Register Client
**Endpoint:** `POST /make-server-3e5c72fb/register/client`

**Description:** Register a new client user. Creates both auth.users and customer.customers records with customer_type='Client'.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid-here",
    "email": "john@example.com",
    "full_name": "John Doe",
    "customer_type": "Client"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

### 2. Register Owner (Salon)
**Endpoint:** `POST /make-server-3e5c72fb/register/owner`

**Description:** Register a new salon owner. Creates both auth.users and customer.customers records with customer_type='Owner'.

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "email": "jane@salon.com",
  "phone": "+971509876543",
  "password": "securePassword123",
  "salon_name": "Bella Beauty Salon" // Optional
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid-here",
    "email": "jane@salon.com",
    "full_name": "Jane Smith",
    "customer_type": "Owner",
    "salon_name": "Bella Beauty Salon"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Frontend Integration Example

### Using fetch() in AuthPage.tsx:

```typescript
// For CLIENT registration
const registerClient = async (fullName: string, email: string, phone: string, password: string) => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/register/client`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          password: password,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log('✅ Client registered:', result.data);
      // Sign in the user
      // Navigate to dashboard
      return { success: true, data: result.data };
    } else {
      console.error('❌ Registration failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: 'Network error during registration' };
  }
};

// For OWNER registration
const registerOwner = async (fullName: string, email: string, phone: string, password: string, salonName?: string) => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/register/owner`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          password: password,
          salon_name: salonName,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log('✅ Owner registered:', result.data);
      return { success: true, data: result.data };
    } else {
      console.error('❌ Registration failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: 'Network error during registration' };
  }
};
```

### Using in BecomePartnerPage.tsx:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/register/owner`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          full_name: formData.salonName, // or actual owner name
          email: formData.email,
          phone: `${countryCodes.find(c => c.code === formData.countryCode)?.dialCode || ''}${formData.phone}`,
          password: 'temporary-password-123', // You'll need to add password field
          salon_name: formData.salonName,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log('✅ Owner registered:', result.data);
      toast.success('Welcome! Your account has been created!');
      navigate('/pricing');
    } else {
      setError(result.error);
      toast.error('Registration failed: ' + result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    setError('Failed to register. Please try again.');
    toast.error('Network error during registration');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Important Notes

1. **Password Requirements:** 
   - Password should be validated on frontend (min 8 characters recommended)
   - Backend uses Supabase Auth which has its own password policies

2. **Email Auto-Confirmation:** 
   - Users are auto-confirmed (`email_confirm: true`) since email server is not configured
   - In production, you should set up email verification

3. **Transaction Safety:** 
   - If customer record creation fails, the auth user is automatically deleted (rollback)
   - This prevents orphaned auth records

4. **Same ID Strategy:** 
   - The customer.customers.id uses the SAME UUID as auth.users.id
   - This makes joins and lookups easier

5. **Customer Types:**
   - Client: Regular customers booking services
   - Owner: Salon owners managing their business
   - Other types (Admin, Master) should be created through different flows

6. **Schema Configuration:**
   - Table is located in `customer` schema: `customer.customers`
   - Code uses `.schema('customer').from('customers')` for proper access
   - Make sure RLS policies are configured for the customer schema

---

## Testing

### Step 1: Test Database Connection First

Before testing registration, verify the database connection:

```bash
# Test if server can connect to customer.customers table
curl https://bbayqzqlqgqipohulcsd.supabase.co/functions/v1/make-server-3e5c72fb/test-db-connection
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Database connection successful!",
  "table": "customer.customers",
  "recordCount": 0
}
```

**If you get an error**, check:
1. Table exists in `customer` schema
2. RLS policies allow service_role to read
3. Edge Function is deployed

---

### Step 2: Test Registration Endpoints

Use cURL or Postman to test:

```bash
# Test Client Registration
curl -X POST https://bbayqzqlqgqipohulcsd.supabase.co/functions/v1/make-server-3e5c72fb/register/client \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYXlxenFscWdxaXBvaHVsY3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkxMjMsImV4cCI6MjA4MTkwNTEyM30.XNZhbdsEgVkFTVh1A6m7fpoVgePVT4ovMORxwKl3fGQ" \
  -d '{
    "full_name": "Test Client",
    "email": "testclient123@example.com",
    "phone": "+971501234567",
    "password": "TestPassword123"
  }'

# Test Owner Registration
curl -X POST https://bbayqzqlqgqipohulcsd.supabase.co/functions/v1/make-server-3e5c72fb/register/owner \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYXlxenFscWdxaXBvaHVsY3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkxMjMsImV4cCI6MjA4MTkwNTEyM30.XNZhbdsEgVkFTVh1A6m7fpoVgePVT4ovMORxwKl3fGQ" \
  -d '{
    "full_name": "Test Owner",
    "email": "testowner123@example.com",
    "phone": "+971509876543",
    "password": "TestPassword123",
    "salon_name": "Test Salon"
  }'
```

---

## Troubleshooting

### Issue: "relation customer.customers does not exist"
**Solution:** 
- Verify table exists: `SELECT * FROM customer.customers;` in SQL Editor
- Or create it if missing

### Issue: "permission denied for schema customer"
**Solution:**
```sql
GRANT USAGE ON SCHEMA customer TO service_role;
GRANT ALL ON customer.customers TO service_role;
```

### Issue: "new row violates row-level security policy"
**Solution:**
```sql
-- Create policy for service_role
CREATE POLICY "service_role_all_access"
ON customer.customers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

### Issue: No logs appearing in Edge Functions
**Solution:**
1. Go to Dashboard → Edge Functions → make-server-3e5c72fb
2. Click "Deploy" to redeploy the function
3. Check Build Logs for compilation errors