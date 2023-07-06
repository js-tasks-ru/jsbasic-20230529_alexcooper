import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    this.renderCarousel();

    const ribbonMenu = this.renderRibbonMenu();
    const stepSlider = this.renderStepSlider();
    const cartIcon = this.renderCartIcon();

    const cart = new Cart(cartIcon);

    const products = await this.fetchProducts();
    const productsGrid = this.renderProductsGrid(products);

    // Default filter
    productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: stepSlider.value,
      category: ribbonMenu.currentCategoryId,
    });

    document.body.addEventListener('product-add', ({ detail: productId }) => {
      const product = products.find(product => product.id === productId);
      cart.addProduct(product);
    });

    stepSlider.elem.addEventListener('slider-change', ({ detail: spiciness }) => {
      productsGrid.updateFilter({
        maxSpiciness: spiciness,
      });
    });

    ribbonMenu.elem.addEventListener('ribbon-select', ({ detail: categoryId }) => {
      productsGrid.updateFilter({
        category: categoryId,
      });
    });

    const nutsCheckboxElement = document.getElementById('nuts-checkbox');
    nutsCheckboxElement
      .addEventListener('change', () => {
        productsGrid.updateFilter({
          noNuts: nutsCheckboxElement.checked,
        });
      });

    const vegetarianCheckboxElement = document.getElementById('vegeterian-checkbox');
    vegetarianCheckboxElement.addEventListener('change', () => {
      productsGrid.updateFilter({
        vegeterianOnly: vegetarianCheckboxElement.checked,
      });
    });
  }

  renderCarousel() {
    const carouselElement = new Carousel(slides).elem;

    document
      .querySelector('[data-carousel-holder]')
      .append(carouselElement);
  }

  renderRibbonMenu() {
    const ribbonMenu = new RibbonMenu(categories);

    document
      .querySelector('[data-ribbon-holder]')
      .append(ribbonMenu.elem);

    return ribbonMenu;
  }

  renderStepSlider() {
    const stepSlider = new StepSlider({
      steps: 5,
      value: 3,
    });

    document
      .querySelector('[data-slider-holder]')
      .append(stepSlider.elem);

    return stepSlider;
  }

  renderCartIcon() {
    const cartItem = new CartIcon();

    document
      .querySelector('[data-cart-icon-holder]')
      .append(cartItem.elem);

    return cartItem;
  }

  renderProductsGrid(products) {
    const productsGrid = new ProductsGrid(products);

    document
      .querySelector('[data-products-grid-holder]')
      .replaceChildren(productsGrid.elem);

    return productsGrid;
  }

  async fetchProducts() {
    return await fetch('products.json')
      .then(response => response.json());
  }
}
