document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#select-danh-muc').select2({ width: '100%', placeholder: 'Chọn danh mục' });
    $('#select-san-pham').select2({ width: '100%', placeholder: 'Chọn sản phẩm' });

    // --- TRUY XUẤT PHẦN TỬ ---
    const selectHinhThuc = document.getElementById('select-hinh-thuc-giam');
    const labelGiaTri = document.getElementById('label-gia-tri');
    const fieldGiamToiDa = document.getElementById('field-giam-toi-da');

    const radioButtons = document.querySelectorAll('input[name="phamViApDung"]');
    const fieldDanhMuc = document.getElementById('field-chon-danh-muc');
    const fieldSanPham = document.getElementById('field-chon-san-pham');

    // --- HÀM CẬP NHẬT HÌNH THỨC GIẢM ---
    function updateHinhThucGiam() {
        const selectedValue = selectHinhThuc.value;
        if (selectedValue === 'PhanTram') {
            labelGiaTri.textContent = 'Giá trị giảm (%) (giaTri)';
            fieldGiamToiDa.style.display = 'block';
        } else { // 'SoTien'
            labelGiaTri.textContent = 'Giá trị giảm (VND) (giaTri)';
            fieldGiamToiDa.style.display = 'none';
        }
    }

    // --- HÀM CẬP NHẬT PHẠM VI ÁP DỤNG ---
    function updatePhamViApDung() {
        const selectedValue = document.querySelector('input[name="phamViApDung"]:checked').value;

        fieldDanhMuc.style.display = 'none';
        fieldSanPham.style.display = 'none';

        if (selectedValue === 'danh-muc') {
            fieldDanhMuc.style.display = 'block';
        } else if (selectedValue === 'san-pham') {
            fieldSanPham.style.display = 'block';
        }
        // Nếu là 'toan-bo' thì không hiển thị gì cả
    }

    // --- GÁN SỰ KIỆN ---
    selectHinhThuc.addEventListener('change', updateHinhThucGiam);

    radioButtons.forEach(radio => {
        radio.addEventListener('change', updatePhamViApDung);
    });

    // --- CHẠY KIỂM TRA KHI TẢI TRANG ---
    // Rất quan trọng cho trang "Sửa"
    updateHinhThucGiam();
    updatePhamViApDung();

    // (Bạn có thể bỏ qua nút tạo mã ngẫu nhiên vì đã ẩn)
});