# Web Forms & Data Table

Two small front-end pages built with plain HTML, CSS and JavaScript (each in its own file).

## Pages

| Page | Files | Description |
|------|-------|-------------|
| Registration Form | `validation.html`, `validation.css`, `validation.js` | Form with Name, Email, Password, Confirm password and Age. JavaScript validates every field, shows a short error under the field, and blocks submission when anything is invalid. |
| Data Table | `data.html`, `data.css`, `data.js` | Array of objects rendered as a table by JavaScript, with live search (filters while typing) and sort buttons (name, age, city; click again to reverse). |

## Run
Open `validation.html` or `data.html` in any browser. No build step or dependencies needed.

## Upload to GitHub
```bash
git init
git add .
git commit -m "Add registration form validation and searchable/sortable data table"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
