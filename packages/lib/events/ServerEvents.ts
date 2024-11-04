// type that matches ServerEventName with payload
export type ServerEventPayload = {
  // TODO: Add server events
  test_reply: string
}

export type ServerBenchmarkPostPayload = (string | number | string[])[]

export type ClientEventPayload = {
  // TODO: Add client events
  test: string
}

export type ServerEvent<K extends keyof ServerEventPayload, P = ServerEventPayload[K]> = {
  eventName: K
  payload: P
}

export type ClientEvent<K extends keyof ClientEventPayload, P = ClientEventPayload[K]> = {
  eventName: K
  payload: P
}

export type ClientPayload = ClientEvent<keyof ClientEventPayload>

export type WebSocketEvent<E extends ServerEventPayload | ClientEventPayload> = {
  eventName: keyof E
  payload: E[keyof E]
}
