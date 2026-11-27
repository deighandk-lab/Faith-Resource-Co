(() => {
const script=document.currentScript, root=new URL('../',script.src), file=script.dataset.file, label=script.dataset.label;
const type=new URLSearchParams(location.search).get('type');
const title=document.getElementById('title'), desc=document.getElementById('description'), container=document.getElementById('products');
const money=n=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format(n);
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
fetch(new URL('data/'+file,root)).then(r=>{if(!r.ok)throw Error('Catalogue unavailable');return r.json()}).then(data=>{
const groups=type ? (Object.hasOwn(data,type)?[[type,data[type]]]:[]) : Object.entries(data);
if(!groups.length){title.textContent='Collection not found';desc.textContent='Please return to the shop and choose another collection.';return;}
title.textContent=type?groups[0][1].title:label;
desc.textContent=type?groups[0][1].description:'Explore our collection. Prices and availability are confirmed when you enquire.';
container.replaceChildren();
for(const [key,group] of groups)for(const product of group.products||[]){
const card=el('div','product-card'), img=el('img','product-image');img.alt=product.name;img.loading='lazy';
if(product.image){img.src=new URL(product.image.replace(/^(?:\.\.\/|\/)+/,''),root).href;img.addEventListener('error',()=>{img.hidden=true;},{once:true});}else img.hidden=true;
const body=el('div','product-content');body.append(el('h3','',product.name),el('p','',product.desc||''),el('div','price',Number.isFinite(product.price)?money(product.price):'Price on enquiry'));
const link=el('a','btn','View product');link.href=new URL('product.html?id='+encodeURIComponent(product.id),root).href;body.append(link);const b=el('button','frc-add','Add to cart');b.type='button';window.FrcCart.attach(b,product.id);body.append(b);card.append(img,body);container.append(card);
}
if(!container.children.length)desc.textContent='No products are currently listed in this collection.';
}).catch(()=>{title.textContent='Unable to load collection';desc.textContent='Please try again later or contact us for assistance.';});
})();