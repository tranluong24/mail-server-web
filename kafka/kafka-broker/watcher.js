const { Kafka } = require("kafkajs");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");

const mysql = require("mysql2/promise");

// Lấy danh sách user từ DB
async function getUserListFromDB() {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute("SELECT username FROM accounts where username like");
  await conn.end();

  // Lấy mảng username từ kết quả query
  return rows.map((row) => row.username);
}

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "XinChao@MySql2025",
  database: "mailserver",
};

// Lấy danh sách user từ DB
async function getUserListFromDB() {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute("SELECT username FROM accounts WHERE username LIKE ?", ['%student%']);
  await conn.end();

  // Lấy mảng username từ kết quả query
  return rows.map((row) => row.username);
}

// Kafka config
const kafka = new Kafka({
  clientId: "mail-watcher",
  brokers: ["localhost:9092"], // nếu Kafka trên VPS này
});

const producer = kafka.producer();

// Hàm khởi tạo Kafka producer
async function startProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}

// Giả sử mail lưu ở /var/mail/username1, /var/mail/username2
const mailBaseDir = "/var/mail/vhosts/email.tekmonk.edu.vn";

// Khởi tạo watcher
function watchUserMail(user) {
  const userMailDir = path.join(mailBaseDir, user, "new");

  // Giám sát thư mục user
  const watcher = chokidar.watch(userMailDir, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("add", async (filePath) => {
    console.log(`New mail file detected for user ${user.slice(0, -1)}: ${filePath}`);

    // Đọc file mail
    const mailContent = fs.readFileSync(filePath, "utf-8");

    try {
      // Gửi nội dung mail vào topic tương ứng với user
      await producer.send({
        topic: user.slice(0, -1), // bỏ ký tự A/B/C cuối
        messages: [{ value: mailContent }],
      });
      console.log(`Mail pushed to Kafka topic: ${user.slice(0, -1)}`);
    } catch (error) {
      console.error("Error sending mail to Kafka:", error);
    }
  });
}

// Danh sách user mail bạn muốn watch (có thể lấy từ DB hoặc config)

async function main() {
  await startProducer();

  const baseUsers = await getUserListFromDB();

  const allUsers = baseUsers.flatMap((user) => [
    `${user}a`,
    `${user}b`,
    `${user}c`,
  ]);

//   console.log("Watching users:", allUsers);

  allUsers.forEach((user) => watchUserMail(user));
}

main().catch(console.error);
