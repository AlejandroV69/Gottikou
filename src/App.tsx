import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowUpRight,
  X,
  Ruler,
  MessageCircle,
  Sparkles,
  Printer,
  Palette,
  Check
} from 'lucide-react';

interface CartItem {
  id: string;
  sku: string;
  title: string;
  color: string;
  size: string;
  price: number;
  qty: number;
  image: string;
}

interface Product {
  id: string;
  sku: string;
  title: string;
  color: string;
  price: number;
  gsm: string;
  fit: string;
  description: string;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'GK-001',
    title: 'Boxy Heavyweight Tee',
    color: 'Pitch Black',
    price: 35.0,
    gsm: '240 GSM',
    fit: 'Boxy Fit con caída pronunciada',
    description: '100% Algodón peinado de alto gramaje. Cuello ribeteado grueso de 3cm que no se deforma tras los lavados y costuras reforzadas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxzEDLFlNOWeFSr52U60WJDLKY-XKa-yrcMBh6CFOvsax1akh6MbHGhH-3OIIG8XPvyMfrnTqeLegv-VxUPkEqA2RbD1I021ipab8lDCudCAQ4boSv52a5M6XSw6bqpv18CqXQQk1CA8VhMEWVsadVwZtXlVMwrqobHwkBQhI7ZV0DUnEG0qck_vrnLAux6WYtbwwlT3l3vrKsLaUA2aPt8w85dxh1_iLIgqnJlO_EZFvesc1l-u6DsQ',
  },
  {
    id: 'prod-2',
    sku: 'GK-002',
    title: 'Vintage Chalk Tee',
    color: 'Chalk Off-White',
    price: 38.0,
    gsm: '260 GSM',
    fit: 'Boxy Oversize estructurado',
    description: 'Tejido french terry liviano peinado. Tono marfil mate sin blanqueadores agresivos, corte cuadrado y tacto ultrasuave.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjTZsmnwOw1ahQ8xebM-X4b7wGoPG7i9TFKMqdUVhazWWuJ0tFZpG1mlzuD2GK4z3GNrhu8NNz_q4srSL5IFDOrkCh5ivgqbqx5lxOxzxjdyeL6_QflGm4uxXXEPqNdD2fjJxPfesLikqtJ1Nn9UiyW3CMz94qzfMukBaMKUrl919obt8zxS48q_eGrHa_y8iLmgEfB9ZS0kMD3mFP7qoi8WVXImOO6dke19Ow5HSRyXRlpKLTgsUE9w',
  },
  {
    id: 'prod-3',
    sku: 'GK-003',
    title: 'Archive Monogram Tee',
    color: 'Washed Black',
    price: 42.0,
    gsm: '240 GSM',
    fit: 'Drop Shoulder relajado',
    description: 'Estampado frontal de alta densidad al tacto en serigrafía tradicional. Tela prelavada para evitar encogimiento.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5iLbo0SZK1pEkv8KwChwIjClAnNk5CaPxlYDQNGLIIxE6zShwsk9XgIgR9l5bW3Km5v2UqYGIDzZ3y6um1uduXcEYHwBEIDuUw9Y4e1czpgigAOd4QasFBULaY5_BmcDBWFIgh8NooUms-m2bB_9wP7WEGud0ppIhyipcwiZx5e908tXwm6g9XDgmxWt2LKAxKVr0Si237nwir4CFeRhO40q6E4p-6gkbjhKPS0N8PNX2eNPNIEKl3w',
  },
];

