import { Configschema } from 'configschema';
import needle from 'needle';
import { Total } from 'schemas';
import socketIO from 'socket.io-client';
import { get as nodecg } from './util/nodecg';

const config = nodecg().bundleConfig as Configschema;
let eventID = -1;
const repeater = socketIO(`https://${config.repeater.url}`, { path: config.repeater.path });
const total = nodecg().Replicant<Total>('total');

/**
 * Translates the short event name into the numerical ID from the tracker, if it exists.
 * @param short Short event name in the tracker.
 */
async function getEventIDFromShort(): Promise<number> {
  const resp = await needle(
    'get',
    `https://${config.trackerURL}/search/?short=${config.eventShort}&type=event`,
  );
  if (!resp.body.length) {
    throw new Error(`Event "${config.eventShort}" does not exist on the tracker`);
  }
  return resp.body[0].pk;
}

// Get donation total from HTTPS API, backup for the repeater socket server.
// We need to add both events together to get the correct total.
async function updateDontationTotalFromAPI(): Promise<void> {
  try {
    const resp = await needle('get', `https://${config.trackerURL}/${eventID}?json`);
    if (resp.statusCode !== 200) {
      throw new Error(JSON.stringify(resp.body));
    }
    const amount = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
    if (total.value !== amount) {
      nodecg().log.info(`API donation total changed: $${total}`);
    }
    total.value = amount;
  } catch (err) {
    nodecg().log.info('Issue getting API donation total:', err);
  }
}

repeater.on('connect', () => nodecg().log.info('Connected to repeater:', config.repeater.url));
repeater.on('connect_error', (err: Error) => nodecg().log.warn('Repeater connect_error:', err));
repeater.on('disconnect', () => nodecg().log.warn('Disconnected from repeater'));
repeater.on('error', (err: Error) => nodecg().log.warn('Repeater error:', err));

// Triggered when a new donation that can be shown on stream is received.
repeater.on('donation', (data: { event: string; id: string }) => {
  if (data.event === config.eventShort) {
    nodecg().log.info(`Received new donation with ID ${data.id}`);
    nodecg().sendMessage('newDonation', data);
  }
});

// Triggered when the updated donation total is received.
// eslint-disable-next-line camelcase
repeater.on('total', (data: { event: string; new_total: string }) => {
  if (data.event === config.eventShort) {
    total.value = parseFloat(data.new_total);
  }
  nodecg().log.info(`Updated donation total received: $${parseFloat(data.new_total).toFixed(2)}`);
});

async function setup(): Promise<void> {
  try {
    eventID = await getEventIDFromShort();
  } catch (err) {
    nodecg().log.error(err);
    return;
  }
  updateDontationTotalFromAPI(); // Getting the initial donation total on startup.
  setInterval(updateDontationTotalFromAPI, 60000); // Also do this every 60s as a socket fallback.
  nodecg().log.info('Setup successful');
}
setup();
