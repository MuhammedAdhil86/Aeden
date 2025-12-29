import html2pdf from "html2pdf.js";

// Helper function to format numbers with thousand separators
function formatNumber(number, currencyCode = "INR") {
  if (isNaN(number) || number === null || number === undefined) return "N/A";
  const fixedNumber = Number(number).toFixed(2);
  const [integer, decimal] = fixedNumber.split(".");
  if (currencyCode === "₹") {
    // Indian format: 1,00,000.00
    let lastThree = integer.slice(-3);
    let otherDigits = integer.slice(0, -3);
    if (otherDigits) {
      lastThree = "," + lastThree;
      otherDigits = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    }
    return otherDigits + lastThree + "." + decimal;
  }
  // Western format: 1,000.00
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimal;
}

function generatePONumber(createdAt, serialNumber) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const serial = String(serialNumber).padStart(3, '0'); // 3-digit serial with leading zeros
  
  return `${year}${month}${serial}`;
}

export function generatePurchaseOrderPDF(data) {
  if (!html2pdf) {
    console.error(
      "html2pdf is not available. Ensure the html2pdf.js library is properly installed and imported."
    );
    throw new Error("html2pdf is not available");
  }

  // Validate data
  if (!data || !data.uin) {
    console.error("Invalid data provided for PDF generation:", data);
    throw new Error("Invalid data provided for PDF generation");
  }
  console.log("Generating PDF with data:", data);

  const poNumber = generatePONumber(data.created_at, data.id);


  // Create PDF wrapper
  const pdfWrapper = document.createElement("div");
  //pdfWrapper.style.padding = "52px 44px";
  pdfWrapper.style.backgroundColor = "white";
  pdfWrapper.style.fontFamily = "'Inter', sans-serif";
  //pdfWrapper.style.maxWidth = "595px";
  pdfWrapper.style.boxSizing = "border-box";
  pdfWrapper.style.display = "flex";
  pdfWrapper.style.flexDirection = "column";
  pdfWrapper.style.alignItems = "flex-center";
  pdfWrapper.style.textTransform = "uppercase";

  // Header with logo and title
  const header = document.createElement("div");
  header.style.width = "100%";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginTop = "20px"
  header.innerHTML = `
    <img src="/logo.svg" alt="Company Logo" style="width: 92px; height: 28px;" />
    <p style="color: #1d2b52; font-size: 24px; font-weight: 600; text-align: center;">PURCHASE ORDER</p>
  `;
  pdfWrapper.appendChild(header);

  // Supplier and Buyer Details
  const detailsSection = document.createElement("div");
  detailsSection.style.width = "100%";
  //   detailsSection.style.display = "flex";
  // pdfWrapper.style.flexDirection = "column";

  //   detailsSection.style.justifyContent = "space-between";
  detailsSection.style.marginBottom = "20px";
  detailsSection.innerHTML = `
    <div class="uppercase" style=" border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
      <p style="color: #000000; font-size: 15px; font-weight: 600; margin: 0 0 5px 0;">Aeden Fruits International Private Limited</p>
      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">Bldg No. 503/A ,Service Rd , Madavana</p>
        <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">Panangad, Ernakulam, Kochi</p>
      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">Kerala 682506</p>

      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 5px 0 0 0;">Mobile: +91 9207879993</p>
      <p class="pb-2" style="color: #000000; font-size: 12px; font-weight: 400; margin: 5px 0 0 0;">Email: neethu.x@aedenfruits.com</p>
    </div>
    <div class="flex justify-between"">
    <div style=" text-align: left; padding-top: 5px;">
      <p style="color: #000; font-size: 14px; font-weight: 600;">Supplier </p>
      <p style="color: #000000; font-size: 13px; font-weight: 400; margin: 0 0 5px 0;">${
        data.party_name || "N/A"
      }</p>
      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">${
        data.address || "N/A"
      }</p>
      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">${
        data.zipcode || "N/A"
      }</p><p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">${
        data.country || "N/A"
      }</p>
    </div>
    <div>
    <p class="text-black text-sm font-semibold">PO NO: # ${poNumber || "N/A"}</p>
    <p class="pt-1" style="color: #000000; font-size: 12px; font-weight: 400; margin: 5px 0 0 0;">Date: ${
      data.date ? new Date(data.date).toLocaleDateString("en-GB") : "N/A"
    }</p>
      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 5px 0 0 0;">UIN: ${
        data.uin
      }</p>
      <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 5px 0 0 0;">POL: ${
        data.port_of_loading_id.port_name}, ${data.port_of_loading_id.country_name
      }</p><p style="color: #000000; font-size: 12px; font-weight: 400; margin: 5px 0 0 0;">POD: ${
        data.port_of_discharge_id.port_name}, ${data.port_of_discharge_id.country_name
      }</p>
    </div>
    </div>
  `;
  pdfWrapper.appendChild(detailsSection);

  // Items Table
  const itemsSection = document.createElement("div");
  itemsSection.style.width = "100%";
  itemsSection.style.marginBottom = "20px";
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  //table.style.border = "1px solid #e5e7eb";

  // Table header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr style="background-color: #1d2b52; color: #ffffff;">
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Sl.</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Description</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">COunt / size</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">packaging</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Unit</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Net weight</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Qty</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Unit Price</th>
      <th style="padding: 8px; font-size: 12px; font-weight: 400; color: #FFFFFF; text-align: left; ">Amount</th>
    </tr>
  `;
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");
  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      const row = document.createElement("tr");
      row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f5f5f5";
      row.innerHTML = `
        <td style="padding: 8px; font-size: 12px; color: #000000;">${index + 1}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${item.product_name}${item.variety_name ? " - " + item.variety_name : ""}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${item.count_or_size || "N/A"}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${item.weight_unit || "N/A"}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${item.unit || "N/A"}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${item.net_weight || "N/A"}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${item.qty || "N/A"}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${data.currency_code || "₹"} ${item.unit_cost ? formatNumber(item.unit_cost, data.currency_code) : "N/A"}</td>
        <td style="padding: 8px; font-size: 12px; color: #000000;">${data.currency_code || "₹"} ${item.qty && item.unit_cost ? formatNumber(item.qty * item.unit_cost, data.currency_code) : "N/A"}</td>
      `;
        // <td style="padding: 8px; font-size: 12px; color: #000000;">${data.currency_code || "₹"} ${item.qty && item.unit_cost ? (item.qty * item.unit_cost).toFixed(2) : "N/A"}</td>
      tbody.appendChild(row);
    });
  }else {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="6" style="padding: 8px; font-size: 12px; color: #000000; text-align: center;">No items found</td>
    `;
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  itemsSection.appendChild(table);
  pdfWrapper.appendChild(itemsSection);

   // Combined Financial and Payment Section
  const financialAndPaymentSection = document.createElement("div");
  financialAndPaymentSection.style.width = "100%";
  financialAndPaymentSection.style.display = "flex";
  //financialAndPaymentSection.style.backgroundColor = "red";
  financialAndPaymentSection.style.justifyContent = "space-between";
  financialAndPaymentSection.style.marginBottom = "20px";
  financialAndPaymentSection.style.borderTop = "1px solid #e5e7eb";
  financialAndPaymentSection.style.paddingTop = "5px";

  // Financial Details
  const financialSection = document.createElement("div");
  financialSection.style.textAlign = "right";
  const subtotal = data.items
    ? data.items
        .reduce(
          (sum, item) =>
            sum +
            (item.qty && item.unit_cost ? item.qty * item.unit_cost : 0),
          0
        )
        .toFixed(2)
    : "0.00";
  const total = subtotal; // Adjust if additional fees/taxes apply
  financialSection.innerHTML = 
    // <p style="color: #000000; font-size: 13px; font-weight: 600; margin: 0 0 5px 0;">Subtotal: ${
    //   data.currency_code || "₹"
    // } ${subtotal}
    // </p>
   ` <p style="color: #000000; font-size: 14px; font-weight: 800; margin: 0 0 5px 0;">Total: ${data.currency_code || "₹"} ${formatNumber(total, data.currency_code)}</p>
  `;
//     <p style="color: #000000; font-size: 13px; font-weight: 800; margin: 0 0 5px 0;">Balance Due: ${
//       data.currency_code || "₹"
//     } ${total}</p>
//   `;

  // Payment Instructions
  const paymentInstructions = document.createElement("div");
  //paymentInstructions.style.backgroundColor = "green";
  paymentInstructions.style.width = "70%";
  paymentInstructions.innerHTML = `
    <p style="color: #000000; font-size: 13px; font-weight: 600; margin: 0 0 5px 0;">Payment Terms</p>
    <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">Freight: ${
      data.incoterm_id?.terms || "N/A"
    }</p>
    <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">shipment term: ${
     data.mode_id?.mode || "N/A"} - ${data.mode_id?.description || "N/A"
    }</p>
    <p style="color: #000000; font-size: 12px; font-weight: 400; margin: 0;">Remarks: ${
     data.remarks || ""
    }</p>
  `;

  financialAndPaymentSection.appendChild(paymentInstructions);
  financialAndPaymentSection.appendChild(financialSection);
  pdfWrapper.appendChild(financialAndPaymentSection);

  // Terms and Conditions
  const termsSection = document.createElement("div");
  termsSection.style.width = "100%";
  termsSection.style.marginBottom = "20px";
  termsSection.style.marginTop="30px";
  termsSection.innerHTML = `
    <p style="color: #000000; font-size: 13px; font-weight: 600; margin: 0 0 5px 0;">Terms & Conditions</p>
    <div style="width: 500px;">
    <p class='pt-1' style="color: #000000; font-size: 10px; font-weight: 400; margin: 0;">1. Shipping Terms: CIF / CFR as agreed between buyer and the seller.</p>
      <p class='py-1' style="color: #000000; font-size: 10px; font-weight: 400; margin: 0 0 5px 0;">2. Packaging & Labelling: Packaging and labelling shall be done as per FSSAI standards and buyer-specific requirements if any.</p>
      <p style="color: #000000; font-size: 10px; font-weight: 400; margin: 0 0 5px 0;">3. Documents: The seller must provide an invoice, packing list, Bill of lading, Phytosanitary certificate, COO, and NON-GMO certificate (if applicable).</p>
      <p class='py-1' style="color: #000000; font-size: 10px; font-weight: 400; margin: 0 0 5px 0;">4. Detention Free-time: A minimum of 14 days detention free-time should be allowed for the shipment after arriving at destination.</p>
    </div>
  `;
  pdfWrapper.appendChild(termsSection);

  // Authorized Signatory
  const signatorySection = document.createElement("div");
  signatorySection.style.width = "100%";
  signatorySection.style.textAlign = "right";
  signatorySection.style.display = "flex";
    signatorySection.style.flexDirection = "column";

  signatorySection.style.justifyContent = "flex-end";
  signatorySection.innerHTML = `
    <p class='pb-5' style="color: #000000; font-size: 11px; font-weight: 600; margin: 0;">Authorized Signatory</p>
  `;
  // <div class="flex justify-end">
  //   <img src="/Signature.svg" alt="Signature" style="width: 140px; height: 93px; margin-top: 0px;" />
  // </div>
  pdfWrapper.appendChild(signatorySection);

  // Append to DOM temporarily
  document.body.appendChild(pdfWrapper);

  // Wait for images to load
  const images = pdfWrapper.getElementsByTagName("img");
  const loadPromises = Array.from(images).map(
    (img) =>
      new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Resolve even if image fails to load
      })
  );

  return Promise.all(loadPromises)
    .then(() => {
      const options = {
        margin: [10, 10, 10, 10],
        filename: `Purchase_Order_${data.uin}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      return html2pdf()
        .set(options)
        .from(pdfWrapper)
        .save()
        .then(() => {
          document.body.removeChild(pdfWrapper);
        });
    })
    .catch((err) => {
      console.error("Error generating PDF:", err);
      document.body.removeChild(pdfWrapper);
      throw err;
    });
}
