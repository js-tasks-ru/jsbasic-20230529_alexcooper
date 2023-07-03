import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filteredProducts = products;
    this.filters = {};

    this.render();
  }

  render() {
    const elem = this.elem ?? createElement(this.template());

    const productCardsContainerEl = elem.querySelector(('.products-grid__inner'));
    this.renderProducts(productCardsContainerEl);

    this.elem = elem;
  }

  renderProducts(container) {
    container.innerHTML = '';

    for (let product of this.filteredProducts) {
      const productCardEl = new ProductCard(product);

      container.append(productCardEl.elem);
    }
  }

  template() {
    return (`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);
  }

  updateFilter(filters) {
    const newFilters = Object.assign(this.filters, filters);

    const filterFunc = product => {
      if (
        (newFilters.noNuts && product.nuts) ||
        (newFilters.vegeterianOnly && !product.vegeterian) ||
        (newFilters.maxSpiciness < product.spiciness) ||
        (newFilters.category && newFilters.category !== product.category)
      ) {
        return false;
      }

      return true;
    };

    this.filters = newFilters;
    this.filteredProducts = this.products.filter(filterFunc);

    this.render();
  }
}
