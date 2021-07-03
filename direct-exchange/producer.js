const amqblib = require('amqplib');

const sleep = (secs) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, secs * 1000);
    });
};

const publish = async () => {
    const exchangeName = 'direct_exchange';
    const routingKey = 'red-key';
    const payload = {
        message: 'Direct message'
    };

    try {
        const connection = await amqblib.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, 'direct', { durable: false });

        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(payload, null, 4)));
        await sleep(2);
        connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

publish();