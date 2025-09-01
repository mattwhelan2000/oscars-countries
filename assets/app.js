
async function loadJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('Failed to load '+url);
  return await res.json();
}

function fmt(n, unit=''){
  if(n===null || n===undefined) return '—';
  const v = Number(n);
  if(!isFinite(v)) return n;
  if(v>=1e9) return (v/1e9).toFixed(2)+'B'+unit;
  if(v>=1e6) return (v/1e6).toFixed(2)+'M'+unit;
  if(v>=1e3) return (v/1e3).toFixed(2)+'K'+unit;
  return v.toLocaleString()+unit;
}

function animateBar(el, value, max){
  const pct = max>0 ? Math.min(100, Math.round((value/max)*100)) : 0;
  requestAnimationFrame(()=>{ el.style.width = pct + '%'; });
}

function setText(sel, text){
  const el = document.querySelector(sel);
  if(el) el.textContent = (text!==undefined && text!==null && text!=='' ) ? text : '—';
}

async function fetchCountry(code){
  const url = `./data/countries/${code}.json`;
  return await loadJSON(url);
}

async function initCountry(){
  const params = new URLSearchParams(location.search);
  const code = (params.get('code') || '').toUpperCase();
  const manifest = await loadJSON('./data/manifest.json');
  const max = manifest.max || {population:1, area_km2:1, highest_point_m:1};
  let item;
  try {
    item = await fetchCountry(code || manifest.countries[0].code);
  } catch(e){
    item = await fetchCountry(manifest.countries[0].code);
  }

  // Header
  setText('[data-bind="name"]', item.name);
  setText('[data-bind="code"]', item.code);
  document.querySelector('[data-bind="flag"]').src = item.flag || './images/placeholder.png';
  document.querySelector('[data-bind="flag"]').alt = item.name + ' flag';

  // Media
  const imgWrap = document.querySelector('[data-bind="images"]');
  imgWrap.innerHTML = '';
  (item.images||[]).forEach(src=>{
    const im = document.createElement('img');
    im.src = src || './images/placeholder.png';
    im.loading = 'lazy';
    imgWrap.appendChild(im);
  });
  // Video
  const v = document.querySelector('[data-bind="video"]');
  if(item.video_embed){
    v.innerHTML = '<iframe src="'+item.video_embed+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }else{
    v.innerHTML = '<div class="card small">No video yet.</div>';
  }

  // Sections
  setText('[data-bind="animals"]', (item.animals||[]).join(', '));
  setText('[data-bind="currency"]', item.currency);
  setText('[data-bind="languages"]', (item.languages||[]).join(', '));
  const locEl = document.querySelector('[data-bind="location"]');
  if (locEl) {
    const query = (item.location || '').trim();
    if (query) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      locEl.textContent = query;
      locEl.href = url;
    } else {
      locEl.textContent = '—';
      locEl.removeAttribute('href');
    }
  }
  setText('[data-bind="facts"]', item.facts || '—');
  setText('[data-bind="history"]', item.history || '—');

  // Graphs
  const stats = {
    population: item.population,
    area_km2: item.area_km2,
    highest_point_m: item.highest_point_m
  };
  document.querySelector('[data-stat="population-val"]').textContent = fmt(stats.population);
  document.querySelector('[data-stat="area-val"]').textContent = fmt(stats.area_km2,' km²');
  document.querySelector('[data-stat="high-val"]').textContent = fmt(stats.highest_point_m,' m');
  animateBar(document.querySelector('[data-bar="population"]'), stats.population, max.population||1);
  animateBar(document.querySelector('[data-bar="area"]'), stats.area_km2, max.area_km2||1);
  animateBar(document.querySelector('[data-bar="high"]'), stats.highest_point_m, max.highest_point_m||1);

  // Breadcrumb link back to index
  const back = document.querySelector('[data-bind="back"]');
  if(back){ back.href = './index.html'; }
}

async function initIndex(){
  const manifest = await loadJSON('./data/manifest.json');
  const list = document.querySelector('[data-list]');
  const filter = document.querySelector('#filter');

  async function cardFor(entry){
    // fetch country to get flag without loading all
    try {
      const c = await fetchCountry(entry.code);
      const a = document.createElement('a');
      a.className='card country-link';
      a.href = './country.html?code='+encodeURIComponent(entry.code);
      a.innerHTML = '<img src="'+(c.flag||'./images/placeholder.png')+'" alt="'+entry.name+' flag"><div><div>'+entry.name+'</div><div class="small">'+entry.code+'</div></div>';
      return a;
    } catch(e){
      const a = document.createElement('a');
      a.className='card country-link';
      a.href = './country.html?code='+encodeURIComponent(entry.code);
      a.textContent = entry.name+' ('+entry.code+')';
      return a;
    }
  }

  async function render(q=''){
    list.innerHTML='';
    const ql = q.trim().toLowerCase();
    const filtered = manifest.countries
      .filter(c=>!ql || c.name.toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql));
    for (const entry of filtered){
      const card = await cardFor(entry);
      list.appendChild(card);
    }
  }
  render();
  filter?.addEventListener('input', e=>render(e.target.value));
}

// Entry
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.body.dataset.page==='country'){ initCountry(); }
  else { initIndex(); }
});
