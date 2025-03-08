import { useEffect, useState } from "react";
import SearchBar from "./components/searchbar";
import "./index.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react";

export function App() {
  const [copyright, setCopyRight] = useState([]);
  const [time, setTime] = useState(new Date());
  const userLanguage = navigator.language.split('-')[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative mb-4 flex flex-row items-end">
          <h1 className="text-4xl font-extrabold">{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
            <p className="text-2xl pb-0.5">:{time.toLocaleTimeString('ko-KR', { second: '2-digit', hour12: false }).padStart(2, '0')}</p>
          
        </div>
        <SearchBar />
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
        <Dialog>
          <DialogTrigger className="flex flex-row gap-1 justify-center items-center text-muted-foreground hover:text-foreground cursor-pointer"><Settings size={16} /><p>Settings</p></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-muted-foreground hover:text-foreground cursor-help">© Bing Wallpaper</p>
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
