import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      assignedDriver: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    return new NextResponse('Order not found', { status: 404 });
  }

  const subtotal = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const deliveryCharge = 5.00;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + deliveryCharge + tax;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ROYA Supermarket Invoice #${order.id.slice(-6).toUpperCase()}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; color: #0F172A; background: #fff; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #16a34a; letter-spacing: -0.5px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        .table th { background: #f0fdf4; color: #15803d; text-align: left; padding: 12px; font-size: 12px; }
        .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .totals { margin-top: 20px; text-align: right; }
        .btn-print { background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
        @media print { .btn-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="logo">👑 ROYA SUPERMARKET</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Freshness Delivered to Your Doorstep</div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin:0; color:#0A4D2E;">TAX INVOICE</h2>
            <div style="font-weight: bold; font-family: monospace;">#${order.id.slice(-6).toUpperCase()}</div>
            <div style="font-size: 12px; color: #64748b;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 24px; font-size: 14px;">
          <div>
            <strong style="color:#16a34a;">BILLED TO:</strong><br/>
            ${order.user?.name || 'Dave Customer'}<br/>
            ${order.user?.email || 'customer@supermarket.com'}<br/>
            ${order.deliveryAddress || 'King Fahd Road, Riyadh, KSA'}
          </div>
          <div style="text-align: right;">
            <strong style="color:#16a34a;">FULFILLMENT:</strong><br/>
            Status: ${order.status.replace(/_/g, ' ')}<br/>
            Payment Method: ${order.paymentStatus === 'PAID' ? 'Credit Card (Paid)' : 'Cash on Delivery'}<br/>
            ${order.assignedDriver ? `Driver: ${order.assignedDriver.name} (${order.assignedDriver.phone})` : ''}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>ITEM DESCRIPTION</th>
              <th>MEASUREMENT UNIT</th>
              <th>QTY</th>
              <th>UNIT PRICE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td><strong>${item.product.name}</strong> ${item.replacementNote ? `<br/><small style="color:#ea580c;">Note: ${item.replacementNote}</small>` : ''}</td>
                <td>${item.unit || item.product.unit || 'Piece'}</td>
                <td>${item.quantity}</td>
                <td>AED ${item.price.toFixed(2)}</td>
                <td>AED ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p style="margin: 4px 0;">Subtotal: <strong>AED ${subtotal.toFixed(2)}</strong></p>
          <p style="margin: 4px 0;">Delivery Charge: <strong>AED ${deliveryCharge.toFixed(2)}</strong></p>
          <p style="margin: 4px 0;">VAT Tax (5%): <strong>AED ${tax.toFixed(2)}</strong></p>
          <h3 style="color: #0A4D2E; margin: 12px 0 0;">GRAND TOTAL: AED ${grandTotal.toFixed(2)}</h3>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <button class="btn-print" onclick="window.print()">🖨️ PRINT / DOWNLOAD PDF INVOICE</button>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
