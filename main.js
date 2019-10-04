var eventBus = new Vue()
Vue.component('product-review', {
  template: `
<form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length"><b>Please correct your following error's:</b>
      <ul> 

      <li v-for="error in errors">{{error}}</li>
      </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name" >
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review" ></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p><b>Would You Recommend this product to anyone else?</b></p> 
      <label>Yes<input type="radio" value="Yes" v-model="recommend"/></label>
      <label>No<input type="radio" value="No" v-model="recommend"/></label>  
      
      <p>
        <input type="submit" value="Submit">  
      </p>
      
    </form>
 `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
      recommend: null
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommend) {
        let productreview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        eventBus.$emit('review-submitted', productreview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      } else {
        if (!this.name) this.errors.push('Name is required')
        if (!this.review) this.errors.push('Review is required')
        if (!this.rating) this.errors.push('Rating is required')
        if (!this.recommend) this.errors.push('Recommendation is required')
      }
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
  <ul>
            <li v-for="detail in details">{{ detail }}</li>
  </ul>
  `
})
Vue.component('product', {
  props: {
    premieum: {
      type: Boolean,
      required: true
    }
  },
  template: `

<div class="product">
        <div class="product-image">
          <img v-bind:src="image" />
        </div>

        <div class="product-info">
          <h1>{{ title}}</h1>
          <p>{{ description }}</p>
<!-- <p>User is Premium{{premieum}}</p> -->
          <!-- As Below code consumes more complexity because of iterative insertion and deletion of component in DOM -->
          <!-- <p v-if="inStock>=20">In Stock</p>
            <p v-else-if="inStock >=1 && inStock<=19">Almost Out of Stock</p>
            <p v-else  >Out of Stock</p> -->

          <!-- But By Using "Show" we just use CSS property "Visiblity" which means its still on the page but just made hide -->
          <p v-show="inStock>=20">In Stock</p>
          <p v-show="inStock >=1 && inStock<=19">Almost Out of Stock</p>
          <p v-if :class="{ out: !inStock }">Out of Stock</p>
          
          <p>Shipping: {{shipping}}</p>
          
          <span style="color:red;font-weight:bold" v-if="onSale">On Sale!</span>
         
          <a :href="link" target="_blank"
            >Click to Buy Official Supreme Product</a
          >
          <product-details :details="details"></product-details>
          <!-- <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul> -->

          <!-- Here Key Is used, So vue can keep track on different variants  -->

          <!-- <div v-for="variant in variants" :key="variant.variantId"
          class="color-box" :style="{backgroundColor:variant.variantColor}"
          @mouseover="updateProduct(variant.variantImage)">
        </div> -->


        <div v-for="(variant, index) in variants" :key="variant.variantId"
        class="color-box" :style="{backgroundColor:variant.variantColor}"
        @mouseover="updateProduct(index)">
      </div>

      <p><b>{{sale}}</b></p>


        <button v-on:click="addToCart":disabled="!inStock" :class="{disabledButton:!inStock}">Add to Cart</button>
        <!-- <div class="cart">
          <p>Cart({{ cart }})</p>
        </div> -->
        <br>
        <button v-on:click="Remove">Remove From Cart</button>
      </div>
                     
<!-- 
            <product-review @review-submitted="addReview"></product-review>

         <div>
        <h2>Reviews</h2>
        <product-tabs></product-tabs>

        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
        <li v-for="review in reviews">
        <p>Name:{{review.name}}</p>
        <p>Review:{{review.review}}</p>
        <p>Rating:{{review.rating}}</p>
        </li>
        </ul>
    </div> -->
    
<product-tabs :reviews="reviews"></product-tabs>


</div>
  `,
  data() {
    return {
      brand: 'Supreme',
      product: 'T-shirt',
      description: ' A premieum brand that every rich kid want',
      selectedVariant: 0,
      // image: "./pics/black.jpg",
      link: 'https://www.supreme.com ',
      // inStock: false,
      onSale: true,
      //  passing variant index as 0
      details: ['100% Premium Cotton', 'Limited Edition', 'Slim Fit'],
      variants: [
        {
          variantId: 2212,
          variantColor: 'Black',
          variantImage: './pics/black.jpg',
          variantQuantity: 13
        },
        {
          variantId: 2432,
          variantColor: 'Red',
          variantImage: './pics/white.jpg',
          variantQuantity: 0
        }
      ],
      reviews: [] // cart: 0
    }
  },

  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },

    // updateProduct: function(variantImage) {
    //   this.image = variantImage;
    // },

    updateProduct: function(index) {
      this.selectedVariant = index
      console.log(index)
    },
    Remove() {
      this.$emit(
        'remove-from-cart',
        this.variants[this.selectedVariant].variantId
      )
    }
  },

  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale() {
      if (this.onSale) {
        return this.brand + '' + this.product + '  are on sale!'
      }
      return this.brand + '' + this.product + '  not on sale!'
    },
    shipping() {
      if (this.premieum) {
        return 'Free'
      }
      return 2.99
    }
  },

  mounted() {
    eventBus.$on('review-submitted', productreview => {
      this.reviews.push(productreview)
    })
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
<div>
  <div>
<span class="tabs"
		:class="{activeTab: selectedTab === tab}"
		v-for="(tab,index) in tabs" :key="index" @click="selectedTab=tab">{{tab}}</span>
</div>

<!-- <div v-show="selectedTab === 'Reviews'" > -->
<div>
  <p v-if="!reviews.length">There are no reviews yet.</p>
<ul>
<li v-for="review in reviews">
<p>Name:{{review.name}}</p>
<p>Review:{{review.review}}</p>
<p>Rating:{{review.rating}}</p>
</li>
</ul>
<product-review v-show="selectedTab === 'Make a Review'" ></product-review>
</div>
</div>

	`,
  data() {
    return {
      tabs: ['reviews', 'Make a Review'],
      selectedTab: 'reviews'
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premieum: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeCart(id) {
      this.cart.pop(id)
    }
  }
})
