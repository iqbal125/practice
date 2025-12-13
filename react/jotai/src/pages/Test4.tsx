/**
 * LIVE CODING MOCK INTERVIEW - React + Jotai
 * 
 * SCENARIO: Shopping Cart with Global State Management
 * TIME LIMIT: 45 minutes
 * 
 * REQUIREMENTS:
 * 
 * 1. Create a product listing with the following features:
 *    - Display a list of products (id, name, price, stock)
 *    - Each product should have an "Add to Cart" button
 *    - Show "Out of Stock" for products with stock = 0
 * 
 * 2. Implement a shopping cart using Jotai atoms:
 *    - Cart should track: productId, quantity, price
 *    - Display total items count in a header badge
 *    - Display total price
 *    - Allow quantity adjustment (increase/decrease)
 *    - Allow item removal
 * 
 * 3. Advanced features:
 *    - Implement a derived atom that calculates cart total
 *    - Add a discount code feature (atom + logic)
 *    - Prevent adding more items than available stock
 *    - Show a "Cart Empty" message when no items
 * 
 * 4. Bonus challenges:
 *    - Add persistence using atomWithStorage
 *    - Implement undo/redo for cart actions
 *    - Add filtering by price range
 * 
 * STARTER CODE BELOW - Complete the implementation
 */

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useState } from 'react';

// ============= TYPE DEFINITIONS =============
type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
};

type CartItem = {
    productId: number;
    quantity: number;
    price: number;
    name: string;
};

// ============= MOCK DATA =============
const PRODUCTS: Product[] = [
    { id: 1, name: 'Laptop', price: 999, stock: 5, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 29, stock: 15, category: 'Electronics' },
    { id: 3, name: 'Keyboard', price: 79, stock: 8, category: 'Electronics' },
    { id: 4, name: 'Monitor', price: 299, stock: 0, category: 'Electronics' },
    { id: 5, name: 'Headphones', price: 199, stock: 12, category: 'Audio' },
    { id: 6, name: 'Webcam', price: 89, stock: 3, category: 'Electronics' },
];

// ============= ATOMS - TODO: Implement these =============

// TODO: Create base cart atom (array of CartItem)
const cartAtom = atom<CartItem[]>([]);

// TODO: Create derived atom for cart total price
const cartTotalAtom = atom((get) => {
    // IMPLEMENT: Calculate total price from cart items
    // const total
    const items = get(cartAtom)

    let total = 0
    items.forEach(item => total += item.price * item.quantity)

    return total;
});

// TODO: Create derived atom for total items count
const cartItemsCountAtom = atom((get) => {
    // IMPLEMENT: Calculate total quantity across all items
    const items = get(cartAtom)

    let totalQuan = 0
    items.forEach(item => totalQuan += item.quantity)
    return totalQuan;
});

// TODO: Create discount code atom and discount percentage atom
const discountCodeAtom = atom('');
const discountPercentageAtom = atom(0);

// TODO: Create final price atom (after discount)
const finalPriceAtom = atom((get) => {
    // IMPLEMENT: Apply discount to cart total
    return 0;
});

// TODO: BONUS - Use atomWithStorage for persistence
// const cartAtom = atomWithStorage<CartItem[]>('shopping-cart', []);

// ============= COMPONENTS - TODO: Implement these =============

// TODO: Implement ProductCard component
function ProductCard({ product }: { product: Product }) {
    const [cart, setCart] = useAtom(cartAtom);

    const handleAddToCart = () => {
        const existingItemIndex = cart.findIndex(item => item.productId === product.id);

        if (existingItemIndex !== -1) {
            // Item exists - check stock before incrementing
            const currentQuantity = cart[existingItemIndex].quantity;
            if (currentQuantity >= product.stock) return; // Already at max stock

            // Create new array with updated quantity (immutable)
            setCart(cart.map((item, index) =>
                index === existingItemIndex
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // New item - add to cart
            const newItem: CartItem = {
                productId: product.id,
                quantity: 1,
                price: product.price,
                name: product.name,
            };
            setCart(prev => [...prev, newItem]);
        }
    };
    const isInCart = false; // TODO: Check if product is in cart
    const cartQuantity = 0; // TODO: Get current quantity in cart

    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-xl font-semibold mt-2">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>

            {/* TODO: Implement button logic */}
            <button
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
            >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* TODO: Show quantity in cart if item is already added */}
        </div>
    );
}

