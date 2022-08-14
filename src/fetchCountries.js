export function fetchCountries(countryNAME) {
  const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages',
  });
  return fetch(
    `https://restcountries.com/v3.1/name/${countryNAME}?${searchParams}`
  ).then(r => {
    if (r.ok !== true) {
      throw Error('Not found!');
    }
    return r.json();
  });
}
