const salesData = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}' } },
    series: [{ data: [150, 230, 224, 218, 135, 147, 260], type: 'line', smooth: true }],
    tooltip: { trigger: 'axis', formatter: "<b>{b0}:</b> ${c0}" }
}
const supportRequests = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
        {
            name: 'Support Requests', type: 'pie', radius: '50%',
            data: [{ value: 300, name: 'In Progress' }, { value: 50, name: 'Delayed' }, { value: 100, name: 'Complete' }],
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }
    ]
};
const salesChartElement = document.getElementById('salesChart');
if (salesChartElement) {
    const salesChart = echarts.init(salesChartElement, null, { renderer: 'svg' });
    salesChart.setOption(salesData);
    new ResizeObserver(() => salesChart.resize()).observe(salesChartElement);
}
const supportChartElement = document.getElementById("supportRequestChart")
if (supportChartElement) {
    const supportChart = echarts.init(supportChartElement, null, { renderer: 'svg' });
    supportChart.setOption(supportRequests);
    new ResizeObserver(() => supportChart.resize()).observe(supportChartElement);
}
if (document.location.hostname == 'pratikborsadiya.in') {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-72504830-1', 'auto');
    ga('send', 'pageview');
}

document.addEventListener("DOMContentLoaded", function () {
    const productListData = [
        { id: 'sp001', name: 'Nước ngọt Coca Cola', originalPrice: 12000, price: 10800, image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Coca+Cola', discountBadge: 'Giảm 10%' },
        { id: 'sp002', name: 'Bánh mì Sandwich Kẹp Thịt', originalPrice: null, price: 25000, image: 'https://via.placeholder.com/300x200/F5DEB3/000000?text=Sandwich', discountBadge: null },
        { id: 'sp003', name: 'Sữa tươi Vinamilk 1L', originalPrice: 30000, price: 28000, image: 'https://via.placeholder.com/300x200/007bff/FFFFFF?text=Vinamilk', discountBadge: 'Giảm 2k' },
        { id: 'sp004', name: 'Mì gói Hảo Hảo', originalPrice: null, price: 4000, image: 'https://via.placeholder.com/300x200/FFC107/000000?text=Hao+Hao', discountBadge: null },
        { id: 'sp005', name: 'Snack Ostar Vị Kim Chi', originalPrice: 10000, price: 8000, image: 'https://via.placeholder.com/300x200/28A745/FFFFFF?text=Ostar', discountBadge: 'Giảm 20%' },
        { id: 'sp006', name: 'Kem Celano', originalPrice: null, price: 20000, image: 'https://via.placeholder.com/300x200/17A2B8/FFFFFF?text=Celano', discountBadge: null },
        { id: 'sp007', name: 'Nước suối Aquafina 500ml', originalPrice: null, price: 5000, image: 'https://via.placeholder.com/300x200/E8F0FE/000000?text=Aquafina', discountBadge: null },
        { id: 'sp008', name: 'Bia 333 Lon', originalPrice: 15000, price: 14500, image: 'https://via.placeholder.com/300x200/DC3545/FFFFFF?text=Bia+333', discountBadge: 'Giảm 500đ' }
    ];

    const productListContainer = document.getElementById('product-list');
    const searchInput = document.getElementById('productSearchInput');
    const searchButton = document.getElementById('productSearchButton');
    const cartBadge = document.getElementById('cart-count-badge');
    const cartIcon = document.getElementById('cart-icon');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const selectAllCheckbox = document.getElementById('select-all-cart-items');

    let cart = new Map();

    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    function renderProducts(products) {
        productListContainer.innerHTML = '';
        if (products.length === 0) {
            productListContainer.innerHTML = '<p class="text-center text-muted col-12">Không tìm thấy sản phẩm nào.</p>';
            return;
        }

        products.forEach(product => {
            const discountBadge = product.discountBadge
                ? `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">${product.discountBadge}</span>`
                : '';

            const priceHtml = product.originalPrice
                ? `<p class="card-text mb-0"><span class="price-original me-2">${formatCurrency(product.originalPrice)}</span><span class="price-discounted">${formatCurrency(product.price)}</span></p>`
                : `<p class="card-text mb-0"><span class="price-discounted">${formatCurrency(product.price)}</span></p>`;

            const isInCart = cart.has(product.id);
            const btnClass = isInCart ? 'btn-success' : 'btn-primary';
            const btnText = isInCart ? '<i class="bi bi-check-lg"></i> Đã thêm' : '<i class="bi bi-cart-plus"></i> Thêm vào giỏ';
            const btnDisabled = isInCart ? 'disabled' : '';

            const productCol = document.createElement('div');
            productCol.className = 'col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4';
            productCol.innerHTML = `
            <div class="card h-100 product-card">
              <img src="${product.image}" class="card-img-top" alt="${product.name}">
              ${discountBadge}
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <div class="mt-auto">
                  ${priceHtml}
                </div>
              </div>
              <div class="card-footer">
                <button class="btn ${btnClass} w-100 add-to-cart-btn" data-id="${product.id}" ${btnDisabled}>
                  ${btnText}
                </button>
              </div>
            </div>
          `;
            productListContainer.appendChild(productCol);
        });
    }

    function renderCartItems() {
        if (cart.size === 0) {
            cartItemsList.innerHTML = '';
            cartEmptyMsg.style.display = 'block';
            updateCartTotal();
            return;
        }

        cartEmptyMsg.style.display = 'none';
        cartItemsList.innerHTML = '';

        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'd-flex align-items-center mb-3 cart-item';
            itemEl.dataset.id = item.product.id;

            itemEl.innerHTML = `
            <input class="form-check-input me-2 cart-item-checkbox" type="checkbox" value="${item.product.id}" checked>
            <img src="${item.product.image}" class="rounded me-2" alt="${item.product.name}">
            <div class="flex-grow-1">
              <h6 class="mb-0 text-truncate">${item.product.name}</h6>
              <small class="text-muted">${formatCurrency(item.product.price)}</small>
              <div class="d-flex align-items-center mt-1">
                <button class="btn btn-sm btn-outline-secondary cart-qty-btn" data-id="${item.product.id}" data-action="decrease">-</button>
                <input type="text" class="form-control form-control-sm text-center mx-1" value="${item.quantity}" readonly>
                <button class="btn btn-sm btn-outline-secondary cart-qty-btn" data-id="${item.product.id}" data-action="increase">+</button>
              </div>
            </div>
            <div class="fw-bold ms-auto me-2 text-nowrap">${formatCurrency(item.product.price * item.quantity)}</div>
            <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-id="${item.product.id}"><i class="bi bi-trash"></i></button>
          `;
            cartItemsList.appendChild(itemEl);
        });

        updateCartTotal();
        updateSelectAllCheckboxState();
    }

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = productListData.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }

    function addToCart(productId, buttonEl) {
        const productToAdd = productListData.find(p => p.id === productId);
        if (!productToAdd) return;

        if (cart.has(productId)) {
            let item = cart.get(productId);
            item.quantity++;
            cart.set(productId, item);
        } else {
            cart.set(productId, { product: productToAdd, quantity: 1 });
        }

        buttonEl.innerHTML = '<i class="bi bi-check-lg"></i> Đã thêm';
        buttonEl.classList.add('btn-success');
        buttonEl.classList.remove('btn-primary');
        buttonEl.disabled = true;

        cartIcon.classList.add('pop');
        cartIcon.addEventListener('animationend', () => {
            cartIcon.classList.remove('pop');
        }, { once: true });

        updateCartBadge();
        renderCartItems();
    }

    function changeQuantity(productId, action) {
        if (!cart.has(productId)) return;

        let item = cart.get(productId);

        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
        }

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            cart.set(productId, item);
            renderCartItems();
            updateCartBadge();
        }
    }

    function removeFromCart(productId) {
        cart.delete(productId);

        const productButton = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        if (productButton) {
            productButton.innerHTML = '<i class="bi bi-cart-plus"></i> Thêm vào giỏ';
            productButton.classList.remove('btn-success');
            productButton.classList.add('btn-primary');
            productButton.disabled = false;
        }

        renderCartItems();
        updateCartBadge();
    }

    function updateCartBadge() {
        let totalQuantity = 0;
        for (const item of cart.values()) {
            totalQuantity += item.quantity;
        }
        cartBadge.textContent = totalQuantity;
    }

    function updateCartTotal() {
        let total = 0;
        const checkedItems = document.querySelectorAll('.cart-item-checkbox:checked');

        checkedItems.forEach(chk => {
            const productId = chk.value;
            if (cart.has(productId)) {
                const item = cart.get(productId);
                total += item.product.price * item.quantity;
            }
        });

        cartTotalPriceEl.textContent = formatCurrency(total);
    }

    function updateSelectAllCheckboxState() {
        const allCheckboxes = document.querySelectorAll('.cart-item-checkbox');
        if (allCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            return;
        }
        const allChecked = Array.from(allCheckboxes).every(chk => chk.checked);
        selectAllCheckbox.checked = allChecked;
    }

    searchButton.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            filterProducts();
        }
    });

    productListContainer.addEventListener('click', function (event) {
        const button = event.target.closest('.add-to-cart-btn');
        if (button) {
            const productId = button.dataset.id;
            addToCart(productId, button);
        }
    });

    cartItemsList.addEventListener('click', function (event) {
        const removeBtn = event.target.closest('.remove-from-cart-btn');
        if (removeBtn) {
            removeFromCart(removeBtn.dataset.id);
            return;
        }

        const qtyBtn = event.target.closest('.cart-qty-btn');
        if (qtyBtn) {
            changeQuantity(qtyBtn.dataset.id, qtyBtn.dataset.action);
            return;
        }
    });

    cartItemsList.addEventListener('change', function (event) {
        if (event.target.classList.contains('cart-item-checkbox')) {
            updateCartTotal();
            updateSelectAllCheckboxState();
        }
    });

    selectAllCheckbox.addEventListener('change', function (event) {
        const isChecked = event.target.checked;
        document.querySelectorAll('.cart-item-checkbox').forEach(chk => chk.checked = isChecked);
        updateCartTotal();
    });

    renderProducts(productListData);
});