/* ============================================================
   WS PEÇAS E ELETRÔNICOS — Script do Catálogo Principal
   ============================================================ */

// ── CONFIGURAÇÃO ────────────────────────────────────────────────
// ⚠️  ALTERE o número abaixo para o WhatsApp do vendedor
// Formato: código do país + DDD + número (somente dígitos)
const WHATSAPP_NUMBER = '5561983733370';

// Chaves do localStorage (compartilhadas com o painel admin)
const STORAGE_KEY = 'ws_products';
const WPP_KEY     = 'ws_whatsapp';

// ── PRODUTOS PADRÃO ─────────────────────────────────────────────
// Exibidos quando nenhum produto foi cadastrado pelo admin ainda
const DEFAULT_PRODUCTS = [
  {
    id: 1, brand: 'Samsung', name: 'Galaxy S24 Ultra',
    price: 6499, oldPrice: 7299, badge: 'TOP VENDA', active: true,
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
      'https://images.unsplash.com/photo-1610945415343-3ea4ead4c4e7?w=400&q=80',
    ],
    specs: { Tela: '6.8" QHD+ AMOLED', RAM: '12 GB', Armazenamento: '256 GB', Câmera: '200 MP', Bateria: '5.000 mAh', SO: 'Android 14' },
    description: 'O flagship definitivo da Samsung com câmera de 200MP e S Pen integrada.',
  },
  {
    id: 2, brand: 'Samsung', name: 'Galaxy A55 5G',
    price: 2199, oldPrice: 2599, badge: 'OFERTA', active: true,
    img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=80',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=80'],
    specs: { Tela: '6.6" FHD+ AMOLED', RAM: '8 GB', Armazenamento: '128 GB', Câmera: '50 MP', Bateria: '5.000 mAh', SO: 'Android 14' },
    description: 'Intermediário premium com design refinado e câmera de 50MP.',
  },
  {
    id: 3, brand: 'iPhone', name: 'iPhone 15 Pro Max',
    price: 9299, oldPrice: 10499, badge: 'PREMIUM', active: true,
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    imgs: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80'],
    specs: { Tela: '6.7" Super Retina XDR', RAM: '8 GB', Armazenamento: '256 GB', Câmera: '48 MP', Bateria: '4.422 mAh', SO: 'iOS 17' },
    description: 'O iPhone mais avançado com chip A17 Pro e câmera de 48MP.',
  },
  {
    id: 4, brand: 'iPhone', name: 'iPhone 14',
    price: 5499, oldPrice: 6299, badge: null, active: true,
    img: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80',
    imgs: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80'],
    specs: { Tela: '6.1" Super Retina XDR', RAM: '6 GB', Armazenamento: '128 GB', Câmera: '12 MP', Bateria: '3.279 mAh', SO: 'iOS 17' },
    description: 'iPhone 14 com excelente desempenho e câmera aprimorada.',
  },
  {
    id: 5, brand: 'Motorola', name: 'Moto G84',
    price: 1399, oldPrice: 1699, badge: 'CUSTO-BENEFÍCIO', active: true,
    img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80',
    imgs: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80'],
    specs: { Tela: '6.55" FHD+ OLED', RAM: '12 GB', Armazenamento: '256 GB', Câmera: '50 MP', Bateria: '5.000 mAh', SO: 'Android 13' },
    description: 'O melhor custo-benefício com tela OLED e 12GB de RAM.',
  },
  {
    id: 6, brand: 'Xiaomi', name: 'Redmi Note 13',
    price: 1599, oldPrice: 1899, badge: 'OFERTA', active: true,
    img: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80',
    imgs: ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80'],
    specs: { Tela: '6.67" FHD+ AMOLED', RAM: '8 GB', Armazenamento: '256 GB', Câmera: '108 MP', Bateria: '5.000 mAh', SO: 'Android 13' },
    description: 'Câmera de 108MP e tela AMOLED por um preço incrível.',
  },
];

// ── ESTADO GLOBAL ────────────────────────────────────────────────
let products      = [];
let cart          = [];
let currentFilter = 'todos';
let wppNumber     = WHATSAPP_NUMBER;

// ── UTILITÁRIOS ──────────────────────────────────────────────────

/** Formata valor para Real Brasileiro */
function fmt(v) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

/** Carrega produtos e WhatsApp do localStorage */
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    products = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    const savedWpp = localStorage.getItem(WPP_KEY);
    if (savedWpp) wppNumber = savedWpp;
  } catch (e) {
    products = DEFAULT_PRODUCTS;
  }
}

// ── FILTROS ───────────────────────────────────────────────────────

/** Constrói os botões de filtro por marca */
function buildFilters() {
  const active = products.filter(p => p.active !== false);
  const brands  = ['todos', ...new Set(active.map(p => p.brand))];
  document.getElementById('filtersBar').innerHTML = brands.map(b =>
    `<button class="filter-btn ${b === currentFilter ? 'active' : ''}" onclick="setFilter('${b}', this)">
      ${b === 'todos' ? 'Todos' : b}
    </button>`
  ).join('');
}

/** Define o filtro ativo e atualiza o catálogo */
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterProducts();
}

/** Filtra produtos por marca e busca de texto */
function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  let list = products.filter(p => p.active !== false);
  if (currentFilter !== 'todos') list = list.filter(p => p.brand === currentFilter);
  if (q) list = list.filter(p => (p.brand + ' ' + p.name).toLowerCase().includes(q));
  renderCatalog(list);
}