// TODO: Implement CartItemComponent
function CartItemComponent({ item }: { item: CartItem }) {
    const [cart, setCart] = useAtom(cartAtom);

    const handleIncrease = () => {
        const product = PRODUCTS.find(product => product.id === item.productId)
        if (!product) throw "Error"

        if (item.quantity + 1 > product.stock) return "Sold Out"
        // TODO: Increase quantity (check stock limit)
        setCart(prev => prev.map(mappedItem => mappedItem.productId === item.productId ? { ...mappedItem, quantity: mappedItem.quantity + 1 } : mappedItem))
    };

    const handleRemove = () => {
        // TODO: Remove item from cart
        let tempArr = [...cart].filter(filterItem => filterItem.productId !== item.productId)
        setCart(tempArr)
    };


    const handleDecrease = () => {
        if (item.quantity === 1) {
            handleRemove()
            return
        }
        setCart(prev => prev.map(mappedItem => mappedItem.productId === item.productId ? { ...mappedItem, quantity: mappedItem.quantity - 1 } : mappedItem))
    };



    return (
        <div className="flex items-center justify-between border-b py-3">
            <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">${item.price} each</p>
            </div>

            {/* TODO: Implement quantity controls */}
            <div className="flex items-center gap-3">
                <button className="px-2 py-1 bg-gray-200 rounded" onClick={handleDecrease}>-</button>
                <span className="font-semibold" >{item.quantity}</span>
                <button className="px-2 py-1 bg-gray-200 rounded" onClick={handleIncrease}>+</button>
                <button className="ml-3 text-red-500 hover:text-red-700" onClick={handleRemove}>Remove</button>
            </div>

            <div className="ml-4 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    );
}

// TODO: Implement Cart component
function Cart() {
    const cart = useAtomValue(cartAtom);
    const cartTotal = useAtomValue(cartTotalAtom);
    const finalPrice = useAtomValue(finalPriceAtom);
    const [discountCode, setDiscountCode] = useAtom(discountCodeAtom);
    const [discountPercentage, setDiscountPercentage] = useAtom(discountPercentageAtom);

    const handleApplyDiscount = () => {
        // TODO: Implement discount logic
        // Example codes: 'SAVE10' = 10%, 'SAVE20' = 20%
    };

    return (
        <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

            {/* TODO: Show "Cart Empty" message if no items */}
            {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
                <>
                    {/* TODO: Render cart items */}
                    <div className="space-y-2">
                        {/* Map through cart items here */}
                        {cart.map(item => {
                            return (<CartItemComponent item={item} />)
                        })}
                    </div>

                    {/* TODO: Implement discount code input */}
                    <div className="mt-6 border-t pt-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Discount code"
                                className="flex-1 border rounded px-3 py-2"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={handleApplyDiscount}
                            >
                                Apply
                            </button>
                        </div>
                        {discountPercentage > 0 && (
                            <p className="text-green-600 text-sm mt-2">
                                {discountPercentage}% discount applied!
                            </p>
                        )}
                    </div>

                    {/* TODO: Display totals */}
                    <div className="mt-6 border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                        </div>
                        {discountPercentage > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({discountPercentage}%):</span>
                                <span>-${((cartTotal * discountPercentage) / 100).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span>${finalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                        Checkout
                    </button>
                </>
            )}
        </div>
    );
}

// TODO: Implement Header with cart badge
function Header() {
    const itemsCount = useAtomValue(cartItemsCountAtom);

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Shop</h1>

                {/* TODO: Implement cart badge */}
                <div className="relative">
                    <span className="text-lg">🛒 Cart</span>
                    {itemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {itemsCount}
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}

// ============= MAIN COMPONENT =============
export default function Test4() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // TODO: Implement category filtering
    const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
    const filteredProducts = selectedCategory === 'All'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto p-6">
                {/* Category Filter */}
                <div className="mb-6 flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded ${selectedCategory === cat
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 border'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Grid */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Cart />
                        </div>
                    </div>
                </div>
            </div>

            {/* TODO: BONUS - Add these features
        * - Price range filter slider
        * - Search functionality
        * - Sort by price (low to high, high to low)
        * - Recently viewed products (using another atom)
        * - Wishlist feature
      */}
        </div>
    );
}

/**
 * EVALUATION CRITERIA:
 * 
 * 1. Atom Design (25%)
 *    - Proper use of base atoms vs derived atoms
 *    - Correct atom composition
 *    - Understanding of atom dependencies
 * 
 * 2. State Management (25%)
 *    - Correct use of useAtom, useAtomValue, useSetAtom
 *    - Proper state updates (immutability)
 *    - Handling edge cases (stock limits, empty cart)
 * 
 * 3. Component Architecture (20%)
 *    - Clean component separation
 *    - Proper prop types
 *    - Reusable components
 * 
 * 4. Logic Implementation (20%)
 *    - Cart operations work correctly
 *    - Discount logic implemented
 *    - Stock validation
 * 
 * 5. Code Quality (10%)
 *    - Clean, readable code
 *    - TypeScript usage
 *    - Error handling
 * 
 * INTERVIEWER NOTES:
 * - Watch for common mistakes: mutating state directly
 * - Check if candidate uses derived atoms effectively
 * - See if they handle edge cases without prompting
 * - Note performance considerations (unnecessary re-renders)
 */
