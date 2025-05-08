import { useEffect, useState, useCallback } from "react";

function getAverageBrightness(image: HTMLImageElement): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx?.drawImage(image, 0, 0, image.width, image.height);

  const data = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
  let totalBrightness = 0;
  let pixelCount = 0;

  if (data) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // 밝기 계산 공식
      const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      totalBrightness += brightness;
      pixelCount++;
    }
  }

  return pixelCount ? totalBrightness / pixelCount : 0;
}

function analyzeImageBrightness(url: string, setTextColor: (color: string) => void) {
  if (!url) return;
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  img.onload = () => {
    const brightness = getAverageBrightness(img);
    // console.log("Average Brightness: ", brightness);
    setTextColor(brightness > 128 ? "black" : "white");
  };
}

function fetchWallpaperUrl(): string | null {
  const customWallpaper = localStorage.getItem("customWallpaper");
  if (customWallpaper) {
    const customWallpaperURL = localStorage.getItem("customWallpaperURL");
    if (customWallpaperURL) return customWallpaperURL;
    return null;
  }
  return localStorage.getItem("wallpaper");
}

export default function Clock() {
  const [textColor, setTextColor] = useState<string>("");
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour] = useState<boolean>(() => localStorage.getItem("is24Hour") === "true");
  const [disableSecond] = useState<boolean>(() => localStorage.getItem("disableSecond") === "true");

  // 사용자 브라우저 언어 감지
  const locale = navigator.language || "en-US";

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTextColor = useCallback(() => {
    const url = fetchWallpaperUrl();
    if (url) analyzeImageBrightness(url, setTextColor);
  }, []);

  useEffect(() => {
    updateTextColor();
  }, [updateTextColor]);

  const textStyle = textColor
    ? { color: textColor === "black" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }
    : {};

  const timeString = time.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !is24Hour,
  });

  const secondString = time
    .toLocaleTimeString(locale, {
      second: "2-digit",
      hour12: !is24Hour,
    })
    .padStart(2, "0");

  return (
    <div
      className={`relative mb-4 flex flex-col items-center ${textColor ? `text-${textColor}` : ""}`}
      style={textStyle}
    >
      <div className="flex flex-row items-center mb-2">
        <h1 className="text-2xl font-medium">
          {time.toLocaleDateString(locale, {
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </h1>
      </div>
      <div className="flex flex-row items-end">
        <h1 className="text-7xl font-extrabold">{timeString}</h1>
        {!disableSecond && (
          <p className="text-4xl pb-1">:{secondString}</p>
        )}
      </div>
    </div>
  );
}
