 $(document).ready(function() {
      // 1. Xử lý khi bấm nút "Xem" (hình con mắt)
      $('.js-view-invoice').on('click', function() {
        // Lấy ID hóa đơn từ nút vừa bấm
        let invoiceId = $(this).data('id');

        // --- Vùng giả lập dữ liệu (Thay bằng AJAX call sau này) ---
        if (invoiceId === 'HD002') {
            $('#detail-invoice-id').text('HD002');
            $('#detail-invoice-date').text('02/11/2025 10:15');
            $('#detail-payment-method').html('<i class="fas fa-qrcode"></i> QR Pay');
            $('#detail-invoice-total').text('50,000 ₫');
        } else {
            $('#detail-invoice-id').text('HD001');
            $('#detail-invoice-date').text('02/11/2025 14:30');
            $('#detail-payment-method').text('Tiền mặt');
            $('#detail-invoice-total').text('151,000 ₫');
        }
        // ---------------------------------------------------------

        // Hiệu ứng chuyển đổi: Ẩn lịch sử -> Hiện chi tiết
        $('#section-transaction-history').fadeOut(300, function() {
           $('#section-invoice-detail').removeClass('d-none').hide().fadeIn(300);
        });
        
        // Cập nhật breadcrumb (tùy chọn, để người dùng biết mình đang ở đâu)
        $('.app-breadcrumb .breadcrumb-item.active a').text('Chi tiết hóa đơn ' + invoiceId);
      });

      // 2. Xử lý khi bấm nút "Quay lại danh sách"
      $('.js-back-to-history').on('click', function() {
        // Hiệu ứng chuyển đổi ngược lại: Ẩn chi tiết -> Hiện lịch sử
        $('#section-invoice-detail').fadeOut(300, function() {
           $(this).addClass('d-none'); // Thêm lại class d-none sau khi ẩn xong
           $('#section-transaction-history').fadeIn(300);
        });

        // Trả lại breadcrumb cũ
        $('.app-breadcrumb .breadcrumb-item.active a').text('Giao dịch thanh toán');
      });
    });