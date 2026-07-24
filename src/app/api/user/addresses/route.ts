import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Check if real user
    if (!session || session.userId === 'mock-super-admin-id') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await db.customerAddress.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error('Fetch addresses error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.userId === 'mock-super-admin-id') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Destructure expected fields
    const { 
      fullName, phone, whatsapp, houseNumber, buildingName, 
      street, area, city = 'Dubai', state = 'Dubai', isDefault = false 
    } = body;

    // Validate required fields
    if (!fullName || !phone || !houseNumber || !street || !area) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // Create the address
    const address = await db.customerAddress.create({
      data: {
        userId: session.userId,
        fullName,
        phone,
        whatsapp,
        houseNumber,
        buildingName,
        street,
        area,
        city,
        state,
        isDefault
      }
    });

    // If this is the user's first time giving a name (e.g. from OTP login), update their profile name
    if (session.name === 'New Customer' && fullName) {
      await db.user.update({
        where: { id: session.userId },
        data: { name: fullName }
      });
      // Note: We don't update the session cookie's name here for simplicity, 
      // but it will be updated on next login.
    }

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error('Create address error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
