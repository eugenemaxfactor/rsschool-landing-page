const header = document.querySelector('.header');
const burgerButton = document.querySelector('[data-burger]');
const burgerMenuLinks = document.querySelectorAll('.header__nav a');
const desktopMediaQuery = window.matchMedia('(min-width: 993px)');

function toggleBurgerMenu() {
  header.classList.toggle('header--menu-open');
  document.body.classList.toggle('body--locked');
}

function closeBurgerMenu() {
  header.classList.remove('header--menu-open');
  document.body.classList.remove('body--locked');
}

function handleBurgerMenuEscape(event) {
  const isBurgerMenuOpen = header.classList.contains('header--menu-open');

  if (event.key === 'Escape' && isBurgerMenuOpen) {
    closeBurgerMenu();
  }
}

function handleDesktopMediaChange(event) {
  if (event.matches) {
    closeBurgerMenu();
  }
}

function addBurgerMenuLinkListener(link) {
  link.addEventListener('click', closeBurgerMenu);
}

function initBurgerMenu() {
  burgerButton.addEventListener('click', toggleBurgerMenu);
  document.addEventListener('keydown', handleBurgerMenuEscape);
  desktopMediaQuery.addEventListener('change', handleDesktopMediaChange);
  burgerMenuLinks.forEach(addBurgerMenuLinkListener);
}

initBurgerMenu();
