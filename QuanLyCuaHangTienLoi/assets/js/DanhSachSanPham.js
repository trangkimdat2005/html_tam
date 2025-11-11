
$(document).ready(function () {

    // --- 1. KHỞI TẠO CÁC THÀNH PHẦN ---
    $('#form-select-nhan-hieu').select2({ width: '100%', dropdownParent: $('#product-form-col') });
    $('#form-select-don-vi').select2({ width: '100%', dropdownParent: $('#product-form-col') });
    $('#form-select-danh-muc').select2({
        width: '100%',
        placeholder: 'Chọn một hoặc nhiều danh mục',
        dropdownParent: $('#product-form-col')
    });

    // --- 2. TRUY XUẤT PHẦN TỬ DOM ---
    const mainRow = $('#main-row-container');
    const showFormBtn = $('#show-add-form-btn');
    const productForm = $('#product-form');
    const formTitle = $('#form-title');
    
    const formImagesUpload = $('#form-images-upload');
    const uploadPlaceholder = $('#upload-placeholder');
    const imagesPreviewContainer = $('#images-preview-container');

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

    // --- 3. LOGIC XỬ LÝ NHIỀU ẢNH ---
    let dt = new DataTransfer();

// Hàm vẽ lại vùng preview ảnh
    function renderPreview() {
        imagesPreviewContainer.empty();

        if (dt.files.length === 0) {
            // Chưa có ảnh: Hiện placeholder lớn ban đầu
            uploadPlaceholder.show();
            imagesPreviewContainer.hide();
        } else {
            // Đã có ảnh: Ẩn placeholder lớn, hiện vùng preview
            uploadPlaceholder.hide();
            imagesPreviewContainer.show().css('display', 'flex');

            // 1. Vẽ các ảnh thumbnail
            Array.from(dt.files).forEach(file => {
                const wrapper = $('<div>').addClass('preview-image-wrapper');
                const img = $('<img>').addClass('preview-image-item');
                const reader = new FileReader();
                reader.onload = (e) => img.attr('src', e.target.result);
                reader.readAsDataURL(file);
                
                const removeBtn = $('<span>').addClass('btn-remove-image')
                    .html('<i class="fas fa-times"></i>')
                    .data('file-name', file.name);
                
                removeBtn.on('click', function(e) {
                    e.preventDefault(); e.stopPropagation();
                    removeFile($(this).data('file-name'));
                });

                wrapper.append(img).append(removeBtn);
                imagesPreviewContainer.append(wrapper);
            });

            // 2. Vẽ thêm nút "dấu cộng" vào cuối (nếu không phải chế độ xem readonly)
            if (!productForm.hasClass('form-readonly')) {
                const addBtn = $('<div>').addClass('mini-add-btn')
                    .html('<i class="fas fa-plus"></i><span>Thêm ảnh</span>');
                
                // Khi click vào nút này thì mở hộp thoại chọn file
                addBtn.on('click', function() {
                    formImagesUpload.click();
                });

                imagesPreviewContainer.append(addBtn);
            }
        }
    }

    function removeFile(fileName) {
        const newDt = new DataTransfer();
        Array.from(dt.files).forEach(file => { if (file.name !== fileName) newDt.items.add(file); });
        dt = newDt;
        formImagesUpload[0].files = dt.files;
        renderPreview();
    }

    formImagesUpload.on('change', function () {
        Array.from(this.files).forEach(file => { if (file.type.startsWith('image/')) dt.items.add(file); });
        this.files = dt.files;
        renderPreview();
    });

    // --- 4. HÀM MỞ FORM ---
    function openForm(mode, data = null) {
        mainRow.addClass('form-open');
        // showFormBtn.hide(); // <-- DÒNG NÀY ĐÃ ĐƯỢC COMMENT LẠI ĐỂ GIỮ NÚT HIỂN THỊ

        productForm.removeClass('form-readonly');

        if (mode === 'add') {
            formTitle.text('Thêm Sản Phẩm Mới');
            productForm[0].reset();
            selectNhanHieu.val('').trigger('change');
            selectDanhMuc.val(null).trigger('change');
            selectDonVi.val('DV_CHAI').trigger('change');
            
            dt = new DataTransfer();
            formImagesUpload[0].files = dt.files;
            renderPreview();

            inputId.val('Tự động tạo').prop('readonly', true);
            btnSubmit.html('<i class="bi bi-check-circle-fill me-2"></i>Thêm').show();
            btnCancel.html('<i class="bi bi-x-circle-fill me-2"></i>Huỷ').show();
            btnEditMode.hide();
        }
        else {
            inputId.val(data.id);
            inputName.val(data.name);
            inputPrice.val(data.price);
            inputDescription.val(data.moTa);
            $(`input[name="trangThaiSP"][value="${data.trangThai}"]`).prop('checked', true);
            selectNhanHieu.val(data.nhanHieuId).trigger('change');
            selectDonVi.val(data.donViId).trigger('change');
            let danhMucIds = typeof data.danhMucIds === 'string' ? JSON.parse(data.danhMucIds) : data.danhMucIds;
            selectDanhMuc.val(danhMucIds).trigger('change');

            dt = new DataTransfer();
            formImagesUpload[0].files = dt.files;
            renderPreview();

            if (mode === 'view') {
                formTitle.text('Chi Tiết Sản Phẩm');
                productForm.addClass('form-readonly');
                btnSubmit.hide();
                btnCancel.text('Đóng').show();
                btnEditMode.show();
            } else {
                formTitle.text('Sửa Sản Phẩm');
                inputId.prop('readonly', true);
                btnSubmit.html('<i class="bi bi-check-circle-fill me-2"></i>Lưu').show();
                btnCancel.text('Huỷ').show();
                btnEditMode.hide();
            }
        }
    }

    // --- 5. HÀM ĐÓNG FORM ---
    function closeForm() {
        mainRow.removeClass('form-open');
        // showFormBtn.show(); // <-- DÒNG NÀY CŨNG ĐƯỢC COMMENT LẠI

        setTimeout(() => {
            productForm.removeClass('form-readonly');
            productForm[0].reset();
            selectNhanHieu.val('').trigger('change');
            selectDanhMuc.val(null).trigger('change');
            dt = new DataTransfer();
            formImagesUpload[0].files = dt.files;
            renderPreview();
        }, 400);
    }

    // --- 6. CÁC SỰ KIỆN KHÁC ---
    showFormBtn.on('click', function (e) { e.preventDefault(); openForm('add'); });
    btnCancel.on('click', function (e) { e.preventDefault(); closeForm(); });

    $('#sampleTable tbody').on('click', 'tr', function (e) {
        const clickedRow = $(this);
        const target = $(e.target);
        const data = clickedRow.data();
        data.price = parseFloat(data.price); // Chuyển đổi giá trị số

        if (target.closest('.btn-delete-khoi').length) {
            e.stopPropagation();
            if (confirm(`Bạn có chắc muốn xoá sản phẩm "${data.name}" không?`)) {
                clickedRow.fadeOut(300, function() { $(this).remove(); });
                closeForm();
            }
            return;
        }
        if (target.closest('.btn-edit-khoi').length) {
            e.stopPropagation();
            openForm('edit', data);
            return;
        }
        openForm('view', data);
    });

    btnEditMode.on('click', function (e) {
        e.preventDefault();
        formTitle.text('Sửa Sản Phẩm');
        productForm.removeClass('form-readonly');
        inputId.prop('readonly', true);
        btnSubmit.html('<i class="bi bi-check-circle-fill me-2"></i>Lưu').show();
        btnCancel.text('Huỷ').show();
        btnEditMode.hide();
    });

    btnSubmit.on('click', function (e) {
        e.preventDefault();
        if (!$('#form-product-name').val().trim()) { alert('Nhập tên SP!'); return; }
        alert('Đã lưu! (Xem console để thấy file ảnh)');
        console.log(dt.files);
        closeForm();
    });
});