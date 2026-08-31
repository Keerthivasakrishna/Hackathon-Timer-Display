import mqtt from 'mqtt';

const NTFY_URL = 'https://ntfy.sh/hacktronics_2026_live_state_v2';
const MQTT_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8000/mqtt'
];
const MQTT_TOPIC = 'hacktronics_2026_live_state_v2';
const DEVICE_ID = 'device_' + Math.random().toString(36).substring(2, 9);

let mqttClient = null;
let latestCloudState = null;
let listenerCallbacks = new Set();
let eventSource = null;

/**
 * Initializes MQTT & SSE connection
 */
function initRealtimeConnections() {
  // 1. MQTT Connection
  if (!mqttClient) {
    try {
      mqttClient = mqtt.connect(MQTT_BROKERS[0], {
        clientId: 'hacktronics_' + DEVICE_ID,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 2000
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

  // 2. EventSource (SSE) Connection for ntfy.sh instant fallback
  if (!eventSource && typeof window !== 'undefined' && 'EventSource' in window) {
    try {
      eventSource = new EventSource(`${NTFY_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const parsed = JSON.parse(data.message);
            if (parsed && parsed.payload) {
              if (parsed.senderId === DEVICE_ID) return;
              handleIncomingState(parsed.payload);
            }
          }
        } catch (e) {}
      };
    } catch (e) {
      console.warn('SSE notice:', e);
    }
  }
}

function handleIncomingState(payload) {
  latestCloudState = payload;
  listenerCallbacks.forEach((cb) => {
    try { cb(payload); } catch (e) {}
  });
}

// Auto init connections
initRealtimeConnections();

/**
 * Pushes updated state from Control Panel to Cloud (dual-layer push)
 */
export async function pushStateToCloud(state) {
  const payloadObj = {
    senderId: DEVICE_ID,
    timestamp: Date.now(),
    payload: state
  };

  const jsonString = JSON.stringify(payloadObj);

  // Layer 1: Push to ntfy.sh REST endpoint
  try {
    fetch(NTFY_URL, {
      method: 'POST',
      body: jsonString,
      headers: { 'Title': 'HACKTRONICS_STATE_UPDATE' }
    }).catch(() => {});
  } catch (e) {}

  // Layer 2: Push to MQTT WebSockets
  try {
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(MQTT_TOPIC, jsonString, { qos: 1, retain: true });
    } else {
      initRealtimeConnections();
    }
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
    const res = await fetch(`${NTFY_URL}/json?poll=1`);
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        const data = JSON.parse(lastLine);
        if (data && data.message) {
          const parsed = JSON.parse(data.message);
          if (parsed && parsed.payload) {
            latestCloudState = parsed.payload;
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
