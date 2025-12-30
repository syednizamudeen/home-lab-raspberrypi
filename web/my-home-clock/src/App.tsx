import { useEffect, useState } from "react";

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
    <>
      <div className="text-center p-4 border border-primary rounded-xl shadow-lg m-5 inline-block">
        <span className="countdown text-7xl tracking-wider text-primary">
          <span
            style={{ "--value": hours, "--digits": 2 } as React.CSSProperties}
            aria-live="polite"
            aria-label={String(hours)}
          >
            {hours}
          </span>
          :
          <span
            style={{ "--value": minutes, "--digits": 2 } as React.CSSProperties}
            aria-live="polite"
            aria-label={String(minutes)}
          >
            {minutes}
          </span>
          :
          <span
            style={{ "--value": seconds, "--digits": 2 } as React.CSSProperties}
            aria-live="polite"
            aria-label={String(seconds)}
          >
            {seconds}
          </span>
        </span>
        <span className="text-accent">{ampm}</span>
        <div className="text-4xl text-secondary">
          {weekday}, {date} {month}, {year}
        </div>
      </div>
    </>
  );
}

export default App;
