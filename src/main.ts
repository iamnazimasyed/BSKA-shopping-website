import './index.css';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, UserProfile } from './types';

// --- CONFIG & STATE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let currentUser: User | null = null;
let cart: CartItem[] = [];

// --- ELEMENTS ---
const mainContent = document.getElementById('main-content')!;
const cartDrawer = document.getElementById('cart-drawer')!;
const cartOverlay = document.getElementById('cart-overlay')!;
const cartCountElem = document.getElementById('cart-count')!;
const announcementText = document.getElementById('announcement-text')!;
const loginBtn = document.getElementById('login-btn')!;
const logoutBtn = document.getElementById('logout-btn')!;
const userInfo = document.getElementById('user-info')!;
const cartBtn = document.getElementById('cart-btn')!;
const closeCartBtn = document.getElementById('close-cart')!;
const continueShoppingBtn = document.getElementById('continue-shopping')!;
const logo = document.getElementById('logo')!;
const navLinks = document.querySelectorAll('.nav-link');

// --- PAGES ---

function renderHome() {
  mainContent.innerHTML = `
    <section class="space-y-20">
      <div class="relative h-[600px] rounded-[40px] overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
        <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-10 text-center">
          <h2 class="text-8xl font-light tracking-tighter uppercase italic text-white mb-6">New Wave</h2>
          <p class="text-accent font-display text-xl tracking-[10px] mb-10">DROP 01 / COLLECTION 26</p>
          <button data-page="shop" class="nav-link py-4 px-12 bg-accent text-black font-bold rounded-full uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Shop Collection</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="glass p-10 rounded-[32px] flex flex-col justify-center space-y-6">
          <h3 class="text-4xl font-light tracking-tighter uppercase italic">The Studio</h3>
          <p class="text-zinc-500 font-sans leading-relaxed">BSKA is more than just apparel. It's a movement. Born from the streets of India, refined for the modern eye. Every piece is an exploration of form and function.</p>
          <button data-page="about" class="nav-link text-accent underline uppercase tracking-widest text-[11px] self-start">Read Our Story</button>
        </div>
        <div class="h-[400px] rounded-[32px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" class="w-full h-full object-cover grayscale" />
        </div>
      </div>

      <div class="space-y-10">
        <div class="flex justify-between items-end border-b border-zinc-800 pb-4">
          <h2 class="text-4xl font-light tracking-tighter uppercase italic">Featured Items</h2>
          <button data-page="shop" class="nav-link text-zinc-500 uppercase tracking-widest text-[10px] hover:text-accent">View All</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          ${INITIAL_PRODUCTS.slice(0, 3).map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>
  `;
  attachPageLinks();
  attachCartButtons();
}

function renderShop() {
  mainContent.innerHTML = `
    <div class="space-y-10">
      <div class="flex justify-between items-end border-b border-zinc-800 pb-4">
        <h1 class="text-6xl font-light tracking-tighter uppercase italic">Full Shop</h1>
        <p class="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">${INITIAL_PRODUCTS.length} ITEMS AVAILABLE</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        ${INITIAL_PRODUCTS.map(p => renderProductCard(p)).join('')}
      </div>
    </div>
  `;
  attachCartButtons();
}

function renderAbout() {
  mainContent.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-12 py-10">
      <h1 class="text-7xl font-light tracking-tighter uppercase italic border-b border-zinc-800 pb-6 text-center">Our Story</h1>
      <div class="space-y-8 text-lg font-sans leading-loose text-zinc-400">
        <p>Launched in 2026, <span class="text-accent underline">BSKA</span> began as a simple experiment in high-grade street apparel. We believed that the market was missing the perfect balance between raw Indian street culture and global editorial aesthetics.</p>
        <p>Every hoodie, every pair of denim, and every accessory is curated with an obsession for detail. We source our oversized blanks from sustainable mills and finalize every graphic in our local studios.</p>
        <div class="grid grid-cols-2 gap-4 h-[300px] overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" class="w-full h-full object-cover grayscale" />
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=500" class="w-full h-full object-cover grayscale" />
        </div>
        <p>We're not just selling clothes; we're providing the uniform for the new wave of Indian creatives. Welcome to the studio.</p>
      </div>
    </div>
  `;
}

function renderContact() {
  mainContent.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-12 py-10">
      <div class="text-center space-y-4">
        <h1 class="text-7xl font-light tracking-tighter uppercase italic">Inquiries</h1>
        <p class="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">REACH OUT TO THE STUDIO</p>
      </div>
      
      <form class="glass p-10 rounded-[32px] space-y-6 border border-zinc-800">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-zinc-500">Name</label>
            <input type="text" class="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-zinc-500">Email</label>
            <input type="email" class="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-zinc-500">Subject</label>
          <input type="text" class="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-zinc-500">Message</label>
          <textarea rows="5" class="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent"></textarea>
        </div>
        <button type="submit" class="w-full py-5 bg-accent text-black font-bold rounded-full text-xs uppercase tracking-[0.2em] transition-transform active:scale-95">Send Message</button>
      </form>
    </div>
  `;
}

