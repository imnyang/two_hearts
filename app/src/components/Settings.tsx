import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Settings as SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function Settings() {
    const [wallpaper, setWallpaper] = useState<string | null>(null);

    const [disableSecond, setDisableSecond] = useState(() => {
        const storedFormat = localStorage.getItem("disableSecond");
        return storedFormat === "true";
    });

    const [BingChecked, setBingChecked] = useState(() => {
        const storedBingChecked = localStorage.getItem("customWallpaper");
        return storedBingChecked === "true";
    });
    const [disableAutocomplete, setDisableAutoComplete] = useState(() => {
        const storedAutoComplete = localStorage.getItem("disableautocomplete");
        return storedAutoComplete === "true";
    });
    const [is24Hour, setIs24Hour] = useState(() => {
        const storedFormat = localStorage.getItem("is24Hour");
        return storedFormat === "true";
    });

    const [disableClock, setDisableClock] = useState(() => {
        const storedClock = localStorage.getItem("disableClock");
        return storedClock === "true";
    });

    const handleCheckboxChange = (checked: boolean) => {
        setBingChecked(checked);
        if (!checked) {
            localStorage.removeItem("customWallpaper");
        } else {
            localStorage.setItem("customWallpaper", "true");
        }
    }
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        localStorage.setItem("customWallpaperURL", value);
        localStorage.removeItem("wallpaperDate");
        localStorage.removeItem("copyright");
        localStorage.removeItem("copyright_link");
        setWallpaper(value);
    }

    useEffect(() => {
        if (BingChecked === true && inputRef.current) {
            inputRef.current.focus();
        }
    }, [BingChecked]);


    return (
        <Dialog>
            <DialogTrigger className="flex flex-row gap-1 justify-center items-center text-foreground/70 hover:text-foreground cursor-pointer"><SettingsIcon size={16} /><p>Settings</p></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col mt-4 gap-4">
                            <div className="flex items-start gap-2" id="BingWallpaper">
                                <Checkbox
                                    checked={BingChecked}
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <div className="grow">
                                    <div className="grid gap-2">
                                        <Label className="text-foreground">Don't use Bing Backgrond</Label>
                                        <p className="text-muted-foreground text-xs">
                                            To customize the background, insert a direct link to the image you want.<br />
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
                            <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2"  id="is24Hour">
                                    <Checkbox
                                        checked={disableClock}
                                        onCheckedChange={(disableClockEvent) => {
                                            if (typeof disableClockEvent === "boolean") {
                                                setDisableClock (disableClockEvent);
                                            }
                                            if (disableClockEvent) {
                                                localStorage.setItem("disableClock", "true");
                                            } else {
                                                localStorage.removeItem("disableClock");
                                            }
                                        }}
                                    />
                                    <Label className="text-foreground">Disable Clock</Label>
                                </div>
                                {!disableClock && (
                                    <div className="flex flex-col gap-4 pl-8">
                                        <div className="flex items-center gap-2"  id="disableSeconds">
                                            <Checkbox
                                                checked={disableSecond}
                                                onCheckedChange={(disableSecondEvent) => {
                                                    if (typeof disableSecondEvent === "boolean") {
                                                        setDisableSecond(disableSecondEvent);
                                                    }
                                                    if (disableSecondEvent) {
                                                        localStorage.setItem("disableSecond", "true");
                                                    } else {
                                                        localStorage.removeItem("disableSecond");
                                                    }
                                                }}
                                            />
                                            <Label className="text-foreground">Disable Second</Label>
                                        </div>
                                        <div className="flex items-center gap-2"  id="is24Hour">
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
                                    </div>
                                )}
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
    );
}