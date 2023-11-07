const countries = [
    {
        name: 'Bolivia',
        coordinates: [-16.2902, -63.5887],
        Categories: 'Dictatorship, coup, Operation Condor, reparation law, truth commission, indigenous peoples.',
        capital: 'Sucre',
        Militarydictatorships: '1964-1982',
        htmlLink: './Bolivia.html',
        image: './Bolivia.Png'
        
    },
    {
        name: 'Ecuador',
        coordinates: [-1.8312, -78.1834],
        Categories: 'Coup, reparation law, indigenous peoples, truth commission.',
        capital: 'Quito',
        Militarydictatorships: '1983 - 2008',
        htmlLink: './Ecuador.html',
        image: './Ecuador.png'
    },
    {
        name: 'Panama',
        coordinates: [8.5375, -80.7821],
        Categories: 'Dictatorship, coup, Operation Condor, international armed conflict, truth commission.',
        capital: 'Panama City',
        Militarydictatorships: '1968-1989',
        htmlLink: './Panama.html',
        image: './Panama.png'
    },
    {
        name: 'Chile',
        coordinates: [-35.6751, -71.5430],
        Categories: 'Dictatorship, coup, Operation Condor, reparation law, truth commission, state museum, memorial sites.',
        capital: 'Santiago',
        Militarydictatorships: '1973-1990',
        htmlLink: './Chile.html',
        image: './Chile.png'
    },
    {
        name: 'Paraguay',
        coordinates: [-23.442503, -58.443832],
        Categories: 'Dictatorship, coup, Operation Condor, indigenous peoples, reparations law, truth commission, state museum, memorial sites.',
        capital: 'Asunción',
        Militarydictatorships : '1954-1989',
        htmlLink: './Paraguay.html',
        image: './Paraguay.png'
    },
    {
        name: 'Peru',
        coordinates: [-9.1900, -75.0152],
        Categories: 'Internal armed conflict, indigenous peoples, truth commission, reparations law, state museum memorial sites.',
        capital: 'Lima',
        Militarydictatorships : '1980-2000',
        htmlLink: './Peru.html',
        image: './Peru.png'
    },
    {
        name: 'Uruguay',
        coordinates: [-32.5228, -55.7658],
        Categories: 'Dictatorship, coup, Operation Condor, amnesty law, reparation law, truth commission, state museum, memorial sites.',
        capital: 'Montevideo',
        Militarydictatorships : '1973-1985',
        htmlLink: './Uruguay.html',
        image: './Uruguay.png'
    },
    {
        name: 'Brazil',
        coordinates: [-14.2350, -51.9253],
        Categories: 'Dictatorship, coup, Operation Condor, amnesty law, reparations law, truth commission, memorial sites.',
        capital: 'Brasília',
        Militarydictatorships : '1964-1985',
        htmlLink: './Brazil.html',
        image: './Brazil.png'
    },
    {
        name: 'Argentina',
        coordinates: [-38.4161, -63.6167],
        Categories: 'Dictatorship, coup, Operation Condor, international armed conflict, truth commission, state museum, memorial sites. ',
        capital: 'Buenos Aires',
        Militarydictatorships : '1976-1983',
        htmlLink: './Argentina.html',
        image: './Argentina.png'
    },
    {
        name: 'Venezuela',
        coordinates: [6.4238, -66.5897],
        Categories: 'Coup, armed forces, authoritarian government, economic crisis, migration.',
        capital: 'Caracas',
        Militarydictatorships : '1989',
        htmlLink: './Venezuela.html',
        image: './Venezuela.png'
    },
    {
        name: 'Colombia',
        coordinates: [4.5709, -74.2973],
        Categories: 'Internal armed conflict, indigenous peoples, truth commission, reparations law, memorial sites.',
        capital: 'Bogotá',
        Militarydictatorships : '1960',
        htmlLink: './Colombia.html',
        image: './Comobia.png'
    },
    {
        name: 'El Salvador',
        coordinates: [13.7942, -88.8965],
        Categories: 'Internal armed conflict, coup, truth commission, indigenous peoples',
        capital: 'San Salvador',
        Militarydictatorships : '1980-1992',
        htmlLink: './Elsalvador.html',
        image: './Elsalvador.png'
    }
];

const map = L.map('map', {
    maxZoom: 15, // Set the maximum zoom level to restrict zooming out
    minZoom: 4
}).setView([-15, -60], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);



countries.forEach(country => {
    const marker = L.marker(country.coordinates)
        .addTo(map)
        .on('click', function() {
            const popupContent = `
                <strong>${country.name}</strong><br>
                <strong>Capital:</strong> ${country.capital}<br>
                <strong>Military dictatorships: </strong> ${country.Militarydictatorships}<br>
                <strong>Categories: </strong> ${country.Categories}<br>
                <img src="${country.image}" alt="${country.name} Image" width="270" height="120"><br>
                <a href="${country.htmlLink}" target="_blank">See More</a><br><br>
                
            `;
            L.popup()
                .setLatLng(marker.getLatLng())
                .setContent(popupContent)
                .openOn(map);
        });
});

const southAmericaBounds = [
    [-56.4, -180], // Southwest
    [19.5, -35]    // Northeast
];

map.setMaxBounds(southAmericaBounds);
map.on('drag', function () {
    map.panInsideBounds(southAmericaBounds, { animate: false });
});



const countrySelect = document.getElementById('country-select');
countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.name;
    option.textContent = country.name;
    countrySelect.appendChild(option);
});

// Event listener for country selection
countrySelect.addEventListener('change', function () {
    const selectedCountryName = countrySelect.value;
    const selectedCountry = countries.find(country => country.name === selectedCountryName);

    if (selectedCountry) {
        // Center the map on the selected country's coordinates
        map.setView(selectedCountry.coordinates, 6);

        // Show a popup with the selected country's information
        const popupContent = `
            <strong>${selectedCountry.name}</strong><br>
            <strong>Capital:</strong> ${selectedCountry.capital}<br>
            <strong>Military dictatorships: </strong> ${selectedCountry.Militarydictatorships}<br>
            <strong>Categories:</strong> ${selectedCountry.Categories}<br>
            
        `;

        // Create a marker and popup for the selected country
        const marker = L.marker(selectedCountry.coordinates)
            .addTo(map)
            .bindPopup(popupContent)
            .openPopup();
    }
});


