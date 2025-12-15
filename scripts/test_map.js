(async () => {
  const FIELDS = 'name,cca3,flags,currencies,capital,languages';
  const url = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;
  try {
    const res = await fetch(url);
    const countries = await res.json();
    const mapped = [];
    countries.forEach((country, idx) => {
      if (!country) {
        console.warn('skipping undefined country at index', idx);
        return;
      }
      if (!country.name || !country.name.common || !country.cca3) {
        console.warn('skipping incomplete country at index', idx, country && Object.keys(country));
        return;
      }
      let codeDev = null;
      let devName = 'no devise';
      if (country.currencies && Object.keys(country.currencies).length > 0) {
        codeDev = Object.keys(country.currencies)[0];
        if (country.currencies[codeDev] && country.currencies[codeDev].name) devName = country.currencies[codeDev].name;
      }
      mapped.push({
        name: country.name.common,
        codecountry: country.cca3,
        flagUrl: country.flags ? country.flags.svg : '',
        devise: devName,
        codeDevise: codeDev || "no code devise"
      });
    });
    console.log('mapped count', mapped.length);
    console.log('sample', mapped.slice(0,5));
  } catch (err) {
    console.error(err);
  }
})();
