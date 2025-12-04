
import { useEffect, useState } from "react";

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">
        Home Clock is working!
      </h1>
      <div className="mt-6 text-4xl font-mono text-gray-800">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App
