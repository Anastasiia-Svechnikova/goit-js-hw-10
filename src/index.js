import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import countryCardTpl from './country-card.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const result = e.target.value.trim();
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (!result) {
    return;
  }

  fetchCountries(result)
    .then(r => {
      if (r.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (r.length === 1) {
        renderCountry(r[0]);
      } else if (r.length > 1 && r.length <= 10) {
        renderCountriesList(r);
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountry({
  name,
  flags,
  languages,
  capital: [capitalDestr],
  population,
}) {
  const languagesDestr = Object.values(languages).map(el => ' ' + el);

  const markup = countryCardTpl({
    name,
    flags,
    population,
    capitalDestr,
    languagesDestr,
  });

  refs.countryInfo.innerHTML = markup;
}

function renderCountriesList(arr) {
  const markup = arr.reduce((acc, { name, flags }) => {
    return (
      acc +
      `<li class="country-list__item">
    <img class="country-list__flag" src="${flags.svg}" alt="${name.official}" width="70">
    <p class="country-list__name">${name.official}</p>
</li>`
    );
  }, '');

  refs.countryList.innerHTML = markup;
}
