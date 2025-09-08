# 🔧 Stripe Payment Setup Instructions

## 1. Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete your account verification
3. Navigate to the Stripe Dashboard

## 2. Get API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

## 3. Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here

# MongoDB (keep your existing configuration)
MONGODB_URI=mongodb://127.0.0.1:27017/studiovista

# DigitalOcean Spaces (keep your existing configuration if any)
DIGITALOCEAN_SPACES_ENDPOINT=your_endpoint_here
DIGITALOCEAN_SPACES_KEY=your_key_here
DIGITALOCEAN_SPACES_SECRET=your_secret_here
DIGITALOCEAN_SPACES_BUCKET=your_bucket_here
```

## 4. Test the Integration

1. Restart your development server: `yarn dev`
2. Open your application and try to place an order
3. Select "Kreditna/debitna kartica (Stripe)" as payment method
4. Use Stripe's test card numbers:
   - **Successful payment**: `4242 4242 4242 4242`
   - **Expired card**: `4000 0000 0000 0069`
   - **Declined card**: `4000 0000 0000 0002`
   - Any future expiry date (e.g., `12/28`)
   - Any 3-digit CVC (e.g., `123`)

## 5. Payment Features Implemented

### ✅ **Stripe Credit Card Payments**

- Secure card processing via Stripe Elements
- Real-time validation and error handling
- Professional payment form with SSL indicators
- Support for all major card types (Visa, MasterCard, Amex)

### ✅ **Cash on Delivery (Pouzeće)**

- Traditional Croatian payment method
- €2.50 handling fee automatically added
- Order processed immediately, payment on delivery

### ✅ **Bank Transfer**

- Direct bank account details provided
- Order marked as "pending" until payment confirmation
- Manual processing workflow

## 6. Order Status Flow

| Payment Method | Initial Status | After Payment      | Processing     |
| -------------- | -------------- | ------------------ | -------------- |
| Stripe         | `paid`         | Immediate          | Auto-process   |
| COD            | `pending`      | On delivery        | Manual confirm |
| Bank Transfer  | `pending`      | After confirmation | Manual confirm |

## 7. Production Setup

When ready for production:

1. Enable live mode in Stripe Dashboard
2. Replace test keys with live keys (`pk_live_` and `sk_live_`)
3. Update webhook endpoints if needed
4. Test thoroughly with real card information

## 8. Troubleshooting

**Payment form not loading?**

- Check console for errors
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Ensure the key starts with `pk_test_` or `pk_live_`

**"Invalid API key" error?**

- Verify `STRIPE_SECRET_KEY` is set correctly in `.env.local`
- Ensure the key starts with `sk_test_` or `sk_live_`
- Restart your development server after changing environment variables

**Payment intent creation fails?**

- Check `/api/create-payment-intent` endpoint logs
- Verify Stripe secret key has proper permissions
- Ensure amount is being passed correctly (in cents for EUR)

## 9. Next Steps

- Set up webhooks for production reliability
- Add customer email receipts
- Implement order status updates
- Add refund functionality if needed

---

🎉 **Your Stripe integration is now complete and ready for testing!**
