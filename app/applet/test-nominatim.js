fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=hamburg', {
  headers: {
    'User-Agent': 'GeoTagHQ/1.0 contact@example.com',
    'Accept': 'application/json'
  }
}).then(res => {
  console.log('Status:', res.status, res.statusText);
  return res.text();
}).then(text => console.log('Body:', text.slice(0, 500))).catch(err => console.error(err));
