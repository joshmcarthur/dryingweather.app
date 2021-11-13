declare const ALLOWED_ORIGINS: string
declare const DARKSKY_API_KEY: string

import summarariseDryingConditions from './dryingCalculation'

function cors(request: Request, response: Response) {
  const allowedOrigin = ALLOWED_ORIGINS.split(',').find(
    (candidate) => candidate === request.headers.get('Origin'),
  )
  allowedOrigin &&
    response.headers.append('Access-Control-Allow-Origin', allowedOrigin)

  return response
}

export async function handleRequest(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const paramLatitude = searchParams.get('lat')
  const paramLongitude = searchParams.get('lng')
  const {
    cf: { country, city, latitude: headerLatitude, longitude: headerLongitude },
  } = request

  const latitude = Number(paramLatitude || headerLatitude || 0).toFixed(2)
  const longitude = Number(paramLongitude || headerLongitude || 0).toFixed(2)

  const cacheKey = `darksky/${latitude},${longitude}`
  const cacheTtl = 60 * 60 * 3 // 3 hours

  const darkskyForecast = await fetch(
    `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}?units=auto`,
    { cf: { cacheKey, cacheTtl } },
  ).then((r) => r.json())

  const responseBody = {
    location: { city, country, latitude, longitude },
    dryingConditions: await summarariseDryingConditions(darkskyForecast),
  }

  const response = new Response(JSON.stringify(responseBody))
  cors(request, response)

  return response
}
