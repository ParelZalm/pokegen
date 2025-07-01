import React from 'react';

type WeatherProps = {
	weather: {
		current?: {
			temperature2m: number;
		};
	} | null;
};

export const Weather = ({weather}: WeatherProps) => {
	if (!weather) return <div>Loading...</div>;
	const currentDeg = typeof weather.current?.temperature2m === 'number'
			? weather.current.temperature2m.toFixed(1)
			: 'N/A';

	return (
		<div>
			<p>Weather</p>
			<h2>{currentDeg} degrees</h2>
		</div>
	);
};