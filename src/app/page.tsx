import styles from "./page.module.css";
import {Weather} from "@/components/Weather/Weather";
import {fetchWeather} from "@/utils/fetchWeather";
import {fetchGeoLocation} from "@/utils/fetchGeoLocation";

export default async function Home() {
  // eindhoven
  const latitude = 51.4408;
  const longitude = 5.4778;
  const weather = await fetchWeather(latitude, longitude);
  const address = await fetchGeoLocation(latitude, longitude);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Weather weather={weather} city={address.address} />
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
