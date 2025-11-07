document.addEventListener('DOMContentLoaded', function () {

    // Khởi tạo Select2 cho các ô chọn
    $('#select-chuc-vu').select2({
        width: '100%'
    });

    $('#select-trang-thai').select2({
        width: '100%'
    });

    // XỬ LÝ PREVIEW ẢNH ĐẠI DIỆN
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