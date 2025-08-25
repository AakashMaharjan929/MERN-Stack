document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'closeOverlayBtn') {
      document.getElementById('overlay').style.display = 'none';
    }
  });
  
  function closeoverlay(){
    document.getElementById('overlay').style.display = 'none';
  }
  
   function myFunction() {
      var x = document.getElementById("myTopnav");
      x.classList.toggle("responsive");
    }
  
    
  
  
  let slideIndex = 0;
  showSlides();
  
  function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 4000); // Change image every 2 seconds
  }
  
  let slideIndex1 = 0;
  showSlides2();
  
  function showSlides2() {
    let i;
    let slides2 = document.getElementsByClassName("mySlides2");
    for (i = 0; i < slides2.length; i++) {
      slides2[i].style.display = "none";
    }
    slideIndex1++;
    if (slideIndex1 > slides2.length) {slideIndex1 = 1}
    slides2[slideIndex1-1].style.display = "block";
    setTimeout(showSlides2, 4000); // Change image every 2 seconds
  }
  
  
  jQuery(function($) {
    $('.slider').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev').on('click', function() {
      $('.slider').slick('slickPrev');
    });
  
    $('.slick-next').on('click', function() {
      $('.slider').slick('slickNext');
    });
  });
  
  jQuery(function($) {
    $('.sliderhotdeals').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev3').on('click', function() {
      $('.sliderhotdeals').slick('slickPrev');
    });
  
    $('.slick-next3').on('click', function() {
      $('.sliderhotdeals').slick('slickNext');
    });
  });
  
  jQuery(function($) {
    $('.slidernew').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev2').on('click', function() {
      $('.slidernew').slick('slickPrev');
    });
  
    $('.slick-next2').on('click', function() {
      $('.slidernew').slick('slickNext');
    });
  });
  
  jQuery(function($) {
    $('.sliderbestseller').slick({
      slidesToShow: 1,
      rows:3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            rows:2,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev4').on('click', function() {
      $('.sliderbestseller').slick('slickPrev');
    });
  
    $('.slick-next4').on('click', function() {
      $('.sliderbestseller').slick('slickNext');
    });
  });
  jQuery(function($) {
    $('.slidermostviewproducts').slick({
      slidesToShow: 1,
      rows:3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            rows:3,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
  });
  jQuery(function($) {
    $('.sliderfeatureproducts').slick({
      slidesToShow: 1,
      rows:3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            rows:3,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
  });
  
  jQuery(function($) {
    $('.slideronsale').slick({
      slidesToShow: 3,
      rows:2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev5').on('click', function() {
      $('.slideronsale').slick('slickPrev');
    });
  
    $('.slick-next5').on('click', function() {
      $('.slideronsale').slick('slickNext');
    });
  });
  
  jQuery(function($) {
    $('.slidertestimonials').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev6').on('click', function() {
      $('.slidertestimonials').slick('slickPrev');
    });
  
    $('.slick-next6').on('click', function() {
      $('.slidertestimonials').slick('slickNext');
    });
  });
  
  jQuery(function($) {
    $('.blogcard').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  
    $('.slick-prev7').on('click', function() {
      $('.blogcard').slick('slickPrev');
    });
  
    $('.slick-next7').on('click', function() {
      $('.blogcard').slick('slickNext');
    });
  });
  
  
  
  
  
  
  
  
  document.addEventListener('DOMContentLoaded', function() {
    // Select all category buttons
    var categoryButtons = document.querySelectorAll('.rv_button');
  
    categoryButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
  
        // Identify which category was clicked
        var category = button.getAttribute('data-number');
  
        // Hide all product sections
        var productSections = document.querySelectorAll('.products');
        productSections.forEach(function(section) {
          section.style.display = 'none';
        });
  
        // Show the selected category's products
        var selectedCategoryProducts = document.querySelector('.rv_element_' + category);
        if (selectedCategoryProducts) {
          selectedCategoryProducts.style.display = 'block';
  
          // Initialize the slider for the selected category's products
          if (category === 'women') {
            $('.rv_element_men .product-slider').slick('destroy'); // Destroy the existing slider (if any)
            $('.rv_element_women .product-slider').slick('destroy'); // Destroy the existing slider (if any)
            $('.rv_element_' + category + ' .product-slider').slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 3000,
              dots: false,
              arrows: false,
              responsive: [
                {
                  breakpoint: 769,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
            });
          } else if (category === 'men') {
            $('.rv_element_women .product-slider').slick('destroy'); // Destroy the existing slider (if any)
            $('.rv_element_men .product-slider').slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 3000,
              dots: false,
              arrows: false,
              responsive: [
                {
                  breakpoint: 769,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
            });
          } else if (category === 'unisex') {
            $('.rv_element_men .product-slider').slick('destroy'); // Destroy the existing slider (if any)
            $('.rv_element_unisex .product-slider').slick('destroy'); // Destroy the existing slider (if any)
            $('.rv_element_unisex .product-slider').slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 3000,
              dots: false,
              arrows: false,
              responsive: [
                {
                  breakpoint: 769,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
            });
          }
        }
  
        // Update button classes
        categoryButtons.forEach(function(btn) {
          btn.classList.remove('rv_button_opened');
          btn.classList.add('rv_button_closed');
        });
  
        button.classList.remove('rv_button_closed');
        button.classList.add('rv_button_opened');
      });
    });
  });
  
  
  
  
  
  // function displayBlock(elementId) {
  //   var element = document.getElementById(elementId);
  //   if (element) {
  //     element.style.display = 'block';
  //   }
  // }
  
  const slidersProducts = {
    hotdeals: [
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      }
    ],
    productsnew: [
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/2-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/3-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/4-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/5-1.png",
        oldPrice: "Rs. 2000",
        newPrice: "Rs. 1000",
        rating: 5
      },
      // Add more products here as needed
    ],
    productsonsale: [
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/2-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/3-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/4-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/5-1.png",
        oldPrice: "Rs. 2000",
        newPrice: "Rs. 1000",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK ",
        imageSrc: "./products/Men/1-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/2-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK ",
        imageSrc: "./products/Men/3-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK ",
        imageSrc: "./products/Men/4-1.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK ",
        imageSrc: "./products/Men/5-1.png",
        oldPrice: "Rs. 2000",
        newPrice: "Rs. 1000",
        rating: 5
      },
      // Add more products here as needed
    ],
    testimonial: [
      {
        name:"Asaroth",
        imageSrc:"./testimonial/testimonial1.jpg"
        },
      {
        name:"Shakira",
        imageSrc:"./testimonial/testimonial2.jpg"
      },
   
        {
          name:"Haryy",
          imageSrc:"./testimonial/testimonial3.jpg"
        },
    ],
    blog: [
      {
        name:"RECIPIE OF PERFRUME",
        imageSrc:"./blog/blog1.jpg"
        },
      {
        name:"ROSE PERFUME",
        imageSrc:"./blog/blog2.jpg"
      },
   
      {
        name:"PERFUME WORLD",
        imageSrc:"./blog/blog3.jpg"
      },
      {
        name:"PERFUME FUN",
        imageSrc:"./blog/blog4.jpg"
      },
    ],
    products: [
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/1-1.png",
        imageSrc2: "./products/Men/1-2.png",
        imageSrc3: "./products/Men/1-2.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/2-1.png",
        imageSrc2: "./products/Men/2-2.png",
        imageSrc3: "./products/Men/2-2.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/3-1.png",
        imageSrc2: "./products/Men/3-2.png",
        imageSrc3: "./products/Men/3-2.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/4-1.png",
        imageSrc2: "./products/Men/4-2.png",
        imageSrc3: "./products/Men/4-2.png",
        oldPrice: "Rs. 3300",
        newPrice: "Rs. 2046",
        rating: 5
      },
      {
        name: "JAGUAR CLASSIC BLACK",
        imageSrc: "./products/Men/5-1.png",
        imageSrc2: "./products/Men/5-1.png",
        imageSrc3: "./products/Men/5-1.png",
        oldPrice: "Rs. 2000",
        newPrice: "Rs. 1000",
        rating: 5
      },
      // Add more products here as needed
    ],
  
    productbestseller : [
      {
        name: "Dolce & Gabbana Women",
        image: "./best-product/B1-1.png",
        rating: 5,
        price: 9000,
        oldPrice: 1000,
      },
      {
  
        name: "Jean Paul Gaultier",
        image: "./best-product/B2-1.png",
        rating: 5,
        price: 7999,
        oldPrice: 1000,
     
  
      },
      {
        name: "Carolina Herrera Women 212 VIP",
        image: "./best-product/B3-1.png",
        rating: 5,
        price: 7499,
        oldPrice: 1000
      },
      {
        name: "Dolce & Gabbana Women",
        image: "./best-product/B1-1.png",
        rating: 5,
        price: 9000,
        oldPrice: 1000,
      },
      {
  
        name: "Jean Paul Gaultier",
        image: "./best-product/B2-1.png",
        rating: 5,
        price: 7999,
        oldPrice: 1000,
     
  
      },
      {
        name: "Carolina Herrera Women 212 VIP",
        image: "./best-product/B3-1.png",
        rating: 5,
        price: 7499,
        oldPrice: 1000
      },
      {
        name: "Dolce & Gabbana Women",
        image: "./best-product/B1-1.png",
        rating: 5,
        price: 9000,
        oldPrice: 1000,
      },
      {
  
        name: "Jean Paul Gaultier",
        image: "./best-product/B2-1.png",
        rating: 5,
        price: 7999,
        oldPrice: 1000,
     
  
      },
      {
        name: "Carolina Herrera Women 212 VIP",
        image: "./best-product/B3-1.png",
        rating: 5,
        price: 7499,
        oldPrice: 1000
      },
    ],
    
    
    // Add more sliders with their respective products
  };
  
  
  
  let outPut="";
  slidersProducts.products.forEach((product, index) => {
    // Create a div element for the product
  
  
    // Generate HTML for the product
  outPut += `
    <div class="slide" id="product_${index}">
      <div class="slide_featuress" id="futuristics">
        <i class="bi bi-cart-fill"></i><br>
        <i class="bi bi-heart"></i> <br>
        <i class="bi bi-shuffle"></i><br>
        <i class="bi bi-eye"  onclick="displayBlock('overlay', 'products',${index})"></i>
      </div>
      <img src="${product.imageSrc}" alt="Product image" />
      <div class="product-info">
        <h2 class="product-title">${product.name}</h2>
        <p class="product-details">
          <span class="product-price-old">${product.oldPrice}</span>
          <span class="product-price-new">${product.newPrice}</span>
        </p>
        <div class="product-rating">
          ${'<span class="star">★</span>'.repeat(product.rating)}
        </div>
      </div>
    </div>
    `;
  
    // Append the product HTML to the product slider container
    document.getElementById("product-sliderr").innerHTML = outPut;
  });
  
  let outPuthotdeals="";
  slidersProducts.hotdeals.forEach((product, index) => {
    // Create a div element for the product
  
  
    // Generate HTML for the product
  outPuthotdeals += `
    <div class="slidehotdeals" id="product_${index}">
      <div class="slide_featuress" id="futuristics">
        <i class="bi bi-cart-fill"></i><br>
        <i class="bi bi-heart"></i> <br>
        <i class="bi bi-shuffle"></i><br>
        <i class="bi bi-eye"  onclick="displayBlock('overlay', 'hotdeals', ${index})"></i>
      </div>
      <img src="${product.imageSrc}" alt="Product image" />
      <div class="product-info">
        <h2 class="product-title">${product.name}</h2>
        <p class="product-details">
          <span class="product-price-old">${product.oldPrice}</span>
          <span class="product-price-new">${product.newPrice}</span>
        </p>
        <div class="product-rating">
          ${'<span class="star">★</span>'.repeat(product.rating)}
        </div>
      </div>
    </div>
    `;
  
    // Append the product HTML to the productslider container
    document.getElementById("product-sliderhotdeals").innerHTML = outPuthotdeals;
  });
  
  
  let outPutbestseller="";
  slidersProducts.productbestseller.forEach((product, index) => {
    // Create a div element for the product
  
  
    // Generate HTML for the product
  outPutbestseller += `
  <div class="product-listing">
    <div class="product-card" style="margin-top:.6rem;">
      <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="productinfohere">
            <div class="product-title">${product.name}</div>
            <div class="product-rating">
              ${'★'.repeat(product.rating)}
            </div>
            <div class="product-price">Rs. ${product.price} <span class="product-price-old1">Rs. ${product.oldPrice}</span></div>
          </div>
    </div>
  </div>
    `;
  
    // Append the product HTML to the product slider container
    document.getElementById("product-sliderbestseller").innerHTML = outPutbestseller;
  });
  
  
  let outPutfeaturedproducts="";
  slidersProducts.productbestseller.forEach((product, index) => {
    // Create a div element for the product
  
  
    // Generate HTML for the product
  outPutfeaturedproducts += `
  <div class="product-listing">
    <div class="product-card" style="margin-top:.6rem;">
      <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="productinfohere">
            <div class="product-title">${product.name}</div>
            <div class="product-rating">
              ${'★'.repeat(product.rating)}
            </div>
            <div class="product-price">Rs. ${product.price} <span class="product-price-old1">Rs. ${product.oldPrice}</span></div>
          </div>
    </div>
  </div>
    `;
  
    // Append the product HTML to the product slider container
    document.getElementById("product-sliderfeaturedproducts").innerHTML = outPutfeaturedproducts;
  });
  
  
  let outPutmostviewproducts="";
  slidersProducts.productbestseller.forEach((product, index) => {
    // Create a div element for the product
  
  
    // Generate HTML for the product
  outPutmostviewproducts += `
  <div class="product-listing">
    <div class="product-card" style="margin-top:.6rem;">
      <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="productinfohere">
            <div class="product-title">${product.name}</div>
            <div class="product-rating">
              ${'★'.repeat(product.rating)}
            </div>
            <div class="product-price">Rs. ${product.price} <span class="product-price-old1">Rs. ${product.oldPrice}</span></div>
          </div>
    </div>
  </div>
    `;
  
    // Append the product HTML to the product slider container
    document.getElementById("product-slidermostviewproducts").innerHTML = outPutmostviewproducts;
  });
  
  
  
  let outPutnew="";
  slidersProducts.productsnew.forEach((product, index) => {
    // Create a div element for the product
  
  
    // Generate HTML for the product
  outPutnew += `
    <div class="slidenew" id="product_${index}">
      <div class="slide_featuress" id="futuristics">
        <i class="bi bi-cart-fill"></i><br>
        <i class="bi bi-heart"></i> <br>
        <i class="bi bi-shuffle"></i><br>
        <i class="bi bi-eye"  onclick="displayBlock('overlay', 'productsnew', ${index})"></i>
      </div>
      <img src="${product.imageSrc}" alt="Product image" />
      <div class="product-info">
        <h2 class="product-title">${product.name}</h2>
        <p class="product-details">
          <span class="product-price-old">${product.oldPrice}</span>
          <span class="product-price-new">${product.newPrice}</span>
        </p>
        <div class="product-rating">
          ${'<span class="star">★</span>'.repeat(product.rating)}
        </div>
      </div>
    </div>
    `;
  
    // Append the product HTML to the product slider container
    document.getElementById("product-slidernew").innerHTML = outPutnew;
  });
  
  let outPutonsalee="";
  slidersProducts.productsonsale.forEach((product, index) => {
  
  outPutonsalee += `
    <div class="slideonsalee" id="product_${index}">
      <div class="slide_featuress" id="futuristics">
        <i class="bi bi-cart-fill"></i><br>
        <i class="bi bi-heart"></i> <br>
        <i class="bi bi-shuffle"></i><br>
        <i class="bi bi-eye" onclick="displayBlock('overlay', 'productsonsale', ${index})"></i>
      </div>
      <img src="${product.imageSrc}" alt="Product image" />
      <div class="product-info">
        <h2 class="product-title">${product.name}</h2>
        <p class="product-details">
          <span class="product-price-old">${product.oldPrice}</span>
          <span class="product-price-new">${product.newPrice}</span>
        </p>
        <div class="product-rating">
          ${'<span class="star">★</span>'.repeat(product.rating)}
        </div>
      </div>
        
      </div>
      `;
    
  
    // Increment index by 1 since we've already processed the next product for slideonsale2
  
  
    // Append the product HTML to the product slider container
    document.getElementById("product-slideronsale").innerHTML = outPutonsalee;
  });
  
  let outPuttestimonials="";
  slidersProducts.testimonial.forEach((product, index) => {
  
  outPuttestimonials += `
    <div class="slidetestimonials" id="product_${index}">
      <img src="${product.imageSrc}" alt="Product image" />
      <div class="product-info">
        <h2 class="product-title">${product.name}</h2>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum quisquam doloribus deleniti esse. Quod dignissimos, tenetur nam ab eveniet asperiores.</p>
      </div>
        
      </div>
      `;
    
  
    // Increment index by 1 since we've already processed the next product for slideonsale2
  
  
    // Append the product HTML to the product slider container
    document.getElementById("product-slidertestimonials").innerHTML = outPuttestimonials
  });
  
  let outPutblog="";
  slidersProducts.blog.forEach((product, index) => {
  
  outPutblog += `
  
  <div class="card">
  <img src="${product.imageSrc}" alt="">
    <h2 class="cardname">${product.name}</h2>
    <p class="limited-text">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat doloremque, quisquam fuga dolorum, corrupti quasi magni ullam distinctio facere odio ad. Voluptatum impedit ipsa sapiente placeat a optio saepe consequuntur, hic, quasi deserunt illum molestiae excepturi, ex temporibus explicabo repellendus veniam beatae aliquid. Dolorum fugit consequuntur rem officia a? Nobis, pariatur vero ipsa saepe eius aliquam obcaecati sint, quos at ullam expedita deserunt id distinctio mollitia excepturi vel incidunt qui quas eligendi nesciunt! Laboriosam, minus. Velit dolores amet ea sunt dignissimos cum dolorum repellendus, veniam ullam recusandae inventore accusamus dolore ipsam, dicta quod rerum? Voluptatibus quidem non placeat incidunt beatae!
    </p>
    <p>
        <a href="#">READ MORE...</a>
    </p>
  </div>
  
  </div>
  
      `;
    
  
    // Increment index by 1 since we've already processed the next product for slideonsale2
  
  
    // Append the product HTML to the product slider container
    document.getElementById("product-sliderblog").innerHTML = outPutblog
  });
  
  
  
  
  
  let outPutoverlay="";
  let outPutoverlayside="";
  function displayBlock(elementId, sliderId, index) {
    jQuery(function($) {
     
      $('.overlay_img').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          autoplay: true,
          autoplaySpeed: 3000,
          asNavFor: '.overlay_img2',
          infinite:true
      });
      $('.overlay_img2').slick({
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows:false,
          autoplay: true,
          autoplaySpeed: 3000,
          asNavFor: '.overlay_img',
          dots: false,
          focusOnSelect: true,
          infinite:true
      });
  
    });
  
    $('.overlay_img').slick('destroy'); // Destroy the existing slider (if any)
    $('.overlay_img2').slick('destroy'); // Destroy the existing slider (if any)
  
  
    var element = document.getElementById(elementId);
    if (element) {
      const sliderProducts = slidersProducts[sliderId]; // Fetch products for this slider
      const product = sliderProducts[index]; // Fetch the product using the index
  
        // Clear the previous images
        outPutoverlay = "";
        outPutoverlayside = "";
    
        // Remove the existing images from the DOM
        document.getElementById("overlay-img").innerHTML = "";
        document.getElementById("overlay-img2").innerHTML = "";
  
        
      // Update the overlay content with the product information
     outPutoverlay +=`
     <img src="${product.imageSrc}" alt="">
     <img src="${product.imageSrc2}" alt="">
     <img src="${product.imageSrc3}" alt="">
     `
     outPutoverlayside +=`
     <img src="${product.imageSrc}" alt="">
     <img src="${product.imageSrc2}" alt="">
     <img src="${product.imageSrc3}" alt="">
     `
      document.querySelector('.title').innerText = product.name;
      document.querySelector('.price').innerHTML = `${product.newPrice} <strike style="color:black;">${product.oldPrice}</strike>`;
      // Display the overlay
      document.getElementById("overlay-img").innerHTML = outPutoverlay;
      document.getElementById("overlay-img2").innerHTML = outPutoverlayside;
      element.style.display = 'block';
    }
  }
  
  
  
  const eyeIcons = document.querySelectorAll('.bi.bi-eye');
  
  // Loop through each element and add event listeners
  eyeIcons.forEach(function(eyeIcon) {
    eyeIcon.addEventListener('mouseover', function() {
      this.classList.remove('bi-eye');
      this.classList.add('bi-eye-fill');
    });
  
    eyeIcon.addEventListener('mouseout', function() {
      this.classList.remove('bi-eye-fill');
      this.classList.add('bi-eye');
    });
  });
  
  