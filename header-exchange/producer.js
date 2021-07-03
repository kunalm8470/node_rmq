const amqblib = require('amqplib');
const { v4: uuid } = require('uuid');

const sleep = (secs) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, secs * 1000);
    });
};

const publish = async () => {
    const exchangeName = 'headers_exchange';
    const routingKey = '';
    const payload = {
        id: uuid(),
        name: 'Kunal Mukherjee'
    };

    try {
        const connection = await amqblib.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, 'headers', { durable: false });

        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(payload, null, 4)), {
            headers: {
                continent: 'Asia',
                country: 'India'
            }
        });

        await sleep(2);
        connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

publish();