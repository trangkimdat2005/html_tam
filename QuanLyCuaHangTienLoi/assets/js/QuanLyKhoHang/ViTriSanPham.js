$(document).ready(function () {
    // ================== PHẦN 1: XỬ LÝ CHO BẢNG SẢN PHẨM TẠI VỊ TRÍ ==================
    let currentRowSPVT = null;

    $(document).on('click', '.btn-edit-sp-vt', function () {
        currentRowSPVT = $(this).closest('tr');
        let tenSP = currentRowSPVT.find('td:eq(0)').text();
        let maViTri = currentRowSPVT.find('td:eq(2)').text();
        let soLuong = currentRowSPVT.find('td:eq(4)').text();

        // Điền dữ liệu vào Modal 1
        $('#sp-vt-ten').text(tenSP);
        $('#sp-vt-ma-cu').val(maViTri);
        $('#sp-vt-ma-moi').val(maViTri); // Mặc định chọn vị trí hiện tại
        $('#sp-vt-so-luong').val(soLuong);

        $('#modalSuaSanPhamViTri').modal('show');
    });

    $('#btn-luu-sp-vt').click(function () {
        if (currentRowSPVT) {
            let viTriMoi = $('#sp-vt-ma-moi').val();
            let soLuongMoi = $('#sp-vt-so-luong').val();
            // Lấy text của loại vị trí tương ứng với mã mới chọn (cần xử lý thêm nếu muốn chuẩn xác)
            let loaiViTriMoiText = $("#sp-vt-ma-moi option:selected").text().includes("Kho") ? "Kho" : "Trưng bày";

            currentRowSPVT.find('td:eq(2)').text(viTriMoi);
            currentRowSPVT.find('td:eq(3)').text(loaiViTriMoiText); // Cập nhật tạm loại vị trí
            currentRowSPVT.find('td:eq(4)').text(soLuongMoi);

            $('#modalSuaSanPhamViTri').modal('hide');
            alert("Đã cập nhật sản phẩm tại vị trí thành công!");
        }
    });

    // ================== PHẦN 2: XỬ LÝ CHO BẢNG DANH MỤC VỊ TRÍ ==================
    let currentRowDMVT = null;

    $(document).on('click', '.btn-edit-dm-vt', function () {
        currentRowDMVT = $(this).closest('tr');
        let maViTri = currentRowDMVT.find('td:eq(0)').text();
        let loaiViTri = currentRowDMVT.find('td:eq(1)').text();
        let moTa = currentRowDMVT.find('td:eq(2)').text();

        // Điền dữ liệu vào Modal 2
        $('#dm-vt-ma').val(maViTri);
        // Chọn đúng loại vị trí trong select
        $('#dm-vt-loai option').filter(function() {
            return $(this).text() === loaiViTri;
        }).prop('selected', true);
        $('#dm-vt-mo-ta').val(moTa);

        $('#modalSuaDanhMucViTri').modal('show');
    });

    $('#btn-luu-dm-vt').click(function () {
        if (currentRowDMVT) {
            let maMoi = $('#dm-vt-ma').val();
            let loaiMoi = $('#dm-vt-loai option:selected').text();
            let moTaMoi = $('#dm-vt-mo-ta').val();

            currentRowDMVT.find('td:eq(0)').text(maMoi);
            currentRowDMVT.find('td:eq(1)').text(loaiMoi);
            currentRowDMVT.find('td:eq(2)').text(moTaMoi);

            $('#modalSuaDanhMucViTri').modal('hide');
            alert("Đã cập nhật thông tin danh mục vị trí!");
        }
    });

    // Xử lý nút xóa chung (nếu muốn) hoặc viết riêng tương tự nút sửa
    $(document).on('click', '.btn-delete-sp-vt, .btn-delete-dm-vt', function () {
        if (confirm("Bạn chắc chắn muốn xóa dòng này?")) {
            $(this).closest('tr').remove();
        }
    });
});