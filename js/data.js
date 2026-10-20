"use strict";

/* 1) The data: an array of objects */
const people = [
  { name: "Ahmed Hassan", age: 28, city: "Cairo", job: "Software Engineer" },
  { name: "Sara Ali", age: 24, city: "Alexandria", job: "Graphic Designer" },
  { name: "Omar Khaled", age: 35, city: "Giza", job: "Accountant" },
  { name: "Mona Ibrahim", age: 31, city: "Mansoura", job: "Doctor" },
  { name: "Youssef Adel", age: 22, city: "Cairo", job: "Student" },
  { name: "Laila Mahmoud", age: 40, city: "Aswan", job: "Teacher" },
  { name: "Karim Samir", age: 27, city: "Luxor", job: "Photographer" },
  { name: "Nour Tarek", age: 29, city: "Alexandria", job: "Marketing Manager" },
  { name: "Hana Mostafa", age: 33, city: "Tanta", job: "Pharmacist" },
  { name: "Mahmoud Fathy", age: 45, city: "Giza", job: "Architect" },
  { name: "Dina Reda", age: 26, city: "Cairo", job: "Data Analyst" },
  { name: "Tamer Nabil", age: 38, city: "Port Said", job: "Civil Engineer" },
];

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const sortButtons = document.querySelectorAll(".sort-btn");

const state = {
  query: "",
  sortKey: null,
  direction: "asc",
};

/* Escape special regex characters so the search text is treated literally */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Create a text node, wrapping the matching part in <mark> */
function buildHighlightedCell(cell, text, query) {
  cell.textContent = "";
  if (!query) {
    cell.textContent = text;
    return;
  }
  const parts = String(text).split(new RegExp("(" + escapeRegex(query) + ")", "i"));
  parts.forEach((part) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      const mark = document.createElement("mark");
      mark.textContent = part;
      cell.appendChild(mark);
    } else {
      cell.appendChild(document.createTextNode(part));
    }
  });
}

/* 2) Get the data to show: filter first, then sort */
function getVisiblePeople() {
  const query = state.query.trim().toLowerCase();

  let result = people.filter((person) =>
    [person.name, person.city, person.job, String(person.age)]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  if (state.sortKey) {
    const key = state.sortKey;
    const factor = state.direction === "asc" ? 1 : -1;
    result = [...result].sort((a, b) => {
      if (typeof a[key] === "number") return (a[key] - b[key]) * factor;
      return a[key].localeCompare(b[key]) * factor;
    });
  }

  return result;
}

/* 3) Build the table rows with JavaScript */
function renderTable() {
  const rows = getVisiblePeople();
  const query = state.query.trim();

  tableBody.innerHTML = "";

  rows.forEach((person, index) => {
    const tr = document.createElement("tr");

    const indexCell = document.createElement("td");
    indexCell.textContent = index + 1;

    const nameCell = document.createElement("td");
    buildHighlightedCell(nameCell, person.name, query);

    const ageCell = document.createElement("td");
    buildHighlightedCell(ageCell, person.age, query);

    const cityCell = document.createElement("td");
    buildHighlightedCell(cityCell, person.city, query);

    const jobCell = document.createElement("td");
    buildHighlightedCell(jobCell, person.job, query);

    tr.append(indexCell, nameCell, ageCell, cityCell, jobCell);
    tableBody.appendChild(tr);
  });

  emptyMessage.hidden = rows.length > 0;
  resultCount.textContent = `Showing ${rows.length} of ${people.length} people`;
}

function updateSortButtons() {
  sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === state.sortKey;
    button.classList.toggle("active", isActive);
    button.querySelector(".arrow").textContent = isActive
      ? state.direction === "asc" ? "▲" : "▼"
      : "";
  });
}

/* 4) Search while typing (no button needed) */
searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  renderTable();
});

/* 5) Sort buttons: click again to reverse the order */
sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.sort;
    if (state.sortKey === key) {
      state.direction = state.direction === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.direction = "asc";
    }
    updateSortButtons();
    renderTable();
  });
});

renderTable();
