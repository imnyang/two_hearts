import { useRef, useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ArrowRightIcon, CircleXIcon } from "lucide-react";

export default function SearchBar() {
  const emoji = ["♥️", "🩷", "🧡", "💛", "💚", "💙", "🩵", "💜", "🤎", "🖤", "🩶", "🤍", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"];

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [randomEmoji, setRandomEmoji] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the user's browser language
  const userLanguage = navigator.language.split('-')[0]; // Get just the language code (e.g., 'en' from 'en-US')

  const handleClearInput = () => {
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return; // Don't search if the query is empty

    // Check if the query is a URL
    const urlPattern = /^(https?:\/\/)?((localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3}|[a-fA-F0-9:]+|[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)(:\d+)?)(\/.*)?$/;
    if (urlPattern.test(query)) {
      // If it's a URL, navigate directly to it
      window.location.href = query.startsWith('http') ? query : `http://${query}`;
      return;
    }

    // Otherwise, perform the search
    chrome.search.query({
      text: query,
      disposition: "CURRENT_TAB"
    }, function() {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  };

  // Function to make the request to Google Suggest API
  const fetchSearchSuggestions = (query: string) => {
    if (!query.trim()) return; // Don't fetch if the query is empty
    const searchURL = `https://api.imnya.ng/google/complete?hl=${userLanguage}&q=${encodeURIComponent(query)}`;

    // Make a request to fetch the search suggestions
    fetch(searchURL, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
      .then((response) => response.text()) // We use `.text()` since it's a toolbar API that returns XML
      .then((data) => {
        // Handle the suggestions response here
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const suggestions = Array.from(xmlDoc.getElementsByTagName("suggestion")).map(
          (suggestion) => suggestion.getAttribute("data")
        );
        setSuggestions(suggestions); // Update the suggestions state
      })
      .catch((error) => {
        console.error("Error fetching search suggestions:", error);
      });
  };

  // useEffect to call fetchSearchSuggestions whenever the input changes
  useEffect(() => {
    fetchSearchSuggestions(inputValue);
  }, [inputValue]);

  // useEffect to focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setRandomEmoji(emoji[Math.floor(Math.random() * emoji.length)]);
  }, []);

  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          ref={inputRef}
          className="ps-9 pe-9 bg-background"
          placeholder="Type something..."
          type="text"
          list="suggestions"
          title="Powred by Unduck.link"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent the default behavior
              handleSearch(inputValue);
            }
          }} // Trigger search on Enter key press
        />
        <datalist id="suggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
        <Label className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">{randomEmoji}</Label>

        {inputValue && (
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-6 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear input"
            onClick={handleClearInput}
          >
            <CircleXIcon size={16} aria-hidden="true" />
          </button>
        )}
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          onClick={() => handleSearch(inputValue)}
          type="button"
        >
          <ArrowRightIcon size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
