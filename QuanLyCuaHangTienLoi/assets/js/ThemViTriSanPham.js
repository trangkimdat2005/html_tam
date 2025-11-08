 $(document).ready(function() {
        // 1. Khởi tạo Select2 cho tất cả các ô chọn
        $('.select2').select2({ width: '100%', theme: 'default' });
        $('#input-ngay-thuc-hien').val(new Date().toISOString().split('T')[0]);

        // Tự động điền giá tiền
        $('#select-san-pham').on('select2:select', function(e) {
            let price = $(this).find(':selected').data('price');
            if (price) {
                 $('#input-gia-tien').val(new Intl.NumberFormat('vi-VN').format(price) + ' ₫');
            } else {
                 $('#input-gia-tien').val('');
            }
        });

        // 2. Nút THÊM DÒNG
        let stt = 1;
        $('#btn-them-dong').click(function() {
            let spOpt = $('#select-san-pham').find(':selected');
            let spId = spOpt.val();
            let maViTri = $('#select-ma-vi-tri').val(); // LẤY TỪ SELECT MỚI
            let loaiViTri = $('#select-loai-vi-tri').val();
            let soLuong = $('#input-so-luong').val();
            let giaTien = $('#input-gia-tien').val();

            // Validate
            if (!spId) { alert("Vui lòng chọn sản phẩm!"); return; }
            if (!maViTri || maViTri === '') { alert("Vui lòng chọn Mã vị trí!"); $('#select-ma-vi-tri').select2('open'); return; }
            if (parseInt(soLuong) <= 0 || isNaN(parseInt(soLuong))) { alert("Số lượng không hợp lệ!"); $('#input-so-luong').focus(); return; }

            // Xóa dòng trống
            $('#row-empty').remove();

            // Badge màu sắc
            let badgeClass = loaiViTri === 'Kho' ? 'badge-kho' : 'badge-trungbay';
            let tenLoai = loaiViTri === 'Kho' ? 'Kho lưu trữ' : 'Kệ trưng bày';

            // Tạo dòng mới
            let newRow = `
                <tr>
                    <td class="c-stt">${stt++}</td>
                    <td class="c-ten">
                        <span class="fw-medium">${spOpt.data('name')}</span>
                        <br><small class="text-muted">${spId}</small>
                    </td>
                    <td class="c-dvt">${spOpt.data('dvt')}</td>
                    <td class="c-ma fw-bold text-primary">${maViTri}</td>
                    <td class="c-loai"><span class="${badgeClass}">${tenLoai}</span></td>
                    <td class="c-sl">${soLuong}</td>
                    <td class="c-gia">${giaTien}</td>
                    <td class="c-act">
                        <button class="btn btn-sm btn-outline-danger border-0 btn-xoa" type="button"><i class="bi bi-trash3-fill"></i></button>
                    </td>
                </tr>
            `;
            $('#tbody-gan-vi-tri').append(newRow);

            // Reset form
            $('#select-san-pham').val('').trigger('change');
            $('#select-ma-vi-tri').val('').trigger('change'); // Reset ô chọn vị trí
            $('#input-so-luong').val(1);
            $('#input-gia-tien').val('');
        });

        // 3. Nút XÓA DÒNG
        $(document).on('click', '.btn-xoa', function() {
            if(confirm('Bạn muốn xóa dòng này?')) {
                $(this).closest('tr').remove();
                if($('#tbody-gan-vi-tri tr').length === 0) {
                     $('#tbody-gan-vi-tri').html('<tr id="row-empty"><td colspan="8" class="text-center text-muted fst-italic py-4"></td></tr>');
                     stt = 1;
                }
            }
        });

        // 4. Nút LƯU PHIẾU
        $('#btn-luu-phieu').click(function() {
             if($('#tbody-gan-vi-tri tr').not('#row-empty').length === 0) {
                 alert("Vui lòng thêm ít nhất một dòng thông tin trước khi lưu!");
                 return;
             }
             alert('Đã lưu phiếu thành công! (Mô phỏng)');
        });
    });