function renderProductCard(product: Product) {
  return `
    <div class="glass rounded-[32px] p-5 text-center border border-zinc-800 transition-all hover:border-accent group">
      <div class="relative h-[440px] rounded-[24px] overflow-hidden bg-zinc-900">
        ${product.isSale ? `<span class="absolute top-4 left-4 bg-accent text-black text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest z-10 transition-transform group-hover:scale-110">Sale</span>` : ''}
        <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div class="mt-5 space-y-1">
        <h3 class="text-xl font-medium tracking-tight text-white font-sans uppercase">${product.name}</h3>
        <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">${product.category}</p>
      </div>
      <div class="mt-2 text-sm flex items-center justify-center gap-3">
        ${product.oldPrice ? `<span class="text-zinc-600 line-through decoration-accent/30 font-light italic">Rs. ${product.oldPrice.toLocaleString()}</span>` : ''}
        <span class="text-accent font-semibold tracking-tight text-lg">Rs. ${product.price.toLocaleString()}</span>
      </div>
      <button 
        data-id="${product.id}"
        class="add-to-cart-btn mt-6 w-full py-4 rounded-full border border-zinc-700 bg-transparent text-white text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-accent hover:text-black hover:border-accent active:scale-95"
      >
        Add to Bag
      </button>
    </div>
  `;
}

function attachCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id!;
      const product = INITIAL_PRODUCTS.find(p => p.id === id)!;
      handleAddToCart(product);
    });
  });
}

function attachPageLinks() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const page = (e.currentTarget as HTMLElement).dataset.page;
      if (page) switchPage(page);
    });
  });
}

