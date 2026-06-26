import type { Order } from '../../../types';
import { CURRENCY } from '../../../constants';

export function generateReceiptHTML(order: Order): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E5E5E5; font-size: 13px; color: #111111;">
        <strong style="font-weight: 600;">${item.product.name}</strong><br/>
        <span style="font-size: 11px; color: #666666;">Size: ${item.selectedSize} | Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #E5E5E5; font-size: 13px; color: #111111;">
        ${CURRENCY}${(item.product.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const subtotal = order.totalAmount / 1.15;
  const vat = order.totalAmount - subtotal;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - DYLAN'S PALACE - #${order.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #111111;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #111111;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .brand {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: bold;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }
        .invoice-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #666666;
          text-align: right;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
          font-size: 12px;
          line-height: 1.6;
        }
        .meta-label {
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666666;
          margin-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          border-bottom: 2px solid #111111;
          padding-bottom: 8px;
          text-align: left;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666666;
        }
        .summary-box {
          margin-left: auto;
          width: 310px;
          font-size: 13px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #111111;
          border-bottom: 2px solid #111111;
          padding: 12px 0;
          margin-top: 10px;
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          margin-top: 80px;
          border-top: 1px solid #E5E5E5;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #8B8B8A;
          letter-spacing: 0.02em;
          line-height: 1.5;
        }
        .badge {
          display: inline-block;
          background: #4A5D23;
          color: white;
          font-size: 9px;
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: bold;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Dylan's Palace</div>
          <div style="font-size: 11px; color: #666666; margin-top: 4px;">Premium Bespoke Apparel & Footwear</div>
        </div>
        <div class="invoice-title">
          INVOICE / RECEIPT<br/>
          <span style="font-size: 18px; font-weight: bold; color: #111111; font-family: 'Inter';">#${order.id}</span>
        </div>
      </div>

      <div class="meta-grid">
        <div>
          <div class="meta-label">Billed To</div>
          <strong style="font-size:14px; color: #111111;">${order.details.fullName}</strong><br/>
          ${order.details.email}<br/>
          ${order.details.address}<br/>
          ${order.details.city}, Ghana
        </div>
        <div style="text-align: right;">
          <div class="meta-label">Details</div>
          <strong>Date:</strong> ${new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}<br/>
          <strong>Status:</strong> ${order.status}<br/>
          <span class="badge">SECURED &amp; VERIFIED</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item Particulars</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${CURRENCY}${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row" style="color: #666666;">
          <span>VAT (15%):</span>
          <span>${CURRENCY}${vat.toFixed(2)}</span>
        </div>
        <div class="summary-row" style="color: #666666;">
          <span>Standard Palace Delivery:</span>
          <span>FREE / INCLUDED</span>
        </div>
        <div class="total-row">
          <span>Amount Paid:</span>
          <span>${CURRENCY}${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <strong>Thank you for choosing Dylan's Palace.</strong><br/>
        Odorkor Palace St. Mall, Accra, Ghana | support@dylanspalace.com<br/>
        This document serves as an official electronic certificate of your transaction and digital purchase credentials.
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.parent.document.body.removeChild(window.frameElement);
          }, 500);
        }
      </script>
    </body>
    </html>
  `;
}

export function printReceipt(order: Order) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) return;

  doc.write(generateReceiptHTML(order));
  doc.close();
}
