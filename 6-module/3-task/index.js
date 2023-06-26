import createElement from '../../assets/lib/create-element.js';

const hideEl = el => el.style.display = 'none';
const showEl = el => el.style.display = '';

export default class Carousel {
  get currentSlide () {
    return this.slides[this.currentPosition];
  }

  get slidesNumber() {
    return this.slides.length;
  }

  get isFirstSlide() {
    return this.currentPosition === 0;
  }

  get isLastSlide() {
    return this.currentPosition === this.slidesNumber - 1;
  }

  constructor(slides) {
    this.slides = slides;
    this.currentPosition = 0;

    this.elem = this.#render();

    this.elem.addEventListener('click', event => this.#onArrowClick(event));
    this.elem.addEventListener('click', event => this.#onAddProductClick(event));

    document.addEventListener('DOMContentLoaded', () => {
      this.#updateCarouselState();
    });
  }

  #render() {
    const carouselInnerEl = document.createElement('div');
    carouselInnerEl.classList.add('carousel__inner');

    for (const product of this.slides) {
      const slide = this.#renderSlide(product);
      carouselInnerEl.append(slide);
    }

    const carouselEl = createElement(`
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
        ${carouselInnerEl.outerHTML}
      </div>
    `);

    this.innerEl = carouselEl.querySelector('.carousel__inner');
    this.arrowLeftEl = carouselEl.querySelector('.carousel__arrow_left');
    this.arrowRightEl = carouselEl.querySelector('.carousel__arrow_right');

    this.#updateCarouselState();

    return carouselEl;
  }

  #renderSlide(product) {
    const productID = product.id;
    const productName = product.name;
    const productImage = product.image;
    const productPrice = product.price.toFixed(2);

    return createElement(`
      <div class="carousel__slide" data-id="${productID}">
        <img src="/assets/images/carousel/${productImage}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${productPrice}</span>
          <div class="carousel__title">${productName}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `);
  }

  #updateCarouselInnerOffset() {
    const offset = this.currentPosition * this.innerEl.offsetWidth;
    this.innerEl.style.transform = `translateX(-${offset}px)`;
  }

  #updateCarouselArrowsVisibility() {
    if (this.isFirstSlide) {
      hideEl(this.arrowLeftEl);
    } else {
      showEl(this.arrowLeftEl);
    }

    if (this.isLastSlide) {
      hideEl(this.arrowRightEl);
    } else {
      showEl(this.arrowRightEl);
    }
  }

  #updateCarouselState() {
    this.#updateCarouselArrowsVisibility();
    this.#updateCarouselInnerOffset();
  }

  #onArrowClick(event) {
    const target = event.target;

    if (this.arrowLeftEl.contains(target) && this.currentPosition > 0) {
      this.currentPosition -= 1;
      this.#updateCarouselState();
    } else if (this.arrowRightEl.contains(target) && !this.isLastSlide) {
      this.currentPosition += 1;
      this.#updateCarouselState();
    }
  }

  #onAddProductClick(event) {
    if (!event.target.closest('.carousel__button')) {
      return;
    }

    const currentProductId = this.currentSlide.id;
    const addEvent = new CustomEvent('product-add', {
      detail: currentProductId,
      bubbles: true,
    });

    this.elem.dispatchEvent(addEvent);
  }
}
