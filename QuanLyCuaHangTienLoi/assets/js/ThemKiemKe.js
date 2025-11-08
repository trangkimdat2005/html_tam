document.addEventListener('DOMContentLoaded', function () {

    $('#select-nhan-vien').select2({ width: '100%' });
    $('#select-san-pham').select2({ width: '100%' });

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('input-ngay-kiem-ke').value = today;

    const addBtn = document.getElementById('add-item-btn');
    const tableBody = document.getElementById('kiem-ke-body');
    const productSelect = $('#select-san-pham');
    const soLuongThucTeInput = document.getElementById('input-thuc-te');
    const ghiChuInput = document.getElementById('input-ghi-chu');

    const heThongTonKho = {
        'SPDV_001': 150,
        'SPDV_002': 80,
        'SPDV_003': 200,
        'SPDV_005': 100,
        'SPDV_006': 50
    };

    addBtn.addEventListener('click', function () {
        const selectedOption = productSelect.find('option:selected');
        const productId = selectedOption.val();
        const productName = selectedOption.data('name');

        if (!productId) {
            alert("Vui lòng chọn một sản phẩm.");
            return;
        }

        let soLuongThucTe;
        try {
            soLuongThucTe = parseInt(soLuongThucTeInput.value);
            if (isNaN(soLuongThucTe) || soLuongThucTe < 0) {
                throw new Error();
            }
        } catch (e) {
            alert("Vui lòng nhập số lượng thực tế hợp lệ (lớn hơn hoặc bằng 0).");
            return;
        }

        const ghiChu = ghiChuInput.value;
        const soLuongHeThong = heThongTonKho[productId] || 0;
        const chenhLech = soLuongThucTe - soLuongHeThong;

        let chenhLechClass = 'chenh-lech-khop';
        let chenhLechText = chenhLech;

        if (chenhLech > 0) {
            chenhLechClass = 'chenh-lech-duong';
            chenhLechText = '+' + chenhLech;
        } else if (chenhLech < 0) {
            chenhLechClass = 'chenh-lech-am';
        }

        const row = tableBody.insertRow();
        row.innerHTML = `
          <td data-id="${productId}">${productName}</td>
          <td class="text-end">${soLuongHeThong}</td>
          <td class="text-end">${soLuongThucTe}</td>
          <td class="text-end ${chenhLechClass}">${chenhLechText}</td>
          <td>${ghiChu}</td>
          <td><button class="btn btn-danger btn-sm remove-item-btn"><i class="bi bi-trash"></i></button></td>
        `;

        productSelect.val('').trigger('change');
        soLuongThucTeInput.value = '';
        ghiChuInput.value = '';
    });

    tableBody.addEventListener('click', function (e) {
        const removeButton = e.target.closest('.remove-item-btn');
        if (removeButton) {
            removeButton.closest('tr').remove();
        }
    });

    document.getElementById('btn-save-phieu').addEventListener('click', function () {
        alert('Đã nhấn lưu! (Logic lưu phiếu sẽ được xử lý ở đây)');
    });

});