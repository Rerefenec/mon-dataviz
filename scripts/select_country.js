import { handleDisplayConverter, updateConverter, initConverterWithCountries } from "./devises.js";

console.log('select_country module loaded');

const infosContent = document.querySelector(".selected-country-infos .infos-content");
const countryInfos = document.querySelector(".selected-country-infos");

const getCountries = async () => {
    const FIELDS = 'name,cca3,flags,currencies,capital,languages';
    const url = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Rest Countries API responded with status', response.status);
            try {
                const errBody = await response.json();
                console.error('API message:', errBody);
            } catch (_) {}
            return [];
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            console.warn('Rest Countries returned no data (empty array)');
        }
        return data;
    } catch (err) {
        console.error('Failed to fetch countries:', err);
        return [];
    }
}

export const restCountriesDatas = await getCountries();
const allCountriesUse = [];

const getAllCountriesUse = async () => {
    const countries = (await getCountries()) || [];
    if (!Array.isArray(countries)) {
        console.error('select_country: expected countries array but got', countries);
        return [];
    }
    try {
        for (let idx = 0; idx < countries.length; idx++) {
            const country = countries[idx];
            if (!country) {
                console.warn('select_country: skipping undefined country at index', idx);
                continue;
            }
            if (!country.name || !country.name.common || !country.cca3) {
                console.warn('select_country: skipping incomplete country at index', idx, country && Object.keys(country));
                continue;
            }
            allCountriesUse.push({
                name: country.name.common,
                codecountry: country.cca3,
                flagUrl: country.flags ? country.flags.svg : '',
                devise: country.currencies ? country.currencies[Object.keys(country.currencies)[0]].name : "no devise",
                codeDevise: country.currencies ? Object.keys(country.currencies)[0] : "no code devise"
            });
        }
    } catch (err) {
        console.error('Error while building country list', err);
    }
    return allCountriesUse.sort((a, b) => a.name.localeCompare(b.name));
}

export const choiceCountries = await getAllCountriesUse();

// Initialise the converter options once we have the country list
try {
    initConverterWithCountries(choiceCountries);
} catch (err) {
    console.warn('Could not init converter with countries yet', err);
}

const displayCountryInfos = (country) => {
    countryInfos.classList.add("actif");
    document.querySelector("#map-holder").classList.add("infos");
    const flag = country.flags ? (country.flags.png || country.flags.svg || '') : '';
    const name = country.name ? country.name.common : 'Nom indisponible';
    const currency = country.currencies ? country.currencies[Object.keys(country.currencies)[0]].name : 'Monnaie indisponible';
    const capital = country.capital ? country.capital.join(', ') : 'Capitale indisponible';
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'Langues indisponibles';

    infosContent.innerHTML = `<img src="${flag}"></img>
                            <p>${name}</p>
                            <p>monnaie officielle : ${currency}</p>
                            <p>capitale: ${capital}</p>
                            <p>langue officelle: ${languages}</p>`
}

export const handleClickEvent = async (data) => {
    // Au click sur un pays
    // récupérer le code 3 pays

    const getCode3Country = () => {
        return data.properties.adm0_a3;
    }

    // récupérer les données du pays séléctionné
    const countriesDatas = await getCountries();
    const selectedCountry = countriesDatas.filter((pays) => pays.cca3 === data.properties.adm0_a3);

    if (!selectedCountry || selectedCountry.length === 0) {
        console.error('Country not found for code', data.properties.adm0_a3);
        return [getCode3Country(), null];
    }

    // récupérer le code 3 devise
    const getCode3Devise = () => {
        return selectedCountry[0].currencies ? Object.keys(selectedCountry[0].currencies)[0] : null;
    }

    // Affiche la carte infos
    displayCountryInfos(selectedCountry[0]);

    // met à jour le converter avec la première devise
    updateConverter(1, data.properties.adm0_a3);

    ///////////////////////////////////////////////////////////////////////
    
    return [getCode3Country(), getCode3Devise()];
}

// Display le converter
document.querySelector(".convert-btn button").addEventListener("click", () => {
    handleDisplayConverter(true);

})

// close infos pays
document.querySelector(".selected-country-infos .close-btn").addEventListener("click", () => {
    document.querySelector(".selected-country-infos").classList.remove("actif");
    document.querySelector("#map-holder").classList.remove("infos");
})