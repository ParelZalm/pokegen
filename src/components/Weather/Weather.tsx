import React from 'react';
import styles from './weather.module.scss';

type WeatherProps = {
	weather: {
		hourly?: {
			temperature2m: number[];
			time: string[];
		}
	} | null;
	city?: string;
};

export const Weather = ({weather, city}: WeatherProps) => {
	const currentHour = new Date().getHours();
	if (!weather) return <div>Loading...</div>;

	const currentDeg = typeof weather.hourly?.temperature2m[currentHour] === 'number' ?
		weather.hourly?.temperature2m[currentHour].toFixed(1)
		:
		'N/A';
	console.log('Current hour:', currentHour);

	const renderHourRow = (index: number) => {
		const hourIndex = currentHour + index;
		const temp = weather.hourly?.temperature2m[hourIndex];
		const timeHour = (hourIndex % 24).toString().padStart(2, '0');
		if (temp === undefined) return null;
		return (
			<div key={hourIndex} className={styles.hour}>
				<div>{`${timeHour}:00`}</div>
				<div>{temp.toFixed(1)}°C</div>
			</div>
		);
	};

	console.log('Weather data:', weather);

	return (
		<div className={styles.container}>
			<p>Weather</p>
			<h1>{currentDeg} degrees</h1>
			<div className={styles.hourly}>
				{Array.from({length: 6}, (_, index) => renderHourRow(index + 1))}
			</div>
			<p>{city}</p>
		</div>
	);
};