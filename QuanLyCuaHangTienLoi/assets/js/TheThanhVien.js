$(document).ready(function () {

    // --- KHỞI TẠO SELECT2 ---
    if ($.fn.select2) {
        $('#form-select-customer').select2({ width: '100%' });
    }

    // --- TRUY XUẤT PHẦN TỬ DOM (jQuery) ---
    const mainRow = $('#main-row-container');
    const listCol = $('#list-col');
    const formCol = $('#form-col');
    const showAddFormBtn = $('#show-add-form-btn');

    const cardForm = $('#card-form');
    const formTitle = $('#form-title');

    // Các trường input
    const inputId = $('#form-id');
    const selectHang = $('#form-select-hang');
    const inputDiem = $('#form-diem');
    const inputNgayCap = $('#form-ngay-cap');

    // Trường "Chọn Khách Hàng" (chế độ Thêm)
    const fieldChonKhachHang = $('#field-chon-khach-hang');
    const selectCustomer = $('#form-select-customer');

    // Trường "Xem Khách Hàng" (chế độ Sửa/Xem)
    const fieldXemKhachHang = $('#field-xem-khach-hang');
    const inputTenKH = $('#form-ten-kh');
    const inputSdtKH = $('#form-sdt-kh');

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
        cardForm.removeClass('form-readonly'); // Mở khoá form trước

        if (mode === 'add') {
            formTitle.text('Cấp Thẻ Mới');
            cardForm[0].reset(); // Xoá trắng form
            selectCustomer.val('').trigger('change');
            selectHang.val('Silver'); // Mặc định 
            inputNgayCap.val(new Date().toISOString().split('T')[0]); // Set ngày hôm nay 

            inputId.val('Mã sẽ được tạo tự động').prop('readonly', true);

            // Hiển thị/Ẩn trường
            fieldChonKhachHang.show();
            fieldXemKhachHang.hide();

            // Mở khoá tất cả trường
            selectHang.prop('disabled', false);
            inputDiem.prop('readonly', false);
            inputNgayCap.prop('readonly', false);

            btnSubmit.text('Thêm').show();
            btnCancel.text('Huỷ').show();
            btnEditMode.hide();
        }
        else if (mode === 'edit' || mode === 'view') {
            // Điền dữ liệu
            inputId.val(data.id);
            inputTenKH.val(data.tenKhachHang);
            inputSdtKH.val(data.sdt);
            selectHang.val(data.hang);
            inputDiem.val(data.diem);
            inputNgayCap.val(data.ngayCap);

            // Hiển thị/Ẩn trường
            fieldChonKhachHang.hide();
            fieldXemKhachHang.show();

            if (mode === 'view') {
                formTitle.text('Chi Tiết Thẻ Thành Viên');
                cardForm.addClass('form-readonly'); // Khoá form

                // Theo yêu cầu: khoá tất cả trừ nút "Chỉnh sửa"
                selectHang.prop('disabled', true);
                inputDiem.prop('readonly', true);
                inputNgayCap.prop('readonly', true);

                btnSubmit.hide();
                btnCancel.text('Đóng').show();
                btnEditMode.text('Chỉnh sửa').show();
            }
            else { // mode === 'edit'
                formTitle.text('Sửa Thẻ Thành Viên');
                cardForm.removeClass('form-readonly'); // Mở khoá

                // Theo yêu cầu: Chỉ cho sửa Hạng và Điểm 
                inputId.prop('readonly', true);
                inputNgayCap.prop('readonly', true);
                selectHang.prop('disabled', false);
                inputDiem.prop('readonly', false);

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
        cardForm.removeClass('form-readonly');
        cardForm[0].reset();
        selectCustomer.val('').trigger('change');
        selectHang.val('Silver');
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
        const data = clickedRow.data();

        // 1. Xử lý nút XOÁ
        if (target.closest('.btn-delete-khoi').length) {
            e.preventDefault();
            if (confirm(`Bạn có chắc muốn xoá thẻ "${data.id}" của khách hàng "${data.tenKhachHang}" không?`)) {
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

});