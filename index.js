let app = new Vue({
        el: '#app',
        data: {
          allProducts: afterSchoolSubjects,
          cart: [],
          sortOption: '',
        },
        methods: {
          addToCart: function(product) {
            this.cart.push(product);
            product.Spaces--;
            console.log("Added:", product.Location);
            console.log("Added:", product.Spaces);
          },
        },
        computed: {
          sortedProducts: function() {
            let sortedArray = this.allProducts.slice();

            if (this.sortOption === 'Price') {
              sortedArray.sort((a, b) => a.Price - b.Price);
            } else if (this.sortOption === 'Availability' || this.sortOption === 'Spaces') {
              sortedArray.sort((a, b) => a.Spaces - b.Spaces);
            } else if (this.sortOption === 'Subject') {
              sortedArray.sort((a, b) => a.Subject.localeCompare(b.Subject));
            } else if (this.sortOption === 'Location') {
              sortedArray.sort((a, b) => a.Location.localeCompare(b.Location));
            }

            return sortedArray;
          }
        }
      });