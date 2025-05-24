document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartSidebar = document.getElementById("cartSidebar");
  const cartBtn = document.getElementById("cartBtn");
  const cartBtnMobile = document.getElementById("cartBtnMobile");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartCountMobile = document.getElementById("cartCountMobile");

  // Show/hide cart sidebar
  const showCart = () => cartSidebar.classList.remove("hidden");
  const hideCart = () => cartSidebar.classList.add("hidden");

  if (cartBtn) cartBtn.addEventListener("click", showCart);
  if (cartBtnMobile) cartBtnMobile.addEventListener("click", showCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", hideCart);

  // Add to cart
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest("[data-name]");
      const name = card.dataset.name;
      const price = Number(card.dataset.price);

      // Check selected size
      const sizeSelect = card.querySelector(".size-select");
      const size = sizeSelect ? sizeSelect.value : null;
      if (!size) {
        alert("Please select a size!");
        return;
      }

      // Quantity input fallback
      const qtyInput = card.querySelector(".qty-input");
      const quantity = qtyInput ? Number(qtyInput.value) || 1 : 1;

      // Use name + size to differentiate cart items
      const existing = cart.find(item => item.name === name && item.size === size);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ name, price, size, quantity });
      }

      saveCart();
      updateCart();
      showNotification(name);  // <-- Show notification here

      // Reset size select after adding
      if (sizeSelect) sizeSelect.value = "";
    });
  });

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Update cart UI
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      totalItems += item.quantity;

      const div = document.createElement("div");
      div.className = "flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded";
      div.innerHTML = `
        <div>
          <p><strong>${item.name} (${item.size})</strong></p>
          <p>₹${item.price} x ${item.quantity}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="decreaseQty(${index})" class="bg-gray-300 px-2 rounded">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})" class="bg-gray-300 px-2 rounded">+</button>
          <button onclick="removeItem(${index})" class="text-red-600 ml-2">✕</button>
        </div>
      `;
      cartItems.appendChild(div);
    });

    cartTotal.textContent = `₹${total}`;
    if (cartCount) cartCount.textContent = totalItems;
    if (cartCountMobile) cartCountMobile.textContent = totalItems;
  }

  // Checkout handler
  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    window.location.href = "checkout.html";
  });

  // Quantity control
  window.increaseQty = (index) => {
    cart[index].quantity += 1;
    saveCart();
    updateCart();
  };

  window.decreaseQty = (index) => {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    saveCart();
    updateCart();
  };

  window.removeItem = (index) => {
    cart.splice(index, 1);
    saveCart();
    updateCart();
  };

  // Notification display function
  function showNotification(productName) {
    let note = document.getElementById("notification");
    if (!note) {
      note = document.createElement("div");
      note.id = "notification";
      note.className = "fixed top-4 right-4 z-50 hidden bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500";
      document.body.appendChild(note);
    }
    note.textContent = `✅ ${productName} added to cart!`;

    // Clear existing timeout to restart the timer
    if (note.hideTimeout) {
      clearTimeout(note.hideTimeout);
    }

    // Show notification
    note.classList.remove("hidden");
    note.style.opacity = "1";

    // Hide after 2 seconds
    note.hideTimeout = setTimeout(() => {
      note.style.opacity = "0";
      // Wait for CSS transition to finish before hiding completely
      setTimeout(() => note.classList.add("hidden"), 500);
    }, 2000);
  }

  // Initialize on load
  updateCart();
});
