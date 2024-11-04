import { ServerEvent, ServerEventPayload } from '@package/lib'
import { WebSocket as WS } from 'ws'
export * from 'ws'
export { WebSocketServer } from 'ws'

export type WebSocket = WS & {
  /**
   * @deprecated Use `sendEvent` instead.
   */
  send(data: BufferLike, cb?: (err?: Error) => void): void
  sendEvent<K extends keyof ServerEventPayload>(event: ServerEvent<K>): void
}
