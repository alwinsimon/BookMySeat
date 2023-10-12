import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', '12345', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listner connected to NATS');
});
