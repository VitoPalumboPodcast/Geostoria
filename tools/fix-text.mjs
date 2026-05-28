import fs from "node:fs/promises";

const files = [
  "index.html",
  "app.js",
  "events.js",
  "map.js",
  "timeline.js",
  "style.css",
  "run-server.ps1"
];

const replacements = [
  ["Ã ", "à"],
  ["Ã¨", "è"],
  ["Ã©", "é"],
  ["Ã¬", "ì"],
  ["Ã²", "ò"],
  ["Ã¹", "ù"],
  ["Ã€", "À"],
  ["Ãˆ", "È"],
  ["Ã‰", "É"],
  ["ÃŒ", "Ì"],
  ["Ã’", "Ò"],
  ["Ã™", "Ù"],
  ["Â·", "·"],
  ["â€“", "–"],
  ["â€”", "—"],
  ["â€˜", "'"],
  ["â€™", "'"],
  ["â€œ", "\""],
  ["â€", "\""],
  ["â€¦", "…"]
];

for (const file of files) {
  let text = await fs.readFile(file, "utf8");
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  await fs.writeFile(file, text, "utf8");
}
