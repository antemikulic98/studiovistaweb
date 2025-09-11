import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// GET all orders or specific order by ID
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      // Fetch specific order by ID
      let order;

      // Try to find by MongoDB _id first
      try {
        order = await Order.findById(orderId).lean();
      } catch {
        // If not valid ObjectId, search by last 8 chars of _id (case insensitive)
        const upperOrderId = orderId.toUpperCase();
        const orders = await Order.find({}).lean();
        order = orders.find((o) => {
          const idString = (o._id as { toString: () => string }).toString();
          return (
            idString.slice(-8).toUpperCase() === upperOrderId ||
            idString.toUpperCase().includes(upperOrderId)
          );
        });
      }

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: 'Order not found',
          },
          { status: 404 }
        );
      }

      // Transform data for tracking modal
      const orderDoc = order as {
        _id: { toString: () => string };
        status?: string;
        timestamp?: Date;
        createdAt?: Date;
        printData?: {
          type?: string;
          size?: string;
          price?: number;
          imageUrl?: string;
        };
      };

      console.log(
        '🔍 Raw order from database:',
        JSON.stringify(order, null, 2)
      );
      console.log('🖼️ Image URL in DB:', orderDoc.printData?.imageUrl);
      console.log('🖼️ Image URL type:', typeof orderDoc.printData?.imageUrl);
      console.log('📊 Order status from DB:', orderDoc.status);
      console.log('📊 Order timestamp from DB:', orderDoc.timestamp);
      console.log('📊 Order createdAt from DB:', orderDoc.createdAt);

      const orderIdString = orderDoc._id.toString();

      // Map "paid" to "processing" for better user experience
      let displayStatus = orderDoc.status || 'pending';
      if (displayStatus === 'paid') {
        displayStatus = 'processing';
        console.log('🔄 Mapped status: paid → processing');
      }

      const trackingData = {
        _id: orderIdString,
        orderNumber: orderIdString.slice(-8).toUpperCase(),
        status: displayStatus,
        createdAt: orderDoc.timestamp || orderDoc.createdAt,
        printData: {
          totalPrice: orderDoc.printData?.price || 0,
          items: orderDoc.printData
            ? [
                {
                  printType: orderDoc.printData.type || 'canvas',
                  size: orderDoc.printData.size || '',
                  quantity: 1,
                },
              ]
            : [],
        },
      };

      console.log(
        '✅ Sending tracking data:',
        JSON.stringify(trackingData, null, 2)
      );

      return NextResponse.json({
        success: true,
        data: trackingData,
      });
    }

    // Return all orders if no ID specified
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
    console.log('📦 Received raw body:', JSON.stringify(body, null, 2));
    console.log('📦 Body has orders array?', !!body.orders);
    console.log('📦 Body status:', body.status);
    console.log('📦 Direct body as order?', !!body.customerData);

    // Convert new format to legacy format for database compatibility
    let printData = body.printData;
    if (body.printData.items && body.printData.items.length > 0) {
      // New format with items array - convert to legacy format using first item
      const firstItem = body.printData.items[0];
      printData = {
        type: firstItem.type,
        size: firstItem.size,
        frameColor: firstItem.frameColor,
        price: body.printData.totalPrice || firstItem.price,
        imageUrl: body.printData.imageUrls ? body.printData.imageUrls[0] : '',
      };
    }

    console.log('💾 Creating order with status:', body.status || 'pending');
    console.log('💾 Full order data being saved:', {
      timestamp: body.timestamp || new Date(),
      customerData: body.customerData,
      printData: printData,
      status: body.status || 'pending',
      stripeSessionId: body.stripeSessionId,
    });

    const order = new Order({
      timestamp: body.timestamp || new Date(),
      customerData: body.customerData,
      printData: printData,
      status: body.status || 'pending',
      stripeSessionId: body.stripeSessionId,
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
