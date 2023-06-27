/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  elem;
  #rows;
  #removeActionName = 'remove-row';

  constructor(rows) {
    this.#rows = rows;
    this.elem = this.#render();
  }

  #render() {
    const tableEl = document.createElement('table');
    tableEl.innerHTML = this.#createTableHTML();
    tableEl.addEventListener(
      'click',
      (event) => this.#onRowRemoveClick(event)
    );

    return tableEl;
  }

  #createTableHTML() {
    return `
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Возраст</th>
            <th>Зарплата</th>
            <th>Город</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.#createTbodyHTML()}
        </tbody>
      </table>
    `;
  }

  #createTbodyHTML() {
    return this.#rows
      .map((row) => {
        return `
          <tr>
            <td>${row.name}</td>
            <td>${row.age}</td>
            <td>${row.salary}</td>
            <td>${row.city}</td>
            <td><button data-action="${this.#removeActionName}">X</button></td>
          </tr>
        `;
      })
      .join('\n');
  }

  #onRowRemoveClick(event) {
    if (event.target.dataset.action !== this.#removeActionName) {
      return;
    }

    const row = event.target.closest('tr');
    if (row) {
      row.remove();
    }
  }
}
