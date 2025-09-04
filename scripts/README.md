# Studio Vista - User Creation Scripts

## 🇭🇷 Created Users

The following users have been created for Studio Vista:

### Admin Users

- **Email:** `ante@studiovista.hr`  
  **Password:** `njonjotruba#`  
  **Role:** Admin

- **Email:** `boris@studiovista.hr`  
  **Password:** `njonjotruba#`  
  **Role:** Admin

## 📁 User Data Location

Users are stored in: `/data/users.json`

## 🔄 Re-running the Script

To recreate users or add new ones:

```bash
yarn create-users
```

## 🔐 Security Notes

- Passwords are hashed with bcrypt (12 salt rounds)
- Users have unique IDs generated for each run
- Admin role provides full system access

## 🔧 Modifying Users

To add or modify users, edit the `users` array in `scripts/create-users.js`:

```javascript
const users = [
  {
    email: 'new-user@studiovista.hr',
    password: 'your-password',
    name: 'User Name',
    role: 'admin', // or 'user'
  },
];
```

Then run `yarn create-users` to regenerate the user file.

## 🗄️ Database Integration

When ready to integrate with a real database (MongoDB, PostgreSQL, etc.), modify the script to:

1. Connect to your database
2. Insert users using your database client
3. Remove the JSON file writing logic

The password hashing and user structure will remain the same.
