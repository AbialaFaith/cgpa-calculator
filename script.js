"use strict";

const formContainer = document.getElementById("form-container");
const addCourse = document.getElementById("add-course");
const calculateBtn = document.getElementById("calculate-cgpa");
const resultDiv = document.getElementById("cgpa-result");
const gradingScaleSelect = document.getElementById("grading-scale");

const gradingScales = {
  "4-scale": {
    A: 4.0,
    B: 3.5,
    C: 3.0,
    D: 2.5,
    E: 2.0,
    F: 0,
  },
  "5-scale": {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
  },
};

// Update row numbers
function updateRowNumbers() {
  const rows = formContainer.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.querySelector(".row-number").textContent = index + 1;
  });
}

// Create a new row
function createRow() {
  const tr = document.createElement("tr");

  //   Create Number Column
  const tdNumber = document.createElement("td");
  tdNumber.classList.add("row-number");
  tr.appendChild(tdNumber);

  //   Course Title field
  const tdCourse = document.createElement("td");
  const courseInput = document.createElement("input");
  courseInput.type = "text";
  tdCourse.appendChild(courseInput);
  tr.appendChild(tdCourse);

  //   Grade Dropdown field
  const tdGrade = document.createElement("td");
  const gradeSelect = document.createElement("select");
  gradeSelect.required = true;
  const grades = ["", "A", "B", "C", "D", "E", "F"];
  grades.forEach((grade) => {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = grade === "" ? "Select Grade" : grade;
    gradeSelect.appendChild(option);
  });
  tdGrade.appendChild(gradeSelect);
  tr.appendChild(tdGrade);

  //   Credit Units field
  const tdUnits = document.createElement("td");
  const unitInput = document.createElement("input");
  unitInput.type = "number";
  unitInput.min = 1;
  unitInput.required = true;
  tdUnits.appendChild(unitInput);
  tr.appendChild(tdUnits);

  //   Remove button
  const tdRemove = document.createElement("td");
  const removeBtn = document.createElement("button");
  removeBtn.type = "button"; // to prevent default form submission
  removeBtn.textContent = "Remove";

  removeBtn.addEventListener("click", () => {
    tr.remove();
    updateRowNumbers();
  });
  tdRemove.appendChild(removeBtn);
  tr.appendChild(tdRemove);

  return tr;
}

//   Add Course button event
addCourse.addEventListener("click", () => {
  const rows = formContainer.querySelectorAll("tr");
  const lastRow = rows[rows.length - 1];
  const grade = lastRow.querySelector("select").value;
  const unit = lastRow.querySelector("input[type='number']").value;

  if (!grade || !unit || parseInt(unit, 10) <= 0) {
    alert("Please enter a valid grade and/or credit unit.");
    return;
  }

  const newRow = createRow();
  formContainer.appendChild(newRow);
  updateRowNumbers();
});

// Get form data
function getFormData() {
  const rows = formContainer.querySelectorAll("tr");
  const grades = [];
  const units = [];

  rows.forEach((row) => {
    const grade = row.querySelector("select").value;
    const unit = row.querySelector("input[type='number']").value;

    if (grade && unit) {
      grades.push(grade);
      units.push(parseInt(unit, 10));
    }
  });

  return { grades, units };
}

// Calculate Totals
function calculateTotals(grades, units, scaleMapping) {
  let totalCreditUnits = 0;
  let totalQualityPoints = 0;

  grades.forEach((grade, index) => {
    const unit = units[index];
    const gradePoint = scaleMapping[grade];

    if (gradePoint !== undefined) {
      totalCreditUnits += unit;
      totalQualityPoints += gradePoint * unit;
    }
  });

  return { totalCreditUnits, totalQualityPoints };
}

// Compute CGPA
function computeCGPA(totalQualityPoints, totalCreditUnits) {
  return totalCreditUnits > 0
    ? (totalQualityPoints / totalCreditUnits).toFixed(2)
    : "0.00";
}

// Calculate CGPA
function calculateCGPA() {
  const { grades, units } = getFormData();
  const selectedScale = gradingScaleSelect.value;
  const scaleMapping = gradingScales[selectedScale];

  const { totalCreditUnits, totalQualityPoints } = calculateTotals(
    grades,
    units,
    scaleMapping
  );
  const cgpa = computeCGPA(totalQualityPoints, totalCreditUnits);

  resultDiv.innerHTML = `Your CGPA is: <span class="cgpa-value">${cgpa}</span>`;
}

// Calculate CGPA button event
calculateBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent default form submission
  calculateCGPA();
});
