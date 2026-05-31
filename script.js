/* =====================================================
   Tripzy — Travel Booking & Planning (Vanilla JS)
   Beginner-friendly. Uses localStorage for persistence.
   ===================================================== */

// ---------- SAMPLE DATA ----------
const DESTINATIONS = [
  { id: 'd1', name: 'Paris', country: 'France', price: 850, rating: 4.8,
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tag: 'Romantic' },
  { id: 'd2', name: 'Bali', country: 'Indonesia', price: 620, rating: 4.7,
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tag: 'Beach' },
  { id: 'd3', name: 'Tokyo', country: 'Japan', price: 1100, rating: 4.9,
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    tag: 'City' },
  { id: 'd4', name: 'Santorini', country: 'Greece', price: 980, rating: 4.8,
    img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    tag: 'Island' },
  { id: 'd5', name: 'Dubai', country: 'UAE', price: 760, rating: 4.6,
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tag: 'Luxury' },
  { id: 'd6', name: 'New York', country: 'USA', price: 1200, rating: 4.7,
    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    tag: 'Urban' },
];

const HOTELS = [
  { id: 'h1', name: 'The Grand Palace', city: 'Paris', price: 320, rating: 4.8,
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'h2', name: 'Ocean Breeze Resort', city: 'Bali', price: 180, rating: 4.6,
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
  { id: 'h3', name: 'Sakura Boutique', city: 'Tokyo', price: 240, rating: 4.7,
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
  { id: 'h4', name: 'Cliffside Suites', city: 'Santorini', price: 410, rating: 4.9,
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80' },
  { id: 'h5', name: 'Budget Inn Central', city: 'Bangkok', price: 65, rating: 4.2,
    img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80' },
  { id: 'h6', name: 'Skyline Tower Hotel', city: 'Dubai', price: 290, rating: 4.7,
    img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80' },
];

// ---------- STATE ----------
let favorites = JSON.parse(localStorage.getItem('tripzy_favs') || '[]');
let itinerary = JSON.parse(localStorage.getItem('tripzy_itinerary') || '[]');

const saveFavs = () => localStorage.setItem('tripzy_favs', JSON.stringify(favorites));
const saveItin = () => localStorage.setItem('tripzy_itinerary', JSON.stringify(itinerary));

// ---------- HELPERS ----------
function scrollToId(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

function isFav(id) { return favorites.includes(id); }

function toggleFavorite(id) {
  if (isFav(id)) {
    favorites = favorites.filter(f => f !== id);
    toast('Removed from favorites');
  } else {
    favorites.push(id);
    toast('Added to favorites ❤️');
  }
  saveFavs();
  renderAll();
}

// ---------- RENDER: DESTINATIONS ----------
function renderDestinations(filter = '') {
  const grid = document.getElementById('destGrid');
  const q = filter.toLowerCase();
  const list = DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
  );
  grid.innerHTML = list.map(d => `
    <article class="card dest-card">
      <div class="img">
        <img src="${d.img}" alt="${d.name}" loading="lazy" />
        <button class="fav-btn ${isFav(d.id) ? 'active' : ''}" onclick="toggleFavorite('${d.id}')">♥</button>
      </div>
      <div class="card-body">
        <h3>${d.name}</h3>
        <p class="muted">${d.country}</p>
        <span class="tag">${d.tag}</span>
        <div class="card-meta">
          <span class="price">From $${d.price}</span>
          <span class="rating">★ ${d.rating}</span>
        </div>
      </div>
    </article>
  `).join('') || `<p class="muted">No destinations found.</p>`;
}

// ---------- RENDER: HOTELS ----------
function renderHotels(filter = 'all') {
  const grid = document.getElementById('hotelGrid');
  const list = HOTELS.filter(h => {
    if (filter === 'budget') return h.price < 100;
    if (filter === 'mid') return h.price >= 100 && h.price <= 250;
    if (filter === 'luxury') return h.price > 250;
    return true;
  });
  grid.innerHTML = list.map(h => `
    <article class="card hotel-card">
      <div class="img">
        <img src="${h.img}" alt="${h.name}" loading="lazy" />
        <button class="fav-btn ${isFav(h.id) ? 'active' : ''}" onclick="toggleFavorite('${h.id}')">♥</button>
      </div>
      <div class="card-body">
        <h3>${h.name}</h3>
        <p class="muted">${h.city}</p>
        <div class="card-meta">
          <span class="price">$${h.price}/night</span>
          <span class="rating">★ ${h.rating}</span>
        </div>
      </div>
    </article>
  `).join('') || `<p class="muted">No hotels match this filter.</p>`;
}

// ---------- RENDER: FAVORITES ----------
function renderFavorites() {
  const grid = document.getElementById('favGrid');
  const empty = document.getElementById('favEmpty');
  const all = [...DESTINATIONS, ...HOTELS].filter(x => isFav(x.id));
  if (!all.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = all.map(x => `
    <article class="card">
      <div class="img">
        <img src="${x.img}" alt="${x.name}" loading="lazy" />
        <button class="fav-btn active" onclick="toggleFavorite('${x.id}')">♥</button>
      </div>
      <div class="card-body">
        <h3>${x.name}</h3>
        <p class="muted">${x.country || x.city}</p>
        <div class="card-meta">
          <span class="price">$${x.price}${x.city ? '/night' : ''}</span>
          <span class="rating">★ ${x.rating}</span>
        </div>
      </div>
    </article>
  `).join('');
}

// ---------- TRIP PLANNER ----------
function renderItinerary() {
  const list = document.getElementById('itineraryList');
  if (!itinerary.length) {
    list.innerHTML = `<p class="muted">No activities planned yet. Add your first one →</p>`;
    return;
  }
  // Sort by day
  const sorted = [...itinerary].sort((a, b) => a.day - b.day);
  list.innerHTML = sorted.map(it => `
    <div class="itinerary-item">
      <div class="info">
        <strong>Day ${it.day} — ${it.activity}</strong>
        <small>${it.location || 'No location'}</small>
      </div>
      <div>
        <span class="cost">$${it.cost}</span>
        <button onclick="removeActivity('${it.id}')" title="Remove">✕</button>
      </div>
    </div>
  `).join('');
}

function removeActivity(id) {
  itinerary = itinerary.filter(i => i.id !== id);
  saveItin();
  renderItinerary();
  toast('Activity removed');
}

document.addEventListener('DOMContentLoaded', () => {
  // Planner form
  document.getElementById('plannerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const item = {
      id: 'a' + Date.now(),
      day: Number(document.getElementById('planDay').value) || 1,
      activity: document.getElementById('planActivity').value.trim(),
      location: document.getElementById('planLocation').value.trim(),
      cost: Number(document.getElementById('planCost').value) || 0,
    };
    if (!item.activity) return;
    itinerary.push(item);
    saveItin();
    renderItinerary();
    e.target.reset();
    document.getElementById('planDay').value = item.day;
    toast('Activity added to itinerary');
  });

  // Destination search
  document.getElementById('destSearch').addEventListener('input', (e) => {
    renderDestinations(e.target.value);
  });

  // Hotel filter
  document.getElementById('hotelFilter').addEventListener('change', (e) => {
    renderHotels(e.target.value);
  });

  // Hamburger menu (mobile)
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  renderAll();
});

// ---------- HERO SEARCH ----------
function runHeroSearch() {
  const q = document.getElementById('heroSearch').value.trim();
  if (q) {
    document.getElementById('destSearch').value = q;
    renderDestinations(q);
  }
  scrollToId('destinations');
}

// ---------- BUDGET ESTIMATOR ----------
function estimateBudget() {
  const total = Number(document.getElementById('totalBudget').value);
  const days = Number(document.getElementById('tripDays').value);
  const ppl = Number(document.getElementById('tripTravelers').value);
  const result = document.getElementById('budgetResult');

  if (!total || !days || !ppl) {
    result.innerHTML = `<h3>Smart Breakdown</h3>
      <p class="muted">Please fill in budget, days and travelers.</p>`;
    return;
  }

  // Typical travel cost split
  const split = {
    'Stay (40%)': total * 0.40,
    'Food (20%)': total * 0.20,
    'Transport (20%)': total * 0.20,
    'Activities (15%)': total * 0.15,
    'Misc (5%)': total * 0.05,
  };

  const daily = (total / days).toFixed(0);
  const perPerson = (total / ppl).toFixed(0);

  result.innerHTML = `
    <h3>Smart Breakdown</h3>
    <p class="muted">For $${total} over ${days} days, ${ppl} traveler(s).</p>
    <div class="breakdown">
      <div class="bd-row"><strong>Daily Budget</strong><span>$${daily}</span></div>
      <div class="bd-row"><strong>Per Person</strong><span>$${perPerson}</span></div>
      ${Object.entries(split).map(([k,v]) =>
        `<div class="bd-row"><strong>${k}</strong><span>$${v.toFixed(0)}</span></div>`
      ).join('')}
    </div>
  `;
}

// ---------- MASTER RENDER ----------
function renderAll() {
  renderDestinations(document.getElementById('destSearch')?.value || '');
  renderHotels(document.getElementById('hotelFilter')?.value || 'all');
  renderFavorites();
  renderItinerary();
}