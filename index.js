let app = new Vue({
  el: "#app",
  data: {
    allProducts: afterSchoolSubjects,
    cart: [],
    sortOption: "Subject",
    sortOrder: "asc",
    cartCount: 0,
    showProduct: true,
  },
  methods: {
    addToCart: function (product) {
      let existingProduct = this.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity++;
      }else{
        this.cart.push({...product, quantity: 1});
      }
      product.Spaces--;
      this.cartCount++;
    },
    showCheckout: function () {
      this.showProduct = !this.showProduct
    },
    removeFromCart: function(product) {
  // 1️⃣ Find the item in the cart
  let existing = this.cart.find(item => item.id === product.id);

  // 2️⃣ If found, decrease its quantity
  if (existing) {
    existing.quantity--;

    // 3️⃣ Increase product availability again
    product.Spaces++;

    // 4️⃣ If quantity reaches 0, remove the item from the cart completely
    if (existing.quantity === 0) {
      this.cart = this.cart.filter(item => item.id !== product.id);
      
    }

    // 5️⃣ Decrease cart count (total items in cart)
    this.cartCount--;
  }
}

    
  },
  computed: {
    sortedProducts: function () {
      let sortedArray = this.allProducts.slice();

      if (this.sortOption === "Price") {
        sortedArray.sort((a, b) => a.Price - b.Price);
      } else if (
        this.sortOption === "Availability" ||
        this.sortOption === "Spaces"
      ) {
        sortedArray.sort((a, b) => a.Spaces - b.Spaces);
      } else if (this.sortOption === "Subject") {
        sortedArray.sort((a, b) => a.Subject.localeCompare(b.Subject));
      } else if (this.sortOption === "Location") {
        sortedArray.sort((a, b) => a.Location.localeCompare(b.Location));
      }
      if (this.sortOrder === "desc") {
        sortedArray.reverse();
      }

      return sortedArray;
    },
  },
});
