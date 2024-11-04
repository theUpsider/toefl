/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ClientPayload,
  handleWsRequest,
  ServerEventPayload,
  WebSocketEvent
} from '@package/lib'
import { memo, useCallback, useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { getConfig } from '@/utils/config'

export const TestPage = () => {
  const path = window.location.pathname
  const [socketUrl, setSocketUrl] = useState(
    (getConfig().WS ?? 'ws://localhost:5000/') + path.slice(1) // window.location.pathname
  )

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl)

  useEffect(() => {
    if (lastMessage !== null) {
      const wsEvent: WebSocketEvent<ServerEventPayload> = JSON.parse(lastMessage.data)
      //* Handle events from server
      if (
        !handleWsRequest<ServerEventPayload>(wsEvent, {
          //TODO: implement handlers
          test_reply(payload) {
            console.log('Received test reply: ', payload)
          }
        })
      ) {
        console.log('Event not handled: ', wsEvent)
      }
    }
  }, [])

  const handleClickChangeSocketUrl = useCallback(() => {
    const newUrl = prompt('Enter new socket url', socketUrl)
    if (newUrl) {
      setSocketUrl(newUrl)
    }
  }, [socketUrl])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Connection closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState]

  const handleSendJsonMessage = useCallback(() => {
    sendJsonMessage<ClientPayload>({
      eventName: 'test',
      payload: 'Hello, world!'
    })
  }, [sendJsonMessage])
  return <></>
}

export default memo(TestPage)