export default function App() {
  // Modal / Drawer states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewSize, setQuickViewSize] = useState('L');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-1',
      sku: 'GK-001',
      title: 'Boxy Heavyweight Tee',
      color: 'Pitch Black',
      size: 'L',
      price: 35.0,
      qty: 1,
      image: PRODUCTS[0].image,
    },
  ]);

  const [buyerName, setBuyerName] = useState('');
  const [buyerCity, setBuyerCity] = useState('');

  // Customizer state
  const [customForm, setCustomForm] = useState({
    silhouette: 'Oversize Boxy (240 GSM)',
    technique: 'DTF Textil',
    quantity: '12 a 24 piezas',
    notes: '',
  });

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const openQuickView = (prod: Product) => {
    setQuickViewProduct(prod);
    setQuickViewSize('L');
  };

  const handleAddToCart = (product: Product, size: string) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.sku === product.sku && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          sku: product.sku,
          title: product.title,
          color: product.color,
          size,
          price: product.price,
          qty: 1,
          image: product.image,
        },
      ];
    });
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;
    const itemsText = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.title} (${it.color}, Talla ${it.size}) x${it.qty} — $${(
            it.price * it.qty
          ).toFixed(2)}`
      )
      .join('%0A');

    const nameStr = buyerName ? `*Cliente:* ${encodeURIComponent(buyerName)}%0A` : '';
    const cityStr = buyerCity ? `*Destino:* ${encodeURIComponent(buyerCity)}%0A` : '';

    const orderMsg =
      `*NUEVO PEDIDO // GOTTIKOU*%0A%0A` +
      nameStr +
      cityStr +
      `*Prendas:*%0A` +
      `${itemsText}%0A%0A` +
      `*Total:* $${cartTotal.toFixed(2)} USD%0A%0A` +
      `_Hola, quiero confirmar este pedido y recibir datos para realizar el pago._`;

    window.open(`https://wa.me/584120000000?text=${orderMsg}`, '_blank');
  };

  const handleCustomWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*COTIZACIÓN DE PERSONALIZADOS // GOTTIKOU*%0A%0A` +
      `▪ *Prenda:* ${encodeURIComponent(customForm.silhouette)}%0A` +
      `▪ *Técnica:* ${encodeURIComponent(customForm.technique)}%0A` +
      `▪ *Cantidad:* ${encodeURIComponent(customForm.quantity)}%0A` +
      (customForm.notes ? `▪ *Detalles:* ${encodeURIComponent(customForm.notes)}%0A%0A` : '%0A') +
      `_Hola, me gustaría recibir un presupuesto formal para esta producción._`;

    window.open(`https://wa.me/584120000000?text=${msg}`, '_blank');
    setIsCustomModalOpen(false);
  };

  return (
    <div className="bg-[#0c0c0c] text-[#e8e8e8] min-h-screen font-grotesk selection:bg-white selection:text-black">
      {/* 1. HEADER (Minimalista y limpio) */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[#0c0c0c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <span className="font-syne font-black text-2xl tracking-tighter uppercase text-white">
              GOTTIKOU
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide">
            <a href="#drops" className="text-white hover:text-white transition-colors">
              Tienda
            </a>
            <a href="#personalizados" className="text-zinc-400 hover:text-white transition-colors">
              Personalizados
            </a>
            <a href="#marca" className="text-zinc-400 hover:text-white transition-colors">
              Nosotros
            </a>
          </nav>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all text-xs font-semibold"
            type="button"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bolsa</span>
            <span className="font-mono text-[11px] bg-black text-white px-2 py-0.5 rounded-full ml-1 font-bold">
              {totalItemCount}
            </span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION (Editorial a pantalla completa) */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Texto Principal */}
          <div className="lg:col-span-7 space-y-8 z-10">
            <div className="space-y-4">
              <span className="text-zinc-400 text-xs tracking-widest uppercase font-mono block">
                Drop 01 — Disponible
              </span>
              <h1 className="font-syne font-black text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-white leading-[0.92]">
                HEAVYWEIGHT
                <br />
                APPAREL.
              </h1>
            </div>

            <p className="text-zinc-300 text-lg sm:text-xl max-w-lg leading-relaxed font-normal">
              Prendas pesadas de 240 a 260 GSM con silueta boxy estructurada. Confección de alta
              durabilidad para uso diario o producción de marcas independientes.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="#drops"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all active:scale-95"
              >
                <span>Ver colección</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsCustomModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white font-medium text-sm transition-all"
              >
                <span>Cotizar al mayor</span>
              </button>
            </div>
          </div>

          {/* Imagen Editorial con fundido suave */}
          <div className="lg:col-span-5 relative h-[520px] rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQ1aWYjR2SwqrXxg8JRG53Jkqp0hYD6fbXa0GdH_UtLf2qpHKIzAnSDjke5f06z2y-PZ0cqMPVdtzm6ftn3RsgYMPF0cupZBiu-hlRWuiXFOOqr4GCI90RxB_WoQ8R7NMAOeQiSAyDquPHRWbHkah_UBsLaFFEXyPio9SalAiXzZYgTzq85sS3VfLKim4FgGjpi5qTPPzkMrVFCLg6hKCqmaiC0uEfdX3qJ-j8yG9A5sFro3QZmyZP_w')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-white text-sm font-semibold block">Boxy Cut 240+ GSM</span>
                <span className="text-zinc-400 text-xs">Cuello grueso 3cm • Doble costura</span>
              </div>
              <span className="font-mono text-xs text-zinc-400">01 / 03</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TIENDA // PRODUCTOS LIMPIOS (Estilo Essentials / Fear of God) */}
      <section className="py-24 sm:py-32" id="drops">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-14">
            <div>
              <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase block mb-2">
                Catálogo
              </span>
              <h2 className="font-syne font-black text-3xl sm:text-4xl uppercase text-white tracking-tight">
                Colección Drop 01
              </h2>
            </div>
            <button
              onClick={() => setIsSizeModalOpen(true)}
              type="button"
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Guía de medidas</span>
            </button>
          </div>

          {/* Cuadrícula limpia sin cajas pesadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                onClick={() => openQuickView(prod)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Contenedor de la foto */}
                <div className="relative aspect-[4/5] w-full rounded-xl bg-zinc-900/60 overflow-hidden mb-4">
                  <div
                    className="w-full h-full bg-cover bg-center grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${prod.image}')` }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold shadow-lg">
                      Vista rápida
                    </span>
                  </div>
                  <span className="absolute top-4 right-4 text-[11px] font-mono bg-black/70 backdrop-blur-sm text-zinc-300 px-2.5 py-1 rounded">
                    {prod.gsm}
                  </span>
                </div>

                {/* Info mínima */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-semibold text-white group-hover:text-zinc-300 transition-colors">
                      {prod.title}
                    </h3>
                    <span className="font-mono text-sm text-white font-medium">
                      ${prod.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{prod.color}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BANDA EDITORIAL (Respiro entre tienda y servicios) */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900/80" id="marca">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Filosofía Gottikou
          </span>
          <p className="font-syne font-bold text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            "No hacemos ropa ligera de una sola temporada. Diseñamos siluetas pesadas y duraderas que
            mantienen su estructura con el paso del tiempo."
          </p>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Fabricadas con algodón peinado de alto gramaje para lograr la caída perfecta sin perder
            firmeza.
          </p>
        </div>
      </section>

      {/* 5. PERSONALIZADOS // ATELIER TEXTIL (Limpio y directo) */}
      <section className="py-24 sm:py-32" id="personalizados">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase block">
              Producción a medida
            </span>
            <h2 className="font-syne font-black text-3xl sm:text-4xl uppercase text-white tracking-tight">
              Prendas para tu marca o proyecto
            </h2>
            <p className="text-zinc-400 text-base">
              Confeccionamos tirajes desde 12 piezas hasta grandes volúmenes con los mismos cortes y
              gramajes de nuestro catálogo.
            </p>
          </div>

          {/* 3 Técnicas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-4">
              <Printer className="w-6 h-6 text-white" />
              <h3 className="font-syne font-bold text-lg text-white">DTF Textil de Alta Definición</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Ideal para diseños a todo color, degradados y artes detalladas con máxima durabilidad al
                lavado.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-4">
              <Sparkles className="w-6 h-6 text-white" />
              <h3 className="font-syne font-bold text-lg text-white">Bordado Computarizado</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Acabado táctil en relieve de presencia formal. Recomendado para monogramas en pecho,
                mangas o cuellos.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-4">
              <Palette className="w-6 h-6 text-white" />
              <h3 className="font-syne font-bold text-lg text-white">Serigrafía Tradicional</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tinta densa o tacto cero para tirajes medianos y grandes volúmenes de estilo streetwear
                clásico.
              </p>
            </div>
          </div>

          {/* Botón CTA directo */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold text-lg">¿Tienes una idea en mente?</h4>
              <p className="text-zinc-400 text-sm mt-0.5">
                Te enviamos presupuesto formal y tiempos de entrega en menos de 15 minutos.
              </p>
            </div>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all active:scale-95"
            >
              Cotizar por WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* 6. ENVÍOS Y PAGOS (Banda sutil de 1 sola línea) */}
      <section className="py-12 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">Despachos:</span>
            <span>Entregas en Caracas</span>
            <span>•</span>
            <span>MRW</span>
            <span>•</span>
            <span>Zoom</span>
            <span>•</span>
            <span>Tealca</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">Métodos de Pago:</span>
            <span>Pago Móvil (BCV)</span>
            <span>•</span>
            <span>Zelle</span>
            <span>•</span>
            <span>USDT Binance</span>
            <span>•</span>
            <span>Efectivo</span>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 border-t border-zinc-900 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-syne font-black text-sm text-white">GOTTIKOU</span>
            <span>—</span>
            <span>Prendas pesadas de corte boxy. Envíos a toda Venezuela.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSizeModalOpen(true)}
              type="button"
              className="hover:text-white transition-colors"
            >
              Guía de tallas
            </button>
            <a
              href="https://wa.me/584120000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href="https://wa.me/584120000000?text=Hola%20GOTTIKOU,%20tengo%20una%20consulta%20sobre%20sus%20prendas"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      {/* MODAL QUICK VIEW (Comprar producto de manera limpia) */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-zinc-800 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            {/* Foto */}
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-zinc-900 relative">
              <div
                className="w-full h-full bg-cover bg-center grayscale contrast-110"
                style={{ backgroundImage: `url('${quickViewProduct.image}')` }}
              />
              <span className="absolute top-4 left-4 text-xs font-mono bg-black/80 text-white px-2.5 py-1 rounded">
                {quickViewProduct.gsm}
              </span>
            </div>

            {/* Info y compra */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-syne font-bold text-xl text-white">
                      {quickViewProduct.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-0.5">{quickViewProduct.color}</p>
                  </div>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="text-zinc-500 hover:text-white"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xl font-mono text-white font-semibold">
                  ${quickViewProduct.price.toFixed(2)} USD
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-grotesk">
                  {quickViewProduct.description}
                </p>

                {/* Selección de talla */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Seleccionar Talla</span>
                    <button
                      onClick={() => setIsSizeModalOpen(true)}
                      type="button"
                      className="text-zinc-500 hover:text-white underline text-[11px]"
                    >
                      Ver medidas
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setQuickViewSize(sz)}
                        className={`py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                          quickViewSize === sz
                            ? 'bg-white text-black font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(quickViewProduct, quickViewSize)}
                className="w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Añadir a la bolsa</span>
                <span className="opacity-40">•</span>
                <span>Talla {quickViewSize}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GUÍA DE TALLAS */}
      {isSizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-zinc-800 max-w-lg w-full rounded-2xl p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="font-syne font-bold text-xl text-white">Guía de Medidas</h3>
                <p className="text-xs text-zinc-400">Silueta Boxy Fit (Medidas en plano)</p>
              </div>
              <button
                onClick={() => setIsSizeModalOpen(false)}
                className="text-zinc-400 hover:text-white"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-2">TALLA</th>
                    <th className="pb-2">PECHO</th>
                    <th className="pb-2">LARGO</th>
                    <th className="pb-2">MANGA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  <tr>
                    <td className="py-2.5 font-bold text-white">S</td>
                    <td className="py-2.5">56 cm</td>
                    <td className="py-2.5">72 cm</td>
                    <td className="py-2.5">22 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">M</td>
                    <td className="py-2.5">59 cm</td>
                    <td className="py-2.5">75 cm</td>
                    <td className="py-2.5">23 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">L</td>
                    <td className="py-2.5">63 cm</td>
                    <td className="py-2.5">78 cm</td>
                    <td className="py-2.5">24 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">XL</td>
                    <td className="py-2.5">67 cm</td>
                    <td className="py-2.5">81 cm</td>
                    <td className="py-2.5">25 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-lg leading-relaxed">
              El corte es amplio. Si prefieres un ajuste regular más ceñido al cuerpo, te
              recomendamos elegir una talla menos de la habitual.
            </p>
          </div>
        </div>
      )}

      {/* MODAL COTIZADOR PERSONALIZADOS */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-zinc-800 max-w-lg w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="font-syne font-bold text-xl text-white">Cotizar Personalizados</h3>
                <p className="text-xs text-zinc-400">Completa y te responderemos por WhatsApp</p>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-zinc-400 hover:text-white"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomWhatsApp} className="space-y-4 text-xs font-grotesk">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium block">Silueta Base</label>
                <select
                  value={customForm.silhouette}
                  onChange={(e) => setCustomForm({ ...customForm, silhouette: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white"
                >
                  <option value="Oversize Boxy (240 GSM)">Camisa Oversize Boxy (240 GSM)</option>
                  <option value="Franela Clásica (190 GSM)">Franela Clásica Regular (190 GSM)</option>
                  <option value="Hoodie Boxy Pesado (350 GSM)">Hoodie Boxy Pesado (350 GSM)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium block">Técnica</label>
                <select
                  value={customForm.technique}
                  onChange={(e) => setCustomForm({ ...customForm, technique: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white"
                >
                  <option value="DTF Textil">DTF Textil (Full color)</option>
                  <option value="Bordado Computarizado">Bordado Computarizado</option>
                  <option value="Serigrafía Tradicional">Serigrafía Tradicional</option>
                  <option value="Por Asesorar">Requiero asesoría técnica</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium block">Cantidad aproximada</label>
                <select
                  value={customForm.quantity}
                  onChange={(e) => setCustomForm({ ...customForm, quantity: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white"
                >
                  <option value="12 a 24 piezas">12 a 24 piezas (Tiraje Inicial)</option>
                  <option value="25 a 50 piezas">25 a 50 piezas (Colección)</option>
                  <option value="50+ piezas">50+ piezas (Tarifa Mayorista)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium block">Notas o dudas (opcional)</label>
                <input
                  type="text"
                  value={customForm.notes}
                  onChange={(e) => setCustomForm({ ...customForm, notes: e.target.value })}
                  placeholder="Ej: Tengo diseño en vectores, entrega para Caracas..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all mt-4"
              >
                Enviar a WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. BOLSA LATERAL (Slide-over Cart Drawer) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#121212] border-l border-zinc-800/80 transform transition-transform duration-300 flex flex-col justify-between shadow-2xl overflow-y-auto ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-syne font-bold text-lg text-white">Bolsa de Compras</span>
              <span className="text-xs text-zinc-400">({totalItemCount})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-white"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Items */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">Tu bolsa está vacía.</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-zinc-900">
                  <div className="w-16 h-20 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0">
                    <div
                      className="w-full h-full bg-cover bg-center grayscale"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-zinc-500 hover:text-white text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="text-xs text-zinc-400 block mt-0.5">
                        {item.color} • Talla {item.size}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center bg-zinc-900 rounded px-2 py-0.5 text-xs">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="text-zinc-400 hover:text-white pr-2"
                        >
                          -
                        </button>
                        <span className="text-white font-mono">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="text-zinc-400 hover:text-white pl-2"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-sm text-white font-medium">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout en WhatsApp */}
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-950/60 space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Nombre para el pedido (opcional)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
              <input
                type="text"
                value={buyerCity}
                onChange={(e) => setBuyerCity(e.target.value)}
                placeholder="Ciudad / Destino (opcional)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex justify-between items-center pt-2 text-sm font-medium">
              <span className="text-zinc-400">Total</span>
              <span className="font-mono text-lg text-white font-semibold">
                ${cartTotal.toFixed(2)} USD
              </span>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              type="button"
              disabled={cartItems.length === 0}
              className="w-full py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>Completar en WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
