import { choiceCountries } from "./select_country.js";
import { initChangeCountry } from "./change_current_country.js";
import { updateConverter } from "./devises.js";

// export const choiceCountries = await getAllCountriesUse();
const choiceCountryContainer = document.querySelector(".choice-country-container");
const countrySelect = document.getElementById("country-select");
const nextButton = document.getElementById('next-button');
const changeCountry = document.querySelector('.current-country');


// First choice
const initAskCountry = (countries) => {
    // créer toute la liste de nom de pays à partir de choiceCountries (tableau de pays)
    countries.forEach(country => {
        countrySelect.innerHTML += `<option value="${country.codecountry}">${country.name}</option>`;
    });

    // show a message if no countries were added
    const countryError = document.getElementById('country-error');
    if (countrySelect.options.length <= 1) {
        if (countryError) countryError.classList.remove('hidden');
    } else {
        if (countryError) countryError.classList.add('hidden');
    }

    //peut avoir à partir de la window pour mettre en valeur par default ??

    // Ajout Event click sur le bouton pour enrgistrer le pays choisi
    nextButton.addEventListener("click", (event) => {
        event.preventDefault();

        // enregistre le pays
        let selectedCountry = countrySelect.value;

        if (!selectedCountry) {
            alert("Veuillez choisir un pays.");
            return;
        }

        // init l'onglet de changement de pays
        initChangeCountry(selectedCountry, choiceCountries);
        changeCountry.classList.add("active");
        
        // cache le form
        hideAskCountry();


        // met à jour le converter avec la première devise

        // console.log(selectedCountry)
        updateConverter(0, selectedCountry);
        /////////////////////////////////////////////////////////////////////////////////////

    })
}

// Caché la div du form de choix du pays
const hideAskCountry = () => {
    choiceCountryContainer.style.opacity = 0;
    choiceCountryContainer.style.visibility = "hidden";
}

// Init de la liste déroulante
initAskCountry(choiceCountries);