function switchPage(page: string) {
  // Update nav active states
  navLinks.forEach(link => {
    const linkPage = (link as HTMLElement).dataset.page;
    if (linkPage === page) {
      link.classList.add('text-accent', 'border-b', 'border-accent', 'pb-1');
    } else {
      link.classList.remove('text-accent', 'border-b', 'border-accent', 'pb-1');
    }
  });

  switch (page) {
    case 'home': renderHome(); break;
    case 'shop': renderShop(); break;
    case 'about': renderAbout(); break;
    case 'contact': renderContact(); break;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- RENDERERS CONTINUED ---

function renderCart() {
  const container = document.getElementById('cart-items')!;
  const cartItems = cart.map(item => ({
    ...item,
    product: INITIAL_PRODUCTS.find(p => p.id === item.productId)!
  })).filter(item => item.product);

  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  container.innerHTML = cartItems.length === 0 
    ? `<div class="h-full flex flex-col items-center justify-center opacity-20 space-y-4 pt-20">
         <h3 class="text-4xl font-light uppercase tracking-tighter italic">Empty Bag</h3>
       </div>`
    : cartItems.map(item => `
      <div class="glass p-5 rounded-[24px] flex gap-8 border border-zinc-800 group relative">
        <div class="w-32 h-40 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
          <img src="${item.product.imageUrl}" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
        <div class="flex-1 flex flex-col justify-between py-2">
          <div>
            <div class="flex justify-between items-start">
              <h4 class="text-xl font-medium tracking-tight text-white uppercase">${item.product.name}</h4>
              <span class="text-accent font-bold">Rs. ${item.product.price.toLocaleString()}</span>
            </div>
            <p class="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-2">${item.product.category}</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center border border-zinc-700 rounded-full bg-black/40 overflow-hidden">
              <button class="cart-qty-btn px-4 py-1.5 hover:bg-white/5 transition-colors" data-id="${item.productId}" data-delta="-1">-</button>
              <span class="w-10 text-center text-[13px] font-sans border-x border-zinc-700">${item.quantity}</span>
              <button class="cart-qty-btn px-4 py-1.5 hover:bg-white/5 transition-colors" data-id="${item.productId}" data-delta="1">+</button>
            </div>
            <button class="cart-remove-btn text-[10px] uppercase tracking-widest underline opacity-30 hover:opacity-100 transition-opacity" data-id="${item.productId}">Remove Item</button>
          </div>
        </div>
      </div>
    `).join('');

  document.getElementById('cart-subtotal')!.textContent = `Rs. ${total.toLocaleString()}`;
  document.getElementById('cart-total')!.textContent = `Rs. ${total.toLocaleString()}`;
  document.getElementById('bag-stats')!.textContent = `${cartItems.length} ${cartItems.length === 1 ? 'ITEM' : 'ITEMS'} TOTAL`;

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCountElem.textContent = count < 10 ? `0${count}` : `${count}`;
  cartCountElem.classList.toggle('hidden', count === 0);

  // Re-attach event listeners
  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const { id, delta } = (e.currentTarget as HTMLButtonElement).dataset;
      handleUpdateQuantity(id!, parseInt(delta!));
    });
  });
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const { id } = (e.currentTarget as HTMLButtonElement).dataset;
      handleRemoveItem(id!);
    });
  });
}

// --- LOGIC ---

async function updateCartInDB(newCart: CartItem[]) {
  cart = newCart;
  renderCart();
  if (currentUser) {
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      cart: newCart,
      updatedAt: new Date().toISOString()
    });
  }
}

function handleAddToCart(product: Product) {
  const existing = cart.find(item => item.productId === product.id);
  if (existing) {
    const newCart = cart.map(item => 
      item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartInDB(newCart);
  } else {
    updateCartInDB([...cart, { productId: product.id, quantity: 1 }]);
  }
  toggleCart(true);
}

function handleUpdateQuantity(productId: string, delta: number) {
  const newCart = cart.map(item => {
    if (item.productId === productId) {
      return { ...item, quantity: Math.max(0, item.quantity + delta) };
    }
    return item;
  }).filter(item => item.quantity > 0);
  updateCartInDB(newCart);
}

function handleRemoveItem(productId: string) {
  updateCartInDB(cart.filter(item => item.productId !== productId));
}

function toggleCart(open: boolean) {
  if (open) {
    cartDrawer.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
  } else {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
  }
}

// --- INITIALIZATION ---

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    userInfo.textContent = user.displayName?.split(' ')[0] || user.email || '';
    userInfo.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');

    const userRef = doc(db, 'users', user.uid);
    onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        cart = data.cart || [];
        renderCart();
      } else {
        setDoc(userRef, { email: user.email, cart: [], updatedAt: new Date().toISOString() });
      }
    });
  } else {
    cart = [];
    renderCart();
    userInfo.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
  }
});

// --- EVENTS ---

loginBtn.addEventListener('click', () => signInWithPopup(auth, googleProvider));
logoutBtn.addEventListener('click', () => auth.signOut());
cartBtn.addEventListener('click', () => toggleCart(true));
closeCartBtn.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));
continueShoppingBtn.addEventListener('click', () => toggleCart(false));
logo.addEventListener('click', () => switchPage('home'));

// Announcement bar timing
const MESSAGES = [
  "get free shipping on all prepaid orders – across india",
  "COD now live - shop stress free, pay when it arrives"
];
let msgIndex = 0;
setInterval(() => {
  msgIndex = (msgIndex + 1) % MESSAGES.length;
  announcementText.textContent = MESSAGES[msgIndex].toUpperCase();
}, 4000);

// Custom Cursor
const cursor = document.getElementById('cursor')!;
window.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Start
switchPage('home');
attachPageLinks();
