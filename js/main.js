const byId = (id) => document.getElementById(id);

function swapTexts() {
  const t1 = byId('text1');
  const t6 = byId('text6');
  if (!t1 || !t6) return;
  const v1 = t1.textContent;
  t1.textContent = t6.textContent;
  t6.textContent = v1;
}

function rhombusArea() {
  const d1 = 12;
  const d2 = 9;
  const s = (d1 * d2) / 2;
  const out = byId('rhombus-area');
  out.innerHTML = `<p><strong>Площа ромба:</strong> d1=${d1}, d2=${d2} → S=${s}</p>`;
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days*24*60*60*1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}
function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function handleTriangleCookies() {
  const triFormWrap = byId('triangle-section');
  const saved = getCookie('tri_result');
  if (saved) {
    const ok = confirm(`Збережено результат: ${saved}. Видалити дані з cookies?`);
    if (ok) {
      deleteCookie('tri_result');
      location.reload();
    } else {
      alert('Cookies наявні. За потреби перезавантажте сторінку.');
      triFormWrap.classList.add('hidden');
    }
  }
}

function triangleFormInit() {
  const form = document.getElementById('triangle-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const a = parseFloat(form.a.value);
    const b = parseFloat(form.b.value);
    const c = parseFloat(form.c.value);
    if ([a,b,c].some(v => !isFinite(v) || v <= 0)) {
      alert('Введіть додатні числа.');
      return;
    }
    const possible = a + b > c && a + c > b && b + c > a;
    const msg = possible ? 'Трикутник існує' : 'Трикутник не існує';
    alert(msg);
    setCookie('tri_result', `${msg} для a=${a}, b=${b}, c=${c}`, 7);
  });
}

function italicInit() {
  const block = byId('block2');
  const form = byId('italic-form');
  const saved = localStorage.getItem('italic_block2') || 'off';
  const input = Array.from(form.elements['italic']).find(r => r.value === saved);
  if (input) input.checked = true;
  block.style.fontStyle = saved === 'on' ? 'italic' : 'normal';

  block.addEventListener('mouseover', () => {
    const val = form.elements['italic'].value;
    block.style.fontStyle = (val === 'on') ? 'italic' : 'normal';
  });
  form.addEventListener('change', () => {
    const val = form.elements['italic'].value;
    localStorage.setItem('italic_block2', val);
  });
}

function listRender(blockEl, items) {
  const list = document.createElement('ol');
  list.className = 'zebra';
  items.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    list.appendChild(li);
  });
  blockEl.querySelectorAll('p, .inline-form, #triangle-section, #rhombus-area').forEach(n => {
    if (n.classList) n.classList.add('hidden');
  });
  blockEl.appendChild(list);
}

function listInit() {
  document.querySelectorAll('.make-list').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const blockId = parseInt(link.dataset.block, 10);
      const blockEl = document.getElementById('block' + blockId);
      if (blockEl.querySelector('form[data-list]')) return;

      const form = document.createElement('form');
      form.dataset.list = '1';
      form.innerHTML = `
        <h3>Нумерований список</h3>
        <label>Елементи (по одному в рядку)
          <textarea name="items" rows="5" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:10px;"></textarea>
        </label>
        <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
          <button type="submit">Зберегти список</button>
        </div>`;
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const raw = form.items.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        const key = 'ol_block_' + blockId;
        localStorage.setItem(key, JSON.stringify(raw));
        listRender(blockEl, raw);
      });
      blockEl.appendChild(form);
    });
  });

  for (let i = 1; i <= 6; i++) {
    const key = 'ol_block_' + i;
    const data = localStorage.getItem(key);
    if (data) {
      const items = JSON.parse(data);
      const blockEl = document.getElementById('block' + i);
      listRender(blockEl, items);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  swapTexts();
  rhombusArea();
  handleTriangleCookies();
  triangleFormInit();
  italicInit();
  listInit();
});
