import createElement from '../../assets/lib/create-element.js';

export default class ProductCard {
  elem;
  #product;
  #productAddEvent;

  constructor(product) {
    this.#product = product;
    this.#productAddEvent = new CustomEvent('product-add', {
      detail: product.id,
      bubbles: true,
    });

    this.elem = this.#render();
    this.elem.addEventListener('click', (event) => this.#onAddProductClick(event));
  }

  #render() {
    const product = this.#product;
    const productPrice = product.price.toFixed(2);

    return createElement(`
      <div class="card">
        <div class="card__top">
            <img src="/assets/images/products/${product.image}" class="card__image" alt="product">
            <span class="card__price">€${productPrice}</span>
        </div>
        <div class="card__body">
            <div class="card__title">${product.name}</div>
            <button type="button" class="card__button">
                <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
        </div>
      </div>
    `);
  }

  #onAddProductClick(event) {
    if (event.target.className !== 'card__button') {
      return;
    }

    this.#dispatchProductAddEvent();
  }

  #dispatchProductAddEvent() {
    this.elem.dispatchEvent(this.#productAddEvent);
  }
}
