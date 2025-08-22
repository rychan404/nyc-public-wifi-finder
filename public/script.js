"use strict"
const myForm = document.getElementById('form');
 
const address = {
    street: '',
    city: '',
    state: '',
    postalcode: ''
}

myForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const mapHTML = document.getElementById('map');
    const mapDiv = document.createElement('div');
    const placeInfo = {
      title: document.querySelector('#place h2'),
      wifiName: document.querySelector('#place h3'),
      location: document.querySelector('#place p'),
      image: document.querySelector('#place img')
    };
    mapDiv.id = 'map';
    mapHTML.replaceWith(mapDiv);
    getAddress();
    const formattedAddress = formatAddress();
    const coordinates = await geocode(formattedAddress, placeInfo.title);
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
    
    placeInfo.image.src = await getWikipedia(place[10]);
    placeInfo.title.innerHTML = place[10];
    placeInfo.wifiName.innerHTML = place[17];
    placeInfo.location.innerHTML = `Located ${place[11]} in ${place[12]}`;
    const placeLat = parseFloat(place[18]);
    const placeLon = parseFloat(place[19]);
    let map = L.map('map').setView([placeLat, placeLon], 15);
    let marker = L.marker([placeLat, placeLon]).addTo(map);
    marker.bindPopup(`<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place[10])}" target="_blank">Open in Google Maps</a>`).openPopup();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
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

async function geocode(formattedAddress, errorMessage) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) {
    errorMessage.innerHTML = 'Address invalid';
    throw new Error('Address invalid');
  }
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}
/*
async function reverseGeocode(placeName) {
  let url = `https://nominatim.openstreetmap.org/search?q=${placeName}&extratags=1&format=json`;
  let res = await fetch(url);
  let data = await res.json();
  console.log(data);
}
*/

async function getDataset() {
  const url = 'https://data.cityofnewyork.us/api/views/npnk-wrj8/rows.json?accessType=DOWNLOAD';
  const res = await fetch(url);
  const data = await res.json();
  return data.data;
}

async function getWikipedia(place) {
  if (place.startsWith('Wolfes')) {
    place = "Wolfe's Pond Park";
  } else if (place.startsWith('Bowne')) {
    place = "Bowne Park";
  }
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(place)}&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const wikiHTML = data.parse.text["*"];
  let imageURL = wikiHTML.substring(wikiHTML.indexOf('<img src="') + '<img src="'.length);
  let index = 0;
  for (let char of imageURL) {
    if (char === '"') {
      break;    
    } else {
      index++;
    }
  }
  imageURL = imageURL.substring(0, index);
  return imageURL;
}