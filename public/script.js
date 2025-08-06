"use strict"
const myForm = document.getElementById('form');
 
let address = {
    street : '',
    city : '',
    state : '',
    zip : ''
}
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
  fetch('/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formattedAddress })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Geocode result:', data);
  });
}