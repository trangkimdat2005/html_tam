$(document).ready(function() {
        // Set ngày mặc định là hôm nay
        document.getElementById('input-ngay-tra').valueAsDate = new Date();

        // --- 1. MOCK DATABASE (GIẢ LẬP SERVER) ---
        const DB_HOADON = {
            'HD001': {
                khachHang: 'Nguyễn Văn A (VIP Silver)', khachHangId: 'KH001',
                sanPham: [
                    { id: 'SP01', ten: 'Mì Hảo Hảo Tôm Chua Cay', gia: 4500, daMua: 10 },
                    { id: 'SP02', ten: 'Nước ngọt Coca Cola 330ml', gia: 10000, daMua: 5 }
                ]
            },
            'HD002': {
                khachHang: 'Trần Thị B (Khách lẻ)', khachHangId: 'KH002',
                sanPham: [
                    { id: 'SP03', ten: 'Combo Gội Xả Sunsilk Óng Mượt', gia: 108500, daMua: 1 }
                ]
            }
        };

        // --- 2. XỬ LÝ TÌM HÓA ĐƠN ---
        $('#btn-check-hd').click(function() {
            let maHD = $('#input-ma-hoa-don').val().trim().toUpperCase();
            if (!maHD) { alert('Vui lòng nhập mã hóa đơn!'); return; }

            // Giả lập gọi API: lấy dữ liệu từ Mock DB
            let data = DB_HOADON[maHD];

            if (data) {
                // Tìm thấy: Điền thông tin khách
                $('#input-khach-hang').val(data.khachHang);
                $('#input-khach-hang-id').val(data.khachHangId);

                // Tạo dropdown sản phẩm
                let options = '<option value="">-- Chọn sản phẩm cần trả --</option>';
                data.sanPham.forEach(sp => {
                    options += `<option value="${sp.id}" data-gia="${sp.gia}" data-ten="${sp.ten}" data-max="${sp.daMua}">
                        ${sp.ten} (Giá mua: ${sp.gia.toLocaleString()}đ - SL mua: ${sp.daMua})
                    </option>`;
                });
                $('#select-san-pham-tra').html(options).prop('disabled', false);

                // Mở khóa các ô nhập liệu khác
                $('#input-sl-tra, #input-ly-do, #btn-add-return-item').prop('disabled', false);
            } else {
                // Không tìm thấy
                alert('Không tìm thấy hóa đơn ' + maHD);
                $('#input-khach-hang').val('');
                $('#select-san-pham-tra').html('<option value="">-- Vui lòng nhập Mã HĐ trước --</option>').prop('disabled', true);
                $('#input-sl-tra, #input-ly-do, #btn-add-return-item').prop('disabled', true);
            }
        });

        // --- 3. XỬ LÝ THÊM DÒNG VÀO BẢNG ---
        $('#btn-add-return-item').click(function() {
            let $selected = $('#select-san-pham-tra option:selected');
            if (!$selected.val()) { alert('Vui lòng chọn sản phẩm!'); return; }

            let maSP = $selected.val();
            // Kiểm tra xem sản phẩm này đã có trong bảng chưa để tránh trùng lặp
            if ($(`#tr-${maSP}`).length > 0) {
                alert('Sản phẩm này đã được thêm vào danh sách trả rồi!'); return;
            }

            let tenSP = $selected.data('ten');
            let giaMua = parseInt($selected.data('gia'));
            let slMax = parseInt($selected.data('max'));
            let slTra = parseInt($('#input-sl-tra').val());
            let lyDo = $('#input-ly-do').val() || 'Khách đổi ý';

            // Validate số lượng trả
            if (slTra <= 0) { alert('Số lượng trả phải lớn hơn 0'); return; }
            if (slTra > slMax) { alert(`Chỉ được trả tối đa ${slMax} sản phẩm này!`); return; }

            let thanhTien = giaMua * slTra;

            // Xóa dòng "chưa có sản phẩm" nếu đây là dòng đầu tiên
            if ($('#tbody-tra-hang tr td').length <= 1) $('#tbody-tra-hang').empty();

            // Thêm dòng mới vào bảng
            let newRow = `
                <tr id="tr-${maSP}" data-tien="${thanhTien}">
                    <td>${maSP}</td>
                    <td>${tenSP}</td>
                    <td>${giaMua.toLocaleString('vi-VN')}</td>
                    <td class="text-center">${slTra}</td>
                    <td>${lyDo}</td>
                    <td class="text-end fw-bold">${thanhTien.toLocaleString('vi-VN')}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger btn-del-row"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
            $('#tbody-tra-hang').append(newRow);

            // Cập nhật lại tổng tiền
            updateTotalMoney();

            // Reset form nhập liệu nhỏ
            $('#input-sl-tra').val(1);
            $('#input-ly-do').val('');
            $('#select-san-pham-tra').val('').focus();
        });

        // --- 4. XỬ LÝ XÓA DÒNG ---
        $(document).on('click', '.btn-del-row', function() {
            $(this).closest('tr').remove();
            // Nếu xóa hết thì hiện lại dòng thông báo trống
            if ($('#tbody-tra-hang tr').length === 0) {
                $('#tbody-tra-hang').html('<tr><td colspan="7" class="text-center text-muted fst-italic">Chưa có sản phẩm nào được chọn</td></tr>');
            }
            updateTotalMoney();
        });

        // Hàm tính tổng tiền
        function updateTotalMoney() {
            let total = 0;
            $('#tbody-tra-hang tr[data-tien]').each(function() {
                total += parseInt($(this).data('tien'));
            });
            $('#lbl-tong-tien-hoan').text(total.toLocaleString('vi-VN') + ' đ');
            $('#hidden-tong-tien-hoan').val(total);
        }
    });