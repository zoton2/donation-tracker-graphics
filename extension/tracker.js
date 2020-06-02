"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const needle_1 = __importDefault(require("needle"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const nodecg_1 = require("./util/nodecg");
const config = nodecg_1.get().bundleConfig;
let eventID = -1;
const repeater = socket_io_client_1.default(`https://${config.repeater.url}`, { path: config.repeater.path });
const total = nodecg_1.get().Replicant('total');
/**
 * Translates the short event name into the numerical ID from the tracker, if it exists.
 * @param short Short event name in the tracker.
 */
function getEventIDFromShort() {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield needle_1.default('get', `https://${config.trackerURL}/search/?short=${config.eventShort}&type=event`);
        if (!resp.body.length) {
            throw new Error(`Event "${config.eventShort}" does not exist on the tracker`);
        }
        return resp.body[0].pk;
    });
}
// Get donation total from HTTPS API, backup for the repeater socket server.
// We need to add both events together to get the correct total.
function updateDontationTotalFromAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', `https://${config.trackerURL}/${eventID}?json`);
            if (resp.statusCode !== 200) {
                throw new Error(JSON.stringify(resp.body));
            }
            const amount = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
            if (total.value !== amount) {
                nodecg_1.get().log.info(`API donation total changed: $${total}`);
            }
            total.value = amount;
        }
        catch (err) {
            nodecg_1.get().log.info('Issue getting API donation total:', err);
        }
    });
}
repeater.on('connect', () => nodecg_1.get().log.info('Connected to repeater:', config.repeater.url));
repeater.on('connect_error', (err) => nodecg_1.get().log.warn('Repeater connect_error:', err));
repeater.on('disconnect', () => nodecg_1.get().log.warn('Disconnected from repeater'));
repeater.on('error', (err) => nodecg_1.get().log.warn('Repeater error:', err));
// Triggered when a new donation that can be shown on stream is received.
repeater.on('donation', (data) => {
    if (data.event === config.eventShort) {
        nodecg_1.get().log.info(`Received new donation with ID ${data.id}`);
        nodecg_1.get().sendMessage('newDonation', data);
    }
});
// Triggered when the updated donation total is received.
// eslint-disable-next-line camelcase
repeater.on('total', (data) => {
    if (data.event === config.eventShort) {
        total.value = parseFloat(data.new_total);
    }
    nodecg_1.get().log.info(`Updated donation total received: $${parseFloat(data.new_total).toFixed(2)}`);
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            eventID = yield getEventIDFromShort();
        }
        catch (err) {
            nodecg_1.get().log.error(err);
            return;
        }
        updateDontationTotalFromAPI(); // Getting the initial donation total on startup.
        setInterval(updateDontationTotalFromAPI, 60000); // Also do this every 60s as a socket fallback.
        nodecg_1.get().log.info('Setup successful');
    });
}
setup();
