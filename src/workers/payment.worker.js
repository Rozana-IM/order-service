const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const db = require("../db");

const sqs = new SQSClient({
  region: process.env.AWS_REGION
});

const queueUrl = process.env.SQS_QUEUE_URL;

async function pollQueue(){

const command = new ReceiveMessageCommand({
QueueUrl: queueUrl,
MaxNumberOfMessages: 5,
WaitTimeSeconds: 10
});

const data = await sqs.send(command);

if(!data.Messages) return;

for(const msg of data.Messages){

const event = JSON.parse(msg.Body);

if(event.type === "PAYMENT_SUCCESS"){

db.pool.query(
"UPDATE orders SET payment_status=? WHERE id=?",
[event.status,event.orderId]
);

}

await sqs.send(new DeleteMessageCommand({
QueueUrl: queueUrl,
ReceiptHandle: msg.ReceiptHandle
}));

}

}

setInterval(pollQueue, 5000);
