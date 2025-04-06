import { useEffect, useRef, useState } from "react";
import SearchBar from "./components/searchbar";
import "./index.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import Clock from "./components/Clock";

export function App() {
  const [copyright, setCopyRight] = useState([]);
  const [disableAutocomplete, setDisableAutoComplete] = useState(() => {
    const storedAutoComplete = localStorage.getItem("disableautocomplete");
    return storedAutoComplete === "true";
  });
  const [is24Hour, setIs24Hour] = useState(() => {
    const storedFormat = localStorage.getItem("is24Hour");
    return storedFormat === "true";
  });
  const [BingChecked, setBingChecked] = useState(() => {
    const storedBingChecked = localStorage.getItem("customWallpaper");
    return storedBingChecked === "true";
  });
  const [haveCustomWallpaper, setHaveCustomWallpaper] = useState(() => {
    const storedCustomWallpaper = localStorage.getItem("customWallpaperURL");
    return storedCustomWallpaper !== null;
  });
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (BingChecked === true && inputRef.current) {
      inputRef.current.focus();
    }
  }, [BingChecked]);

  const userLanguage = navigator.language.split('-')[0];

  const handleCheckboxChange = (checked: boolean) => {
    setBingChecked(checked);
    if (!checked) {
      localStorage.removeItem("customWallpaper");
    } else {
      localStorage.setItem("customWallpaper", "true");
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    localStorage.setItem("customWallpaperURL", value);
    localStorage.removeItem("wallpaperDate");
    localStorage.removeItem("copyright");
    localStorage.removeItem("copyright_link");
    setWallpaper(value);
  }

  const fetchWallpaper = async () => {
    const BingWallpaper = localStorage.getItem("customWallpaper");
    if (BingWallpaper) {
      const customWallpaper = localStorage.getItem("customWallpaperURL");
      if (customWallpaper) {
        setWallpaper(customWallpaper);
      }
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

    setCopyRight([data.copyRight, data.copyRightLink]);
    return wallpaperUrl;
  }

  useEffect(() => {
    fetchWallpaper().then((url) => {
      const img = document.querySelector("img") as HTMLImageElement;
      img.src = url;
    });
  }, []);

  console.log("BingChecked", BingChecked);
  console.log("haveCustomWallpaper", haveCustomWallpaper);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img 
      alt="bing-wallpaper" 
      className={`object-cover w-full h-full absolute blur-xs transition-opacity duration-1000 ${(BingChecked && !haveCustomWallpaper) ? 'hidden' : 'opacity-0'}`} 
      onLoad={(e) => {
      const img = e.currentTarget as HTMLImageElement;
      if (img.naturalWidth < 500) {
      img.src = "http://bingw.jasonzeng.dev/?index=random";
      } else {
      img.style.opacity = '1';
      }
      }}
      />
      <div className="flex flex-col items-center justify-center h-full">
        <Clock />

        <SearchBar />
      </div>
      
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 bg-background/1 backdrop-blur-sm rounded-md p-2">
      {!BingChecked && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-muted-foreground hover:text-foreground cursor-help">© Bing</p>
              </TooltipTrigger>
              <TooltipContent align="end">
                <a href={copyright[1]}>
                  <p>{copyright[0]}</p>
                </a>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Dialog>
          <DialogTrigger className="flex flex-row gap-1 justify-center items-center text-muted-foreground hover:text-foreground cursor-pointer"><Settings size={16} /><p>Settings</p></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col mt-4 gap-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={BingChecked}
                      onCheckedChange={handleCheckboxChange}

                    />
                    <div className="grow">
                      <div className="grid gap-2">
                        <Label className="text-foreground">Don't use Bing Backgrond</Label>
                        <p className="text-muted-foreground text-xs">
                          To customize the background, insert a direct link to the image you want.<br/>
                          If you leave this field blank, the default background color will be used.
                        </p>
                      </div>
                      {/* Expandable field */}
                      <div
                        role="region"
                        className="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
                        data-state={BingChecked ? "expanded" : "collapsed"}
                      >
                        <div className="pointer-events-none -m-2 overflow-hidden p-2">
                          <div className="pointer-events-auto mt-3">
                            <Input
                              ref={inputRef}
                              type="text"
                              id="checkbox-11-additional-info"
                              placeholder="Image Direct Link"
                              aria-label="Additional Information"
                              onChange={handleInputChange}
                              defaultValue={wallpaper || ""}
                              disabled={!BingChecked}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  <Checkbox
                    checked={is24Hour}
                    onCheckedChange={(is24HourEvent) => {
                    if (typeof is24HourEvent === "boolean") {
                      setIs24Hour(is24HourEvent);
                    }
                    if (is24HourEvent) {
                    localStorage.setItem("is24Hour", "true");
                    } else {
                    localStorage.removeItem("is24Hour");
                    }
                    }}
                  />
                  <Label className="text-foreground">Use 24 hour time format</Label>
                  </div>
                  <div className="flex items-center gap-2">
                  <Checkbox
                    checked={disableAutocomplete}
                    onCheckedChange={(disableAutocompleteEvent) => {
                    if (typeof disableAutocompleteEvent === "boolean") {
                      setDisableAutoComplete(disableAutocompleteEvent);
                    }
                    if (disableAutocompleteEvent) {
                    localStorage.setItem("disableautocomplete", "true");
                    } else {
                    localStorage.removeItem("disableautocomplete");
                    }
                    }}
                  />
                  <Label className="text-foreground">Disable Auto Search Suggestion</Label>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2">
              <Label className="text-muted-foreground">All settings will be applied when you reopen this tab.</Label>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
