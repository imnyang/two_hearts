import { useEffect, useState } from "react";
import SearchBar from "./components/searchbar";
import "./index.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import Clock from "./components/Clock";
import Settings from "./components/Settings";

export function App() {
    const [copyright, setCopyRight] = useState([]);
    const [disableClock] = useState(() => {
        const stored = localStorage.getItem("disableClock");
        return stored === "true";
    });
    const [BingChecked, setBingChecked] = useState(() => {
        return localStorage.getItem("customWallpaper") === "true";
    });
    const [haveCustomWallpaper] = useState(() => {
        return localStorage.getItem("customWallpaperURL") !== null;
    });

    const userLanguage = navigator.language.split('-')[0];

    const fetchWallpaper = async () => {
        if (localStorage.getItem("customWallpaper")) {
            const customWallpaper = localStorage.getItem("customWallpaperURL");
            setBingChecked(true);
            return customWallpaper;
        }

        const cachedWallpaper = localStorage.getItem("wallpaper");
        const cachedCopyRight = localStorage.getItem("copyright");
        const cachedCopyRightLink = localStorage.getItem("copyright_link");
        const cachedDate = localStorage.getItem("wallpaperDate");
        const today = new Date().toISOString().split('T')[0];

        if (cachedWallpaper && cachedCopyRight && cachedCopyRightLink && cachedDate === today) {
            setCopyRight([cachedCopyRight, cachedCopyRightLink]);
            return cachedWallpaper;
        }

        const response = await fetch(`https://bing.biturl.top/?resolution=UHD&format=json&index=0&mkt=${userLanguage}`);
        const data = await response.json();
        const wallpaperUrl = data.url;

        localStorage.setItem("wallpaper", wallpaperUrl);
        localStorage.setItem("copyright", data.copyright);
        localStorage.setItem("copyright_link", data.copyright_link);
        localStorage.setItem("wallpaperDate", today);

        setCopyRight([data.copyright, data.copyright_link]);
        return wallpaperUrl;
    };

    useEffect(() => {
        fetchWallpaper().then((url) => {
            const img = document.querySelector("img") as HTMLImageElement;
            if (img) img.src = url;
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img
                alt="bing-wallpaper"
                className={`object-cover w-full h-full absolute blur-xs transition-opacity duration-500 pointer-events-none select-none ${(BingChecked && !haveCustomWallpaper) ? 'hidden' : 'opacity-0'}`}
                onLoad={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.naturalWidth < 500) {
                        img.src = "http://bingw.jasonzeng.dev/?index=random";
                    } else {
                        img.style.opacity = '1';
                    }
                }}
            />
            <div id="components" className="flex flex-col items-center justify-center h-full gap-y-[70%]">
                {!disableClock && <Clock />}
                <SearchBar />
            </div>
            <div id="toolarea" className="absolute bottom-4 right-4 flex flex-col items-end gap-1 p-2">
                {!BingChecked && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <p className="text-foreground/70 hover:text-foreground cursor-help">© Bing</p>
                            </TooltipTrigger>
                            <TooltipContent align="end">
                                <a href={copyright[1]}>
                                    <p>{copyright[0]}</p>
                                </a>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                <Settings />
            </div>
        </div>
    );
}

export default App;
