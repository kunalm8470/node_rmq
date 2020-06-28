const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const config= {
    rmq: {
        connection_url: `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@localhost/?=heartbeat=60`,
        routing_key: process.env.RMQ_ROUTING_KEY,
        exchange: process.env.RMQ_EXCHANGE,
        exchange_type: process.env.RMQ_EXCHANGE_TYPE,
        queue: process.env.RMQ_QUEUE
    }
};

module.exports = config;