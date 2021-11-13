const summariseDryingConditions = async ({ daily, hourly }) => {
  const today = daily.data[0]
  const sunrise = new Date(today.sunriseTime * 1000)
  const sunset = new Date(today.sunsetTime * 1000)
  const minTemperature = today.temperatureLow
  const maxTemperature = today.temperatureMax

  const data = hourly.data
    .map((hourForecast) => {
      let { time } = hourForecast
      time = new Date(time * 1000)

      return {
        event: 'forecast',
        time,
        ...calculateDryingConditions(
          hourForecast,
          minTemperature,
          maxTemperature,
          sunrise,
          sunset,
        ),
      }
    })
    .filter((v) => v)

  return [
    { event: 'sunrise', time: sunrise },
    ...data,
    { event: 'sunset', time: sunset },
  ]
}

const DEWPOINT_THRESHOLD = 2
const TEMPERATURE_THRESHOLD = 10
const BEAUFORT_SCALE_LIGHT_BREEZE_KMH = 6
const BEAUFORT_SCALE_STRONG_BREEZE_KMH = 38
const CLOUD_COVER_PARTLY_CLOUDY = 0.4 // 40% cover

const calculateDryingConditions = (
  forecast,
  minTemperature,
  maxTemperature,
  sunrise,
  sunset,
) => {
  let failure = false
  const messages = []

  const temperatureScore =
    ((forecast.temperature - minTemperature) /
      (maxTemperature - minTemperature)) *
    100
  const humidityScore = (1.0 - forecast.humidity) * 100
  const windSpeedScore = 10 // This is constant for now
  const time = new Date(forecast.time * 1000)

  const temperatureDewpointDifference = forecast.temperature - forecast.dewPoint
  if (temperatureDewpointDifference < DEWPOINT_THRESHOLD) {
    failure = true
    messages.push({
      type: 'warning',
      message:
        'The dewpoint temperature is approaching the actual temperature. This means that your clothes could condense water instead of drying.',
    })
  }

  // Temperature should be above 10 degrees C
  if (forecast.temperature < TEMPERATURE_THRESHOLD) {
    messages.push({
      type: 'warning',
      message: `Temperatures below ${TEMPERATURE_THRESHOLD} degrees celsius will still dry clothes if the humidity is low, but will take longer`,
    })
  }

  if (forecast.precipProbability > 0.5) {
    failure = true
    messages.push({ type: 'warning', message: "It's likely to rain." })
  }

  if (forecast.windSpeed < BEAUFORT_SCALE_LIGHT_BREEZE_KMH) {
    messages.push({
      type: 'warning',
      message:
        "There isn't enough wind to contribute to clothes drying, so drying will take longer.",
    })
  } else if (forecast.windSpeed >= BEAUFORT_SCALE_STRONG_BREEZE_KMH) {
    failure = true
    messages.push({
      type: 'warning',
      message:
        'The wind will be strong enough that clothes drying in an unsheltered place could blow away.',
    })
  } else {
    messages.push({
      type: 'info',
      message:
        'A light breeze will help circulate drier air around your washing and reduce the drying time',
    })
  }

  if (forecast.cloudCover < CLOUD_COVER_PARTLY_CLOUDY) {
    messages.push({
      type: 'warning',
      message:
        'Hanging clothes in full sunlight can wear out fabrics and colours more quickly',
    })
  } else {
    messages.push({
      type: 'info',
      message: 'An overcast day is better for drying.',
    })
  }

  if (forecast.humidity >= 0.6) {
    failure = true
  }

  if (time < sunrise || time > sunset) {
    messages.push({
      type: 'warning',
      message:
        'Clothes require low humidity and high temperatures to dry at nighttime.',
    })
  }

  return {
    scores: {
      overall: failure ? 0 : temperatureScore + humidityScore + windSpeedScore,
      temperatureScore,
      humidityScore,
      windSpeedScore,
    },
    forecast: {
      temperature: forecast.temperature,
      dewpoint: forecast.dewPoint,
      humidity: forecast.humidity,
      windspeed: forecast.windSpeed,
    },
    messages,
  }
}

export default summariseDryingConditions
