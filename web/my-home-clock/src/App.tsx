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
    <>
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-red-600">
          Home Clock is working!
        </h1>
        <div className="mt-6 text-4xl font-mono text-gray-800">
          {time.toLocaleTimeString()}
        </div>
      </div>
      <button className="btn btn-neutral">Neutral</button>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-secondary">Secondary</button>
      <button className="btn btn-accent">Accent</button>
      <button className="btn btn-info">Info</button>
      <button className="btn btn-success">Success</button>
      <button className="btn btn-warning">Warning</button>
      <button className="btn btn-error">Error</button>
    </>
  );
}

export default App;
