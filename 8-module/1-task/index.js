import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  _initialTopCoordinates = 0;

  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');
      this._initialTopCoordinates = this.elem.getBoundingClientRect().top;

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    const isMobile = document.documentElement.clientWidth <= 767;
    const leftIndent = Math.min(
      document.querySelector('.container')?.getBoundingClientRect().right + 20,
      document.documentElement.clientWidth - this.elem.offsetWidth - 10
    ) + 'px';

    if (window.scrollY >= this._initialTopCoordinates && !isMobile) {
      Object.assign(this.elem.style, {
        position: 'fixed',
        top: `${50 + window.scrollY}`,
        zIndex: 1e3,
        right: '10px',
        left: leftIndent
      });
    } else {
      this.elem.style = null;
    }
  }
}
