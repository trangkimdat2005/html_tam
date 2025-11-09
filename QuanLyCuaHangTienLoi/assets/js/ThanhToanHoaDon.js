document.addEventListener('DOMContentLoaded', function () {

    // === CÁC BIẾN DOM ===
    const totalAmountDisplay = document.getElementById('total-amount-display');
    // Lấy giá trị tổng tiền từ data-value
    const TOTAL_AMOUNT = parseInt(totalAmountDisplay.dataset.value, 10);

    const cashReceivedInput = document.getElementById('cash-received');
    const changeDisplay = document.getElementById('change-display');
    const suggestionButtons = document.querySelectorAll('.btn-suggestion');

    // Nút chuyển tab
    const btnCash = document.getElementById('btn-cash-method');
    const btnQR = document.getElementById('btn-qr-method');

    // Panels
    const cashPanel = document.getElementById('cash-payment-panel');
    const qrPanel = document.getElementById('qr-payment-panel');

    const dateInput = document.getElementById('input-ngay-giao-dich');

    // === BỘ ĐỊNH DẠNG TIỀN TỆ ===
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    // === KHỞI TẠO GIÁ TRỊ BAN ĐẦU ===
    // 1. Tự điền ngày hôm nay
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // 2. Hiển thị tổng tiền (đã format)
    totalAmountDisplay.textContent = formatter.format(TOTAL_AMOUNT);

    // === HÀM TÍNH TOÁN TIỀN THỐI ===
    function updateChange() {
        const cashGiven = parseInt(cashReceivedInput.value, 10) || 0;

        if (cashGiven === 0) {
            changeDisplay.innerHTML = `<span class="change-value missing">Còn thiếu: ${formatter.format(TOTAL_AMOUNT)}</span>`;
            return;
        }

        const change = cashGiven - TOTAL_AMOUNT;

        if (change < 0) {
            changeDisplay.innerHTML = `<span class="change-value missing">Còn thiếu: ${formatter.format(Math.abs(change))}</span>`;
        } else {
            changeDisplay.innerHTML = `<span class="change-value change">Tiền thối: ${formatter.format(change)}</span>`;
        }
    }

    // === GÁN SỰ KIỆN ===
    // 1. Gõ vào ô tiền khách đưa
    cashReceivedInput.addEventListener('input', updateChange);

    // 2. Nhấn nút gợi ý
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const amount = this.dataset.amount;
            cashReceivedInput.value = amount;
            // Kích hoạt sự kiện 'input' để JS tự tính lại tiền
            cashReceivedInput.dispatchEvent(new Event('input'));
        });
    });

    // 3. Chuyển tab Tiền Mặt
    btnCash.addEventListener('click', function (e) {
        e.preventDefault();
        cashPanel.classList.remove('d-none');
        qrPanel.classList.add('d-none');

        // Cập nhật style nút
        btnCash.classList.add('btn-success');
        btnCash.classList.remove('btn-outline-primary');
        btnQR.classList.add('btn-outline-primary');
        btnQR.classList.remove('btn-success');
    });

    // 4. Chuyển tab QR
    btnQR.addEventListener('click', function (e) {
        e.preventDefault();
        cashPanel.classList.add('d-none');
        qrPanel.classList.remove('d-none');

        // Cập nhật style nút
        btnQR.classList.add('btn-success');
        btnQR.classList.remove('btn-outline-primary');
        btnCash.classList.add('btn-outline-primary');
        btnCash.classList.remove('btn-success');
    });

    // === CHẠY LẦN ĐẦU KHI TẢI TRANG ===
    updateChange();
});