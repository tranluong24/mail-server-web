// kafkaMail.js
import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  clientId: "mail-backend",
  brokers: [`${process.env.KAFKA_BROKER}`],
});

export async function consumeMail(topic) {
  const consumer = kafka.consumer({ groupId: `group-${topic}-${Date.now()}` });

  return new Promise(async (resolve, reject) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ message }) => {
          
          const content = message.value.toString();
          console.log(content.length)
          resolve(content); // trả lại content cho route
          await consumer.disconnect(); // ngắt luôn sau khi nhận
          
          
        },
      });

      // Timeout nếu chờ quá 30s
      setTimeout(async () => {
        await consumer.disconnect();
        reject(new Error("Timeout chờ Kafka"));
      }, 30000);
    } catch (err) {
      reject(err);
    }
  });
}

// consumeMail("student001").catch(console.error);