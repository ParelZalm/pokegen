import {fetchWeatherApi} from 'openmeteo';

type WeatherData = {
	hourly: {
		temperature2m: number[];
		uvIndex: number[];
		time: string[];
	},
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const weatherCache = new Map<string, { promise: Promise<WeatherData>; timestamp: number }>();

export async function fetchWeather(
	latitude: number,
	longitude: number,
	timezone: string = "Europe/Berlin"
): Promise<WeatherData> {
	const cacheKey = `${latitude},${longitude},${timezone}`;
	const now = Date.now();

	const cached = weatherCache.get(cacheKey);
	if (cached && now - cached.timestamp < CACHE_TTL_MS) {
		console.log(`Using cached weather data for ${cacheKey}`);
		return cached.promise;
	}

	const fetchPromise = (async () => {
		const params = {
			latitude,
			longitude,
			hourly: ["temperature_2m", "uv_index"],
			timezone: "Europe/Berlin",
		};

		const url = "https://api.open-meteo.com/v1/forecast";
		console.log(url, params);
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];

		const hourly = response.hourly()!;
		const rawTime = hourly.time();
		const timeArray = Array.isArray(rawTime)
			? rawTime.map((t: bigint) => new Date(Number(t) * 1000).toISOString())
			: [new Date(Number(rawTime) * 1000).toISOString()];

		const weatherData: WeatherData = {
			hourly: {
				temperature2m: Array.from(hourly.variables(0)!.valuesArray()!),
				uvIndex: Array.from(hourly.variables(1)!.valuesArray()!),
				time: timeArray,
			},
		};

		return {
			hourly: weatherData.hourly,
		};
	})();

	weatherCache.set(cacheKey, {promise: fetchPromise, timestamp: now});
	return fetchPromise;
}