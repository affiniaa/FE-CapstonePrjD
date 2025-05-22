$(document).ready(function () {
  const userTable = $('#user-table-body');
  
  // Tampilkan loading state
  userTable.html('<tr><td colspan="4" class="text-muted">Memuat data...</td></tr>');

  $.ajax({
    url: 'https://capstone-project-nodejs.onrender.com/api/work-experiences/getAllWorkExperience',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      userTable.empty();

      if (data.status && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          userTable.html('<tr><td colspan="4" class="text-warning">Belum ada data pengalaman kerja.</td></tr>');
          return;
        }

        data.data.forEach(user => {
          const row = `
            <tr>
              <td>${user.id_user}</td>
              <td>${user.name}</td>
              <td>${user.current_position}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="window.location.href='landing-page.html?id_user=${user.id_user}'">
                  Lihat Pengalaman
                </button>
              </td>
            </tr>
          `;
          userTable.append(row);
        });
      } else {
        userTable.html('<tr><td colspan="4" class="text-danger">Gagal memuat data.</td></tr>');
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX error:', error);
      userTable.html('<tr><td colspan="4" class="text-danger">Terjadi kesalahan saat mengambil data.</td></tr>');
    }
  });

});
