import { IncomingMessage, ServerResponse } from 'http'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RestRequestHandler<T> = (
  request: IncomingMessage,
  response: Readonly<ServerResponse>,
  payload?: T
) => Promise<RestResponse>

export type RestHandlerMap<T> = {
  [K in HttpMethod]?: {
    [route: string]: RestRequestHandler<T>
  }
}

export type RestRequest<T> = {
  method: HttpMethod
  route: string
  payload?: T
}

type RestResponse = {
  headers?: Record<string, string | number | string[]>
  statusCode?: StatusCodes
  body?: unknown //TODO: define custom type
}

export const handleRestRequest = async <T>(
  request: IncomingMessage,
  response: ServerResponse,
  restRequest: RestRequest<T>,
  handlers: RestHandlerMap<T>
): Promise<RestResponse> => {
  const { method, route, payload } = restRequest
  const methodHandlers = handlers[method]
  try {
    if (methodHandlers) {
      const handler = methodHandlers[route]
      if (handler) {
        return await handler(request, response, payload)
      } else {
        return {
          statusCode: StatusCodes.NOT_FOUND,
          body: ReasonPhrases.NOT_FOUND
        }
      }
    } else {
      return {
        statusCode: StatusCodes.METHOD_NOT_ALLOWED,
        body: ReasonPhrases.METHOD_NOT_ALLOWED
      }
    }
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    }
  }
}
