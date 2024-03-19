import express from "express";
import cors from "cors";
import "dotenv/config";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();
app.use("/mail", router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(PORT, () => console.log("Server started" + PORT));
  } catch (error) {
    console.log(error.message);
  }
};

start();

//Nodemailer code

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.AUTH,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(emails, title, plans) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    bcc: emails, // list of receivers
    subject: `Your Itinerary for ${title}`, // Subject line
    text: plans, // plain text body
    html: plans, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

router.post("/send", async (req, res) => {
  const { emails, title, plans } = req.body;
  main(emails, title, plans);
  res.json({ msg: "sent" });
});
