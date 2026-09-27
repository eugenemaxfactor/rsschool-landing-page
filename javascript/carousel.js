const sliderPrevButton = document.querySelector('[data-slider-prev]');
const sliderNextButton = document.querySelector('[data-slider-next]');
const sliderCard = document.querySelector('[data-slider-card]');
const sliderImage = document.querySelector('[data-slider-image]');
const sliderTitle = document.querySelector('[data-slider-title]');
const sliderText = document.querySelector('[data-slider-text]');
const sliderPrice = document.querySelector('[data-slider-price]');
const sliderPaginationItems = document.querySelectorAll('[data-slider-pagination]');

let activeFavoriteSlideIndex = 0;
let activeFavoriteSlides = [];

async function loadFavoriteSlides() {
  const response = await fetch('./favorites.json');

  return response.json();
}

function renderFavoriteSlide(slide) {
  sliderImage.src = slide.image;
  sliderImage.alt = slide.name;
  sliderTitle.textContent = slide.name;
  sliderText.textContent = slide.description;
  sliderPrice.textContent = slide.price;
}

function updatePaginationItem(item, index) {
  const isActive = index === activeFavoriteSlideIndex;

  item.classList.toggle('slider-pagination__item--active', isActive);
}

function updateFavoriteSliderPagination() {
  sliderPaginationItems.forEach(updatePaginationItem);
}

function updateFavoriteSlideContent() {
  renderFavoriteSlide(activeFavoriteSlides[activeFavoriteSlideIndex]);
  updateFavoriteSliderPagination();
  sliderCard.classList.remove('coffee-card--hidden');
}

function showFavoriteSlide() {
  sliderCard.classList.add('coffee-card--hidden');

  setTimeout(updateFavoriteSlideContent, 300);
}

function showNextFavoriteSlide() {
  activeFavoriteSlideIndex += 1;

  if (activeFavoriteSlideIndex >= activeFavoriteSlides.length) {
    activeFavoriteSlideIndex = 0;
  }

  showFavoriteSlide();
}

function showPreviousFavoriteSlide() {
  activeFavoriteSlideIndex -= 1;

  if (activeFavoriteSlideIndex < 0) {
    activeFavoriteSlideIndex = activeFavoriteSlides.length - 1;
  }

  showFavoriteSlide();
}

async function initFavoriteSlider() {
  if (!sliderImage) {
    return;
  }

  activeFavoriteSlides = await loadFavoriteSlides();

  showFavoriteSlide();

  sliderNextButton.addEventListener('click', showNextFavoriteSlide);
  sliderPrevButton.addEventListener('click', showPreviousFavoriteSlide);
}

initFavoriteSlider();
