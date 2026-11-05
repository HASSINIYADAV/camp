import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "dist");
const config = {
  apiBaseUrl: process.env.API_BASE_URL || "https://camp-1-dufr.onrender.com",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || "",
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, "src"), output, { recursive: true });
const html = await readFile(path.join(root, "index.html"), "utf8");
await writeFile(path.join(output, "index.html"), html, "utf8");
await writeFile(path.join(output, "config.js"), `window.CAMPUS_CONFIG = ${JSON.stringify(config)};\n`, "utf8");
console.log("CampusConnect static site built in frontend/dist");

