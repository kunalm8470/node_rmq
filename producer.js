const amqp = require('amqplib');
const config = require('./config');

let channel = null;

process.on('exit', (code) => {
    if (channel) {
        channel.close();
        console.log('Closing RMQ channel!');
    }

    console.error(code);
});

const exitQueue = (err) => {
    console.error(err);
    process.exit(1);
};

const publish = async () => {
    try {
        const connection = await amqp.connect(config.rmq.connection_url);
        connection.on('error', exitQueue);
        channel = await connection.createChannel();
        
        // Assert exchange existence
        await channel.assertExchange(config.rmq.exchange, config.rmq.exchange_type, { durable: false });
        channel.publish(config.rmq.exchange, config.rmq.routing_key, Buffer.from('Publisher message!', 'utf8'));
        await channel.close();
        await connection.close();
    } catch (err) {
        return exitQueue(err);
    }
};

publish();
