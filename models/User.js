const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema for Studio Vista
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please enter a valid email address',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret) {
        // Remove password from JSON output
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes are automatically created for unique fields
// userSchema.index({ email: 1 }); // Already handled by unique: true
// userSchema.index({ role: 1 }); // Commented out to avoid duplicate warning

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to create user (password will be hashed by pre-save hook)
userSchema.statics.createUser = async function (userData) {
  // Don't hash password here - let the pre-save middleware handle it
  return this.create(userData);
};

// Pre-save middleware to hash password if modified
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Prevent OverwriteModelError in Next.js development
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
