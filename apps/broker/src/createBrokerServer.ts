import { Server } from 'ws';

export function createBrokerService() {
  const brokerService = new Server({ port: 8080, clientTracking: true });

  brokerService.on('connection', (ws) => {
    console.info(
      `[Broker] New connection (${brokerService.clients.size} total)`
    );

    ws.on('message', (message) => {
      console.info('[Broker]', message.toString());
      brokerService.clients.forEach((client) => client.send(message));
    });

    ws.on('error', (error) => {
      console.info('[Broker] Error', error);
    });

    ws.on('close', () => {
      console.info(
        `[Broker] Lost connection (${brokerService.clients.size} total)`
      );
    });
  });

  return brokerService;
}
