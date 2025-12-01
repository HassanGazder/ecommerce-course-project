let app = new Vue({
  el: "#app",
  data: {
    allProducts: [],
    searchText: "",
    cart: [],
    sortOption: "Subject",
    sortOrder: "asc",
    cartCount: 0,
    showProduct: true,
    username: "",
    usernumber: "",
    isFormValid: false,
  },
  created() {
    // Fetch products from backend
    fetch(
      "https://ecommerce-coursework-backend.onrender.com/collection/products"
    )
      .then((response) => response.json())
      .then((data) => {
        this.allProducts = data;

        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        this.cart = savedCart;

        // Restore cartCount
        this.cartCount = savedCart.reduce(
          (acc, item) => acc + item.quantity,
          0
        );

        // Adjust product availability based on saved cart
        this.cart.forEach((item) => {
          const product = this.allProducts.find((p) => p.id === item.id);
          if (product) product.Spaces = (product.Spaces || 0) - item.quantity;
        });
      })
      .catch((error) => console.error("Error fetching products:", error));
  },
  methods: {
    validateInput() {
      const userNamePattern = /^[a-zA-Z\s]+$/;
      const userNumberPattern = /^\d{10}$/;
      this.isFormValid =
        userNamePattern.test(this.username) &&
        userNumberPattern.test(this.usernumber);
    },

    addToCart(product) {
      if (product.Spaces <= 0) return;

      let existing = this.cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }

      product.Spaces--;
      this.cartCount++;

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    removeFromCart(item) {
      // 1. Find the item in the cart
      let existing = this.cart.find((i) => i.id === item.id);
      if (!existing) return;

      // 2. Reduce quantity
      existing.quantity--;

      // 3. Increase available spaces in product list
      let product = this.allProducts.find((p) => p.id === item.id);
      if (product) product.Spaces++;

      // 4. Remove item completely if quantity becomes 0
      if (existing.quantity === 0) {
        this.cart = this.cart.filter((i) => i.id !== item.id);
      }

      // 5. Update cart in local storage
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    showCheckout() {
      this.showProduct = !this.showProduct;
    },

    placeOrder() {
      if (this.cart.length === 0) {
        alert("Cart is empty!");
        return;
      }

      // Step 1: Save order
      fetch("https://ecommerce-coursework-backend.onrender.com/placeorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.username,
          number: this.usernumber,
          cart: this.cart,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Order saved:", data);

          // Step 2: Update spaces
          return fetch(
            "https://ecommerce-coursework-backend.onrender.com/update-spaces",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cart: this.cart }),
            }
          );
        })
        .then((res) => res.json())
        .then((updateData) => {
          console.log(updateData);

          // Step 3: Remove cart data from browser
          localStorage.removeItem("cart");

          alert("Order completed successfully!");

          // Reload products from backend so updated Spaces appear
          location.reload();
        })
        .catch((err) => {
          console.error("Error placing order:", err);
        });
    },
    searchLessons() {
      fetch(
        `https://ecommerce-coursework-backend.onrender.com/search?search=${this.searchText}`
      )
        .then((res) => res.json())
        .then((data) => {
          this.allProducts = data; // update product list from backend
        })
        .catch((err) => console.error("Search error:", err));
    },
  },
  computed: {
    sortedProducts() {
      let sortedArray = this.allProducts.slice();

      if (this.sortOption === "Price") {
        sortedArray.sort((a, b) => (a.Price || 0) - (b.Price || 0));
      } else if (
        this.sortOption === "Availability" ||
        this.sortOption === "Spaces"
      ) {
        sortedArray.sort((a, b) => (a.Spaces || 0) - (b.Spaces || 0));
      } else if (this.sortOption === "Subject") {
        sortedArray.sort((a, b) =>
          (a.Subject || "").localeCompare(b.Subject || "")
        );
      } else if (this.sortOption === "Location") {
        sortedArray.sort((a, b) =>
          (a.Location || "").localeCompare(b.Location || "")
        );
      }

      if (this.sortOrder === "desc") sortedArray.reverse();
      return sortedArray;
    },
  },
});
