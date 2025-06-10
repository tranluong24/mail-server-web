import express from "express";
import { createEmails, getEmails } from "../controllers/emailController.js";
import axios from "axios";
import { NodeSSH } from "node-ssh";

import { simpleParser } from "mailparser";
import * as cheerio from "cheerio";

import { consumeMail } from "../../kafka/kafka-consumer/consumer.js";

const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

const sshConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASS,
  readyTimeout: 30000,
  keepaliveInterval: 10000,
  keepaliveCountMax: 3,
  tryKeyboard: true,
};

// Create emails for new user
router.post("/create", createEmails);

// Get user's emails
router.get("/:username", getEmails);

// Proxy route for Thunkable requests
router.post("/proxy-thunkable", async (req, res) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://x.thunkable.com/emaillogin",
      headers: {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        Origin: "https://x.thunkable.com",
        Referer: "https://x.thunkable.com/login",
      },
      data: req.body,
    });
    console.log(response.data);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message || "Error proxying request to Thunkable",
    });
  }
});

router.get("/:email/latest/v2", async (req, res) => {
  const email = req.params.email;
  const username = email.split("@")[0].slice(0,-1);
  
  console.log(username)

  try {
    const mailContent = await consumeMail(username); // chờ 1 tin nhắn
    // Parse email MIME format
    const parsed = await simpleParser(mailContent);
    // Nếu bạn chỉ muốn nội dung HTML:
    const html = parsed.html; // đây là phần bạn cần
    //   const text = parsed.text; // nếu muốn hiển thị văn bản thuần

    // Dùng Cheerio để parse HTML và tìm nút "Click to Sign In"
    let loginLink = null;
    if (html) {
      const $ = cheerio.load(html);
      $("a").each((_, el) => {
        const text = $(el).text().trim();
        if (text.toLowerCase().includes("click to sign in")) {
          loginLink = $(el).attr("href");
        }
      });
    }

    return res.json({
      content: html, // hoặc text nếu muốn
      loginLink,
    });
  } catch (err) {
    console.error("Lỗi khi chờ Kafka:", err);
    res.status(500).json({ error: "Lỗi khi nhận tin nhắn từ Kafka" });
  }
});

// // Get latest email for a specific email address
// router.get("/:email/latest", async (req, res) => {
//   const email = req.params.email;
//   const username = email.split("@")[0];
//   const mailDir = `/var/mail/vhosts/email.tekmonk.edu.vn/${username}/new`;

//   try {
//     await ssh.connect(sshConfig);
//     console.log("SSH connected");

//     // Lấy danh sách file trong thư mục /new
//     const lsResult = await ssh.execCommand(`ls -1 ${mailDir}`);
//     if (lsResult.stderr) throw new Error(lsResult.stderr);

//     const files = lsResult.stdout.trim().split("\n").filter(Boolean);
//     if (files.length === 0) return res.json({ content: null });

//     // Sắp xếp theo tên file (tên file bắt đầu bằng timestamp)
//     files.sort((a, b) => {
//       const aTime = parseInt(a.split(".")[0]);
//       const bTime = parseInt(b.split(".")[0]);
//       return aTime - bTime; // tăng dần
//     });

//     const latestFile = files[files.length - 1];
//     const latestFilePath = `${mailDir}/${latestFile}`;

//     // Đọc nội dung file
//     const catResult = await ssh.execCommand(`cat ${latestFilePath}`);
//     if (catResult.stderr) throw new Error(catResult.stderr);

//     const content = catResult.stdout;
//     // Parse email MIME format
//     const parsed = await simpleParser(content);

//     // Nếu bạn chỉ muốn nội dung HTML:
//     const html = parsed.html; // đây là phần bạn cần
//     const text = parsed.text; // nếu muốn hiển thị văn bản thuần

//     // Dùng Cheerio để parse HTML và tìm nút "Click to Sign In"
//     let loginLink = null;
//     if (html) {
//       const $ = cheerio.load(html);
//       $("a").each((_, el) => {
//         const text = $(el).text().trim();
//         if (text.toLowerCase().includes("click to sign in")) {
//           loginLink = $(el).attr("href");
//         }
//       });
//     }

//     return res.json({
//       content: html, // hoặc text nếu muốn
//       loginLink,
//     });

//     // Kiểm tra nội dung có phải email của Thunkable không
//     if (
//       !content.includes("From: noreply@thunkable.com") &&
//       !content.includes("Subject: Your Thunkable Login Link")
//     ) {
//       return res.json({ content: null });
//     }

//     // Tách email thành dòng và lấy đoạn snippet như bạn cần
//     const lines = content.split(/\r?\n/);
//     const snippetLines = lines.slice(1073 - 1, 1300);
//     const snippet = snippetLines.join("\n");

//     const linkMatch = snippet.match(
//       /href="(https:\/\/x\.thunkable\.com\/[^"]+)"/
//     );
//     loginLink = linkMatch ? linkMatch[1] : null;

//     return res.json({ content: snippet, loginLink });
//   } catch (error) {
//     console.error("Error getting latest email:", error);
//     return res.status(500).json({ message: "Error getting latest email" });
//   } finally {
//     ssh.dispose();
//   }
// });

// // SSH connection setup
// const ssh = new NodeSSH();

// // Connect to SSH server
// try {
//   await ssh.connect(sshConfig);
//   console.log("SSH connection established");
// } catch (error) {
//   console.error("SSH connection error:", error);
// }

export default router;
