$(document).ready(function () {

    // --- TRUY XUẤT PHẦN TỬ DOM (jQuery) ---
    const mainRow = $('#main-row-container');
    const listCol = $('#list-col');
    const formCol = $('#form-col');

    const tableBody = $('#sampleTable tbody');

    const formTitle = $('#form-title');
    const btnCancel = $('#btn-cancel');

    // Các trường input
    const inputKyBaoCao = $('#form-ky-bao-cao');
    const inputTenSP = $('#form-ten-sp');
    const inputTonDauKy = $('#form-ton-dau-ky');
    const inputNhapTrongKy = $('#form-nhap-trong-ky');
    const inputXuatTrongKy = $('#form-xuat-trong-ky');
    const inputTonCuoiKy = $('#form-ton-cuoi-ky');

    // --- HÀM MỞ FORM ---
    function openForm(data) {
        // 1. Co Bảng, Mở Form
        listCol.removeClass('col-md-12').addClass('col-md-8');
        formCol.removeClass('col-md-0').addClass('col-md-4');
        mainRow.addClass('form-open');

        // 2. Điền dữ liệu (Sử dụng dữ liệu mẫu cho Báo Cáo Tồn Kho )
        formTitle.text('Chi Tiết Tồn Kho: ' + data.tenSp);
        inputTenSP.val(data.tenSp);

        // (Dữ liệu báo cáo mẫu - bạn sẽ thay bằng dữ liệu thật từ AJAX)
        inputKyBaoCao.val('01/10/2025 - 31/10/2025'); // 
        inputTonDauKy.val(50); // 
        inputNhapTrongKy.val(300); // 
        inputXuatTrongKy.val(100); // 
        inputTonCuoiKy.val(250); // (Giả định ST001)
    }

    // --- HÀM ĐÓNG FORM ---
    function closeForm() {
        // 1. Phình Bảng, Đóng Form
        listCol.removeClass('col-md-8').addClass('col-md-12');
        formCol.removeClass('col-md-4').addClass('col-md-0');
        mainRow.removeClass('form-open');
    }

    // --- GÁN SỰ KIỆN CHO NÚT "ĐÓNG" ---
    btnCancel.on('click', function (e) {
        e.preventDefault();
        closeForm();
    });

    // --- GÁN SỰ KIỆN CHO NÚT XEM TRÊN BẢNG ---
    tableBody.on('click', 'a.btn-view-report', function (e) {
        e.preventDefault();
        const clickedRow = $(this).closest('tr');

        // Lấy dữ liệu từ data attributes
        const data = {
            id: clickedRow.data('id'),
            tenSp: clickedRow.data('ten-sp')
        };

        // Mở form và truyền dữ liệu
        openForm(data);
    });

});