// ── RENDERIZAÇÃO ──────────────────────────────────────────────────

/** Renderiza os cards no grid */
function renderCatalog(list) {
  const el = document.getElementById('catalog');

  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><span>📱</span>Nenhum produto encontrado.</div>';
    return;
  }

  el.innerHTML = list.map(p => `
    <div class="card" onclick="openModal(${p.id})">
      ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
      <img class="card-img"
           src="${p.img || ''}" alt="${p.name}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x400/0d2060/F5C200?text=📱'">
      <div class="card-body">
        <div class="card-brand">${p.brand}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-specs">
          ${p.specs ? Object.entries(p.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' · ') : ''}
        </div>
        ${p.oldPrice ? `<div class="card-old-price">${fmt(p.oldPrice)}</div>` : ''}
        <div class="card-price"><span>R$</span> ${p.price.toLocaleString('pt-BR')}</div>
      </div>
      <div class="card-footer" onclick="event.stopPropagation()">
        <button class="btn-add"  onclick="addToCart(${p.id})">+ Carrinho</button>
        <button class="btn-view" onclick="openModal(${p.id})" title="Ver detalhes">🔍</button>
      </div>
    </div>
  `).join('');
}

// ── MODAL DE PRODUTO ──────────────────────────────────────────────

/** Abre o modal com detalhes do produto */
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalTitle').textContent       = p.name;
  document.getElementById('modalBrand').textContent       = p.brand;
  document.getElementById('modalName').textContent        = p.name;
  document.getElementById('modalMainImg').src             = p.img || '';
  document.getElementById('modalMainImg').alt             = p.name;
  document.getElementById('modalOld').textContent         = p.oldPrice ? 'De ' + fmt(p.oldPrice) : '';
  document.getElementById('modalPrice').textContent       = fmt(p.price);
  document.getElementById('modalInstallment').textContent =
    `ou 12x de R$ ${Math.ceil(p.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros`;

  document.getElementById('modalSpecs').innerHTML = p.specs
    ? Object.entries(p.specs).map(([k, v]) => `<li>${k} <strong>${v}</strong></li>`).join('')
    : '<li>Sem especificações cadastradas</li>';

  const imgs = (p.imgs && p.imgs.length) ? p.imgs : [p.img].filter(Boolean);
  document.getElementById('modalThumbs').innerHTML = imgs.map((src, i) =>
    `<img class="modal-thumb ${i === 0 ? 'active' : ''}"
          src="${src}" alt="foto ${i + 1}"
          onclick="setMainImg(this, '${src}')">`
  ).join('');

  document.getElementById('btnModalAdd').onclick = () => addToCart(p.id);
  document.getElementById('btnModalWpp').onclick = () => buyNow(p);

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Troca a imagem principal ao clicar em miniatura */
function setMainImg(thumb, src) {
  document.getElementById('modalMainImg').src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

// ── CARRINHO ──────────────────────────────────────────────────────

/** Adiciona produto ao carrinho */
function addToCart(id) {
  const p  = products.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  showToast('✔ ' + p.name + ' adicionado!');
}

/** Remove item do carrinho */
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

/** Altera quantidade do item */
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

/** Esvazia o carrinho */
function clearCart() {
  cart = [];
  updateCartUI();
}

/** Atualiza a interface do carrinho */
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);
  document.getElementById('cartTotal').textContent = fmt(total);

  const el = document.getElementById('cartItems');
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    return;
  }

  el.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.img || ''}" alt="${i.name}"
           onerror="this.src='https://via.placeholder.com/60x80?text=?'">
      <div class="cart-item-info">
        <div class="cart-item-name">${i.brand} ${i.name}</div>
        <div class="cart-item-price">${fmt(i.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${i.id}, -1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${i.id})" title="Remover">✕</button>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/** Redireciona para WhatsApp com resumo do pedido */
function checkout() {
  if (!cart.length) { showToast('Adicione produtos ao carrinho!'); return; }
  const lines = cart.map(i => `• ${i.brand} ${i.name} (x${i.qty}) — ${fmt(i.price * i.qty)}`).join('%0A');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const msg   = `Olá! Gostaria de finalizar meu pedido:%0A%0A${lines}%0A%0A*Total: ${fmt(total)}*%0A%0APor favor, me informe sobre pagamento e entrega. Obrigado!`;
  window.open(`https://wa.me/${wppNumber}?text=${msg}`, '_blank');
}

/** Compra direta de um produto via WhatsApp */
function buyNow(p) {
  const msg = `Olá! Tenho interesse em:%0A%0A*${p.brand} ${p.name}*%0APreço: ${fmt(p.price)}%0A%0APor favor, me informe sobre pagamento e entrega. Obrigado!`;
  window.open(`https://wa.me/${wppNumber}?text=${msg}`, '_blank');
}

// ── TOAST ─────────────────────────────────────────────────────────
let toastTimer;

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────
loadData();
buildFilters();
filterProducts();

// Detecta alterações feitas pelo painel admin em outra aba
window.addEventListener('storage', e => {
  if (e.key === STORAGE_KEY || e.key === WPP_KEY) {
    loadData();
    buildFilters();
    filterProducts();
  }
});