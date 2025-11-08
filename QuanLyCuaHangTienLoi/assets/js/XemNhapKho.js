document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    const selectNhaCungCap = $('#select-nha-cung-cap');
    const selectNhanVien = $('#select-nhan-vien');
    const selectSanPham = $('#select-san-pham');
    
    selectNhaCungCap.select2({ width: '100%' });
    selectNhanVien.select2({ width: '100%' });
    selectSanPham.select2({ width: '100%' });

    // --- ĐỊNH DẠNG TIỀN TỆ ---
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    // --- TRUY XUẤT PHẦN TỬ DOM CHÍNH ---
    const addItemBtn = document.getElementById('add-item-btn');
    const tableBody = document.getElementById('chi-tiet-phieu-nhap-body');
    const totalSpan = document.getElementById('tong-tien-phieu-nhap');

    const soLuongInput = document.getElementById('input-so-luong');
    const donGiaInput = document.getElementById('input-don-gia');
    const hsdInput = document.getElementById('input-hsd');
    
    // --- TRUY XUẤT CÁC PHẦN TỬ ĐIỀU KHIỂN CHẾ ĐỘ ---
    const container = document.getElementById('phieu-nhap-container');
    const btnEdit = document.getElementById('btn-edit');
    const btnSave = document.getElementById('btn-save');
    
    // Các trường thông tin chung
    const inputNgayNhap = document.getElementById('input-ngay-nhap');
    
    // --- DỮ LIỆU MẪU (Giả lập trang chi tiết đã có dữ liệu) ---
    function loadMockData() {
        // Dữ liệu mẫu
        const mockItems = [
            { id: 'SPDV_001', name: 'Sting Dâu (Chai 330ml)', soLuong: 50, donGia: 8000, hsd: '2026-11-01' },
            { id: 'SPDV_002', name: 'Bánh Chocopie (Hộp 12 cái)', soLuong: 20, donGia: 45000, hsd: '2026-05-15' }
        ];

        tableBody.innerHTML = ''; // Xoá bảng trước khi tải

        mockItems.forEach(item => {
            const thanhTien = item.soLuong * item.donGia;
            const row = tableBody.insertRow();
            row.innerHTML = `
              <td>${item.name} (ID: ${item.id})</td>
              <td>${item.soLuong}</td>
              <td>${formatter.format(item.donGia)}</td>
              <td>${item.hsd}</td>
              <td class="row-total" data-total="${thanhTien}">${formatter.format(thanhTien)}</td>
              <td class="delete-column"><button class="btn btn-danger btn-sm remove-item-btn"><i class="bi bi-trash"></i></button></td>
            `;
        });
        
        updateTotal();
    }
    
    // Tải dữ liệu mẫu khi trang được mở
    loadMockData();
    
    
    // --- LOGIC CHUYỂN CHẾ ĐỘ XEM / CHỈNH SỬA ---
    
    btnEdit.addEventListener('click', function() {
        // Bật container sang chế độ 'edit-mode' (CSS sẽ xử lý ẩn/hiện)
        container.classList.add('edit-mode');
        
        // Kích hoạt các trường nhập liệu
        selectNhaCungCap.prop('disabled', false).trigger('change');
        selectNhanVien.prop('disabled', false).trigger('change');
        inputNgayNhap.disabled = false;
    });

    btnSave.addEventListener('click', function() {
        // (Đây là nơi bạn sẽ gọi API để lưu dữ liệu)
        alert('Đã lưu thay đổi! (Giả lập)');

        // Tắt chế độ 'edit-mode'
        container.classList.remove('edit-mode');
        
        // Vô hiệu hoá các trường nhập liệu
        selectNhaCungCap.prop('disabled', true).trigger('change');
        selectNhanVien.prop('disabled', true).trigger('change');
        inputNgayNhap.disabled = true;
    });


    // --- LOGIC THÊM SẢN PHẨM VÀO BẢNG (KHI Ở CHẾ ĐỘ EDIT) ---
    addItemBtn.addEventListener('click', function () {
        const selectedOption = selectSanPham.find('option:selected');
        const productId = selectedOption.val();
        const productName = selectedOption.data('name');
        const soLuong = parseInt(soLuongInput.value);
        const donGia = parseFloat(donGiaInput.value);
        const hsd = hsdInput.value;

        // Kiểm tra dữ liệu
        if (!productId) {
            alert("Vui lòng chọn một sản phẩm.");
            return;
        }
        if (isNaN(soLuong) || soLuong <= 0) {
            alert("Số lượng phải lớn hơn 0.");
            return;
        }
        if (isNaN(donGia) || donGia < 0) {
            alert("Vui lòng nhập đơn giá nhập.");
            return;
        }
        if (!hsd) {
            alert("Vui lòng nhập hạn sử dụng cho sản phẩm.");
            return;
        }

        const thanhTien = soLuong * donGia;

        // Tạo hàng mới
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${productName} (ID: ${productId})</td>
          <td>${soLuong}</td>
          <td>${formatter.format(donGia)}</td>
          <td>${hsd}</td>
          <td class="row-total" data-total="${thanhTien}">${formatter.format(thanhTien)}</td>
          <td class="delete-column"><button class="btn btn-danger btn-sm remove-item-btn"><i class="bi bi-trash"></i></button></td>
        `;

        // Cập nhật tổng tiền
        updateTotal();

        // Xoá trường nhập
        selectSanPham.val('').trigger('change');
        soLuongInput.value = 1;
        donGiaInput.value = '';
        hsdInput.value = '';
    });

    // --- LOGIC XOÁ SẢN PHẨM KHỎI BẢNG (KHI Ở CHẾ ĐỘ EDIT) ---
    tableBody.addEventListener('click', function (e) {
        const removeButton = e.target.closest('.remove-item-btn');
        if (removeButton) {
            removeButton.closest('tr').remove();
            updateTotal(); // Cập nhật lại tổng tiền
        }
    });

    // --- HÀM CẬP NHẬT TỔNG TIỀN (PhieuNhap.tongTien) ---
    function updateTotal() {
        let total = 0;
        const allRows = tableBody.querySelectorAll('tr');

        allRows.forEach(row => {
            const totalCell = row.querySelector('.row-total');
            total += parseFloat(totalCell.getAttribute('data-total'));
        });

        totalSpan.textContent = formatter.format(total);
    }
    
    // --- BỎ QUA LOGIC IMPORT EXCEL (vì đây là trang chi tiết) ---
    // (Đoạn code import excel của bạn đã bị loại bỏ vì không phù hợp với trang "Chi tiết")
    const importBtn = document.getElementById('import-excel-btn');
    if(importBtn) {
        importBtn.style.display = 'none'; // Ẩn nếu còn sót
    }

});