"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mqtt, { MqttClient } from "mqtt";

export type MqttStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseMqttOptions {
  brokerUrl: string;
  username?: string;
  password?: string;
  topics?: string[];
  onMessage?: (topic: string, payload: string) => void;
}

export function useMqtt({
  brokerUrl,
  username,
  password,
  topics = [],
  onMessage,
}: UseMqttOptions) {
  const clientRef = useRef<MqttClient | null>(null);
  const [status, setStatus] = useState<MqttStatus>("disconnected");

  // onMessage가 매 렌더마다 새 함수로 바뀌어도 최신 버전을 참조하도록
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
  if (!brokerUrl) {
    setStatus("disconnected");
    return;
  }
  useEffect(() => {
    setStatus("connecting");

    const client = mqtt.connect(brokerUrl, {
      username,
      password,
      // 브라우저 환경 WebSocket 필수 옵션
      protocol: "wss",
      reconnectPeriod: 0, // 자동 재연결 비활성화
      connectTimeout: 10000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setStatus("connected");
      if (topics.length > 0) {
        client.subscribe(topics, (err) => {
          if (err) console.error("[MQTT] 구독 실패:", err);
        });
      }
    });

    client.on("message", (topic, message) => {
      onMessageRef.current?.(topic, message.toString());
    });

    client.on("error", (err) => {
      console.error("[MQTT] 에러:", err);
      setStatus("error");
    });

    client.on("close", () => setStatus("disconnected"));
    client.on("reconnect", () => setStatus("connecting"));

    return () => {
      client.end(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerUrl, username, password]);

  /** 특정 토픽에 메시지 발행 */
  const publish = useCallback((topic: string, payload: string) => {
    if (!clientRef.current?.connected) {
      console.warn("[MQTT] 연결되지 않아 발행 실패:", topic);
      return;
    }
    clientRef.current.publish(topic, payload, { qos: 1 });
  }, []);

  /** 추가 토픽 구독 */
  const subscribe = useCallback((topic: string | string[]) => {
    clientRef.current?.subscribe(topic);
  }, []);

  return { status, publish, subscribe };
}
