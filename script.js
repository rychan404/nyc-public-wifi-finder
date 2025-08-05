"use strict"
const myForm = document.getElementById('form');
 
let address = {
    street : '',
    city : '',
    state : '',
    zip : ''
}

fetch('/api-key')
  .then(res => res.json())
  .then(data => {
    console.log('Response from backend:', data);
});

myForm.addEventListener('submit', function(event) {
    event.preventDefault();
    getAddress();
    let formattedAddress = formatAddress();
    geocode(formattedAddress);
});
function getAddress() {
  for (const addressPart of myForm.elements) {
      if (addressPart.type === 'text' || addressPart.id === 'state') {
          address[addressPart.id] = addressPart.value;
      }
  }
}
function formatAddress() {
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
}
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