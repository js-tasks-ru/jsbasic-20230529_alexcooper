function makeFriendsList(friends) {
  const ulEl = document.createElement('ul');

  for (const friend of friends) {
    const liEl = document.createElement('li');
    liEl.textContent = `${friend.firstName} ${friend.lastName}`;

    ulEl.append(liEl);
  }

  return ulEl;
}
