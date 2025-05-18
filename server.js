/*
 * Simple Node/Express webapp with two form endpoints.
 * --------------------------------------------------
 * Endpoints:
 *   GET  /             – Landing page with links to forms
 *   GET  /cleaner      – Form for professional cleaners
 *   POST /cleaner      – Receives cleaner form data (JSON or url‑encoded)
 *   GET  /homeowner    – Form for homeowners
 *   POST /homeowner    – Receives homeowner form data
 *
 * Quick start:
 *   1. mkdir home‑cleaning‑forms && cd home‑cleaning‑forms
 *   2. npm init -y
 *   3. npm install express body-parser
 *   4. node server.js    # then browse to http://localhost:3000
 *
 * Data persistence:
 *   For demo purposes submissions are kept in memory (cleaners[], homeowners[]).
 *   Replace these arrays with a real database for production use.
 */

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware -----------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false })); // parse <form method="POST" enctype="application/x-www-form-urlencoded">
app.use(bodyParser.json());                          // parse JSON bodies

// --- In‑memory data stores (demo only) ------------------------------------
const cleaners = [];   // [{ name, phone, email, city, availability, ratePerHour }]
const homeowners = []; // [{ name, phone, email, address, city, dateNeeded, bedrooms, notes }]

// --- Helper functions -----------------------------------------------------
function pageTemplate(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; }
      h1   { margin-bottom: 1rem; }
      form { display: grid; gap: 0.75rem; max-width: 420px; }
      label { display: flex; flex-direction: column; font-weight: 600; }
      input, textarea, select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; }
      button { padding: 0.6rem 1rem; border: 0; border-radius: 6px; cursor: pointer; font-weight: 600; }
      nav a { margin-right: 1rem; }
    </style>
  </head>
  <body>
    <nav><a href="/">Home</a></nav>
    ${body}
  </body>
</html>`;
}

function cleanerForm() {
  return pageTemplate("Cleaner Registration", `
    <h1>Professional Cleaner – Registration</h1>
    <form method="POST" action="/cleaner">
      <label>Name <input name="name" required /></label>
      <label>Phone <input name="phone" required /></label>
      <label>Email <input type="email" name="email" required /></label>
      <label>City <input name="city" required /></label>
      <label>Availability <input name="availability" placeholder="e.g. Weekdays 9‑17" required /></label>
      <label>Rate per hour (€) <input type="number" step="0.01" name="ratePerHour" required /></label>
      <button type="submit">Submit</button>
    </form>
  `);
}

function homeownerForm() {
  return pageTemplate("Homeowner Request", `
    <h1>Homeowner – Cleaning Request</h1>
    <form method="POST" action="/homeowner">
      <label>Name <input name="name" required /></label>
      <label>Phone <input name="phone" required /></label>
      <label>Email <input type="email" name="email" required /></label>
      <label>Address <input name="address" required /></label>
      <label>City <input name="city" required /></label>
      <label>Bedrooms <input type="number" name="bedrooms" min="1" required /></label>
      <label>Date needed <input type="date" name="dateNeeded" required /></label>
      <label>Special instructions <textarea name="notes" rows="4"></textarea></label>
      <button type="submit">Submit</button>
    </form>
  `);
}

// --- Routes ---------------------------------------------------------------
app.get("/", (_, res) => {
  res.send(pageTemplate("Home", `
    <h1>Home Cleaning Forms</h1>
    <p>Select an option below:</p>
    <nav>
      <a href="/cleaner">I am a Professional Cleaner</a>
      <a href="/homeowner">I am a Homeowner</a>
    </nav>
  `));
});

app.get("/cleaner", (_, res) => res.send(cleanerForm()));
app.post("/cleaner", (req, res) => {
  cleaners.push(req.body);
  console.log("[Cleaner] New submission:", req.body);
  res.send(pageTemplate("Thank you", `<h1>Thank you!</h1><p>Your cleaner profile has been submitted.</p><a href="/">Back to home</a>`));
});

app.get("/homeowner", (_, res) => res.send(homeownerForm()));
app.post("/homeowner", (req, res) => {
  homeowners.push(req.body);
  console.log("[Homeowner] New submission:", req.body);
  res.send(pageTemplate("Thank you", `<h1>Thank you!</h1><p>Your cleaning request has been submitted.</p><a href="/">Back to home</a>`));
});

// --- Start server ---------------------------------------------------------
app.listen(PORT, () => console.log(`✅  Server running at http://localhost:${PORT}`));
