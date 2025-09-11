export function generateInvoiceHtml(
  invoiceNumber: string,
  purchaseDate: Date,
  assetTitle: string,
  price: number
): string {
  const formattedDate = purchaseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedPrice = (price / 100).toFixed(2);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
      background: #f9f9f9;
    }
    .invoice-container {
      max-width: 700px;
      margin: auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #eee;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .company-info {
      font-size: 14px;
      line-height: 1.6;
      color: #555;
    }
    .invoice-title {
      font-size: 26px;
      font-weight: bold;
      color: #2c3e50;
      text-align: right;
    }
    .invoice-details {
      margin-bottom: 20px;
    }
    .invoice-details div {
      margin: 5px 0;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .invoice-table th,
    .invoice-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    .invoice-table th {
      background: #f4f6f8;
    }
    .invoice-total {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      margin-top: 30px;
    }
    .print-btn {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      background: #2c3e50;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .print-btn:hover {
      background: #1a242f;
    }
    @media print {
      .print-btn {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <strong>Asset Manager Inc.</strong><br/>
        1234 Elm Street, Suite 500<br/>
        New York, NY 10001<br/>
        Email: support@assetmanager.com<br/>
        Phone: (123) 456-7890
      </div>
      <div class="invoice-title">
        Invoice<br/>
        <span style="font-size:16px;">#${invoiceNumber}</span>
      </div>
    </div>

    <div class="invoice-details">
      <div><strong>Date:</strong> ${formattedDate}</div>
      <div><strong>Billed To:</strong> John Doe<br/>123 Main Street<br/>Springfield, USA</div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Asset</th>
          <th>Price (USD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${assetTitle}</td>
          <td>$${formattedPrice}</td>
        </tr>
      </tbody>
    </table>

    <div class="invoice-total">Total: $${formattedPrice}</div>

    <button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>

    <div class="footer">
      Thank you for your purchase.<br/>
      Asset Manager Platform
    </div>
  </div>
</body>
</html>
`;
}

