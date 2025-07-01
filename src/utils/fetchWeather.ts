import { fetchWeatherApi } from 'openmeteo';

type WeatherData = {
	current: {
		time: Date;
		temperature2m: number;
	};
	hourly: {
		time: Date[];
		temperature2m: number[];
		rain: number[];
		cloudCover: number[];
		windSpeed10m: number[];
		windSpeed10m: number[];
	};
};

export async function fetchWeather(
	latitude: number,
	longitude: number,
	timezone: string = "Europe/Berlin"
): Promise<WeatherData> {
	const params = {
		latitude,
		longitude,
		hourly: ["temperature_2m", "rain", "cloud_cover", "wind_speed_10m"],
		current: "temperature_2m",
		timezone
	};
	const url = "https://api.open-meteo.com/v1/forecast";
	const responses = await fetchWeatherApi(url, params);
	const response = responses[0];

	const utcOffsetSeconds = response.utcOffsetSeconds();
	const current = response.current()!;
	const hourly = response.hourly()!;

	return {
		current: {
			time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
			temperature2m: current.variables(0)!.value(),
		},
		hourly: {
			time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
				(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
			),
			temperature2m: Array.from(hourly.variables(0)!.valuesArray()!),
			rain: Array.from(hourly.variables(1)!.valuesArray()!),
			cloudCover: Array.from(hourly.variables(2)!.valuesArray()!),
			windSpeed10m: Array.from(hourly.variables(3)!.valuesArray()!),
		},
	};
}