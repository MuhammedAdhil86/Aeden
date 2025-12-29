import { fetchTrip } from "@/service/fleet";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DownloadPDFButton = () => {
  const handleDownloadPDF = async () => {
    try {
      const data = await fetchTrip();
      console.log("data : ",data)
      const doc = new jsPDF();

      // Optional: Title
      doc.setFontSize(16);
      doc.text("Trip Report", 14, 20);

      // Prepare table rows (customize fields as needed)
      const tableData = data.map((trip, index) => [
        index + 1,
        trip.trip_title,
        trip.driverid.full_name,
        trip.vehicleModel,
        trip.date || "N/A",
      ]);

      // Add table using autoTable plugin
      doc.autoTable({
        head: [["#","From - to", "Driver Name", "Vehicle Model", "Date"]],
        body: tableData,
        startY: 30,
      });

      doc.save("trip-report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
    >
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;
