import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer, faSignal, faWifi } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [time, setTime] = useState(new Date());

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
        {/* 02 */}
      </div>
      <div className="border rounded-xl p-4 border-primary">{/* 03 */}</div>
      <div className="border rounded-xl p-4 border-primary md:col-span-2">
        {/* 04 */}
      </div>
    </div>
  );
}

export default App;
