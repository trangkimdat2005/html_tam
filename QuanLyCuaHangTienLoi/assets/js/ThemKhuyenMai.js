document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 CHO CÁC Ô CHỌN ---
    $('#select-danh-muc').select2({
        width: '100%',
        placeholder: 'Chọn một hoặc nhiều danh mục'
    });
    $('#select-san-pham').select2({
        width: '100%',
        placeholder: 'Chọn một hoặc nhiều sản phẩm'
    });

    // --- TRUY XUẤT PHẦN TỬ DOM ---
    const selectHinhThucGiam = document.getElementById('select-hinh-thuc-giam');
    const labelGiaTri = document.getElementById('label-gia-tri');
    const fieldGiamToiDa = document.getElementById('field-giam-toi-da');

    const radioPhamVi = document.querySelectorAll('input[name="phamViApDung"]');
    const fieldChonDanhMuc = document.getElementById('field-chon-danh-muc');
    const fieldChonSanPham = document.getElementById('field-chon-san-pham');

    // --- LOGIC 1: THAY ĐỔI HÌNH THỨC GIẢM (%) HOẶC (VND) ---
    selectHinhThucGiam.addEventListener('change', function () {
        if (this.value === 'PhanTram') {
            // Nếu là %, hiển thị ô "Giảm tối đa" và đổi nhãn
            labelGiaTri.textContent = 'Giá trị giảm (%) ';
            fieldGiamToiDa.classList.remove('form-field-hidden');
        } else {
            // Nếu là VND, ẩn ô "Giảm tối đa" và đổi nhãn
            labelGiaTri.textContent = 'Giá trị giảm (VND) ';
            fieldGiamToiDa.classList.add('form-field-hidden');
        }
    });
    // Kích hoạt sự kiện change một lần lúc tải trang để đảm bảo trạng thái đúng
    selectHinhThucGiam.dispatchEvent(new Event('change'));


    // --- LOGIC 2: THAY ĐỔI PHẠM VI ÁP DỤNG ---
    radioPhamVi.forEach(radio => {
        radio.addEventListener('change', function () {
            // Ẩn tất cả các trường chọn trước
            fieldChonDanhMuc.classList.add('form-field-hidden');
            fieldChonSanPham.classList.add('form-field-hidden');

            if (this.value === 'danh-muc') {
                fieldChonDanhMuc.classList.remove('form-field-hidden');
            } else if (this.value === 'san-pham') {
                fieldChonSanPham.classList.remove('form-field-hidden');
            }
            // Nếu là 'toan-bo' thì không làm gì cả (vì đã ẩn hết)
        });
    });

    // --- LOGIC 3: TẠO MÃ NGẪU NHIÊN ---
    document.getElementById('generate-code-btn').addEventListener('click', function () {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        document.getElementById('ma-code-input').value = result;
    });

});