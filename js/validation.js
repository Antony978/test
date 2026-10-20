"use strict";

const form = document.getElementById("registerForm");
const successMessage = document.getElementById("successMessage");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  age: document.getElementById("age"),
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Each validator returns an error message, or "" when the value is valid. */
const validators = {
  name(value) {
    if (value.trim() === "") return "Name is required.";
    if (value.trim().length < 3) return "Name must be at least 3 characters.";
    return "";
  },

  email(value) {
    if (value.trim() === "") return "Email is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
    return "";
  },

  password(value) {
    if (value === "") return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return "Password must contain letters and numbers.";
    }
    return "";
  },

  confirmPassword(value) {
    if (value === "") return "Please confirm your password.";
    if (value !== fields.password.value) return "Passwords do not match.";
    return "";
  },

  age(value) {
    if (value.trim() === "") return "Age is required.";
    const age = Number(value);
    if (!Number.isInteger(age)) return "Age must be a whole number.";
    if (age < 18) return "You must be at least 18 years old.";
    if (age > 120) return "Please enter a realistic age.";
    return "";
  },
};

function showError(fieldName, message) {
  const input = fields[fieldName];
  document.getElementById(fieldName + "Error").textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.classList.toggle("valid", message === "");
}

function validateField(fieldName) {
  const message = validators[fieldName](fields[fieldName].value);
  showError(fieldName, message);
  return message === "";
}

function validateAll() {
  let firstInvalid = null;
  Object.keys(fields).forEach((fieldName) => {
    if (!validateField(fieldName) && !firstInvalid) {
      firstInvalid = fields[fieldName];
    }
  });
  if (firstInvalid) firstInvalid.focus();
  return firstInvalid === null;
}

/* Live validation: check when the user leaves a field, then keep checking while typing. */
Object.keys(fields).forEach((fieldName) => {
  const input = fields[fieldName];
  input.addEventListener("blur", () => validateField(fieldName));
  input.addEventListener("input", () => {
    successMessage.hidden = true;
    if (input.classList.contains("invalid") || input.classList.contains("valid")) {
      validateField(fieldName);
    }
    if (fieldName === "password" && fields.confirmPassword.value !== "") {
      validateField("confirmPassword");
    }
  });
});

/* Password strength meter */
const strengthBar = document.querySelector("#strength span");

fields.password.addEventListener("input", () => {
  const value = fields.password.value;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const colors = ["#dc2626", "#f59e0b", "#eab308", "#22c55e"];
  strengthBar.style.width = value ? score * 25 + "%" : "0";
  strengthBar.style.background = colors[Math.max(score - 1, 0)];
});

/* Show / hide password */
const toggleButton = document.getElementById("togglePassword");

toggleButton.addEventListener("click", () => {
  const isHidden = fields.password.type === "password";
  fields.password.type = isHidden ? "text" : "password";
  fields.confirmPassword.type = isHidden ? "text" : "password";
  toggleButton.textContent = isHidden ? "Hide" : "Show";
  toggleButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

/* Block submission when anything is invalid */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.hidden = true;

  if (!validateAll()) return; // invalid -> stop here, form is NOT sent

  successMessage.hidden = false;
  form.reset();
  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].classList.remove("valid", "invalid");
  });
  strengthBar.style.width = "0";
});
