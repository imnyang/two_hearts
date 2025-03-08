import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/search": async (req) => {
      const query = new URL(req.url).searchParams.get("q");
      const language = new URL(req.url).searchParams.get("hl") || "en";
      if (!query) {
        return new Response("Missing query parameter", { status: 400 });
      }

      const response = await fetch(
        `https://suggestqueries.google.com/complete/search?output=toolbar&hl=${language}&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        return new Response("Failed to fetch suggestions", { status: response.status });
      }

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const suggestions = Array.from(xmlDoc.getElementsByTagName("suggestion")).map(
        (suggestion) => suggestion.getAttribute("data")
      );

      return new Response(JSON.stringify(suggestions), {
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
