import mqtt from 'mqtt';

const MQTT_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8000/mqtt'
];

const TOPIC_NAME = 'hacktronics_2026_live_state_v1';
const DEVICE_ID = 'dev_' + Math.random().toString(36).substring(2, 9);

let client = null;
let latestStateCache = null;
let listenerCallback = null;
let currentBrokerIdx = 0;

function connectMQTT() {
  if (client) return;

  const brokerUrl = MQTT_BROKERS[currentBrokerIdx];

  try {
    client = mqtt.connect(brokerUrl, {
      clientId: 'hacktronics_' + DEVICE_ID,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 3000
    });

    client.on('connect', () => {
      console.log('⚡ Connected to Realtime Cloud Sync via', brokerUrl);
      client.subscribe(TOPIC_NAME, { qos: 1 }, (err) => {
        if (err) console.warn('MQTT subscribe warning:', err);
      });
    });

    client.on('message', (topic, message) => {
      if (topic === TOPIC_NAME) {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed && parsed.payload) {
            // Ignore self-dispatched messages if already applied locally
            if (parsed.senderId === DEVICE_ID) return;

            latestStateCache = parsed.payload;
            if (listenerCallback) {
              listenerCallback(parsed.payload);
            }
          }
        } catch (e) {
          console.warn('MQTT parse warning:', e);
        }
      }
    });

    client.on('error', (err) => {
      console.warn('MQTT connection notice:', err.message);
      // Switch broker if error occurs
      switchBroker();
    });
  } catch (err) {
    console.warn('MQTT init notice:', err);
  }
}

function switchBroker() {
  if (client) {
    try { client.end(true); } catch (e) {}
    client = null;
  }
  currentBrokerIdx = (currentBrokerIdx + 1) % MQTT_BROKERS.length;
  setTimeout(connectMQTT, 1000);
}

// Auto connect on import
connectMQTT();

/**
 * Pushes updated state to Realtime Cloud for instant cross-device broadcast
 */
export function pushStateToCloud(state) {
  if (!client || !client.connected) {
    connectMQTT();
  }

  const payloadStr = JSON.stringify({
    senderId: DEVICE_ID,
    timestamp: Date.now(),
    payload: state
  });

  try {
    if (client && client.connected) {
      client.publish(TOPIC_NAME, payloadStr, { qos: 1, retain: true });
    }
  } catch (err) {
    console.warn('Cloud dispatch notice:', err);
  }
}

/**
 * Subscribes to Realtime Cloud state broadcasts across all devices
 */
export function subscribeToCloudState(callback) {
  listenerCallback = callback;
  if (latestStateCache) {
    callback(latestStateCache);
  }
  return () => {
    listenerCallback = null;
  };
}

/**
 * Gets cached cloud state
 */
export function fetchInitialCloudState() {
  return Promise.resolve(latestStateCache);
}
