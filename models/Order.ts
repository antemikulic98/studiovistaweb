import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  timestamp: Date;
  customerData: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: 'card' | 'paypal' | 'bank' | 'cash';
  };
  printData: {
    type: 'canvas' | 'framed' | 'sticker';
    size: string;
    frameColor?: 'black' | 'silver';
    price: number;
    imageUrl?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'shipped' | 'cancelled';
  trackingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerDataSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank', 'cash'],
    required: true,
  },
});

const PrintDataSchema = new Schema({
  type: {
    type: String,
    enum: ['canvas', 'framed', 'sticker'],
    required: true,
  },
  size: { type: String, required: true },
  frameColor: {
    type: String,
    enum: ['black', 'silver'],
    required: function (this: any) {
      return this.type === 'framed';
    },
  },
  price: { type: Number, required: true },
  imageUrl: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    timestamp: { type: Date, required: true },
    customerData: { type: CustomerDataSchema, required: true },
    printData: { type: PrintDataSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'shipped', 'cancelled'],
      default: 'pending',
    },
    trackingId: { type: String },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
OrderSchema.index({ 'customerData.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema);
