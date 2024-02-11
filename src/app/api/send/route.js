// pages/api/send.js
import fs from "fs";
import { Parser } from "json2csv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, subject, message } = req.body;

    const csvFields = ["Email", "Subject", "Message"];
    const opts = { fields: csvFields };
    const parser = new Parser(opts);
    const csv = parser.parse({
      Email: email,
      Subject: subject,
      Message: message,
    });

    fs.appendFile("data.csv", csv + "\n", function (err) {
      if (err) {
        console.log(
          "Some error occurred - file either not saved or corrupted file saved."
        );
        res.status(500).json({ error: "Error writing to CSV file" });
      } else {
        console.log("It's saved!");
        res.status(200).json({ status: "Data added to CSV file" });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
