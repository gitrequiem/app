import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
const [time, setTime] = useState(new Date());

useEffect(() => {
    const interval = setInterval(() => {
    setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
}, []);

return (
    <div className="text-white">
    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
);
}

export default Clock;