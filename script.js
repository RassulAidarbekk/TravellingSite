const results = document.getElementById('search-input') && document.getElementById('results');
const input = document.getElementById('search-input');
let data = null;

function card(item) {
  return '<article class="result-card"><img src="' + item.imageUrl + '" alt="' + item.name + '">' +
    '<div><h3>' + item.name + '</h3><p>' + item.description + '</p></div></article>';
}

async function search() {
  const key = input.value.trim().toLowerCase();
  if (!key) { results.innerHTML = ''; return; }
  try {
    if (!data) data = await (await fetch('travel-recommendation.json')).json();
    let list = [];
    if (key.startsWith('beach')) list = data.beaches;
    else if (key.startsWith('temple')) list = data.temples;
    else if (key.startsWith('countr')) list = data.countries.flatMap(c => c.cities);
    else {
      const match = data.countries.find(c => c.name.toLowerCase().includes(key));
      if (match) list = match.cities;
    }
    results.innerHTML = list.length ? list.map(card).join('') : '<p>No results found. Try "beach", "temple" or "country".</p>';
  } catch (err) {
    results.innerHTML = '<p>Could not load recommendations.</p>';
  }
}

if (input) {
  document.getElementById('search-btn').addEventListener('click', search);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
  document.getElementById('reset-btn').addEventListener('click', () => { input.value = ''; results.innerHTML = ''; });
}
