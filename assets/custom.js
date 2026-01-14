console.log("custom.js loading");
console.log("Changes from GIT - custom js loading");
let selectedVariantId=null;
document.addEventListener('DOMContentLoaded',()=>{
  const selectedVariantScript=document.querySelector('variant-selects [data-selected-variant]');
  if(selectedVariantScript){
    try{
      const variantData=JSON.parse(selectedVariantScript.textContent);
      selectedVariantId=variantData.id;
      console.log(selectedVariantId);
    }
    catch(e){
      console.error("Variant error",e);
    }
  }

});

subscribe(PUB_SUB_EVENTS.variantChange,({ data })=>{
  selectedVariantId=data.variant?.id||null;
  console.log(selectedVariantId);
})


document.addEventListener('click',async(e)=>{
  
  const button=e.target.closest('#custom-ajax-add');
  if(!button){
    return;
  }

  if(!selectedVariantId){
    console.log("No variant selected");
    return;
  }

  const quantityInput=document.querySelector('input[name="quantity"]');
  const quantity=quantityInput?parseInt(quantityInput.value,10):1;

  console.log("ADDED to cart : ",{
    variant:selectedVariantId,
    quantity
  });

  try {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedVariantId,
        quantity
      })
    });

  fetch(`${routes.cart_url}?sections=cart-drawer`)
  .then((response)=>response.json())
  .then((sections)=>{
    const sectionIds=['cart-drawer'];
    for (const sectionId of sectionIds){
      const htmlString=sections[sectionId];
      const html=new DOMParser().parseFromString(htmlString,'text/html');
      const sourceElement=html.querySelector(`${sectionId}`);
      const targetElement=document.querySelector(`${sectionId}`);
      if(targetElement && sourceElement){
        targetElement.replaceWith(sourceElement);
      }
    }
    document.body.classList.add('overflow-hidden');
    const theme_cart=document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    if(theme_cart && theme_cart.classList.contains('is-empty')){
      theme_cart.classList.remove('is-empty');
    } 
    theme_cart.classList.add('active');
    
  })

  const cartData=await fetch('/cart.js').then(r=>r.json());

  const bubble = document.querySelector('.cart-count-bubble span[aria-hidden]');
  if (bubble) {
    bubble.textContent = cartData.item_count;
  }
  const bubbleWrapper = document.querySelector('.cart-count-bubble');
  if (bubbleWrapper) {
    bubbleWrapper.style.display = cart.item_count > 0 ? 'flex' : 'none';
  }

  } 
  catch (e) {
    console.error('Cart error:', e);
  }
});




document.addEventListener("click", function (event) {
  if (event.target.id === "menu-toggle") {
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenu) {
      mobileMenu.classList.toggle("is-open");
      console.log("Mobile menu toggled");
    }
  }
});


document.addEventListener("submit", function (e) {
  const form = event.target;
  if (form.classList.contains("newsletter-form")) {
    const email = form.querySelector('input[type="email"]');
    if (!email || !email.value.includes("@")) {
      e.preventDefault();
      alert("Invalid email address!!");
    }
  }
});







// document.addEventListener('DOMContentLoaded', () => {
//   const input = document.getElementById('collectionSearchInput');
//   if (!input) return;

//   const cards = document.querySelectorAll('.product-card-wrapper');

//   input.addEventListener('input', () => {
//     const query = input.value.toLowerCase().trim();


//     cards.forEach(card => {
//       const title = card.dataset.title || '';
//       const vendor = card.dataset.vendor || '';
//       const tags = card.dataset.tags || '';

//       const match =
//         title.includes(query) ||
//         vendor.includes(query) ||
//         tags.includes(query);

//       card.closest('.grid__item').style.display = match ? '' : 'none';
//     });
//   });
// });





document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('collectionSearchInput');
  const resultsContainer = document.getElementById('api-search-results');
  const productGrid = document.getElementById('product-grid');

  if (!input || !resultsContainer) {
    console.log('Required elements missing');
    return;
  }
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
  }
  });

  input.addEventListener('input', () => {
    const term = input.value.trim();

    if (term.length < 3) {
      resultsContainer.innerHTML = '';
      if (productGrid) productGrid.style.display = '';
      return;
    }

    fetch(`/search/suggest.json?q=${encodeURIComponent(term)}&resources[type]=product`)
      .then(res => res.json())
      .then(data => {
        const products = data.resources.results.products;
        console.log('Products:', products);

        if (productGrid) productGrid.style.display = 'none';
        fetch(`/search?q=${encodeURIComponent(term)}&section_id=api-search-products`)
  .then(res => res.text())
  .then(html => {
    resultsContainer.innerHTML = html;
    updateAjaxSearchCount(resultsContainer);

  });

  });

});
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('.pagination a');
  if (!link) return;

  e.preventDefault();

  const url = new URL(link.href);
  url.searchParams.set('section_id', 'api-search-products');

  fetch(url.toString())
    .then(res => res.text())
    .then(html => {
      const resultsContainer = document.getElementById('api-search-results');
      resultsContainer.innerHTML = html;
      updateAjaxSearchCount(resultsContainer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function updateAjaxSearchCount(container) {
  const meta = container.querySelector('.api-search-meta');
  if (!meta) return;

  const total = meta.dataset.total;
  const shown = meta.dataset.shown;
  const text = `Showing ${shown} of ${total} products`;

  document
    .querySelectorAll('#ProductCount, #ProductCountDesktop')
    .forEach(el => el.textContent = text);
  document
    .querySelectorAll('.facets__summary-text')
    .forEach(el => el.textContent = text);
}





document.addEventListener('DOMContentLoaded',()=>{
  const currentProductHeading=document.querySelector('.card__heading');
  console.log(currentProductHeading.innerText);
});