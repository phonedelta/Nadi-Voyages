// Local stand-in for public/api/reviews.php so reviews work with `npm run dev` / `npm run preview`.
// Same contract as the PHP endpoint; data is stored in .data/reviews.json (git-ignored).
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const file = resolve(dirname(fileURLToPath(import.meta.url)), "../.data/reviews.json");
const read = () => {
  try {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
  } catch {
    return [];
  }
};
const clean = (v, max) =>
  String(v ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const send = (res, code, data) => {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
};
const strip = ({ status: _s, ...r }) => r;

function handler(req, res, next) {
  if (!req.url?.startsWith("/api/reviews.php")) return next();
  if (req.method === "GET") {
    const reviews = read()
      .filter((r) => (r.status ?? "published") === "published")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(strip);
    return send(res, 200, { reviews });
  }
  if (req.method !== "POST") return send(res, 405, { success: false });
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 20000) req.destroy();
  });
  req.on("end", () => {
    let input;
    try {
      input = JSON.parse(body);
    } catch {
      return send(res, 400, { success: false, error: "invalid" });
    }
    const review = {
      id: randomBytes(8).toString("hex"),
      name: clean(input.name, 60),
      city: clean(input.city, 60),
      trip: clean(input.trip, 80),
      travelDate: clean(input.travelDate, 7),
      rating: Number.parseInt(input.rating, 10),
      comment: clean(input.comment, 1000),
      createdAt: new Date().toISOString(),
      status: "published",
    };
    if (
      review.name.length < 2 ||
      review.comment.length < 3 ||
      !(review.rating >= 1 && review.rating <= 5) ||
      (review.travelDate && !/^\d{4}-(0[1-9]|1[0-2])$/.test(review.travelDate)) ||
      input.website
    )
      return send(res, 422, { success: false, error: "validation" });
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify([...read(), review], null, 2));
    send(res, 201, { success: true, review: strip(review), status: review.status });
  });
}

export default function reviewsDevApi() {
  return {
    name: "nadi-reviews-dev-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
