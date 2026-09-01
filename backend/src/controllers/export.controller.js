import { Parser } from "json2csv";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import Transaction from "../models/transaction.js";
import Category from "../models/category.js";

const getUserFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

const exportTransactionsCSV = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let user;
    try {
      user = getUserFromToken(token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const transactions = await Transaction.find({ user }).sort({ date: -1 });

    const rows = await Promise.all(
      transactions.map(async (t) => {
        const category = await Category.findById(t.category);
        return {
          date: t.date.toISOString().split("T")[0],
          type: t.type,
          category: category ? category.name : "Unknown",
          amount: t.amount,
          note: t.note || "",
        };
      })
    );

    const fields = [
  { label: "Date", value: "date" },
  { label: "Type", value: "type" },
  { label: "Category", value: "category" },
  { label: "Amount (Rs.)", value: "amount" },
  { label: "Note", value: "note" },
];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportTransactionsPDF = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let user;
    try {
      user = getUserFromToken(token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const transactions = await Transaction.find({ user }).sort({ date: -1 });

    const rows = await Promise.all(
      transactions.map(async (t) => {
        const category = await Category.findById(t.category);
        return {
          date: t.date.toISOString().split("T")[0],
          type: t.type,
          category: category ? category.name : "Unknown",
          amount: t.amount,
          note: t.note || "",
        };
      })
    );

    res.header("Content-Type", "application/pdf");
    res.attachment("transactions.pdf");

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(18).text("Transaction Report", { align: "center" });
    doc.moveDown();

    rows.forEach((row) => {
      doc
  .fontSize(11)
  .text(`Date: ${row.date}    Type: ${row.type}    Category: ${row.category}    Amount: Rs. ${row.amount}`);

    if (row.note) {
    doc.fontSize(9).fillColor("gray").text(`Note: ${row.note}`);
    doc.fillColor("black");
   }

    doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { exportTransactionsCSV, exportTransactionsPDF };