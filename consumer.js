'use strict';

const amqp = require('amqplib');
const config = require('./config');

let channel = null;
const exitQueue = (err) => {
    console.error(err);
    process.exit(1);
};

const onMessageRecieved = (message) => {
    if (message && message.content) {
        const messageContent = message.content.toString() || '';
        console.log(messageContent);
    }
};

const consume = async () => {
    try {
        const connection = await amqp.connect(config.rmq.connection_url);
        connection.on('error', exitQueue);

        channel = await connection.createChannel();
        await channel.assertExchange(config.rmq.exchange, config.rmq.exchange_type, { durable: false });
        const queue = await channel.assertQueue(config.rmq.queue);
        channel.bindQueue(queue.queue, config.rmq.exchange, config.rmq.routing_key);

        channel.consume(queue.queue, onMessageRecieved);
    } catch (err) {
        return exitQueue(err);
    }
};

consume();

process.on('exit', (code) => {
    if (channel) {
        channel.close();
        console.log('Closing RMQ channel!');
    }

    console.error(code);
});
