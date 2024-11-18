import { config, getData } from "./services.js";
import { truncate } from "./utils.js";

const productContainer = document.querySelector("#productlist");
const searchContainer = document.querySelector("#search-input");
const sortBy = document.querySelector("#sortBy");

const getDataFromApi = async () => {
  try {
    productContainer.innerHTML = "<p>Products Loading...</p>";
    let products = await getData(config.api);

    // Display Products
    const displayProducts = (products) => {
      productContainer.innerHTML = "";
      products.forEach((product) => {
        productContainer.innerHTML += `
          <div class="product-block">
              <div class="product-img"><img src='${product.image}' alt='${
          product.title
        }' /></div>
              <h2>${truncate(product.title, 50)}...</h2>
              <h3>Price: ${product.price}</h3>
              <p>${truncate(product.description, 90)}...</p>
              <button class="wishlist-icon"><img class="heart-icon" src="./images/heart.svg" alt="WishListIcon" /></button>
          </div>
        `;
      });
    };

    displayProducts(products);

    function paginationArr(products) {
      const productCount = 6;
      const productslength = Math.ceil(products.length / productCount);
      const paginationContainer = document.querySelector("#pagination");
      const pageinationArr = [];

      for (let i = 1; i <= productslength; i++) {
        pageinationArr.push(i);
      }

      pageinationArr.forEach((button) => {
        paginationContainer.innerHTML += `<button class="page-item" id="${button}">${button}</button>`;
      });

      // pagination function

      let buttons = document.querySelectorAll(".page-item");

      buttons.forEach((button) => {
        button.addEventListener("click", function () {
          let pageNumber = button.getAttribute("id");

          if (pageNumber) {
            buttons.forEach((btn) => btn.classList.remove("active"));
          }
          button.classList.add("active");

          let startIndex = (pageNumber - 1) * productCount;
          let endIndex = startIndex + productCount;
          let filtered = products.slice(startIndex, endIndex);

          displayProducts(filtered);
        });
      });
    }

    paginationArr(products);

    // search
    function SearchProducts() {
      searchContainer.addEventListener("keyup", function () {
        let searchKeyword = searchContainer.value.toLowerCase();

        let filterdProduct = products.filter((product) => {
          return (
            product.title.toLowerCase().includes(searchKeyword) &&
            product.description.toLowerCase().includes(searchKeyword)
          );
        });
        displayProducts(filterdProduct);

        filterdProduct.length > 0
          ? displayProducts(filterdProduct)
          : (productContainer.innerHTML = "No Data found");
      });
    }
    SearchProducts();

    // wishlist

    function wishlisted() {
      const heartIcons = document.querySelectorAll(".wishlist-icon");
      const wishlistItems = JSON.parse(localStorage.getItem("Wishlist")) || [];
      heartIcons.forEach((button, index) => {
        button.addEventListener("click", () => {
          let product = products[index];
          let isAdded = wishlistItems.some((item) => item.id === product.id);

          if (!isAdded) {
            wishlistItems.push(product);
            localStorage.setItem("Wishlist", JSON.stringify(wishlistItems));
            alert(`${product.title} has been added to the wishlist!`);
          } else {
            alert(`${product.title} is already added to the wishlist!`);
          }
        });
      });
    }
    wishlisted();

    // sort by price

    function sortByPrice() {
      const notSortedProducts = [...products];
      sortBy.addEventListener("change", function () {
        let selected = sortBy.value;
        if (selected === "lowtohigh") {
          let lowToHigh = products.sort((a, b) => a.price - b.price);
          displayProducts(lowToHigh);
        } else if (selected === "highttolow") {
          let hightToLow = products.sort((a, b) => b.price - a.price);
          displayProducts(hightToLow);
        } else if (selected === "all") {
          displayProducts(notSortedProducts);
        }
      });
    }
    sortByPrice();

    // Select as per category

    function selectAsperCategory() {
      // Category List
      let categories = products.map((item) => item.category);
      let displayCategories = [...new Set(categories)];

      // Display Catgories
      displayCategories.map((category, index) => {
        filterByCategory.innerHTML += `
        <li>
          <div class="form-group">
            <input type="checkbox" id="checkbox_${index}" class="checkbox-input" aria-label="${category}">
            <label for="checkbox_${index}" class="checkbox-label">${category}</label>
          </div>
        </li>
        `;
      });

      // filter by checkbox

      function productCategory() {
        const categorySet = new Set();

        document.querySelectorAll(".checkbox-input").forEach((checkbox) => {
          checkbox.addEventListener("change", function () {
            const selectedCategory = checkbox.getAttribute("aria-label");

            checkbox.checked
              ? categorySet.add(selectedCategory)
              : categorySet.delete(selectedCategory);

            const filterProduct = products.filter((item) =>
              [...categorySet].some((category) =>
                item.category.includes(category)
              )
            );

            displayProducts(filterProduct.length ? filterProduct : products);
          });
        });
      }

      productCategory();
    }
    selectAsperCategory();
  } catch (error) {
    console.error("Error, while fetch the data", error);
  }
};
getDataFromApi();

// const starRating = () => {
//   let buttons = document.querySelectorAll(".star-btn");
//   buttons.forEach((button, index) => {
//     button.addEventListener("click", function () {
//       buttons.forEach((btn) => btn.classList.remove("selected"));
//       for (let i = 0; i <= index; i++) {
//         buttons[i].classList.add("selected");
//       }
//     });
//   });
// };
// starRating();

// toggle function

function toggleContent(openToggle, closeToggle, content, className) {
  let toggleButton = document.querySelector(openToggle);
  let toggleContent = document.querySelector(content);
  let closeToggleContent = document.querySelector(closeToggle);
  let body = document.querySelector("body");

  toggleButton.addEventListener("click", function () {
    toggleContent.classList.add(className);
    body.classList.add("overlay");
  });
  closeToggleContent.addEventListener("click", function () {
    toggleContent.classList.remove(className);
    body.classList.remove("overlay");
  });
}

toggleContent(
  ".categories-filter-btn",
  ".close-icon",
  ".product-sidebar",
  "opensidebar"
);

toggleContent(
  ".hamburger-icon",
  ".close-menu-icon",
  ".menu-wrapper",
  "openMenu"
);
