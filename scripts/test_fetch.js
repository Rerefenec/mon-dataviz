(async () => {
  try {
    const url = 'https://restcountries.com/v3.1/all?fields=name,cca3,flags,currencies,capital,languages';
    const res = await fetch(url);
    console.log('status', res.status);
    const data = await res.json();
    console.log('count', Array.isArray(data) ? data.length : 'not array');
    console.log('sample', JSON.stringify(data[0], null, 2));
  } catch (err) {
    console.error('fetch error', err);
  }
})();
