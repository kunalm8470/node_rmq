const amqblib = require('amqplib');

const sleep = (secs) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, secs * 1000);
    });
};

const publish = async () => {
    const exchangeName = 'topic_exchange';
    const routingKey = 'blue.green.blue';
    const payload = {
        message: 'Topic message'
    };

    try {
        const connection = await amqblib.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(payload, null, 4)));
        await sleep(2);
        connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

publish();