function highlight(table) {
  for (const row of table.tBodies[0].rows) {
    const ageCell = row.cells[1];
    const genderCell = row.cells[2];
    const statusCell = row.cells[3];

    // Availability
    if (statusCell.dataset.available === 'true') {
      row.classList.add('available');
    } else if (statusCell.dataset.available === 'false') {
      row.classList.add('unavailable');
    } else {
      row.hidden = true;
    }

    // Gender
    if (genderCell.textContent === 'm') {
      row.classList.add('male');
    } else if (genderCell.textContent === 'f') {
      row.classList.add('female');
    }

    // Age
    if (parseInt(ageCell.textContent) < 18) {
      row.style.textDecoration = 'line-through';
    }
  }
}
