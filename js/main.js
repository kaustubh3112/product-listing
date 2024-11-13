import { config, getData } from "./services.js";
import { truncate } from "./utils.js";

let productDiv = document.querySelector("#productlist");
let searchInput = document.querySelector("#search-input");
let sortSelector = document.querySelector("#sortBy");
let filterByCategory = document.querySelector("#filterByCategory");

const getProductData = async () => {
  try {
    let products = await getData(config.api);

    const displayProducts = (productList) => {
      productDiv.innerHTML = "";
      productList.forEach((product) => {
        productDiv.innerHTML += `
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

    function noDataFound() {
      let productMainContainer = document.querySelector(
        ".product-listing-body"
      );
      productMainContainer.innerHTML = `<h3 class="nodata">No data found</h3>`;
    }

    // Search

    searchInput.addEventListener("keyup", function () {
      let searchValue = searchInput.value.toLowerCase();
      let filteredProduct = products.filter((product) => {
        return product.title.toLowerCase().includes(searchValue);
      });
      filteredProduct.length > 0
        ? displayProducts(filteredProduct)
        : noDataFound();
    });

    // sort by price
    const originalProducts = [...products];
    sortSelector.addEventListener("change", function () {
      let selectedValue = sortSelector.value.toLowerCase();

      if (selectedValue === "lowtohigh") {
        products.sort((a, b) => a.price - b.price);
        displayProducts(products);
      } else if (selectedValue === "highttolow") {
        products.sort((a, b) => b.price - a.price);
        displayProducts(products);
      } else if (selectedValue === "all") {
        products = [...originalProducts];
        displayProducts(products);
      }
    });

    // categories

    let displayCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    displayCategories.forEach((category, index) => {
      filterByCategory.innerHTML += `
      <li>
        <div class="form-group">
          <input type="checkbox" id="checkbox_${index}" class="checkbox-input" aria-label="${category}">
          <label for="checkbox_${index}" class="checkbox-label">${category}</label>
        </div>
      </li>
      `;
    });

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

    //wishlist
    function wishlist() {
      let wishlist = [];
      let wishListButtons = document.querySelectorAll(".wishlist-icon");

      wishListButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
          const product = products[index];
          wishlist.push(product);
          localStorage.setItem("wishlistProduct", JSON.stringify(wishlist));
          alert(`${product.title} is Added to wishlist!`);
        });
      });
    }

    wishlist();
  } catch (error) {
    console.error("Error fetching product data", error);
  }
};

getProductData();

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
