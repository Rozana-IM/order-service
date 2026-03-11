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
    WaitTimeSeconds: 20, 
    VisibilityTimeout: 30  });

  const data = await sqs.send(command);

  if(!data.Messages) return;

  for(const msg of data.Messages){

    const event = JSON.parse(msg.Body);
    console.log("Received event:", event);

    if(event.type === "PAYMENT_SUCCESS"){

      db.pool.query(
        `UPDATE orders
         SET payment_status=?
         WHERE id=? AND payment_status!='PAID'`,
        [event.status,event.orderId],
        (err)=>{
          if(err){
            console.error("Order update error:",err.message);
          }else{
            console.log("Order payment updated:",event.orderId);
          }
        }
      );

    }

    await sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: msg.ReceiptHandle
    }));

  }

}

}catch(err){

    console.error("SQS worker error:", err.message);

  }

}

/* CONTINUOUS POLLING LOOP */

async function startWorker(){
  while(true){
    await pollQueue();
  }
}

startWorker();
