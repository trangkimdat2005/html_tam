document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#select-nha-cung-cap').select2({ width: '100%' });
    $('#select-nhan-vien').select2({ width: '100%' });
    $('#select-san-pham').select2({ width: '100%' });

    // --- TỰ ĐỘNG ĐIỀN NGÀY NHẬP LÀ HÔM NAY ---
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('input-ngay-nhap').value = today;

    // --- ĐỊNH DẠNG TIỀN TỆ ---
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    // --- TRUY XUẤT PHẦN TỬ DOM ---
    const addItemBtn = document.getElementById('add-item-btn');
    const tableBody = document.getElementById('chi-tiet-phieu-nhap-body');
    const totalSpan = document.getElementById('tong-tien-phieu-nhap');

    const productSelect = $('#select-san-pham');
    const soLuongInput = document.getElementById('input-so-luong');
    const donGiaInput = document.getElementById('input-don-gia');
    const hsdInput = document.getElementById('input-hsd');

    // --- LOGIC NÚT IMPORT EXCEL ---
    const importBtn = document.getElementById('import-excel-btn');
    const importInput = document.getElementById('import-excel-input');
    importBtn.addEventListener('click', function () {
        importInput.click(); // Kích hoạt input file bị ẩn
    });

    importInput.addEventListener('change', function () {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            console.log("Đã chọn file:", fileName);
            alert("Đã chọn file: " + fileName + ". (Logic xử lý file Excel sẽ được lập trình ở đây)");
            // Bạn sẽ cần dùng thư viện như SheetJS (xlsx) để đọc file này
        }
    });

    // --- LOGIC THÊM SẢN PHẨM VÀO BẢNG ---
    addItemBtn.addEventListener('click', function () {
        const selectedOption = productSelect.find('option:selected');
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
          <td><button class="btn btn-danger btn-sm remove-item-btn"><i class="bi bi-trash"></i></button></td>
        `;

        // Cập nhật tổng tiền
        updateTotal();

        // Xoá trường nhập
        productSelect.val('').trigger('change');
        soLuongInput.value = 1;
        donGiaInput.value = '';
        hsdInput.value = '';
    });

    // --- LOGIC XOÁ SẢN PHẨM KHỎI BẢNG ---
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

});