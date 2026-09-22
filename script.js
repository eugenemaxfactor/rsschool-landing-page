const THEME_KEY = 'coffee-house-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

const themeButtons = document.querySelectorAll('[data-theme]');

function setTheme(theme) {
  const isDarkTheme = theme === THEME_DARK;

  document.body.classList.toggle('theme-dark', isDarkTheme);
  localStorage.setItem(THEME_KEY, theme);

  themeButtons.forEach(updateThemeButton);
}

function updateThemeButton(button) {
  const buttonTheme = button.dataset.theme;
  const currentTheme = localStorage.getItem(THEME_KEY);
  const isActive = buttonTheme === currentTheme;

  button.classList.toggle('theme-switcher__button--active', isActive);
  button.classList.toggle('theme-switcher__button--inactive', !isActive);
}

function handleThemeButtonClick(event) {
  const selectedTheme = event.currentTarget.dataset.theme;

  setTheme(selectedTheme);
}

function addThemeButtonListener(button) {
  button.addEventListener('click', handleThemeButtonClick);
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const isSavedThemeDark = savedTheme === THEME_DARK;
  let initialTheme = THEME_LIGHT;

  if (isSavedThemeDark) {
    initialTheme = THEME_DARK;
  }

  setTheme(initialTheme);
  themeButtons.forEach(addThemeButtonListener);
}

initTheme();
