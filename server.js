/*
 * CleanConnect – polished two‑form demo app
 * -------------------------------------------------------
 * Bootstrap 5 styling, gradient hero, responsive forms.
 *
 * Endpoints:
 *   GET  /             – Landing page
 *   GET  /cleaner      – Cleaner signup form
 *   POST /cleaner      – Receives cleaner data
 *   GET  /homeowner    – Homeowner request form
 *   POST /homeowner    – Receives homeowner data
 *
 * Quick start:
 *   npm install
 *   node server.js
 */

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // optional static dir

// ---------------------------------------------------------------------------
// In‑memory data stores (demo only)
// ---------------------------------------------------------------------------
const cleaners = [];
const homeowners = [];

// ---------------------------------------------------------------------------
// HTML template helpers
// ---------------------------------------------------------------------------
function pageTemplate(title, body) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title} – CleanConnect</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        <style>
          body { background-color:#f8f9fa; }
          .hero {
            background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
            color: #fff;
            padding: 5rem 1rem;
            text-align:center;
          }
        </style>
      </head>
      <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
            <a class="navbar-brand fw-semibold" href="/">CleanConnect</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBar" aria-controls="navBar" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navBar">
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="/cleaner">For Cleaners</a></li>
                <li class="nav-item"><a class="nav-link" href="/homeowner">For Homeowners</a></li>
              </ul>
            </div>
          </div>
        </nav>

        ${body}

        <footer class="py-4 bg-light mt-5">
          <div class="container text-center small text-muted">
            © ${new Date().getFullYear()} CleanConnect
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
      </body>
    </html>
  `;
}

function homePage() {
  return pageTemplate("Home", `
    <section class="hero">
      <h1 class="display-4 fw-bold mb-3">Connect Cleaners & Homeowners</h1>
      <p class="lead mb-4">Fast, simple forms to match cleaning pros with people who need them.</p>
      <a href="/cleaner" class="btn btn-light btn-lg me-3">I'm a Cleaner</a>
      <a href="/homeowner" class="btn btn-outline-light btn-lg">I Need Cleaning</a>
    </section>
  `);
}

function cleanerForm() {
  return pageTemplate("Cleaner Registration", `
    <div class="container my-5">
      <h2 class="mb-4">Professional Cleaner Registration</h2>
      <form class="row g-3 needs-validation" method="POST" action="/cleaner" novalidate>
        <div class="col-md-6">
          <label class="form-label">Name</label>
          <input class="form-control" name="name" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Phone</label>
          <input class="form-control" name="phone" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">City</label>
          <input class="form-control" name="city" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Availability</label>
          <input class="form-control" name="availability" placeholder="e.g. Weekdays 9‑17" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Rate per hour (€)</label>
          <input type="number" step="0.01" class="form-control" name="ratePerHour" required>
        </div>
        <div class="col-12">
          <button class="btn btn-primary btn-lg" type="submit">Submit</button>
        </div>
      </form>
    </div>
  `);
}

function homeownerForm() {
  return pageTemplate("Cleaning Request", `
    <div class="container my-5">
      <h2 class="mb-4">Request Home Cleaning</h2>
      <form class="row g-3 needs-validation" method="POST" action="/homeowner" novalidate>
        <div class="col-md-6">
          <label class="form-label">Name</label>
          <input class="form-control" name="name" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Phone</label>
          <input class="form-control" name="phone" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" required>
        </div>
        <div class="col-12">
          <label class="form-label">Address</label>
          <input class="form-control" name="address" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">City</label>
          <input class="form-control" name="city" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Bedrooms</label>
          <input type="number" min="1" class="form-control" name="bedrooms" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Date needed</label>
          <input type="date" class="form-control" name="dateNeeded" required>
        </div>
        <div class="col-12">
          <label class="form-label">Special instructions</label>
          <textarea class="form-control" name="notes" rows="4"></textarea>
        </div>
        <div class="col-12">
          <button class="btn btn-primary btn-lg" type="submit">Submit</button>
        </div>
      </form>
    </div>
  `);
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get("/", (_, res) => res.send(homePage()));

app.get("/cleaner", (_, res) => res.send(cleanerForm()));
app.post("/cleaner", (req, res) => {
  cleaners.push(req.body);
  console.log("[Cleaner] New submission:", req.body);
  res.send(pageTemplate("Thank you", `
    <div class="container py-5 text-center">
      <h2 class="mb-3">Thank you!</h2>
      <p>Your cleaner profile has been submitted successfully.</p>
      <a class="btn btn-primary mt-3" href="/">Back to Home</a>
    </div>
  `));
});

app.get("/homeowner", (_, res) => res.send(homeownerForm()));
app.post("/homeowner", (req, res) => {
  homeowners.push(req.body);
  console.log("[Homeowner] New submission:", req.body);
  res.send(pageTemplate("Thank you", `
    <div class="container py-5 text-center">
      <h2 class="mb-3">Thank you!</h2>
      <p>Your cleaning request has been submitted successfully.</p>
      <a class="btn btn-primary mt-3" href="/">Back to Home</a>
    </div>
  `));
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => console.log(`✅  Server running at http://localhost:${PORT}`));
