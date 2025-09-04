# 🍃 MongoDB Setup for Studio Vista

## Quick Setup Guide

### 1. Create `.env.local` file in your project root:

```bash
# Copy and paste this into your .env.local file
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/studiovista?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-here
NODE_ENV=development
```

### 2. Replace the MongoDB connection string:

**For MongoDB Atlas (Cloud):**

- Go to your MongoDB Atlas dashboard
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` in the string above

**Example:**

```
MONGODB_URI=mongodb+srv://ante:mypassword@cluster0.abc123.mongodb.net/studiovista?retryWrites=true&w=majority
```

**For Local MongoDB:**

```
MONGODB_URI=mongodb://localhost:27017/studiovista
```

### 3. Generate a JWT Secret:

Run this in your terminal to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run the user creation script:

```bash
yarn create-users
```

## ✅ What the Script Does:

- ✅ Connects to your MongoDB cluster
- ✅ Creates a `users` collection
- ✅ Adds two admin users:
  - `ante@studiovista.hr`
  - `boris@studiovista.hr`
- ✅ Hashes passwords securely with bcrypt
- ✅ Prevents duplicate users
- ✅ Adds proper timestamps and validation

## 🔍 Verify Users Were Created:

You can check your MongoDB Atlas dashboard to see the new users in your `studiovista` database under the `users` collection.

## 🐛 Troubleshooting:

**"Failed to connect to MongoDB"**

- Check your connection string is correct
- Verify username/password
- Ensure your IP is whitelisted in Atlas
- Make sure your cluster is running

**"User already exists"**

- This is normal - script won't create duplicates
- Delete users from MongoDB if you want to recreate them

**"Cannot find module"**

- Run `yarn install` to install dependencies
- Make sure you're in the project directory

## 🔐 Security Notes:

- Never commit `.env.local` to git
- Use strong passwords for production
- Rotate JWT secrets regularly
- Enable MongoDB Atlas IP whitelisting
