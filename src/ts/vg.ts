/*
1. Se om du kan hitta problem med koden nedan och se om du kan göra den bättre.
*/
export enum Sort {
	PRICE_ASCENDING = 'Stigande pris',
	PRICE_DECENDING = 'Sjunkande pris',
	NAME_ALPHABETIC = 'Alfabetisk ordning',
	NAME_ALPHABETIC_REVERSE = 'Omvänd alfabetisk ordning',
}

export class Product {
	constructor(
		public id: number,
		public name: string,
		public imageUrl: string[],
		public price: number,
		public description: string
	) {
		this.id = id;
		this.name = name;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
	}
}

interface SortProps {
	whichAttribute: string;
	products: Product[];
	reverse?: boolean;
}

function sortList({ whichAttribute, products, reverse }: SortProps): Product[] {
	products.sort((a, b) => {
		if (whichAttribute === 'Price') {
			return a.price - b.price;
		} else {
			return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
		}
	});

	if (reverse) return products.reverse();

	return products;
}

export function sortProductsBy(sort: Sort, products: Product[]): Product[] {
	const tempCopy = [...products];

	if (sort === Sort.PRICE_ASCENDING) return sortList({ whichAttribute: 'Price', products: tempCopy, reverse: true });
	if (sort === Sort.PRICE_DECENDING) return sortList({ whichAttribute: 'Price', products: tempCopy });
	if (sort === Sort.NAME_ALPHABETIC) return sortList({ whichAttribute: 'Name', products: tempCopy });
	if (sort === Sort.NAME_ALPHABETIC_REVERSE)
		return sortList({ whichAttribute: 'Name', products: tempCopy, reverse: true });

	return tempCopy;
}

/*
  2. Refaktorera funktionen createProductHtml :)
  */
class Cart {
	public cart: ProductList[];
	constructor() {
		this.cart = [];
	}

	addToCart(product: ProductList) {
		this.cart.push(product);
	}
}

interface CartList {
	quantity: number;
}

interface ProductList {
	name: string;
	price: number;
	info: string;
	productSpec: boolean;
	category: string;
	picture: string;
	pictureAlt: string;
}

export const cartList = JSON.parse(localStorage.getItem('savedCartList') || '[]') as CartList[];
export const productList = JSON.parse(localStorage.getItem('savedList') || '[]') as ProductList[];

function createHTMLElement({ type, text, parent }: { type: string; text?: string; parent?: HTMLElement }) {
	const createdElement = document.createElement(type);

	if (text) {
		createdElement.innerHTML = text;
	}

	if (parent) {
		parent.appendChild(createdElement);
	}

	return createdElement;
}

function createCartImage({
	src,
	alt,
	hover,
	parent,
}: {
	src: string;
	alt?: string;
	hover?: string;
	parent?: HTMLElement;
}) {
	const createdElement = document.createElement('img');

	createdElement.src = src;
	createdElement.alt = alt ? alt : '';

	const symbolContainer = createHTMLElement({ type: 'div', parent: createdElement });
	const symbolIcon = createHTMLElement({ type: 'i', parent: symbolContainer });
	symbolContainer.className = 'cartSymbolContainer';
	symbolIcon.className = 'bi bi-bag-plus';

	if (parent) {
		parent.appendChild(createdElement);
	}

	if (hover && hover !== '') {
		createdElement.addEventListener('mouseover', () => {
			symbolContainer.classList.add('hover');
			createdElement.classList.add('hover');
		});

		createdElement.addEventListener('mouseout', () => {
			symbolContainer.classList.remove('hover');
			createdElement.classList.remove('hover');
		});
	}

	return { createdElement, symbolIcon };
}

export function createProductHtml() {
	const quantity = cartList.reduce((sum, { quantity }) => sum + quantity, 0);
	const floatingCart = document.querySelector('#floatingcartnumber') as HTMLElement;
	floatingCart.innerHTML = `${quantity}`;

	for (const product of productList) {
		const productCard = createHTMLElement({ type: 'div' });
		const productImageContainer = createHTMLElement({ type: 'div', parent: productCard });
		productCard.className = 'dogproduct';
		productImageContainer.className = 'dogimgcontainer';

		const { createdElement: productImage, symbolIcon } = createCartImage({
			src: product.picture,
			alt: product.pictureAlt,
			parent: productImageContainer,
		});

		createHTMLElement({ type: 'h5', text: product.name, parent: productCard });
		createHTMLElement({ type: 'p', text: product.price.toString(), parent: productCard });
		createHTMLElement({ type: 'p', text: product.info, parent: productCard });

		product.productSpec = false;

		productImage.addEventListener('click', () => {
			product.productSpec = !product.productSpec;
			window.location.href = 'product-spec.html#backArrow';
			const productListAsText = JSON.stringify(productList);
			localStorage.setItem('savedList', productListAsText);
		});

		symbolIcon.addEventListener('click', () => {
			const cart = new Cart();
			cart.addToCart(product);
		});

		const categoryElement = document.querySelector(`#${product.category}`) as HTMLElement;
		categoryElement.appendChild(productCard);
	}

	const productListAsText = JSON.stringify(productList);
	localStorage.setItem('savedList', productListAsText);
	sessionStorage.clear();
}

/*
  3. Refaktorera funktionen getfromstorage
  */
export class CartProduct {
	constructor(public name: string, public image: string, public price: number, public amount: number) {}
}

function getfromstorage() {
	const fromStorage = JSON.parse(localStorage.getItem('cartArray') || '') as CartProduct[];

	const amountContainerElement = document.querySelector('#amount-checkout-container') as HTMLElement;
	const titleContainerElement = document.querySelector('#title-container') as HTMLTableRowElement;
	const productQuantityElement = document.querySelector('#product-quantity') as HTMLTableRowElement;
	const checkoutTotalElement = document.querySelector('#title-total') as HTMLTableCellElement;

	createHTMLElement({ type: 'th', text: 'amount:', parent: amountContainerElement });
	createHTMLElement({
		type: 'th',
		text: 'change quantity:',
		parent: productQuantityElement,
	});
	createHTMLElement({ type: 'th', text: 'total:', parent: checkoutTotalElement });

	titleContainerElement.innerHTML = '<strong>products:</strong>';

	for (const cartItem of fromStorage) {
		const productCard = createHTMLElement({ type: 'th', text: cartItem.name, parent: titleContainerElement });
		productCard.className = 'hej';

		const productAmount = createHTMLElement({
			type: 'th',
			text: `x ${cartItem.amount}`,
			parent: amountContainerElement,
		});
		productAmount.className = 'hej';

		const productControls = createHTMLElement({ type: 'th', parent: productQuantityElement });
		productControls.className = 'hej';

		const productPlusBtn = document.createElement('button');
		const plusIcon = createHTMLElement({ type: 'i', parent: productPlusBtn });

		productControls.appendChild(productPlusBtn);
		productPlusBtn.className = 'plusbtn';
		plusIcon.className = 'fas fa-plus';

		const productMinusBtn = document.createElement('button');
		const minusIcon = createHTMLElement({ type: 'i', parent: productMinusBtn });

		productControls.appendChild(productMinusBtn);
		productMinusBtn.className = 'minusbtn';
		minusIcon.className = 'fas fa-minus';
	}

	const addition = fromStorage.reduce((sum, { price, amount }) => sum + price * amount, 0);
	const totalPrice = createHTMLElement({ type: 'th', text: `${addition}$`, parent: checkoutTotalElement });
	totalPrice.id = 'totalincenter';
}
