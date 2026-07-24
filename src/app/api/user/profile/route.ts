import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // 1. Create the CustomerProfile
    const profile = await (db as any).customerProfile.upsert({
      where: { userId: session.userId },
      update: {
        fullName: data.fullName,
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        whatsappNumber: data.whatsappNumber,
        dateOfBirth: data.dateOfBirth,
      },
      create: {
        userId: session.userId,
        fullName: data.fullName,
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        whatsappNumber: data.whatsappNumber,
        dateOfBirth: data.dateOfBirth,
      }
    });

    // 2. Create the default Address
    await (db as any).customerAddress.create({
      data: {
        userId: session.userId,
        fullName: data.fullName,
        phone: data.phone,
        whatsapp: data.whatsappNumber,
        houseNumber: data.houseNumber,
        buildingName: data.buildingName,
        street: data.street,
        area: data.area,
        city: data.city,
        district: data.district,
        state: data.state,
        postalCode: data.postalCode,
        landmark: data.landmark,
        latitude: data.latitude,
        longitude: data.longitude,
        placeId: data.googlePlaceId,
        deliveryInstructions: data.deliveryInstructions,
        preferredDeliveryTime: data.preferredDeliveryTime,
        addressLabel: data.addressLabel,
        isDefault: true // First address is always default
      }
    });

    // 3. Update the Session token so middleware stops redirecting
    await createSession({
      userId: session.userId,
      role: session.role,
      branchId: session.branchId,
      name: data.fullName || session.name
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save profile error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
