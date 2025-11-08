$(document).ready(function() {
        const MOCK_DB = {
            'GDNCC001': {
                general: {
                    id: 'GDNCC001', date: '01/11/2025', total: 10500000,
                    supplier: { name: 'CP Foods Việt Nam', phone: '028 3512 3456', email: 'contact@cp.com.vn', address: 'KCN Biên Hòa 2, Đồng Nai' }
                },
                details: [
                    // Đã sửa dữ liệu khớp với hình ảnh bạn gửi để test
                    { name: 'Xúc xích heo CP gói 500g', unit: 'Gói', qty: 100, price: 45000, total: 4500000 },
                    { name: 'Trứng gà tươi CP vỉ 10', unit: 'Vỉ', qty: 200, price: 30000, total: 6000000 }
                ]
            },
            'GDNCC002': {
                general: {
                    id: 'GDNCC002', date: '30/10/2025', total: 25000000,
                    supplier: { name: 'Công ty Cổ phần Sữa TH', phone: '1800 54 54 40', email: 'cskh@thmilk.vn', address: 'Nghĩa Đàn, Nghệ An' }
                },
                details: [
                    { name: 'Sữa tươi tiệt trùng TH true MILK 1L', unit: 'Hộp', qty: 500, price: 30000, total: 15000000 },
                    { name: 'Sữa chua ăn có đường TH true YOGURT', unit: 'Vỉ (4 hộp)', qty: 400, price: 25000, total: 10000000 }
                ]
            }
        };

        $('.js-view-detail').on('click', function() {
            let transId = $(this).data('id');
            let data = MOCK_DB[transId];

            if (data) {
                $('#detail-transaction-id, #detail-trans-code').text(transId);
                $('#detail-trans-date').text(data.general.date);
                $('#detail-total-amount').text(data.general.total.toLocaleString('vi-VN') + ' ₫');
                $('#detail-ncc-name').text(data.general.supplier.name);
                $('#detail-ncc-phone').text(data.general.supplier.phone);
                $('#detail-ncc-email').text(data.general.supplier.email);
                $('#detail-ncc-address').text(data.general.supplier.address);

                let rowsHtml = '';
                data.details.forEach((item, index) => {
                    // QUAN TRỌNG: Đã thêm class c-* vào từng thẻ <td> để khớp với header <th>
                    rowsHtml += `
                        <tr>
                            <td class="c-stt">${index + 1}</td>
                            <td class="c-ten fw-medium">${item.name}</td>
                            <td class="c-dvt">${item.unit}</td>
                            <td class="c-sl">${item.qty.toLocaleString('vi-VN')}</td>
                            <td class="c-gia">${item.price.toLocaleString('vi-VN')}</td>
                            <td class="c-tien">${item.total.toLocaleString('vi-VN')}</td>
                        </tr>
                    `;
                });
                $('#detail-product-list').html(rowsHtml);

                $('#section-transaction-history').fadeOut(200, function() {
                    $('#section-transaction-detail').removeClass('d-none');
                });
            }
        });

        $('.js-back-to-list').on('click', function() {
            $('#section-transaction-detail').addClass('d-none');
            $('#section-transaction-history').fadeIn(200);
        });
    });