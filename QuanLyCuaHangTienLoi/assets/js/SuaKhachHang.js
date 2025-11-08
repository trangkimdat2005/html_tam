document.addEventListener('DOMContentLoaded', function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#select-hang-the').select2({ width: '100%' });
    $('#select-trang-thai').select2({ width: '100%' });

    // --- TỰ ĐỘNG ĐIỀN NGÀY HÔM NAY ---
    const today = new Date().toISOString().split('T')[0];
    const ngayDangKyInput = document.getElementById('input-ngay-dang-ky');
    const ngayCapTheInput = document.getElementById('input-ngay-cap');

    if (ngayDangKyInput) ngayDangKyInput.value = today;
    if (ngayCapTheInput) ngayCapTheInput.value = today;

    // --- TRUY XUẤT CÁC PHẦN TỬ FORM ---
    const toggleSwitch = document.getElementById('toggle-membership-form'); // ID giữ nguyên
    const customerContainer = document.getElementById('customer-form-container');
    const membershipContainer = document.getElementById('membership-form-container');

    // --- XỬ LÝ LOGIC CHÍNH KHI BẬT/TẮT CHECKBOX ---
    toggleSwitch.addEventListener('change', function () {
        if (this.checked) {
            // --- KÍCH HOẠT CHẾ ĐỘ 2 CỘT ---
            membershipContainer.style.display = 'block';
            setTimeout(() => {
                membershipContainer.style.opacity = 1;
            }, 10);
            customerContainer.classList.remove('mx-auto');
        } else {
            // --- TẮT, QUAY VỀ TRẠNG THÁI BAN ĐẦU ---
            membershipContainer.style.opacity = 0;
            setTimeout(() => {
                membershipContainer.style.display = 'none';
            }, 500);
            customerContainer.classList.add('mx-auto');
        }
    });

    // --- THÊM MỚI: XỬ LÝ PREVIEW ẢNH ĐẠI DIỆN ---
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');

    avatarUpload.addEventListener('change', function () {
        const file = this.files[0]; // Lấy file đầu tiên
        if (file) {
            // Tạo một URL tạm thời cho file ảnh
            const reader = new FileReader();
            reader.onload = function (e) {
                // Gán URL này cho ảnh preview
                avatarPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

});