const { 
  SQSClient, 
  ReceiveMessageCommand, 
  DeleteMessageCommand 
} = require("@aws-sdk/client-sqs");

const db = require("../db");

/* ===============================
SQS CONFIG
=============================== */

const sqs = new SQSClient({
  region: process.env.AWS_REGION
});

const queueUrl = process.env.SQS_QUEUE_URL;


/* ===============================
POLL QUEUE
=============================== */

async function pollQueue(){

  try{

    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 20,        // Long polling
      VisibilityTimeout: 30
    });

    const data = await sqs.send(command);

    if(!data.Messages || data.Messages.length === 0){
      return;
    }

    for(const msg of data.Messages){

      try{

        const event = JSON.parse(msg.Body);

        console.log("📩 Received event:", event);

        if(event.type === "PAYMENT_SUCCESS"){

          await new Promise((resolve,reject)=>{

            db.pool.query(
              `UPDATE orders
               SET payment_status = ?
               WHERE id = ? AND payment_status != 'PAID'`,
              [event.status, event.orderId],
              (err)=>{

                if(err){
                  console.error("❌ Order update error:",err.message);
                  return reject(err);
                }

                console.log("✅ Order payment updated:",event.orderId);
                resolve();
              }
            );

          });

        }

        /* DELETE MESSAGE AFTER SUCCESS */

        await sqs.send(new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: msg.ReceiptHandle
        }));

      }catch(err){

        console.error("❌ Message processing error:",err.message);

      }

    }

  }catch(err){

    console.error("❌ SQS polling error:", err.message);

  }

}


/* ===============================
WORKER LOOP
=============================== */

async function startWorker(){

  console.log("🚀 Payment Worker Started");

  while(true){

    await pollQueue();

    /* Small delay to avoid tight loop */
    await new Promise(resolve => setTimeout(resolve, 2000));

  }

}


/* START WORKER */

startWorker();
