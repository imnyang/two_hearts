import { useEffect, useState } from "react";

export default function Clock() {
    const [textColor, setTextColor] = useState("");
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

      // 밝기 분석 함수
  const getAverageBrightness = (image: HTMLImageElement) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0, image.width, image.height);

    let data = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
    let totalBrightness = 0;
    let pixelCount = 0;

    if (data) {
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];     // Red
        let g = data[i + 1]; // Green
        let b = data[i + 2]; // Blue
        // 평균 밝기 계산 (Simple Brightness Formula)
        let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        totalBrightness += brightness;
        pixelCount++;
      }
    }

    let avgBrightness = totalBrightness / pixelCount;
    return avgBrightness;
  };

  // 배경 이미지의 밝기를 분석하고 텍스트 색상 설정
  const analyzeImageBrightness = (url: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow cross-origin image loading
    img.src = url;
    img.onload = () => {
      const brightness = getAverageBrightness(img);
      console.log("Average Brightness: ", brightness); // 밝기 값 로그 찍기

      // 밝기에 따라 텍스트 색상 결정
      if (brightness > 128) { // 밝기가 128 이상이면 텍스트는 어두운 색(검정)
        setTextColor("black");
      } else { // 밝기가 128 미만이면 텍스트는 밝은 색(흰색)
        setTextColor("white");
      }
    };
  };

    // 이미지 URL을 가져와서 밝기 분석 함수 호출

    const fetchImageUrl = () => {
        // get local storage value
        const customWallpaper = localStorage.getItem("customWallpaper");
        if (customWallpaper) {
          const customWallpaperURL = localStorage.getItem("customWallpaperURL");
          if (customWallpaperURL) {
            analyzeImageBrightness(customWallpaperURL);
          }
          return;
        }
        const cachedWallpaper = localStorage.getItem("wallpaper");

        analyzeImageBrightness(cachedWallpaper || "");
    };

    useEffect(() => {
        fetchImageUrl();
    }, []);

    return (
        <div className={`relative mb-4 flex flex-col items-center`} style={textColor ? { color: textColor } : {}}>
            <div className={`flex flex-row items-end`} style={textColor ? { color: textColor } : {}}>
                <h1 className={`text-4xl font-extrabold`} style={textColor ? { color: textColor } : {}}>
                    {time.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: !is24Hour,
                    })}
                </h1>
                <p className={`text-2xl pb-0.5`} style={textColor ? { color: textColor } : {}}>
                    :{time.toLocaleTimeString('ko-KR', {
                        second: '2-digit',
                        hour12: !is24Hour,
                    }).padStart(2, '0')}
                </p>
            </div>
        </div>
    );
}