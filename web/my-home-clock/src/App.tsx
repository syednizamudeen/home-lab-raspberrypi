import { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosque,
  faServer,
  faSignal,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import Papa from "papaparse";

type PrayerTimes = {
  Asar: string;
  Date: string;
  Day: string;
  Isyak: string;
  Maghrib: string;
  Subuh: string;
  Syuruk: string;
  Zohor: string;
};

function App() {
  const [time, setTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const formattedDate = useMemo(() => {
    const y = time.getFullYear();
    const m = String(time.getMonth() + 1).padStart(2, "0");
    const d = String(time.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [time]);

  useEffect(() => {
    let timer: number | undefined;
    const sync = () => {
      const now = new Date();
      setTime(now);
      const delay = 1000 - now.getMilliseconds();
      timer = setTimeout(sync, delay);
    };
    sync();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/MuslimPrayerTimetable2026.csv")
      .then((response) => response.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true });
        const filtered = (result.data as PrayerTimes[]).find(
          (row) => row.Date === formattedDate
        );
        setPrayerTimes(filtered || null);
      })
      .catch((error) => {
        console.error("Error fetching prayer timetable:", error);
      });
  }, [formattedDate]);

  // 12-hour format
  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // Get today's date details
  const today = time;
  const year = today.getFullYear();
  const month = today.toLocaleString("default", { month: "long" });
  const date = today.getDate();
  const weekday = today.toLocaleString("default", { weekday: "long" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-w-[640px] min-h-screen">
      <div className="border rounded-xl p-4 border-primary md:col-span-2 flex flex-col items-center justify-center">
        <div className="my-5">
          <div>
            <span className="countdown text-8xl font-bold tracking-wider text-primary">
              <span
                style={
                  { "--value": hours, "--digits": 2 } as React.CSSProperties
                }
                aria-live="polite"
                aria-label={String(hours)}
              >
                {hours}
              </span>
              :
              <span
                style={
                  { "--value": minutes, "--digits": 2 } as React.CSSProperties
                }
                aria-live="polite"
                aria-label={String(minutes)}
              >
                {minutes}
              </span>
              :
              <span
                style={
                  { "--value": seconds, "--digits": 2 } as React.CSSProperties
                }
                aria-live="polite"
                aria-label={String(seconds)}
              >
                {seconds}
              </span>
            </span>
            <span className="text-2xl text-accent">{ampm}</span>
          </div>
          <div className="text-3xl text-center text-secondary">
            {weekday}, {date} {month}, {year}
          </div>
          <div className="flex justify-center mt-5">
            <div className="badge badge-success badge-xl">
              <FontAwesomeIcon icon={faWifi} className="text-neutral" /> Wifi 5G{" "}
              <FontAwesomeIcon icon={faServer} className="text-neutral" /> 2
              Devices{" "}
              <FontAwesomeIcon icon={faSignal} className="text-neutral" /> 1
              Gbps
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-xl p-4 border-primary flex flex-col items-center justify-center">
        <h3>
          <FontAwesomeIcon
            icon={faMosque}
            size="2xl"
            className="text-primary"
          />{" "}
          Prayer Times
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-4 w-full h-full">
          <div className="border border-neutral rounded-xl flex flex-col items-center justify-center gap-1">
            <div className="flex flex-row justify-between items-center flex-wrap gap-1 text-xl">
              <div>Fajr</div>
              <div>الفجر</div>
            </div>
            <div className="font-bold text-3xl">
              {prayerTimes?.Subuh || "--"} AM
            </div>
          </div>
          <div className="border border-neutral rounded-xl flex flex-col items-center justify-center gap-1">
            <div className="flex flex-row justify-between items-center flex-wrap gap-1 text-xl">
              <div>Dhuhur</div>
              <div>الظهر</div>
            </div>
            <div className="font-bold text-3xl">
              {prayerTimes?.Zohor || "--"} PM
            </div>
          </div>
          <div className="border border-neutral rounded-xl flex flex-col items-center justify-center gap-1">
            <div className="flex flex-row justify-between items-center flex-wrap gap-1 text-xl">
              <div>Asar</div>
              <div>العصر</div>
            </div>
            <div className="font-bold text-3xl">
              {prayerTimes?.Asar || "--"} PM
            </div>
          </div>
          <div className="border border-neutral rounded-xl flex flex-col items-center justify-center gap-1">
            <div className="flex flex-row justify-between items-center flex-wrap gap-1 text-xl">
              <div>Maghrib</div>
              <div>المغرب</div>
            </div>
            <div className="font-bold text-3xl">
              {prayerTimes?.Maghrib || "--"} PM
            </div>
          </div>
          <div className="border border-neutral rounded-xl flex flex-col items-center justify-center gap-1">
            <div className="flex flex-row justify-between items-center flex-wrap gap-1 text-xl">
              <div>Isha</div>
              <div>العشاء</div>
            </div>
            <div className="font-bold text-3xl">
              {prayerTimes?.Isyak || "--"} PM
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-xl p-4 border-primary">{/* 03 */}</div>
      <div className="border rounded-xl p-4 border-primary md:col-span-2">
        {/* 04 */}
      </div>
    </div>
  );
}

export default App;
