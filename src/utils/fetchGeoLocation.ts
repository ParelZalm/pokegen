type GeoLocation = {
	address: string;
};

export async function fetchGeoLocation(
	latitude: number,
	longitude: number
): Promise<GeoLocation> {
	const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();

		return {
			address: data?.address?.city ? data?.address?.city : 'Unknown location'
		};
	} catch (error) {
		console.error('Error fetching geolocation:', error);
		throw error;
	}
}
