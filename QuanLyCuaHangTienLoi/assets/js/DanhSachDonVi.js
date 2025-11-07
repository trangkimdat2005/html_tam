document.addEventListener('DOMContentLoaded', function () {

    // --- TRUY XUẤT PHẦN TỬ DOM ---
    const mainRow = document.getElementById('main-row-container');
    const listCol = document.getElementById('list-col');
    const formCol = document.getElementById('form-col');

    const showAddFormBtn = document.getElementById('show-add-form-btn');
    const tableBody = document.getElementById('sampleTable').getElementsByTagName('tbody')[0];

    // Form Wrappers
    const addFormWrapper = document.getElementById('add-form-wrapper');
    const editFormWrapper = document.getElementById('edit-form-wrapper');

    // Nút Huỷ
    const cancelAddBtn = document.getElementById('cancel-add-form-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-form-btn');

    // Form Sửa Inputs
    const editIdInput = document.getElementById('edit-id-input');
    const editTenInput = document.getElementById('edit-ten-input');
    const editKyHieuInput = document.getElementById('edit-kyhieu-input');

    // Form Thêm Inputs
    const addTenInput = document.getElementById('add-ten-input');
    const addKyHieuInput = document.getElementById('add-kyhieu-input');

    // --- HÀM MỞ FORM (CHUNG) ---
    function openForm(mode) {
        // 1. Co Bảng
        listCol.classList.remove('col-md-12');
        listCol.classList.add('col-md-8');

        // 2. Hiện Form
        formCol.classList.remove('col-md-0');
        formCol.classList.add('col-md-4');

        // 3. Thêm class điều khiển
        mainRow.classList.add('form-open');

        // 4. Ẩn nút "Thêm"
        showAddFormBtn.style.display = 'none';

        // 5. Chọn form nào để hiển thị
        if (mode === 'add') {
            addFormWrapper.style.display = 'block';
            editFormWrapper.style.display = 'none';
            // Xoá trắng các trường
            addTenInput.value = '';
            addKyHieuInput.value = '';
        } else if (mode === 'edit') {
            addFormWrapper.style.display = 'none';
            editFormWrapper.style.display = 'block';
        }
    }

    // --- HÀM ĐÓNG FORM (CHUNG) ---
    function closeForm() {
        // 1. Phình Bảng
        listCol.classList.remove('col-md-8');
        listCol.classList.add('col-md-12');

        // 2. Ẩn Form
        formCol.classList.remove('col-md-4');
        formCol.classList.add('col-md-0');

        // 3. Xoá class điểu khiển
        mainRow.classList.remove('form-open');

        // 4. Hiện lại nút "Thêm"
        showAddFormBtn.style.display = 'block';
    }

    // --- GÁN SỰ KIỆN CHO NÚT "THÊM" ---
    showAddFormBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openForm('add');
    });

    // --- GÁN SỰ KIỆN CHO CÁC NÚT "HUỶ" ---
    cancelAddBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeForm();
    });

    cancelEditBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeForm();
    });

    // --- GÁN SỰ KIỆN CHO BẢNG (SỬA & XOÁ) ---
    tableBody.addEventListener('click', function (e) {
        // Chỉ bắt sự kiện nếu nhấn vào <a> bên trong <td>
        const btn = e.target.closest('a');
        if (!btn) return;

        e.preventDefault();
        const row = btn.closest('tr');

        // Yêu cầu 1: XỬ LÝ NÚT SỬA (btn-edit-khoi)
        if (btn.classList.contains('btn-edit-khoi')) {
            // 1. Lấy dữ liệu từ bảng
            const maDonVi = row.cells[0].textContent.trim();
            const tenDonVi = row.cells[1].textContent.trim();
            const kyHieu = row.cells[2].textContent.trim();

            // 2. Điền vào form "Sửa"
            editIdInput.value = maDonVi;
            editTenInput.value = tenDonVi;
            editKyHieuInput.value = kyHieu;

            // 3. Mở form ở chế độ "edit"
            openForm('edit');
        }

        // Yêu cầu 2: XỬ LÝ NÚT XOÁ (btn-delete-khoi)
        if (btn.classList.contains('btn-delete-khoi')) {
            const tenDonVi = row.cells[1].textContent.trim();

            // 3. Hỏi xác nhận
            if (confirm(`Bạn có chắc muốn xoá đơn vị "${tenDonVi}" không?`)) {
                // 4. Thực hiện xoá (ở đây là xoá hàng trong table)
                row.remove();

                // Đóng form nếu nó đang mở
                closeForm();
            }
        }
    });

});