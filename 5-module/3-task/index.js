function initCarousel() {
  const hideEl = el => el.style.display = 'none';
  const showEl = el => el.style.display = '';

  const carouselEl = document.querySelector('.carousel');
  const carouselInnerEl = carouselEl.querySelector('.carousel__inner');
  const carouselArrowLeftEl = carouselEl.querySelector('.carousel__arrow_left');
  const carouselArrowRightEl = carouselEl.querySelector('.carousel__arrow_right');

  let currentSlideNumber = 1;
  const carouselSlidesNumber = carouselInnerEl.children.length;

  const updateCarouselInnerOffset = () => {
    const offset = (currentSlideNumber - 1) * carouselInnerEl.offsetWidth;
    carouselInnerEl.style.transform = `translateX(-${offset}px)`;
  };

  const updateCarouselArrowVisibility = () => {
    if (currentSlideNumber === 1) {
      hideEl(carouselArrowLeftEl);
    } else {
      showEl(carouselArrowLeftEl);
    }

    if (currentSlideNumber === carouselSlidesNumber) {
      hideEl(carouselArrowRightEl);
    } else {
      showEl(carouselArrowRightEl);
    }
  };

  const updateCarouselState = () => {
    updateCarouselArrowVisibility();
    updateCarouselInnerOffset();
  };

  // Initial state
  updateCarouselState();

  // Arrows click
  carouselEl.addEventListener('click', event => {
    const target = event.target;

    if (carouselArrowLeftEl.contains(target) && currentSlideNumber > 1) {
      currentSlideNumber -= 1;
      updateCarouselState();
    } else if (carouselArrowRightEl.contains(target) && currentSlideNumber !== carouselSlidesNumber) {
      currentSlideNumber += 1;
      updateCarouselState();
    }
  });
}
