"use strict"
const myForm = document.getElementById('form');
 
let address = {
    street : '',
    city : '',
    state : '',
    postalcode : '',
    format : 'json'
}
myForm.addEventListener('submit', function(event) {
    event.preventDefault();
    getAddress();
    let formattedAddress = formatAddress();
    geeocode(formattedAddress);
});

function getAddress() {
  for (const addressPart of myForm.elements) {
      if (addressPart.type === 'text' || addressPart.id === 'state') {
          address[addressPart.id] = addressPart.value;
      }
  }
}
function formatAddress() {
  return `${address.street}, ${address.city}, ${address.state} ${address.postalcode}`;
}

async function geeocode(formattedAddress) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data[0], null, 2));
}
/*
function geocode(formattedAddress) {
  fetch(`https://api.geocod.io/v1.9/geocode?q=${encodeURIComponent(formattedAddress)}&api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      if (results.length) {
        const { lat, lng } = results[0].location;
        console.log(`${lat}, ${lng}`);
      } else {
        console.log('No location results found');
      }
    })
    .catch(error => console.error(error));
}
*/