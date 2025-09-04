import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// GET all orders
export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Return plain JavaScript objects

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

// POST new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const order = new Order({
      timestamp: new Date(),
      customerData: body.customerData,
      printData: body.printData,
      status: 'pending',
    });

    const savedOrder = await order.save();

    return NextResponse.json(
      {
        success: true,
        data: savedOrder,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
