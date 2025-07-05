import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/AgreementForm.css";

export default function RentalAgreement() {
  const [form, setForm] = useState({
    ownerName: "",
    ownerAadhaar: "",
    tenantName: "",
    tenantAadhaar: "",
    propertyAddress: "",
    rent: "",
    maintenance: "",
    security: "",
    paymentMode: "",
    duration: "",
    startDate: "",
    endDate: "",
    notice: "",
    increment: "",
    purpose: "",
    witnesses: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateAndUploadPDF = () => {
    const doc = new jsPDF();
    
    // Get Today's Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Header
    doc.setFontSize(14);
    doc.text("RENTAL AGREEMENT", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Date: ${formattedDate}`, 15, 30);

    // Agreement Text with Proper Formatting
    const agreementText = `
This Rental Agreement is executed on this day between:

Landlord: ${form.ownerName} (Aadhaar No: ${form.ownerAadhaar})
AND
Tenant: ${form.tenantName} (Aadhaar No: ${form.tenantAadhaar})

Property Address:
${form.propertyAddress}

Terms & Conditions:

1. Monthly Rent: ₹${form.rent}, payable on or before the 5th of each month.
2. Maintenance Charges: ₹${form.maintenance} per month.
3. Security Deposit: ₹${form.security} (Paid via ${form.paymentMode}), refundable upon completion of agreement subject to deductions.
4. Agreement Duration: ${form.duration} months, effective from ${form.startDate} to ${form.endDate}.
5. Notice Period: ${form.notice} months, by either party to terminate this agreement.
6. Annual Rent Increment: ${form.increment}% after completion of tenure.
7. Purpose of Property: ${form.purpose} use only. Subletting or unauthorized activities strictly prohibited.

Tenant's Responsibilities:
- Maintain the premises in good condition.
- Avoid nuisance, damage, or illegal activity.
- Allow periodic inspections by the Owner with prior notice.

Owner's Responsibilities:
- Ensure peaceful possession during the tenure.
- Return the Security Deposit after deducting pending dues or damages.

Termination:
- Either party may terminate with written notice as per the Notice Period.
- Breach of terms permits immediate termination.

Witnesses to this Agreement:
${form.witnesses}

Both parties have read, understood, and agreed to the above terms.

Signed:
Owner: ${form.ownerName}               Tenant: ${form.tenantName}
`;

    // Insert Agreement Text
    doc.text(agreementText, 15, 40, { maxWidth: 180, lineHeightFactor: 1.4 });

    // Save Locally
    doc.save("RentalAgreement.pdf");

    // Upload to Backend
    const pdfBlob = doc.output("blob");
    const data = new FormData();
    data.append("pdf", pdfBlob, "rental-agreement.pdf");

    fetch("http://localhost:5000/api/agreements/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(() => alert("Agreement uploaded successfully!"))
      .catch((err) => console.error("Upload failed:", err));
  };

  return (
    <div className="rental-form">
      <h2>Create Rental Agreement</h2>

      <input
        name="ownerName"
        placeholder="Owner Full Name"
        value={form.ownerName}
        onChange={handleChange}
      />
      <input
        name="ownerAadhaar"
        placeholder="Owner Aadhaar Number"
        value={form.ownerAadhaar}
        onChange={handleChange}
      />
      <input
        name="tenantName"
        placeholder="Tenant Full Name"
        value={form.tenantName}
        onChange={handleChange}
      />
      <input
        name="tenantAadhaar"
        placeholder="Tenant Aadhaar Number"
        value={form.tenantAadhaar}
        onChange={handleChange}
      />
      <textarea
        name="propertyAddress"
        placeholder="Property Full Address"
        value={form.propertyAddress}
        onChange={handleChange}
      />
      <input
        name="rent"
        placeholder="Monthly Rent (₹)"
        value={form.rent}
        onChange={handleChange}
      />
      <input
        name="maintenance"
        placeholder="Maintenance Charges (₹)"
        value={form.maintenance}
        onChange={handleChange}
      />
      <input
        name="security"
        placeholder="Security Deposit (₹)"
        value={form.security}
        onChange={handleChange}
      />
      <select
        name="paymentMode"
        value={form.paymentMode}
        onChange={handleChange}
      >
        <option value="">Select Payment Mode</option>
        <option>Cash</option>
        <option>Bank Transfer</option>
        <option>UPI</option>
      </select>
      <input
        name="duration"
        placeholder="Agreement Duration (Months)"
        value={form.duration}
        onChange={handleChange}
      />
      <input
        name="startDate"
        type="date"
        value={form.startDate}
        onChange={handleChange}
      />
      <input
        name="endDate"
        type="date"
        value={form.endDate}
        onChange={handleChange}
      />
      <input
        name="notice"
        placeholder="Notice Period (Months)"
        value={form.notice}
        onChange={handleChange}
      />
      <input
        name="increment"
        placeholder="Rent Increment (%)"
        value={form.increment}
        onChange={handleChange}
      />
      <select name="purpose" value={form.purpose} onChange={handleChange}>
        <option value="">Purpose</option>
        <option>Residential</option>
        <option>Commercial</option>
      </select>
      <textarea
        name="witnesses"
        placeholder="Witness Names (comma-separated)"
        value={form.witnesses}
        onChange={handleChange}
      ></textarea>

      <button className="btn-primary" onClick={generateAndUploadPDF}>
        Generate & Upload Agreement
      </button>
    </div>
  );
}
