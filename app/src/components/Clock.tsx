import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState(new Date());
    const [is24Hour, setIs24Hour] = useState(() => {
        const storedFormat = localStorage.getItem("is24Hour");
        return storedFormat === "true";
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative mb-4 flex flex-col items-center">
            <div className="flex flex-row items-end">
                <h1 className="text-4xl font-extrabold">
                    {time.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: !is24Hour,
                    })}
                </h1>
                <p className="text-2xl pb-0.5">
                    :{time.toLocaleTimeString('ko-KR', {
                        second: '2-digit',
                        hour12: !is24Hour,
                    }).padStart(2, '0')}
                </p>
            </div>
        </div>
    );
}