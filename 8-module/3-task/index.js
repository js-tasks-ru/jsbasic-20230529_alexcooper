export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}
