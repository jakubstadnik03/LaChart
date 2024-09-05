import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";

const GeneratePDF = ({ testings, athletes }) => {
  const generatePdf = async () => {
    const doc = new jsPDF();

    // 1. PDF Header Section - Styled like Tailwind CSS header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(21, 101, 192); // Tailwind's blue-600
    doc.text("Lactate Test Report", 105, 20, null, null, "center");

    // 2. Athlete Information Section Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black color for headers
    doc.text("Athlete Information", 10, 35);

    // 3. Athlete Information Styled Like Tailwind
    const athlete = athletes[0];

    // Styling similar to Tailwind "font-semibold text-lg"
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81); // Tailwind's gray-700
    doc.text(`Name: ${athlete.name}`, 10, 45);

    doc.setTextColor(107, 114, 128); // Tailwind's gray-500
    doc.setFont("helvetica", "normal"); // Normal weight
    doc.text(
      `Age: ${
        new Date().getFullYear() - new Date(athlete.age).getFullYear()
      } years`,
      10,
      55
    );
    doc.text(`Weight: ${athlete.weight} kg`, 10, 65);
    doc.text(`Sport: ${athlete.sport}`, 10, 75);

    // Custom horizontal line for styling separation
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 80, 200, 80);

    // 4. Lactate Testing Data Section Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Lactate Testing Data", 10, 90);

    // 5. Table of Lactate Testing Data
    const testingData = testings[0];
    const tableColumns = ["Power (W)", "Lactate (mmol/L)", "Heart Rate (bpm)"];
    const tableRows = testingData.points.map((point) => [
      point.power,
      point.lactate,
      point.heartRate,
    ]);

    // Applying similar styles to Tailwind's table styles using autoTable
    autoTable(doc, {
      startY: 95,
      head: [tableColumns],
      body: tableRows,
      theme: "striped", // Similar to Tailwind's table striping
      headStyles: {
        fillColor: [21, 101, 192], // Tailwind's blue-600 for table headers
        textColor: [255, 255, 255], // White text in header
        fontSize: 12,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [55, 65, 81], // Tailwind's gray-700 for body text
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246], // Tailwind's gray-100 for alternate rows
      },
      margin: { top: 10 },
    });

    // 6. Capture Chart Image and Add Below Table
    const chartElement = document.getElementById("chart-container");
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");

      // Add the chart image to the PDF
      doc.addImage(imgData, "PNG", 10, doc.lastAutoTable.finalY + 20, 180, 100);
    }

    // 7. Footer Section
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150); // Light gray
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 290);
    doc.text("Page 1", 200, 290, null, null, "right");

    // Save the PDF
    doc.save("athlete_lactate_test.pdf");
  };

  return (
    <Button onClick={generatePdf} variant="contained" color="primary">
      Generate PDF
    </Button>
  );
};

export default GeneratePDF;
