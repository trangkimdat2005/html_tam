document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#select-danh-muc').select2({
        width: '100%',
        placeholder: 'Chọn một hoặc nhiều danh mục'
    });

    // --- TỰ ĐỘNG ĐIỀN NGÀY HÔM NAY ---
    const today = new Date().toISOString().split('T')[0];
    const tuNgayInput = document.getElementById('input-tu-ngay');
    if (tuNgayInput) tuNgayInput.value = today;

    // --- TRUY XUẤT PHẦN TỬ DOM ---
    const apDungToanBoCheck = document.getElementById('check-ap-dung-toan-bo');
    const danhMucField = document.getElementById('field-chon-danh-muc');

    // --- HÀM CẬP NHẬT FORM ---
    function toggleDanhMucField() {
        if (apDungToanBoCheck.checked) {
            // Nếu check "Toàn bộ" -> ẨN trường chọn Danh mục
            danhMucField.classList.add('form-field-hidden');
            $('#select-danh-muc').val(null).trigger('change'); // Xoá lựa chọn (nếu có)
        } else {
            // Nếu không check "Toàn bộ" -> HIỆN trường chọn Danh mục
            danhMucField.classList.remove('form-field-hidden');
        }
    }

    // --- GÁN SỰ KIỆN CHO CHECKBOX ---
    apDungToanBoCheck.addEventListener('change', toggleDanhMucField);

    // Kích hoạt 1 lần khi tải trang để set trạng thái ban đầu (đang là checked -> ẩn)
    toggleDanhMucField();

});