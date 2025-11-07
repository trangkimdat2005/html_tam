document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#selectKhachHang').select2({
        width: '100%'
    });
    $('#selectDanhMuc').select2({
        width: '100%'
    });

    // --- CÁC BIẾN LƯU TRỮ ---
    // Dùng để lưu trữ dữ liệu của các hoá đơn tạm
    let savedDrafts = {};

    // --- TRUY XUẤT PHẦN TỬ DOM ---
    const productList = document.getElementById('product-list');
    const invoiceBody = document.getElementById('invoice-items-body');
    const subTotalEl = document.getElementById('sub-total');
    const discountEl = document.getElementById('discount-amount');
    const totalEl = document.getElementById('total-amount');
    const searchInput = document.getElementById('product-search-input');
    const categorySelect = document.getElementById('selectDanhMuc');
    const customerSelect = $('#selectKhachHang'); // jQuery object
    const discountInput = document.getElementById('discount-code-input');

    // Nút bấm
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const cancelInvoiceBtn = document.getElementById('cancel-invoice-btn');

    // Danh sách hoá đơn tạm
    const draftList = document.getElementById('draft-list');

    // Hàm định dạng tiền tệ (vi-VN)
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    // =======================================================
    // 1. CHỨC NĂNG LỌC SẢN PHẨM (Không đổi)
    // =======================================================
    function filterProducts() {
        const searchText = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        const allProducts = productList.querySelectorAll('.product-item');

        allProducts.forEach(product => {
            const productName = product.querySelector('h6').textContent.toLowerCase();
            const productCategory = product.getAttribute('data-category');
            const matchesSearch = productName.includes(searchText);
            const matchesCategory = (category === 'all' || productCategory === category);

            if (matchesSearch && matchesCategory) {
                product.classList.remove('hide');
            } else {
                product.classList.add('hide');
            }
        });
    }
    searchInput.addEventListener('keyup', filterProducts);
    categorySelect.addEventListener('change', filterProducts);

    // =======================================================
    // 2. CHỨC NĂNG GIỎ HÀNG (Thêm, Xoá, Cập nhật)
    // =======================================================

    // --- Thêm sản phẩm vào hoá đơn ---
    productList.addEventListener('click', function (e) {
        const addButton = e.target.closest('.add-product-btn');
        if (addButton) {
            const id = addButton.getAttribute('data-id');
            const name = addButton.getAttribute('data-name');
            const price = parseFloat(addButton.getAttribute('data-price'));
            addProductToInvoice(id, name, price);
        }
    });

    /**
     * Thêm 1 sản phẩm vào bảng chi tiết.
     * @param {string} id - Mã sản phẩm (ví dụ: spdv_01)
     * @param {string} name - Tên sản phẩm
     * @param {number} price - Đơn giá
     * @param {number} [quantity=1] - Số lượng (dùng khi tải lại draft)
     */
    function addProductToInvoice(id, name, price, quantity = 1) {
        const existingRow = document.querySelector(`#invoice-items-body tr[data-id="${id}"]`);

        if (existingRow) {
            // Nếu đã có, tăng số lượng
            const qtyInput = existingRow.querySelector('.quantity-input');
            qtyInput.value = parseInt(qtyInput.value) + quantity;
            updateRowTotal(existingRow);
        } else {
            // Nếu chưa có, tạo dòng mới
            const row = invoiceBody.insertRow();
            row.setAttribute('data-id', id);
            row.innerHTML = `
            <td>${name}</td>
            <td><input type="number" class="form-control quantity-input" value="${quantity}" min="1" data-price="${price}"></td>
            <td>${formatter.format(price)}</td>
            <td class="row-total">${formatter.format(price * quantity)}</td>
            <td><button class="btn btn-danger btn-sm remove-item-btn"><i class="bi bi-trash"></i></button></td>
          `;
        }
        updateInvoiceTotal(); // Cập nhật tổng tiền
    }

    // --- Xoá sản phẩm / Thay đổi số lượng ---
    invoiceBody.addEventListener('input', function (e) {
        // Cập nhật khi thay đổi số lượng
        const qtyInput = e.target.closest('.quantity-input');
        if (qtyInput) {
            if (qtyInput.value < 1) qtyInput.value = 1;
            const row = qtyInput.closest('tr');
            updateRowTotal(row);
            updateInvoiceTotal();
        }
    });

    invoiceBody.addEventListener('click', function (e) {
        // Xử lý nút Xoá
        const removeButton = e.target.closest('.remove-item-btn');
        if (removeButton) {
            removeButton.closest('tr').remove();
            updateInvoiceTotal(); // Cập nhật lại tổng tiền
        }
    });

    // --- Các hàm tính toán ---
    function updateRowTotal(row) {
        const qtyInput = row.querySelector('.quantity-input');
        const price = parseFloat(qtyInput.getAttribute('data-price'));
        const quantity = parseInt(qtyInput.value);
        const total = price * quantity;
        row.querySelector('.row-total').textContent = formatter.format(total);
    }

    function updateInvoiceTotal() {
        let subTotal = 0;
        const allRows = invoiceBody.querySelectorAll('tr');
        allRows.forEach(row => {
            const qtyInput = row.querySelector('.quantity-input');
            const price = parseFloat(qtyInput.getAttribute('data-price'));
            const quantity = parseInt(qtyInput.value);
            subTotal += price * quantity;
        });

        const discount = 0; // Logic giảm giá sẽ thêm sau
        const total = subTotal - discount;

        subTotalEl.textContent = formatter.format(subTotal);
        discountEl.textContent = formatter.format(discount);
        totalEl.textContent = formatter.format(total);
    }

    // =======================================================
    // 3. CHỨC NĂNG HOÁ ĐƠN (Lưu tạm, Tải tạm, Huỷ)
    // =======================================================

    // --- Xoá trắng hoá đơn hiện tại ---
    function clearInvoice() {
        invoiceBody.innerHTML = '';
        customerSelect.val('khach_le').trigger('change'); // Reset về khách lẻ
        discountInput.value = '';
        updateInvoiceTotal(); // Tính lại tổng tiền (về 0)
    }

    // --- Bấm nút Huỷ ---
    cancelInvoiceBtn.addEventListener('click', function () {
        if (confirm('Bạn có chắc muốn huỷ hoá đơn này? Mọi dữ liệu sẽ bị mất.')) {
            clearInvoice();
        }
    });

    // --- Bấm nút "Lưu tạm" ---
    saveDraftBtn.addEventListener('click', function () {
        const items = [];
        const allRows = invoiceBody.querySelectorAll('tr');

        // 1. Kiểm tra xem có sản phẩm nào không
        if (allRows.length === 0) {
            alert('Chưa có sản phẩm nào trong hoá đơn để lưu tạm.');
            return;
        }

        // 2. Lấy thông tin khách hàng
        const customerValue = customerSelect.val();
        const customerName = customerSelect.find('option:selected').text();

        // 3. Lấy thông tin tất cả sản phẩm
        allRows.forEach(row => {
            const qtyInput = row.querySelector('.quantity-input');
            items.push({
                id: row.getAttribute('data-id'),
                name: row.cells[0].textContent,
                quantity: parseInt(qtyInput.value),
                price: parseFloat(qtyInput.getAttribute('data-price'))
            });
        });

        // 4. Lấy thông tin tổng tiền
        const totalText = totalEl.textContent;
        const draftId = 'draft-' + new Date().getTime(); // Tạo ID duy nhất

        // 5. Tạo đối tượng hoá đơn tạm
        const draftData = {
            id: draftId,
            customer: {
                value: customerValue,
                name: customerName
            },
            items: items,
            total: totalText
        };

        // 6. Lưu vào kho lưu trữ (biến savedDrafts)
        savedDrafts[draftId] = draftData;
        console.log("Đã lưu tạm:", savedDrafts);

        // 7. Thêm vào danh sách bên phải
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center draft-item';
        li.setAttribute('data-draft-id', draftId);
        li.innerHTML = `
          <div>
            <h6 class="mb-0">${customerName}</h6>
            <small class="text-muted">Tổng: ${totalText} (${items.length} SP)</small>
          </div>
          <button class="btn btn-danger btn-sm remove-draft-btn">
            <i class="bi bi-x-lg"></i>
          </button>
        `;
        draftList.appendChild(li);

        // 8. Xoá trắng hoá đơn hiện tại
        clearInvoice();
    });

    // --- Xử lý danh sách hoá đơn tạm (Tải lại hoặc Xoá) ---
    draftList.addEventListener('click', function (e) {
        const draftItem = e.target.closest('.draft-item');
        if (!draftItem) return; // Không làm gì nếu không nhấn vào 1 item

        const draftId = draftItem.getAttribute('data-draft-id');
        const draftData = savedDrafts[draftId];

        // Trường hợp 1: Nhấn nút "Xoá"
        if (e.target.closest('.remove-draft-btn')) {
            if (confirm(`Bạn có chắc muốn XOÁ hoá đơn tạm của "${draftData.customer.name}"?`)) {
                delete savedDrafts[draftId]; // Xoá khỏi bộ nhớ
                draftItem.remove(); // Xoá khỏi giao diện
            }
        }
        // Trường hợp 2: Nhấn vào để "Tải lại"
        else {
            // Kiểm tra xem hoá đơn hiện tại có trống không
            if (invoiceBody.querySelectorAll('tr').length > 0) {
                if (!confirm('Hoá đơn hiện tại có dữ liệu. Bạn có muốn xoá và tải hoá đơn tạm?')) {
                    return;
                }
            }

            // Tải hoá đơn
            clearInvoice(); // Xoá trắng

            // 1. Set lại khách hàng
            customerSelect.val(draftData.customer.value).trigger('change');

            // 2. Thêm lại các sản phẩm
            draftData.items.forEach(item => {
                // Dùng hàm addProductToInvoice với số lượng cụ thể
                addProductToInvoice(item.id, item.name, item.price, item.quantity);
            });

            // 3. Xoá hoá đơn tạm sau khi đã tải
            delete savedDrafts[draftId];
            draftItem.remove();
        }
    });

});