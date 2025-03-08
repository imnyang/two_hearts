import { useEffect, useState } from "react";
import SearchBar from "./components/searchbar";
import "./index.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";

export function App() {
  const [copyright, setCopyRight] = useState([]);
  const userLanguage = navigator.language.split('-')[0]; // Get just the language code (e.g., 'en' from 'en-US')

  const fetchWallpaper = async () => {
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

    setCopyRight([data.copyRight, data.copyRightLink]);
    return wallpaperUrl;
  }

  useEffect(() => {
    fetchWallpaper().then((url) => {
      const img = document.querySelector("img") as HTMLImageElement;
      img.src = url;
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img 
      alt="bing-wallpaper" 
      className="object-cover w-full h-full absolute blur-xs transition-opacity duration-1000 opacity-0" 
      onLoad={(e) => {
      const img = e.currentTarget as HTMLImageElement;
      if (img.naturalWidth < 1920) {
        img.src = "http://bingw.jasonzeng.dev/?index=random";
      } else {
        img.style.opacity = '1';
      }
      }}
      />
      <SearchBar />
      <div className="absolute bottom-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p>© Bing Wallpaper</p>
            </TooltipTrigger>
            <TooltipContent align="end">
              <a href={copyright[1]}>
                <p>{copyright[0]}</p>
              </a>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default App;
