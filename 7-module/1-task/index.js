import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  elem = null;
  categories = [];
  currentMenuItemEl = null;
  arrowLeftEl;
  arrowRightEl;
  innerEl;

  constructor(categories) {
    this.categories = categories;

    const menu = this.#render();
    this.elem = menu;

    this.arrowLeftEl = menu.querySelector('.ribbon__arrow_left');
    this.arrowRightEl = menu.querySelector('.ribbon__arrow_right');
    this.innerEl = menu.querySelector('.ribbon__inner');

    menu.addEventListener('click', event => this.#onArrowClick(event));
    menu.addEventListener('click', event => this.#onMenuItemClick(event));
    this.innerEl.addEventListener('scroll', event => this.#onMenuScroll(event));

    document.addEventListener('DOMContentLoaded', () => {
      this.#updateArrowsVisibility();
    });
  }

  #render() {
    const categoriesLinks = this.#renderCategoriesLinks();

    return createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>

        <nav class="ribbon__inner">
          ${categoriesLinks}
        </nav>

        <button class="ribbon__arrow ribbon__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>
    `);
  }

  #renderCategoriesLinks() {
    return this.categories
      .map(category => `<a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`)
      .join('');
  }

  #updateArrowsVisibility() {
    const arrowVisibleClassName = 'ribbon__arrow_visible';
    const isMenuInStartPosition = this.innerEl.scrollLeft <= 0;
    const isMenuInEndPosition = (
      this.innerEl.scrollWidth - this.innerEl.scrollLeft - this.innerEl.clientWidth
    ) < 1;

    if (isMenuInStartPosition) {
      this.arrowLeftEl.classList.remove(arrowVisibleClassName);
    } else {
      this.arrowLeftEl.classList.add(arrowVisibleClassName);
    }

    if (isMenuInEndPosition) {
      this.arrowRightEl.classList.remove(arrowVisibleClassName);
    } else {
      this.arrowRightEl.classList.add(arrowVisibleClassName);
    }
  }

  #onArrowClick(event) {
    const target = event.target;
    const scrollStep = 350;

    if (this.arrowLeftEl.contains(target)) {
      this.innerEl.scrollBy(-scrollStep, 0);
    } else if (this.arrowRightEl.contains(target)) {
      this.innerEl.scrollBy(scrollStep, 0);
    }
  }

  #onMenuScroll() {
    this.#updateArrowsVisibility();
  }

  #onMenuItemClick(event) {
    const menuItemEl = event.target;
    const menuItemClass = '.ribbon__item';
    const activeMenuItemClassName = 'ribbon__item_active';

    if (menuItemEl.closest(menuItemClass) && menuItemEl !== this.currentMenuItemEl) {
      const categoryID = menuItemEl.dataset.id;

      event.preventDefault();

      if (this.currentMenuItemEl) {
        this.currentMenuItemEl.classList.remove(activeMenuItemClassName);
      }
      menuItemEl.classList.add(activeMenuItemClassName);

      this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
        detail: categoryID,
        bubbles: true,
      }));

      this.currentMenuItemEl = menuItemEl;
    }
  }
}
