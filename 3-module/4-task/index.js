function showSalary(users, age) {
  return users
    .filter(el => el.age <= age)
    .map(user => `${user.name}, ${user.balance}`)
    .join('\n');
}
