let app = new Vue({
    el:'#app',
    data:{
        message:'hello frooooom vue',
        allProducts:afterSchoolSubjects,  
        cart:[],
      
        //    addToCart:function(products){
        //     this.cart.push(products)
        //    }
        },
      methods:{
           addToCart:function(products){
            this.cart.push(products)
            console.log(products.Location);
           }
    }
})