$(document).ready(() => {
  const userTable = $('#user-table-body');

  // Tampilkan loading state
  userTable.html('<tr><td colspan="4" class="text-muted">Memuat data...</td></tr>');

  $.ajax({
    url: 'https://capstone-project-nodejs.onrender.com/api/work-experiences/getAllWorkExperience',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      userTable.empty();

      if (response.status && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          userTable.html('<tr><td colspan="4" class="text-warning">Belum ada data pengalaman kerja.</td></tr>');
          return;
        }

        response.data.forEach(user => {
          const row = `
            <tr>
              <td>${user.id_user}</td>
              <td>${user.name}</td>
              <td>${user.current_position}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="window.location.href='landing-page.html?id_user=${user.id_user}'">
                  View Experience
                </button>
              </td>
              <td>
                <button class="btn btn-sm btn-danger" onclick="deleteUserData(${user.id_user})">
                  Delete
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

function deleteUserData(id_user) {
  // Ambil semua ID user dari tabel
  const allIds = [];
  $('#user-table-body tr').each(function () {
    const rowId = parseInt($(this).find('td:first').text());
    if (!isNaN(rowId)) allIds.push(rowId);
  });

  // Cari ID terbesar
  const maxId = Math.max(...allIds);

  // Validasi hanya bisa hapus ID terbesar
  if (parseInt(id_user) !== maxId) {
    Swal.fire({
      icon: 'warning',
      title: 'Peringatan',
      text: `Mohon hapus data dari urutan paling bawah`,
    });
    return;
  }

  // Jika valid, lanjutkan konfirmasi
  Swal.fire({
    title: 'Konfirmasi Hapus',
    text: 'Yakin ingin menghapus semua data untuk user ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Hapus Work Experiences terlebih dahulu
      $.ajax({
        url: `https://capstone-project-nodejs.onrender.com/api/work-experiences/delete/${id_user}`,
        method: 'DELETE',
        success: function (portfolioResponse) {
          console.log('Work Experience deleted:', portfolioResponse);

          // Setelah berhasil, hapus Portfolios
          $.ajax({
            url: `https://capstone-project-nodejs.onrender.com/api/portfolios/delete/${id_user}`,
            method: 'DELETE',
            success: function (workExpResponse) {
              console.log('Portfolio deleted:', workExpResponse);
              Swal.fire({
                title: 'Berhasil',
                text: 'Semua data berhasil dihapus.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                location.reload();
              });
            },
            error: function () {
              Swal.fire('Gagal', 'Gagal menghapus data portfolio.', 'error');
            }
          });
        },
        error: function () {
          Swal.fire('Gagal', 'Gagal menghapus data pengalaman kerja.', 'error');
        }
      });
    }
  });
}
