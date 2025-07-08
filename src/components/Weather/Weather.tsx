"use client"

import React from 'react';
import styles from './weather.module.scss';

type WeatherProps = {
	weather: {
		hourly?: {
			temperature2m: number[];
			uvIndex: number[];
			time: string[];
		}
	} | null;
	city?: string;
};

export const Weather = ({weather, city}: WeatherProps) => {
	const currentHour = new Date().getHours();
	if (!weather || !weather.hourly) return <div>Loading...</div>;

	console.log(weather)

	const renderHourRow = (index: number) => {
		const hourIndex = currentHour + index;
		const temp = weather.hourly?.temperature2m[hourIndex];
		const timeHour = (hourIndex % 24).toString().padStart(2, '0');
		if (temp === undefined) return null;
		return (
			<div key={hourIndex} className={styles.hour}>
				<div>{`${timeHour}:00`}</div>
				<div>{temp.toFixed(1)}</div>
			</div>
		);
	};

	return (
		<div className={styles.container}>
			<div className={styles.heading}>
				<p>Weather</p>
				<p>UV: {weather.hourly['uvIndex'][currentHour].toFixed(1)}</p>
			</div>
			<h1>{weather.hourly['temperature2m'][currentHour].toFixed(1)}</h1>
			<div className={styles.hourly}>
				{Array.from({length: 6}, (_, index) => renderHourRow(index + 1))}
			</div>
			<p>{city}</p>
		</div>
	);
};
