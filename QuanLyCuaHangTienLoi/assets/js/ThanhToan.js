document.addEventListener('DOMContentLoaded', function () {

    // === CÁC BIẾN DOM ===
    const mainRow = document.getElementById('main-content-row');
    const listCol = document.getElementById('list-column');
    const formCol = document.getElementById('form-column');
    const formTitle = document.getElementById('form-title');
    const form = document.getElementById('payment-channel-form');
    const inputId = document.getElementById('form-id');

    // Nút
    const btnShowAddForm = document.getElementById('btn-show-add-form');
    const btnCloseForm = document.getElementById('btn-close-form');
    const btnCancelForm = document.getElementById('btn-cancel-form');
    const btnSaveForm = document.getElementById('btn-save-form');
    const allEditButtons = document.querySelectorAll('.btn-edit');

    let currentEditRow = null; // Biến để lưu hàng đang sửa

    // === HÀM MỞ FORM ===
    const openForm = (mode, data = null) => {
        // 1. Thêm class 'active' vào row chính để CSS responsive hoạt động
        mainRow.classList.add('form-active');

        // 2. Co cột danh sách lại (trên màn hình 'lg' trở lên)
        listCol.classList.remove('col-lg-12');
        listCol.classList.add('col-lg-8');

        // 3. Hiện cột form
        formCol.classList.add('active');

        // 4. Xử lý dữ liệu
        form.reset(); // Xoá trắng form
        inputId.readOnly = false; // Mặc định là cho phép sửa ID

        if (mode === 'add') {
            formTitle.textContent = 'Thêm Kênh Mới';
            btnSaveForm.textContent = 'Lưu';
            currentEditRow = null;
        }
        else if (mode === 'edit' && data) {
            formTitle.textContent = `Sửa Kênh: ${data.id}`;
            btnSaveForm.textContent = 'Lưu thay đổi';
            currentEditRow = data.row; // Lưu lại hàng đang sửa

            // Điền dữ liệu vào form 
            document.getElementById('form-id').value = data.id;
            document.getElementById('form-id').readOnly = true; // Không cho sửa ID (PK)
            document.getElementById('form-tenKenh').value = data.tenKenh;
            document.getElementById('form-loaiKenh').value = data.loaiKenh;
            document.getElementById('form-phiGiaoDich').value = data.phiGiaoDich;
            document.getElementById('form-trangThai').value = data.trangThai;
            // (Bạn có thể thêm data-cauHinh nếu cần)
            // document.getElementById('form-cauHinh').value = data.cauHinh; 
        }
    };

    // === HÀM ĐÓNG FORM ===
    const closeForm = () => {
        // 1. Xoá class 'active' khỏi row chính
        mainRow.classList.remove('form-active');

        // 2. Trả cột danh sách về 100%
        listCol.classList.remove('col-lg-8');
        listCol.classList.add('col-lg-12');

        // 3. Ẩn cột form
        formCol.classList.remove('active');

        form.reset();
        currentEditRow = null;
    };

    // === GÁN SỰ KIỆN ===

    // 1. Nút "Thêm kênh mới"
    btnShowAddForm.addEventListener('click', () => {
        openForm('add');
    });

    // 2. Nút "Huỷ" và "X"
    btnCloseForm.addEventListener('click', closeForm);
    btnCancelForm.addEventListener('click', closeForm);

    // 3. Các nút "Sửa" trong bảng
    allEditButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');

            // Lấy dữ liệu từ các ô <td> trong hàng
            const data = {
                id: row.querySelector('[data-field="id"]').textContent.trim(),
                tenKenh: row.querySelector('[data-field="tenKenh"]').textContent.trim(),
                loaiKenh: row.querySelector('[data-field="loaiKenh"]').textContent.trim(),
                phiGiaoDich: row.querySelector('[data-field="phiGiaoDich"]').textContent.trim(),
                trangThai: row.querySelector('[data-field="trangThai"]').dataset.value, // Lấy từ data-value
                row: row // Lưu lại chính hàng đó
            };

            openForm('edit', data);
        });
    });

    // 4. Nút "Lưu" (Giả lập lưu)
    btnSaveForm.addEventListener('click', () => {
        // Đây là nơi bạn sẽ thu thập dữ liệu và gửi đi
        const formData = {
            id: document.getElementById('form-id').value,
            tenKenh: document.getElementById('form-tenKenh').value,
            loaiKenh: document.getElementById('form-loaiKenh').value,
            phiGiaoDich: document.getElementById('form-phiGiaoDich').value,
            trangThai: document.getElementById('form-trangThai').value,
            //...
        };

        if (!formData.id || !formData.tenKenh) {
            alert('Vui lòng nhập Mã Kênh và Tên Kênh!');
            return;
        }

        if (currentEditRow) {
            // --- Chế độ SỬA ---
            // (Giả lập cập nhật lại hàng trong bảng)
            currentEditRow.querySelector('[data-field="tenKenh"]').textContent = formData.tenKenh;
            currentEditRow.querySelector('[data-field="loaiKenh"]').textContent = formData.loaiKenh;
            currentEditRow.querySelector('[data-field="phiGiaoDich"]').textContent = formData.phiGiaoDich + " %";

            // Cập nhật trạng thái
            const trangThaiCell = currentEditRow.querySelector('[data-field="trangThai"]');
            trangThaiCell.dataset.value = formData.trangThai;
            trangThaiCell.innerHTML =
                formData.trangThai === 'Active'
                    ? '<span class="badge bg-success">Hoạt động</span>'
                    : '<span class="badge bg-secondary">Không hoạt động</span>';

            alert(`Đã cập nhật kênh: ${formData.id}`);
        } else {
            // --- Chế độ THÊM ---
            // (Giả lập thêm hàng mới vào bảng)
            // Bạn sẽ cần logic phức tạp hơn để thêm hàng mới vào <tbody>
            alert(`Đã thêm kênh mới: ${formData.id}`);
        }

        // Đóng form sau khi lưu
        closeForm();
    });

});