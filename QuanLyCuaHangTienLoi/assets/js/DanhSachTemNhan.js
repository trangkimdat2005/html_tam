$(document).ready(function () {

    // --- KHỞI TẠO SELECT2 ---
    // (Bạn cần tải thư viện Select2)
    if ($.fn.select2) {
        $('#form-select-identifier').select2({ width: '100%' });
    }

    // --- TRUY XUẤT PHẦN TỬ DOM (jQuery) ---
    const mainRow = $('#main-row-container');
    const listCol = $('#list-col');
    const formCol = $('#form-col');
    const showAddFormBtn = $('#show-add-form-btn');

    const labelForm = $('#label-form');
    const formTitle = $('#form-title');
    const formImagePreview = $('#form-image-preview');

    // Các trường input
    const inputId = $('#form-label-id');
    const selectIdentifier = $('#form-select-identifier');
    const inputContent = $('#form-label-content');
    const inputDate = $('#form-label-date');

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
        labelForm.removeClass('form-readonly'); // Mở khoá form trước

        if (mode === 'add') {
            formTitle.text('Tạo Mẫu Tem Mới');
            labelForm[0].reset(); // Xoá trắng form
            selectIdentifier.val('').trigger('change');
            formImagePreview.attr('src', 'https://via.placeholder.com/300x100?text=Code+Image');
            inputDate.val(new Date().toISOString().split('T')[0]); // Set ngày hôm nay

            inputId.val('Mã sẽ được tạo tự động').prop('readonly', true);

            btnSubmit.text('Thêm').show();
            btnCancel.text('Huỷ').show();
            btnEditMode.hide();
        }
        else if (mode === 'edit' || mode === 'view') {
            // Điền dữ liệu
            inputId.val(data.id);
            inputContent.val(data.noiDung);
            inputDate.val(data.ngayIn);
            formImagePreview.attr('src', data.imageUrl);

            // Điền Select2
            selectIdentifier.val(data.maDinhDanhId).trigger('change');

            if (mode === 'view') {
                formTitle.text('Chi Tiết Tem Nhãn');
                labelForm.addClass('form-readonly'); // Khoá form

                btnSubmit.hide();
                btnCancel.text('Đóng').show();
                btnEditMode.text('Chỉnh sửa').show();
            }
            else { // mode === 'edit'
                formTitle.text('Sửa Mẫu Tem');
                labelForm.removeClass('form-readonly'); // Mở khoá
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
        labelForm.removeClass('form-readonly');
        labelForm[0].reset();
        selectIdentifier.val('').trigger('change');
        formImagePreview.attr('src', 'https://via.placeholder.com/300x100?text=Code+Image');
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
            maDinhDanhId: clickedRow.data('ma-dinh-danh-id'),
            noiDung: clickedRow.data('noi-dung'),
            ngayIn: clickedRow.data('ngay-in'),
            imageUrl: clickedRow.data('image-url'),
            maCode: clickedRow.data('ma-code')
        };

        // 1. Xử lý nút XOÁ
        if (target.closest('.btn-delete-khoi').length) {
            e.preventDefault();
            if (confirm(`Bạn có chắc muốn xoá tem nhãn cho mã "${data.maCode}" không?`)) {
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

        // 3. Xử lý nút IN (không làm gì)
        if (target.closest('.btn-secondary').length) {
            e.preventDefault();
            alert('Đang gọi máy in... (mô phỏng)');
            return; // Dừng xử lý
        }

        // 4. Xử lý click XEM (nếu click vào hàng, không phải nút)
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

if (document.location.hostname == 'pratikborsadiya.in') {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-72504830-1', 'auto');
    ga('send', 'pageview');
}