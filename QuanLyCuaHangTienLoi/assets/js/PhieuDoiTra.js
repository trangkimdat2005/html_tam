 $(document).ready(function() {
        // 1. MOCK DATA (Đã sửa lỗi cú pháp JSON)
        const MOCK_DB = {
            'PDT001': {
                id: 'PDT001', 
                hoaDonId: 'HD003',
                ngayDoiTra: '2025-11-01',
                chinhSachId: 'CS_7NGAY (Đổi trả trong 7 ngày)',
                chiTiet: [
                    { sanPhamDonViId: 'SP005 - Sữa tươi TH True Milk (Lốc 4)', lyDo: 'Khách hàng đổi ý', soTienHoan: 12000 }
                ]
            },
            'PDT002': {
                id: 'PDT002',
                hoaDonId: 'HD001',
                ngayDoiTra: '2025-11-03',
                chinhSachId: 'CS_LOI_NSX (Lỗi nhà sản xuất)',
                chiTiet: [
                    { sanPhamDonViId: 'SP012 - Thịt gà công nghiệp (Kg)', lyDo: 'Thịt có mùi lạ', soTienHoan: 85000 },
                    { sanPhamDonViId: 'SP008 - Trứng gà Ba Huân (Hộp 10)', lyDo: 'Vỡ khi vận chuyển', soTienHoan: 32000 }
                ]
            }
        };

        // 2. XỬ LÝ SỰ KIỆN CLICK NÚT "XEM"
        $('.js-view-detail').click(function(e) {
            e.preventDefault();
            let id = $(this).data('id');
            let data = MOCK_DB[id];

            if (data) {
                // Điền dữ liệu Header
                $('#detail-id').text('#' + data.id);
                $('#detail-hoaDonId').html(`<a href="#" class="text-decoration-none">${data.hoaDonId} <i class="bi bi-box-arrow-up-right small"></i></a>`);
                $('#detail-ngayDoiTra').text(new Date(data.ngayDoiTra).toLocaleDateString('vi-VN'));
                $('#detail-chinhSachId').text(data.chinhSachId);

                // Điền dữ liệu Bảng chi tiết & Tính tổng
                let rows = '';
                let tongTien = 0;
                
                data.chiTiet.forEach((item, index) => {
                    tongTien += item.soTienHoan;
                    rows += `
                        <tr>
                            <td class="text-center">${index + 1}</td>
                            <td class="fw-bold">${item.sanPhamDonViId}</td>
                            <td>${item.lyDo}</td>
                            <td class="text-end">${new Intl.NumberFormat('vi-VN').format(item.soTienHoan)} đ</td>
                        </tr>
                    `;
                });
                
                $('#detail-tbody').html(rows);
                $('#detail-tong-tien').text(new Intl.NumberFormat('vi-VN').format(tongTien) + ' đ');

                // Chuyển đổi hiển thị sang màn hình chi tiết (ẩn list, hiện detail)
                $('#section-list').addClass('d-none');
                $('#section-detail').removeClass('d-none');
            }
        });

        // 3. XỬ LÝ SỰ KIỆN CLICK NÚT "QUAY LẠI"
        $('#btn-back-list').click(function() {
             // Chuyển ngược lại (ẩn detail, hiện list)
             $('#section-detail').addClass('d-none');
             $('#section-list').removeClass('d-none');
        });
    });