import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  steps;
  value;

  get segmentsNumber() {
    return this.steps - 1;
  }

  constructor(config) {
    this.steps = config.steps;
    this.value = config.value || 0;

    const sliderEl = this.#render();

    this.elem = sliderEl;

    // Set slider default position
    this.#updateCurrentPosition(this.value);

    sliderEl.addEventListener('click', (event) => this.#onSliderClick(event));
  }

  #render() {
    const sliderEl = createElement(`
      <div class="slider">
        <div class="slider__thumb"">
          <span class="slider__value"></span>
        </div>
        <div class="slider__progress""></div>
      </div>
    `);

    // Add steps
    const stepsEl = this.#renderSteps();
    sliderEl.append(stepsEl);

    return sliderEl;
  }

  #renderSteps() {
    const stepsEl = document.createElement('div');
    stepsEl.classList.add('slider__steps');

    for (let i = 0; i < this.steps; i++) {
      const spanEl = document.createElement('span');
      spanEl.classList.add('slider__step');

      if (i === this.value) {
        spanEl.classList.add('slider__step-active');
      }

      stepsEl.append(spanEl);
    }

    return stepsEl;
  }

  #onSliderClick(event) {
    const sliderSegmentsNumber = this.segmentsNumber;
    const sliderWidth = this.elem.offsetWidth;
    const sliderLeftPosition = this.elem.getBoundingClientRect().left;

    const clickPosition = event.clientX - sliderLeftPosition;
    const segmentApproximateNumber = clickPosition / sliderWidth * sliderSegmentsNumber;
    const segmentNumber = Math.abs(Math.round(segmentApproximateNumber));

    this.#updateCurrentPosition(segmentNumber);
  }

  #updateCurrentPosition(positionNumber) {
    const sliderEl = this.elem;
    const percent = `${(positionNumber / this.segmentsNumber * 100)}%`;

    sliderEl.querySelector('.slider__thumb').style.left = percent;
    sliderEl.querySelector('.slider__progress').style.width = percent;
    sliderEl.querySelector('.slider__value').textContent = positionNumber;

    this.value = positionNumber;

    sliderEl.dispatchEvent(new CustomEvent('slider-change', {
      detail: positionNumber,
      bubbles: true
    }));
  }
}
