import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    const cartItem = this.findById(product.id);

    if (!cartItem) {
      this.cartItems.push({
        product,
        count: 1
      });
    } else {
      cartItem.count += 1;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    const cartItem = this.findById(productId);

    cartItem.count += amount;

    if (cartItem.count < 1) {
      this.cartItems.splice(
        this.cartItems.indexOf(cartItem),
        1
      );
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce(
      (total, cartItem) => total += cartItem.count,
      0
    );
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (total, cartItem) => total += cartItem.product.price * cartItem.count,
      0
    );
  }

  findById(productId) {
    return this.cartItems.find(
      cartProduct => cartProduct.product.id === productId
    );
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    const modalWindow = new Modal();
    this.modalWindow = modalWindow;

    modalWindow.setTitle('Your order');

    const modalBodyEl = document.createElement('div');

    for (let cartItem of this.cartItems) {
      modalBodyEl.append(
        this.renderProduct(cartItem.product, cartItem.count)
      );
    }
    modalBodyEl.append(this.renderOrderForm());

    modalWindow.setBody(modalBodyEl);
    modalWindow.open();

    this.modalBodyEl = modalBodyEl;

    modalBodyEl.addEventListener('click', event => {
      const target = event.target;

      const button = target.closest('.cart-counter__button');

      if (!button) {
        return;
      }

      const amount = button.classList.contains('cart-counter__button_plus') ? 1 : -1;
      const productId = button
        .closest('.cart-product')
        .dataset
        .productId;

      this.updateProductCount(productId, amount);
    });

    const form = modalBodyEl.querySelector('.cart-form');
    form.addEventListener('submit', event => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    const isModalOpened = document.body.classList.contains('is-modal-open');
    if (!isModalOpened) {
      return;
    }

    if (this.getTotalCount() === 0) {
      this.modalWindow.close();
      return;
    }

    const product = cartItem.product;
    const productId = product.id;
    const modalBodyEl = this.modalBodyEl;

    const productCountEl = modalBodyEl.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    const productPriceEl = modalBodyEl.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    const infoPriceEl = modalBodyEl.querySelector(`.cart-buttons__info-price`);

    productCountEl.innerHTML = cartItem.count;
    productPriceEl.innerHTML = `€${(product.price * cartItem.count).toFixed(2)}`;
    infoPriceEl.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
  }

  onSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.classList.add('is-loading');


    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(form)
    }).then(() => {
      this.cartItems = [];

      this.modalWindow.setTitle('Success!');
      this.modalWindow.setBody(createElement(`
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img alt="" src="/assets/images/delivery.gif">
        </p>
      </div>
      `));
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
