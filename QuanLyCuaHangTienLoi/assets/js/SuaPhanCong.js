    document.addEventListener('DOMContentLoaded', function () {
      
      // --- KHỞI TẠO SELECT2 ---
      // (Đảm bảo jQuery đã được tải trước)
      $('#select-nhan-vien').select2({
        width: '100%',
        placeholder: '-- Tìm và chọn nhân viên --'
      });
      
      $('#select-ca-lam-viec').select2({
        width: '100%',
        placeholder: '-- Chọn ca làm việc --'
      });

      // --- TỰ ĐỘNG ĐIỀN NGÀY HÔM NAY ---
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('input-ngay').value = today;

    });