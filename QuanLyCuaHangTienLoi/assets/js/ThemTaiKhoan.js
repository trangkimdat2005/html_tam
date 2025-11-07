document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#select-nhan-vien').select2({ width: '100%' });
    $('#select-khach-hang').select2({ width: '100%' });
    $('#select-trang-thai').select2({ width: '100%', minimumResultsForSearch: Infinity }); // Ẩn thanh tìm kiếm
    $('#select-quyen').select2({
        width: '100%',
        placeholder: 'Chọn một hoặc nhiều quyền'
    });

    // --- TRUY XUẤT PHẦN TỬ DOM ---
    const accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
    const nhanVienField = document.getElementById('field-chon-nhan-vien');
    const khachHangField = document.getElementById('field-chon-khach-hang');
    const quyenField = document.getElementById('field-chon-quyen');
    const emailInput = document.getElementById('input-email');

    // --- HÀM CẬP NHẬT FORM DỰA TRÊN LOẠI TÀI KHOẢN ---
    function updateFormFields(selectedValue) {
        if (selectedValue === 'NhanVien') {
            // HIỆN form nhân viên và quyền
            nhanVienField.classList.remove('form-field-hidden');
            quyenField.classList.remove('form-field-hidden');
            // ẨN form khách hàng
            khachHangField.classList.add('form-field-hidden');

            // Xoá lựa chọn & email (nếu có)
            $('#select-khach-hang').val('').trigger('change');
            if ($('#select-nhan-vien').val() === '') {
                emailInput.value = '';
            }

        } else if (selectedValue === 'KhachHang') {
            // ẨN form nhân viên và quyền
            nhanVienField.classList.add('form-field-hidden');
            quyenField.classList.add('form-field-hidden');
            // HIỆN form khách hàng
            khachHangField.classList.remove('form-field-hidden');

            // Xoá lựa chọn & email (nếu có)
            $('#select-nhan-vien').val('').trigger('change');
            $('#select-quyen').val(null).trigger('change');
            if ($('#select-khach-hang').val() === '') {
                emailInput.value = '';
            }
        }
    }

    // --- GÁN SỰ KIỆN CHO RADIO BUTTON ---
    accountTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            updateFormFields(this.value);
        });
    });

    // --- HÀM TỰ ĐỘNG ĐIỀN EMAIL ---
    $('#select-nhan-vien, #select-khach-hang').on('change', function () {
        const selectedOption = $(this).find('option:selected');
        const email = selectedOption.data('email');
        if (email) {
            emailInput.value = email;
        } else {
            emailInput.value = '';
        }
    });

    // Kích hoạt 1 lần khi tải trang
    updateFormFields(document.querySelector('input[name="accountType"]:checked').value);

});