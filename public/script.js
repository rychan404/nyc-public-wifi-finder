"use strict"
const myForm = document.getElementById('form');
 
let address = {
    street: '',
    city: '',
    state: '',
    postalcode: ''
}
myForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    getAddress();
    const formattedAddress = formatAddress();
    const coordinates = await geocode(formattedAddress);
    const dataset = await getDataset();
    const distances = [];
    for (let place of dataset) {
      const lat = takeDifference(place[18], coordinates[0])**2;
      const lon = takeDifference(place[19], coordinates[1])**2;
      const distance = findDistance(lat, lon);
      distances.push(distance);
    }
    const minDistance = Math.min(...distances);
    const place = dataset[distances.indexOf(minDistance)];
    console.log(place);
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
function takeDifference(value1, value2) {
  return Math.abs(parseFloat((value1 - value2).toFixed(17)));
}

function findDistance(value1, value2) {
  return parseFloat(Math.sqrt(parseFloat((value1 + value2).toFixed(17)).toFixed(17)));
}

async function geocode(formattedAddress) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

async function getDataset() {
  const url = 'https://data.cityofnewyork.us/api/views/npnk-wrj8/rows.json?accessType=DOWNLOAD'
  const res = await fetch(url);
  const data = await res.json();
  return data.data;
}