$(document).ready(function () {

    // --- KHỞI TẠO SELECT2 ---
    $('#form-select-nhan-hieu').select2({ width: '100%' });
    $('#form-select-don-vi').select2({ width: '100%' });
    $('#form-select-danh-muc').select2({
        width: '100%',
        placeholder: 'Chọn một hoặc nhiều danh mục'
    });

    // --- TRUY XUẤT PHẦN TỬ DOM (jQuery) ---
    const mainRow = $('#main-row-container');
    const listCol = $('#product-list-col');
    const formCol = $('#product-form-col');
    const showFormBtn = $('#show-add-form-btn');

    const productForm = $('#product-form');
    const formTitle = $('#form-title');
    const formAvatarPreview = $('#form-avatar-preview');
    const formAvatarUpload = $('#form-avatar-upload');

    // Các trường input
    const inputId = $('#form-product-id');
    const inputName = $('#form-product-name');
    const selectNhanHieu = $('#form-select-nhan-hieu');
    const selectDanhMuc = $('#form-select-danh-muc');
    const selectDonVi = $('#form-select-don-vi');
    const inputPrice = $('#form-product-price');
    const inputDescription = $('#form-product-description');

    // Nút bấm
    const btnSubmit = $('#btn-submit');
    const btnCancel = $('#btn-cancel');
    const btnEditMode = $('#btn-edit-mode');

    // --- HÀM MỞ FORM ---
    function openForm(mode, data = null) {
        // 1. Co Bảng, Mở Form
        listCol.removeClass('col-md-12').addClass('col-md-8');
        formCol.removeClass('col-md-0').addClass('col-md-4');
        mainRow.addClass('form-open');
        showFormBtn.hide();

        // 2. Xử lý form dựa theo 'mode'
        productForm.removeClass('form-readonly'); // Mở khoá form trước

        if (mode === 'add') {
            formTitle.text('Thêm Sản Phẩm Mới');
            productForm[0].reset(); // Xoá trắng form
            // Reset Select2
            selectNhanHieu.val('').trigger('change');
            selectDanhMuc.val(null).trigger('change');
            selectDonVi.val('DV_CHAI').trigger('change');
            formAvatarPreview.attr('src', 'https://via.placeholder.com/200?text=Ảnh SP');

            inputId.val('Mã sẽ được tạo tự động').prop('readonly', true);

            btnSubmit.text('Thêm').show();
            btnCancel.text('Huỷ').show();
            btnEditMode.hide();
        }
        else if (mode === 'edit' || mode === 'view') {
            // Điền dữ liệu
            inputId.val(data.id);
            inputName.val(data.name);
            inputPrice.val(data.price);
            inputDescription.val(data.moTa);

            // Điền trạng thái (radio)
            $(`input[name="trangThaiSP"][value="${data.trangThai}"]`).prop('checked', true);

            // Điền Select2
            selectNhanHieu.val(data.nhanHieuId).trigger('change');
            selectDonVi.val(data.donViId).trigger('change');
            // JSON.parse cho mảng danh mục
            let danhMucIds = Array.isArray(data.danhMucIds) ? data.danhMucIds : JSON.parse(data.danhMucIds || "[]");
            selectDanhMuc.val(danhMucIds).trigger('change');

            if (mode === 'view') {
                formTitle.text('Chi Tiết Sản Phẩm');
                productForm.addClass('form-readonly'); // Khoá form
                inputId.prop('readonly', true); // Mã luôn readonly 

                btnSubmit.hide();
                btnCancel.text('Đóng').show();
                btnEditMode.text('Chỉnh sửa').show();
            }
            else { // mode === 'edit'
                formTitle.text('Sửa Sản Phẩm');
                productForm.removeClass('form-readonly'); // Mở khoá
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
        showFormBtn.show();

        // 2. Reset form về trạng thái mặc định (mở khoá)
        productForm.removeClass('form-readonly');
        productForm[0].reset();
        selectNhanHieu.val('').trigger('change');
        selectDanhMuc.val(null).trigger('change');
        selectDonVi.val('DV_CHAI').trigger('change');
    }

    // --- GÁN SỰ KIỆN CHO NÚT "THÊM" ---
    showFormBtn.on('click', function (e) {
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
        const data = clickedRow.data();

        // Chuyển đổi giá trị cho đúng
        // (data() tự động chuyển mảng JSON)
        data.price = parseFloat(data.price);

        // 1. Xử lý nút XOÁ
        if (target.closest('.btn-delete-khoi').length) {
            e.preventDefault();
            if (confirm(`Bạn có chắc muốn xoá sản phẩm "${data.name}" không?`)) {
                clickedRow.remove();
                closeForm(); // Đóng form nếu nó đang mở
            }
            return; // Dừng xử lý
        }

        // 2. Xử lý nút SỬA
        if (target.closest('.btn-edit-khoi').length) {
            e.preventDefault();
            openForm('edit', data);
            return; // Dừng xử lý
        }

        // 3. Xử lý click XEM (nếu click vào hàng, không phải nút)
        openForm('view', data);
    });

    // --- GÁN SỰ KIỆN CHO NÚT "CHỈNH SỬA" (TRONG FORM VIEW) ---
    btnEditMode.on('click', function () {
        formTitle.text('Sửa Sản Phẩm');
        productForm.removeClass('form-readonly'); // Mở khoá form
        inputId.prop('readonly', true); // Giữ mã SP readonly 

        btnSubmit.text('Lưu').show();
        btnCancel.text('Huỷ').show();
        btnEditMode.hide();
    });

    // --- LOGIC SUBMIT (Mô phỏng) ---
    btnSubmit.on('click', function () {
        // (Thêm logic kiểm tra (validation) ở đây)
        alert('Đã lưu! (Đây là mô phỏng, dữ liệu chưa được gửi đi)');
        closeForm();
    });

    // --- LOGIC PREVIEW ẢNH ---
    formAvatarUpload.on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                formAvatarPreview.attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

});