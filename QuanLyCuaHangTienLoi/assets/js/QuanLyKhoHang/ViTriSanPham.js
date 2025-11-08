    $(document).ready(function () {
      // Biến lưu trữ dòng đang được sửa
      let currentRow = null;

      // Xử lý khi bấm nút SỬA
      $('.btn-edit-khoi').click(function (e) {
        e.preventDefault();

        // Xác định dòng (tr) chứa nút vừa bấm
        currentRow = $(this).closest('tr');

        // Lấy dữ liệu từ các cột trong dòng đó
        let tenSP = currentRow.find('td:eq(0)').text();
        let dvt = currentRow.find('td:eq(1)').text();
        let maViTri = currentRow.find('td:eq(2)').text();
        let loaiViTri = currentRow.find('td:eq(3)').text();
        let soLuong = currentRow.find('td:eq(4)').text();

        // Điền dữ liệu vào Modal
        $('#modal-ten-sp').text(tenSP);
        $('#modal-dvt').val(dvt);
        $('#modal-ma-vi-tri').val(maViTri); // Cần đảm bảo value trong <select> khớp với text hiển thị
        // Nếu text trong bảng là "Kho" mà value trong select cũng là "Kho" thì .val() sẽ tự chọn đúng.
        // Nếu không khớp (VD: Bảng hiện "Kho", select value là "KHO_LUU_TRU"), bạn cần xử lý thêm.
        $('#modal-loai-vi-tri').val(loaiViTri);
        $('#modal-so-luong').val(soLuong);

        // Hiển thị Modal
        $('#modalSuaViTri').modal('show');
      });

      // Xử lý khi bấm nút LƯU trong Modal (Demo cập nhật lại bảng)
      $('#btn-luu-sua').click(function () {
        if (currentRow) {
          // Lấy giá trị mới từ form modal
          let maViTriMoi = $('#modal-ma-vi-tri').val();
          let loaiViTriMoi = $('#modal-loai-vi-tri').val();
          let soLuongMoi = $('#modal-so-luong').val();

          // Cập nhật lại dòng trong bảng
          currentRow.find('td:eq(2)').text(maViTriMoi);
          currentRow.find('td:eq(3)').text(loaiViTriMoi);
          currentRow.find('td:eq(4)').text(soLuongMoi);

          // Ẩn modal và thông báo thành công (tùy chọn)
          $('#modalSuaViTri').modal('hide');
          alert("Cập nhật thành công!"); // Có thể dùng thư viện thông báo đẹp hơn như SweetAlert2
        }
      });

      // Xử lý nút XÓA (Demo đơn giản)
      $('.btn-delete-khoi').click(function (e) {
        e.preventDefault();
        if (confirm("Bạn chắc chắn muốn xóa vị trí này của sản phẩm?")) {
          $(this).closest('tr').remove();
        }
      });
    });