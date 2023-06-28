import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  steps;

  value;
  prevValue;

  #thumbEl;

  get segmentsNumber() {
    return this.steps - 1;
  }

  get sliderWidth() {
    return this.elem.offsetWidth;
  }

  get sliderLeftPosition() {
    return this.elem.getBoundingClientRect().left;
  }

  set value(value) {
    this.value = value;
  }

  constructor(config) {
    this.steps = config.steps;
    this.value = config.value || 0;
    this.prevValue = -1;

    const sliderEl = this.#render();

    this.elem = sliderEl;

    this.#thumbEl = sliderEl.querySelector('.slider__thumb');

    // Disable browser drag-n-drop
    this.#thumbEl.ondragstart = () => false;
    this.#thumbEl.onpointerdown = () => false;
    this.#thumbEl.onpointermove = () => false;

    // Default position and state
    this.#updateState(this.value);

    sliderEl.addEventListener('click', (event) => this.#onClick(event));
    sliderEl.addEventListener('pointerdown', () => this.#onMoveStart());
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

  #updateCurrentPosition(positionNumber, percentNumber = null) {
    const sliderEl = this.elem;

    if (!percentNumber) {
      percentNumber = percentNumber || positionNumber / this.segmentsNumber * 100;
    }

    const percentText = `${percentNumber}%`;

    this.#thumbEl.style.left = percentText;
    sliderEl.querySelector('.slider__progress').style.width = percentText;
    sliderEl.querySelector('.slider__value').textContent = positionNumber;
  }

  #dispatchChangeEvent() {
    this.elem.dispatchEvent(new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    }));
  }

  #updateState(value) {
    if (value === this.prevValue) {
      return;
    }

    this.prevValue = this.value;
    this.value = value;

    this.#updateCurrentPosition(value);
    this.#dispatchChangeEvent();
  }

  #onClick(event) {
    const clickPosition = event.clientX - this.sliderLeftPosition;
    const segmentApproximateNumber = clickPosition / this.sliderWidth * this.segmentsNumber;

    const segmentNumber = Math.abs(Math.round(segmentApproximateNumber));

    this.#updateState(segmentNumber);
  }

  #onMoveStart() {
    const sliderEl = this.elem;
    const onDraggingClassName = 'slider_dragging';

    sliderEl.classList.add(onDraggingClassName);
    this.prevValue = this.value;

    const onMove = (event) => {
      const shiftX = event.clientX - this.sliderLeftPosition;
      let shiftXRelative = shiftX / this.sliderWidth;

      if (shiftXRelative < 0) {
        shiftXRelative = 0;
      } else if (shiftXRelative > 1) {
        shiftXRelative = 1;
      }

      const segmentApproximateNumber = shiftXRelative * this.segmentsNumber;
      const segmentNumber = Math.abs(Math.round(segmentApproximateNumber));
      const percent = shiftXRelative * 100;

      this.#updateCurrentPosition(segmentNumber, percent);
      this.value = segmentNumber;
    };

    const onMoveEnd = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onMoveEnd);

      sliderEl.classList.remove(onDraggingClassName);

      this.#updateState(this.value);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onMoveEnd);
  }
}
