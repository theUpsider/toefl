import { StatusCodes } from 'http-status-codes'

import { RestHandlerMap } from './utils/rest'

// Define your REST handlers
export const handlers: RestHandlerMap<unknown> = {
  POST: {
    '/v1/test': async (_, response, payload) => {
      if (!payload) {
        return {
          statusCode: StatusCodes.BAD_REQUEST
        }
      } else
        return {
          statusCode: StatusCodes.OK
        }
    }
  },
  GET: {
    '/v1/test': async () => {
      return {
        statusCode: StatusCodes.OK
      }
    }
  }
}
