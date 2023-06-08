function sumSalary(salaries) {
  let sum = 0;

  for (const key in salaries) {
    const keyValue = salaries[key];

    if (Number.isFinite(keyValue)) {
      sum += keyValue;
    }
  }

  return sum;
}
