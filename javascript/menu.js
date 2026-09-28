const productsGrid = document.querySelector('[data-products-grid]');
const categoryButtons = document.querySelectorAll('[data-category]');
const showMoreButton = document.querySelector('[data-show-more]');

let activeCategoryProducts = [];
let loadedProducts = [];

async function loadProducts() {
  const response = await fetch('./products.json');

  return response.json();
}

function createProductCard(product, productIndex) {
  const card = document.createElement('article');

  card.className = 'product-card';
  card.dataset.productIndex = productIndex;
  card.innerHTML = `
    <div class="product-card__image-wrapper">
      <img class="product-card__image" src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-card__content">
      <div class="product-card__description">
        <h2 class="product-card__title">${product.name}</h2>
        <p class="product-card__text">${product.description}</p>
      </div>
      <p class="product-card__price">$${product.price}</p>
    </div>
  `;

  return card;
}

function renderProductCard(product, productIndex) {
  const card = createProductCard(product, productIndex);

  productsGrid.append(card);
}

function renderProducts(products) {
  productsGrid.innerHTML = '';
  products.forEach(renderProductCard);
}

function setShowMoreInitialState(products) {
  if (!showMoreButton) {
    return;
  }

  productsGrid.classList.remove('menu__cards--expanded');
  showMoreButton.classList.toggle('menu__more-button--hidden', products.length <= 4);
}

function showAllProducts() {
  productsGrid.classList.add('menu__cards--expanded');
  showMoreButton.classList.add('menu__more-button--hidden');
}

const productModal = document.querySelector('[data-product-modal]');
const modalImage = document.querySelector('[data-modal-image]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalDescription = document.querySelector('[data-modal-description]');
const modalPrice = document.querySelector('[data-modal-price]');
const modalSizes = document.querySelector('[data-modal-sizes]');
const modalAdditives = document.querySelector('[data-modal-additives]');
const modalCloseButton = document.querySelector('[data-modal-close]');

function createSizeButton(sizeKey, sizeValue) {
  const button = document.createElement('button');

  button.className = 'modal__option-button modal__option-button--size';
  button.type = 'button';
  button.dataset.addPrice = sizeValue['add-price'];
  button.addEventListener('click', activateSizeButton);

  if (sizeKey === 's') {
    button.classList.add('modal__option-button--active');
  }

  button.innerHTML = `
    <span class="modal__option-mark">${sizeKey.toUpperCase()}</span>
    ${sizeValue.size}
  `;

  return button;
}

function toggleOptionButton(event) {
  const optionButton = event.currentTarget;

  optionButton.classList.toggle('modal__option-button--active');
  updateProductTotalPrice();
}

function deactivateSizeButton(sizeButton) {
  sizeButton.classList.remove('modal__option-button--active');
}

function activateSizeButton(event) {
  const selectedSizeButton = event.currentTarget;
  const sizeButtons = modalSizes.querySelectorAll('.modal__option-button');

  sizeButtons.forEach(deactivateSizeButton);
  selectedSizeButton.classList.add('modal__option-button--active');
  updateProductTotalPrice();
}

function renderSizeButton(size) {
  const sizeKey = size[0];
  const sizeValue = size[1];
  const button = createSizeButton(sizeKey, sizeValue);

  modalSizes.append(button);
}

function renderProductSizes(product) {
  modalSizes.innerHTML = '';

  const productSizes = Object.entries(product.sizes);
  productSizes.forEach(renderSizeButton);
}

function createAdditiveButton(additive, additiveIndex) {
  const button = document.createElement('button');

  button.className = 'modal__option-button';
  button.type = 'button';
  button.dataset.addPrice = additive['add-price'];
  button.addEventListener('click', toggleOptionButton);
  button.innerHTML = `
    <span class="modal__option-mark">${additiveIndex + 1}</span>
    ${additive.name}
  `;

  return button;
}

function renderAdditiveButton(additive, additiveIndex) {
  const button = createAdditiveButton(additive, additiveIndex);

  modalAdditives.append(button);
}

function renderProductAdditives(product) {
  modalAdditives.innerHTML = '';
  product.additives.forEach(renderAdditiveButton);
}

function fillProductModal(product) {
  productModal.dataset.basePrice = product.price;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = `$${product.price}`;
  renderProductSizes(product);
  renderProductAdditives(product);
  updateProductTotalPrice();
}

function openProductModal(product) {
  fillProductModal(product);
  productModal.hidden = false;
  document.body.classList.add('body--locked');
}

function closeProductModal() {
  productModal.hidden = true;
  document.body.classList.remove('body--locked');
}

function getOptionAddPrice(optionButton) {
  return Number(optionButton.dataset.addPrice);
}

function calculateOptionsPrice(totalPrice, optionButton) {
  return totalPrice + getOptionAddPrice(optionButton);
}

function updateProductTotalPrice() {
  const basePrice = Number(productModal.dataset.basePrice);
  const activeOptions = productModal.querySelectorAll('.modal__option-button--active');
  const optionsPrice = [...activeOptions].reduce(calculateOptionsPrice, 0);
  const totalPrice = basePrice + optionsPrice;

  modalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

function handleProductModalClick(event) {
  if (event.target === productModal) {
    closeProductModal();
  }
}

function handleProductCardClick(event, products) {
  const productCard = event.target.closest('.product-card');

  if (!productCard) {
    return;
  }

  const productIndex = Number(productCard.dataset.productIndex);
  const selectedProduct = products[productIndex];

  openProductModal(selectedProduct);
}

function getProductCategory(product) {
  return product.category;
}

function isProductInCategory(product, category) {
  return product.category === category;
}

function updateCategoryButton(button, activeCategory) {
  const isActive = button.dataset.category === activeCategory;

  button.classList.toggle('menu__category--active', isActive);
  button.classList.toggle('menu__category--available', !isActive);
  button.disabled = isActive;
}

function renderCategoryProducts(products, category) {
  activeCategoryProducts = products.filter((product) => isProductInCategory(product, category));

  categoryButtons.forEach((button) => updateCategoryButton(button, category));
  renderProducts(activeCategoryProducts);
  setShowMoreInitialState(activeCategoryProducts);
}

function handleCategoryButtonClick(event) {
  const selectedCategory = event.currentTarget.dataset.category;

  renderCategoryProducts(loadedProducts, selectedCategory);
}

function handleProductGridClick(event) {
  handleProductCardClick(event, activeCategoryProducts);
}

function handleEscapeKeydown(event) {
  if (event.key === 'Escape' && productModal && !productModal.hidden) {
    closeProductModal();
  }
}

function addCategoryButtonListener(button) {
  button.addEventListener('click', handleCategoryButtonClick);
}

async function initProducts() {
  if (!productsGrid) {
    return;
  }

  loadedProducts = await loadProducts();
  renderCategoryProducts(loadedProducts, 'coffee');
  categoryButtons.forEach(addCategoryButtonListener);
  productsGrid.addEventListener('click', handleProductGridClick);
  showMoreButton.addEventListener('click', showAllProducts);
  modalCloseButton.addEventListener('click', closeProductModal);
  productModal.addEventListener('click', handleProductModalClick);
  document.addEventListener('keydown', handleEscapeKeydown);
}

initProducts();
