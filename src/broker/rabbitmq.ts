import amqp from "amqplib";

import { Logger } from "../helpers";

class RabbitmqServer {
  private channel: amqp.Channel;

  private queue: string = "example";

  public async connect() {
    try {
      const conn = await amqp.connect("amqp://admin:admin@localhost:5672");
      Logger.info("Connected to RabbitMq");

      this.channel = await conn.createChannel();
      Logger.info("Channel created");

      this.channel.assertQueue(this.queue);
      Logger.info("Queue created");

      this.consume((message) => {
        Logger.info(message.content.toString())
      })
    } catch (err) {
      Logger.error(`Rabbitmq not is connected\n${err}`);
      throw new Error(err);
    }
  }

  async publishInQueue(message: string) {
    return this.channel.sendToQueue(this.queue, Buffer.from(message));
  }

  public async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string
  ): Promise<boolean> {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  public async consume(callback: (message: amqp.Message) => void) {
    return this.channel.consume(this.queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });
  }
}

export default new RabbitmqServer();
