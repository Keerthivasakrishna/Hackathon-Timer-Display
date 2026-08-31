import mqtt from 'mqtt';

const NTFY_POLL_URL = 'https://ntfy.sh/hacktronics_2026_live_state_v3';
const MQTT_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8000/mqtt'
];
const MQTT_TOPIC = 'hacktronics_2026_live_state_v3';
const DEVICE_ID = 'dev_' + Math.random().toString(36).substring(2, 9);

let mqttClient = null;
let latestCloudState = null;
let lastHandledHash = '';
let listenerCallbacks = new Set();

/**
 * Computes a structural hash to deduplicate identical cloud state updates
 */
function getStructuralHash(payload) {
  if (!payload) return '';
  try {
    return JSON.stringify({
      timerStatus: payload.timer?.status,
      targetEndTime: payload.timer?.targetEndTime,
      duration: payload.timer?.durationSeconds,
      eventInfo: payload.eventInfo,
      announcements: payload.announcements,
      qrCodes: payload.qrCodes,
      settings: payload.settings
    });
  } catch (e) {
    return '';
  }
}

/**
 * Initializes single high-speed MQTT WebSocket Connection
 */
function initRealtimeConnection() {
  if (mqttClient) return;

  try {
    mqttClient = mqtt.connect(MQTT_BROKERS[0], {
      clientId: 'hacktronics_' + DEVICE_ID,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 3000
    });

    mqttClient.on('connect', () => {
      mqttClient.subscribe(MQTT_TOPIC, { qos: 1 });
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed && parsed.payload) {
            if (parsed.senderId === DEVICE_ID) return;
            handleIncomingState(parsed.payload);
          }
        } catch (e) {}
      }
    });
  } catch (e) {
    console.warn('MQTT init notice:', e);
  }
}

function handleIncomingState(payload) {
  const hash = getStructuralHash(payload);
  if (hash && hash === lastHandledHash) {
    return; // Deduplicate identical updates to prevent React DOM glitching
  }
  lastHandledHash = hash;
  latestCloudState = payload;

  listenerCallbacks.forEach((cb) => {
    try { cb(payload); } catch (e) {}
  });
}

// Auto init WebSocket connection
initRealtimeConnection();

/**
 * Pushes updated state from Control Panel to Cloud
 */
export async function pushStateToCloud(state) {
  const payloadObj = {
    senderId: DEVICE_ID,
    timestamp: Date.now(),
    payload: state
  };

  const jsonString = JSON.stringify(payloadObj);

  // Push to MQTT WebSockets with retain
  try {
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(MQTT_TOPIC, jsonString, { qos: 1, retain: true });
    } else {
      initRealtimeConnection();
    }
  } catch (e) {}

  // HTTPS backup post for instant HTTP poll
  try {
    fetch(NTFY_POLL_URL, {
      method: 'POST',
      body: jsonString,
      headers: { 'Title': 'HACKTRONICS_STATE_UPDATE' }
    }).catch(() => {});
  } catch (e) {}
}

/**
 * Subscribes to Realtime Cloud state broadcasts across all devices
 */
export function subscribeToCloudState(callback) {
  listenerCallbacks.add(callback);
  if (latestCloudState) {
    callback(latestCloudState);
  }
  return () => {
    listenerCallbacks.delete(callback);
  };
}

/**
 * Fetches the initial cloud state on page load via instant HTTPS poll
 */
export async function fetchInitialCloudState() {
  try {
    const res = await fetch(`${NTFY_POLL_URL}/json?poll=1`);
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        const data = JSON.parse(lastLine);
        if (data && data.message) {
          const parsed = JSON.parse(data.message);
          if (parsed && parsed.payload) {
            handleIncomingState(parsed.payload);
            return parsed.payload;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Initial cloud fetch notice:', err);
  }
  return latestCloudState;
}
