const amqblib = require('amqplib');

let connection;
let channel;

const onMessageRecieved = (msg) => {
    if (!msg || !msg.content) {
        return;
    }

    console.log(msg.content.toString());
    channel.ack(msg);
};

const consume = async () => {
    const queueName = 'blue';
    const exchangeName = 'topic_exchange';
    const routingKey = 'blue.#';

    try {
        connection = await amqblib.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, 'topic', { durable: false });
        const q = await channel.assertQueue(queueName);
        channel.bindQueue(q.queue, exchangeName, routingKey);
        channel.prefetch(1);
        console.log(`Waiting for messages in queue - ${q.queue}`);

        channel.consume(q.queue, onMessageRecieved, { noAck: false });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

consume();