import { ClientEventPayload, handleWsRequest, sendWs, WebSocketEvent } from '@package/lib'
import { parse } from 'url'
import { WebSocket } from 'ws'

import { handlers } from './resthandlers'
import { log, serverType, wssType } from './server'
import { handleRestRequest, HttpMethod, RestRequest } from './utils/rest'
import { IncomingMessage, ServerResponse } from 'http'

const addListeners = async (wss: wssType, server: serverType) => {
  /**
   * * Handle websocket when on valid path
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wss.on('connection', async function connection(ws: WebSocket, _request) {
    const timeItStart = Date.now()
    ws.on('error', (err) => {
      log.error('Websocket error: ', err)
    })

    // ! Register custom events
    log.debug('Registering custom events')
    ws.on('message', async function (message) {
      const wsEvent: WebSocketEvent<ClientEventPayload> = JSON.parse(message.toString())

      log.debug('Received message: ', wsEvent)
      await handleWsRequest(wsEvent, {
        //TODO: implement handlers
        test(payload) {
          log.debug('Received test event: ', payload)

          ws.send(
            JSON.stringify({
              eventName: 'test_reply',
              payload: 'Hello to you as well, world!'
            })
          )
          sendWs(ws, { eventName: 'test_reply', payload: 'Hello to you as well, world!' })
        }
      })
    })
    const timeItEnd = Date.now()
    log.info('Request took: ', timeItEnd - timeItStart, 'ms')
  })

  /**
   ** Handle get, post, put, delete requests
   */
  server.on('request', async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const parsedRequest = await parseRequest(request)
      const result = await handleRestRequest<unknown>(
        request,
        response,
        parsedRequest,
        handlers
      )

      response.writeHead(result.statusCode ?? 500, result.headers)
      response.end(JSON.stringify(result.body))
    } catch (error) {
      log.error('Error handling request:', error)
      response.writeHead(500)
      response.end('Internal Server Error')
    }
  })

  // Log request timing
  server.on('request', (_, response) => {
    const timeItStart = Date.now()
    log.info('Request received at: ', timeItStart)
    response.on('finish', () => {
      const timeItEnd = Date.now()
      log.info('Request took: ', timeItEnd - timeItStart, 'ms')
    })
  })
  /**
   ** Handle initial websocket connection on http server
   */
  server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url ?? '', true)
    // Announce that we are going to handle this request
    log.trace('Handling request for ', pathname)

    if (pathname?.startsWith('/ws')) {
      //TODO: implement custom websocket handling
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request)
      })
    } else if (pathname === '/mock') {
      //TODO: Example of a custom handler
      // send mock model response:
      socket.write(
        JSON.stringify({
          id: 'mock',
          model: 'mock',
          created: new Date().toISOString(),
          choices: [
            {
              text: 'mock',
              index: 0,
              logprobs: null,
              finish_reason: 'length'
            }
          ]
        })
      )
    } else {
      socket.destroy()
      log.warn('Invalid path')
    }
  })
}

const parseRequest = async (request: IncomingMessage): Promise<RestRequest<unknown>> => {
  const { pathname } = parse(request.url ?? '', true)
  const method = request.method as HttpMethod
  const route = pathname ?? '/'

  // For methods with body
  if (method === 'POST' || method === 'PUT') {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []

      request.on('data', (chunk) => chunks.push(chunk))

      request.on('end', () => {
        try {
          const payload = JSON.parse(Buffer.concat(chunks).toString())
          resolve({
            method,
            route,
            payload
          })
        } catch (error) {
          reject(error)
        }
      })

      request.on('error', reject)
    })
  }

  // For methods without body
  return {
    method,
    route,
    payload: undefined
  }
}

export default addListeners
