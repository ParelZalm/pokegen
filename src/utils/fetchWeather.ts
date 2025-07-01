import { fetchWeatherApi } from 'openmeteo';

type WeatherData = {
	hourly: {
		time: Date[];
		temperature2m: number[];
	};
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
		return cached.promise;
	}

	const fetchPromise = (async () => {
		const params = {
			latitude,
			longitude,
			hourly: "temperature_2m",
			models: "knmi_seamless"
		};



		const url = "https://api.open-meteo.com/v1/forecast";
		console.log(url, params);
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];

		const utcOffsetSeconds = response.utcOffsetSeconds();
		const hourly = response.hourly()!;


		return {
			hourly: {
				time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
					(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
				),
				temperature2m: Array.from(hourly.variables(0)!.valuesArray()!),
			},
		};
	})();

	weatherCache.set(cacheKey, { promise: fetchPromise, timestamp: now });
	return fetchPromise;
}