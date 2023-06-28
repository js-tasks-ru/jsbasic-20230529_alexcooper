import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  _modalEL = null;
  _titleEl;
  _bodyEl;
  _closeEl;
  opened = false;

  constructor() {
    const modal = this.#render();

    this._modalEL = modal;
    this._titleEl = modal.querySelector('.modal__title');
    this._bodyEl = modal.querySelector('.modal__body');
    this._closeEl = modal.querySelector('.modal__close');

    // Tests don't provide for the use of the Pointer events API
    modal.addEventListener('click', event => this.#onModalCloseElClick(event));

    document.addEventListener('keydown', event => this.#onEscKeydown(event));
  }

  #render() {
    return createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `);
  }

  #toggleBodyModalClass() {
    document.body.classList.toggle('is-modal-open');
  }

  open() {
    document.body.append(this._modalEL);

    this.#toggleBodyModalClass();
    this.opened = true;
  }

  close() {
    if (this._modalEL) {
      this._modalEL.remove();
      this._modalEL = null;

      this.#toggleBodyModalClass();
      this.opened = false;
    }
  }

  setTitle(text) {
    if (this._modalEL) {
      this._titleEl.textContent = text;
    }
  }

  setBody(node) {
    if (this._modalEL) {
      this._bodyEl.innerHTML = '';
      this._bodyEl.append(node);
    }
  }

  #onModalCloseElClick(event) {
    const isButtonPressed = this._closeEl.contains(event.target);
    if (isButtonPressed) {
      this.close();
    }
  }

  #onEscKeydown(event) {
    if (this.opened && event.code === 'Escape') {
      this.close();
    }
  }
}
