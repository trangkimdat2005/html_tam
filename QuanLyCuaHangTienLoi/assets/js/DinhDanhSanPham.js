$(document).ready(function () {

    // --- KHỞI TẠO SELECT2 ---
    // (Bạn cần tải thư viện Select2)
    if ($.fn.select2) {
        $('#form-select-sanpham').select2({ width: '100%' });
    }

    // --- TRUY XUẤT PHẦN TỬ DOM (jQuery) ---
    const mainRow = $('#main-row-container');
    const listCol = $('#list-col');
    const formCol = $('#form-col');
    const showAddFormBtn = $('#show-add-form-btn');

    const identifierForm = $('#identifier-form');
    const formTitle = $('#form-title');
    const formImagePreview = $('#form-image-preview');
    const formImageUpload = $('#form-image-upload');

    // Các trường input
    const inputId = $('#form-id');
    const selectSanPham = $('#form-select-sanpham');
    const inputMaCode = $('#form-ma-code');

    // Nút bấm
    const btnSubmit = $('#btn-submit');
    const btnCancel = $('#btn-cancel');
    const btnEditMode = $('#btn-edit-mode');

    let currentData = null; // Biến lưu trữ dữ liệu khi xem

    // --- HÀM MỞ FORM ---
    function openForm(mode, data = null) {
        currentData = data; // Lưu dữ liệu hiện tại

        // 1. Co Bảng, Mở Form
        listCol.removeClass('col-md-12').addClass('col-md-8');
        formCol.removeClass('col-md-0').addClass('col-md-4');
        mainRow.addClass('form-open');
        showAddFormBtn.hide();

        // 2. Xử lý form dựa theo 'mode'
        identifierForm.removeClass('form-readonly'); // Mở khoá form trước

        if (mode === 'add') {
            formTitle.text('Tạo Mã Mới');
            identifierForm[0].reset(); // Xoá trắng form
            selectSanPham.val('').trigger('change');
            formImagePreview.attr('src', 'https://via.placeholder.com/200?text=Ảnh+Code');

            inputId.val('Mã sẽ được tạo tự động').prop('readonly', true);

            btnSubmit.text('Thêm').show();
            btnCancel.text('Huỷ').show();
            btnEditMode.hide();
        }
        else if (mode === 'edit' || mode === 'view') {
            // Điền dữ liệu
            inputId.val(data.id);
            inputMaCode.val(data.maCode);
            formImagePreview.attr('src', data.duongDan); // Cập nhật ảnh preview

            // Điền trạng thái (radio)
            $(`input[name="form-loai-ma"][value="${data.loaiMa}"]`).prop('checked', true);

            // Điền Select2
            selectSanPham.val(data.sanPhamDonViId).trigger('change');

            if (mode === 'view') {
                formTitle.text('Chi Tiết Mã Định Danh');
                identifierForm.addClass('form-readonly'); // Khoá form

                btnSubmit.hide();
                btnCancel.text('Đóng').show();
                btnEditMode.text('Chỉnh sửa').show();
            }
            else { // mode === 'edit'
                formTitle.text('Sửa Mã Định Danh');
                identifierForm.removeClass('form-readonly'); // Mở khoá
                inputId.prop('readonly', true); // Mã luôn readonly

                btnSubmit.text('Lưu').show();
                btnCancel.text('Huỷ').show();
                btnEditMode.hide();
            }
        }
    }

    // --- HÀM ĐÓNG FORM ---
    function closeForm() {
        // 1. Phình Bảng, Đóng Form
        listCol.removeClass('col-md-8').addClass('col-md-12');
        formCol.removeClass('col-md-4').addClass('col-md-0');
        mainRow.removeClass('form-open');
        showAddFormBtn.show();

        // 2. Reset form về trạng thái mặc định (mở khoá)
        identifierForm.removeClass('form-readonly');
        identifierForm[0].reset();
        selectSanPham.val('').trigger('change');
        formImagePreview.attr('src', 'https://via.placeholder.com/200?text=Ảnh+Code');
        currentData = null; // Xoá dữ liệu đang xem
    }

    // --- GÁN SỰ KIỆN CHO NÚT "THÊM" ---
    showAddFormBtn.on('click', function (e) {
        e.preventDefault();
        openForm('add');
    });

    // --- GÁN SỰ KIỆN CHO CÁC NÚT "HUỶ" / "ĐÓNG" ---
    btnCancel.on('click', function (e) {
        e.preventDefault();
        closeForm();
    });

    // --- GÁN SỰ KIỆN CHO BẢNG (SỬA, XOÁ, XEM) ---
    $('#sampleTable tbody').on('click', 'tr', function (e) {
        const clickedRow = $(this);
        const target = $(e.target);

        // Lấy dữ liệu từ data attributes
        const data = {
            id: clickedRow.data('id'),
            sanPhamDonViId: clickedRow.data('san-pham-don-vi-id'),
            loaiMa: clickedRow.data('loai-ma'),
            maCode: clickedRow.data('ma-code'),
            duongDan: clickedRow.data('duong-dan'),
            tenSp: clickedRow.data('ten-sp') // Dùng cho confirm box
        };

        // 1. Xử lý nút XOÁ
        if (target.closest('.btn-delete-khoi').length) {
            e.preventDefault();
            if (confirm(`Bạn có chắc muốn xoá mã định danh "${data.maCode}" của sản phẩm "${data.tenSp}" không?`)) {
                clickedRow.remove();
                closeForm(); // Đóng form nếu nó đang mở
            }
            return; // Dừng xử lý
        }

        // 2. Xử lý nút IN (không làm gì)
        if (target.closest('.btn-secondary').length) {
            e.preventDefault();
            alert('Đang gọi máy in... (mô phỏng)');
            return; // Dừng xử lý
        }

        // 3. Xử lý click XEM (nếu click vào hàng, không phải nút)
        // (Chúng ta không có nút "Sửa" riêng, nên click vào hàng là "Xem")
        openForm('view', data);
    });

    // --- GÁN SỰ KIỆN CHO NÚT "CHỈNH SỬA" (TRONG FORM VIEW) ---
    btnEditMode.on('click', function () {
        if (currentData) {
            openForm('edit', currentData); // Mở lại form ở chế độ edit
        }
    });

    // --- LOGIC SUBMIT (Mô phỏng) ---
    btnSubmit.on('click', function () {
        // (Thêm logic kiểm tra (validation) ở đây)
        alert('Đã lưu! (Đây là mô phỏng, dữ liệu chưa được gửi đi)');
        closeForm();
    });

    // --- CẬP NHẬT: LOGIC PREVIEW ẢNH KHI UPLOAD ---
    formImageUpload.on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                formImagePreview.attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

});