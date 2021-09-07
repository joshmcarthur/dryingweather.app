declare const ALLOWED_ORIGINS : string;
declare const DARKSKY_API_KEY : string;

import summarariseDryingConditions from "./dryingCalculation";

function cors(request: Request, response: Response) {
  const allowedOrigin = ALLOWED_ORIGINS.split(',').find(candidate => candidate === request.headers.get("Origin"));
  allowedOrigin && response.headers.append("Access-Control-Allow-Origin", allowedOrigin);

  return response;
}

export async function handleRequest(request: Request) : Promise<Response> {
  const { cf: { postalCode, country, city, latitude, longitude } } = request;
  const cacheKey = `darksky/${postalCode}-${country}`
  const cacheTtl = 60 * 60 * 3 // 3 hours

  const darkskyForecast = await fetch(
    `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}?units=auto`,
    { cf: { cacheKey, cacheTtl } },
  ).then(r => r.json());

  const responseBody = {
    location: { city, country },
    dryingConditions: await summarariseDryingConditions(darkskyForecast)
  };

  const response = new Response(JSON.stringify(responseBody));
  cors(request, response);

  return response;
}
