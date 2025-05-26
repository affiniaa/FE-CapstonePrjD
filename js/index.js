$(document).ready(() => {
  const userTable = $('#user-table-body');

  // Tampilkan loading state
  userTable.html('<tr><td colspan="4" class="text-muted">Memuat data...</td></tr>');

  //Get all data work ecperience
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
                <button class="btn btn-sm btn-info" onclick="getDetailUserToUpdate(${user.id_user})">
                  Update
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

//FUNCTION UNTUK DELETE SESUAI ID_USER
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
//FUNCTION UNTUK GET DATA SESUAI ID_USER KEMUDIAN AUTOFILL KE FIELD & BISA UPDATE
function getDetailUserToUpdate(id_user) {
  $('#temp-id-user').val(id_user);

  // Ambil data Work Experience
  $.ajax({
    url: 'https://capstone-project-nodejs.onrender.com/api/work-experiences/getWorkExperience',
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      id_user: id_user
    }),
    success: function (response) {
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const user = response.data[0];
        const result = {
          name: user.name || "",
          current_position: user.current_position || "",
          about: user.about || "",
          data_experiences: Array.isArray(user.data_experiences) ? user.data_experiences.map(exp => ({
            work_exp_id: exp.work_exp_id || "",
            img_icon_src: exp.img_icon_src || "",
            img_modal_src: exp.img_modal_src || "",
            work_position: exp.work_position || "",
            work_location: exp.work_location || "",
            info: exp.info || "",
            company: exp.company || "",
            start_year: exp.start_year || "",
            end_year: exp.end_year || "",
            work_responsibilities: Array.isArray(exp.work_responsibilities) ?
              exp.work_responsibilities : (typeof exp.work_responsibilities === 'string' ?
                exp.work_responsibilities.split('\n').filter(Boolean) : [])
          })) : []
        };

        fillWorkExperiences(result);
      } else {
        Swal.fire({
          title: 'Tidak Ada Data',
          text: 'Data work experience tidak ditemukan atau kosong.',
          icon: 'warning'
        });
      }
    },
    error: function (xhr) {
      Swal.fire({
        title: 'Gagal Mengambil Data',
        text: `Terjadi kesalahan: ${xhr.responseText}`,
        icon: 'error'
      });
    }
  });

  // Ambil data Portfolio
  $.ajax({
    url: 'https://capstone-project-nodejs.onrender.com/api/portfolios/getPortfolio',
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      id_user: id_user
    }),
    success: function (response) {
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const userData = response.data[0];
        const result = {
          data_portfolios: Array.isArray(userData.data_portfolios) ? userData.data_portfolios.map(portfolio => ({
            portfolio_id: portfolio.portfolio_id || "",
            info: portfolio.info || "",
            img_portfolio_src: portfolio.img_portfolio_src || "",
            project: portfolio.project || "",
            description: portfolio.description || "",
            project_responsibilities: Array.isArray(portfolio.project_responsibilities) ?
              portfolio.project_responsibilities : (typeof portfolio.project_responsibilities === 'string' ?
                portfolio.project_responsibilities.split('\n').filter(Boolean) : [])
          })) : []
        };

        fillPortfolios(result);
        const modal = new bootstrap.Modal(document.getElementById('jsonModal'));
        modal.show();
      } else {
        Swal.fire({
          title: 'Tidak Ada Data',
          text: 'Data portfolio tidak ditemukan atau kosong.',
          icon: 'warning'
        });
      }
    },
    error: function (xhr) {
      Swal.fire({
        title: 'Gagal Mengambil Data',
        text: `Terjadi kesalahan: ${xhr.responseText}`,
        icon: 'error'
      });
    }
  });
}
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
//FUNCTION UNTUK AUTOFILL WORK EXP
function fillWorkExperiences(data) {
  const container = document.getElementById('work-experiences-container');
  const nameField = document.getElementById('name_update');
  const positionField = document.getElementById('current_position_update');
  const aboutField = document.getElementById('about_update');
  container.innerHTML = '';

  // Isi profil utama
  nameField.value = data.name || '';
  positionField.value = data.current_position || '';
  aboutField.value = data.about || '';

  // Buat isi pengalaman kerja
  let html = '';
  (data.data_experiences || []).forEach((exp, index) => {
    const responsibilitiesText = Array.isArray(exp.work_responsibilities) ?
      exp.work_responsibilities.map(escapeHtml).join('\n') :
      '';

    html += `
      <div class="mb-4 border p-3 rounded">
        <h6>Work Experience #${index + 1}</h6>
        <input type="hidden" name="work_exp_id" value="${escapeHtml(exp.work_exp_id)}">
        <div class="mb-2"><label>Company:</label><input type="text" class="form-control" name="company" value="${escapeHtml(exp.company)}"></div>
        <div class="mb-2"><label>Work Position:</label><input type="text" class="form-control" name="work_position" value="${escapeHtml(exp.work_position)}"></div>
        <div class="mb-2"><label>Work Location:</label><input type="text" class="form-control" name="work_location" value="${escapeHtml(exp.work_location)}"></div>
        <div class="mb-2"><label>Start Year:</label><input type="text" class="form-control" name="start_year" value="${escapeHtml(exp.start_year)}"></div>
        <div class="mb-2"><label>End Year:</label><input type="text" class="form-control" name="end_year" value="${escapeHtml(exp.end_year)}"></div>
        <div class="mb-2"><label>Icon Src:</label><input type="text" class="form-control" name="img_icon_src" value="${escapeHtml(exp.img_icon_src)}"></div>
        <div class="mb-2"><label>Modal Src:</label><input type="text" class="form-control" name="img_modal_src" value="${escapeHtml(exp.img_modal_src)}"></div>
        <div class="mb-2"><label>Info:</label><input type="text" class="form-control" name="info" value="${escapeHtml(exp.info)}"></div>
        <div class="mb-2"><label>Responsibilities:</label><textarea class="form-control" name="work_responsibilities" rows="5">${responsibilitiesText}</textarea></div>
      </div>
    `;
  });

  container.innerHTML = html;
}
//FUNCTION UNTUK AUTOFILL PORTFOLIO
function fillPortfolios(data) {
  const container = document.getElementById('portfolios-container');
  container.innerHTML = '';

  data.data_portfolios.forEach((portfolio, index) => {
    container.innerHTML += `
      <div class="mb-4 border p-3 rounded">
        <h6>Portfolio #${index + 1}</h6>
        <input type="hidden" name="portfolio_id" value="${escapeHtml(portfolio.portfolio_id)}">
        <div class="mb-2"><label>Info:</label><input type="text" class="form-control" name="info" value="${escapeHtml(portfolio.info)}"></div>
        <div class="mb-2"><label>Image Portfolio Source:</label><input type="text" class="form-control" name="img_portfolio_src" value="${escapeHtml(portfolio.img_portfolio_src)}"></div>
        <div class="mb-2"><label>Project:</label><input type="text" class="form-control" name="project" value=${escapeHtml(portfolio.project)}"></div>
        <div class="mb-2"><label>Description:</label><textarea class="form-control" name="description">${portfolio.description}</textarea></div>
        <div class="mb-2"><label>Responsibilities:</label><textarea class="form-control" name="project_responsibilities">${portfolio.project_responsibilities.join('\n')}</textarea></div>
      </div>
    `;
  });
}
//FUNCTION UNTUK TRIGGER UPDATE KE API
function updateAllData() {
  const id_user = $('#temp-id-user').val();

  // Ambil dan susun data Work Experiences sesuai format JSON
  const workExperiences = [];
  document.querySelectorAll('#work-experiences-container > div').forEach(section => {
    workExperiences.push({
      work_exp_id: section.querySelector('[name="work_exp_id"]').value,
      work_position: section.querySelector('[name="work_position"]').value,
      company: section.querySelector('[name="company"]').value,
      work_location: section.querySelector('[name="work_location"]').value,
      start_year: section.querySelector('[name="start_year"]').value,
      end_year: section.querySelector('[name="end_year"]').value,
      img_icon_src: section.querySelector('[name="img_icon_src"]').value,
      img_modal_src: section.querySelector('[name="img_modal_src"]').value,
      info: section.querySelector('[name="info"]').value,
      work_responsibilities: section.querySelector('[name="work_responsibilities"]').value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
    });
  });

  // Ambil dan susun data Portfolios
  const portfolios = [];
  document.querySelectorAll('#portfolios-container > div').forEach(section => {
    portfolios.push({
      portfolio_id: section.querySelector('[name="portfolio_id"]').value,
      project: section.querySelector('[name="project"]').value,
      info: section.querySelector('[name="info"]').value,
      description: section.querySelector('[name="description"]').value,
      project_responsibilities: section.querySelector('[name="project_responsibilities"]').value
        .split('\n')
        .filter(line => line.trim() !== ''),
      img_portfolio_src: section.querySelector('[name="img_portfolio_src"]').value
    });
  });

  // Payload lengkap
  const workExpPayload = {
    name: document.getElementById('name_update').value,
    current_position: document.getElementById('current_position_update').value,
    about: document.getElementById('about_update').value,
    data_experiences: workExperiences
  };

  const portfolioPayload = {
    data_portfolios: portfolios
  };

  // Kirim Work Experience terlebih dahulu
  $.ajax({
    url: `https://capstone-project-nodejs.onrender.com/api/work-experiences/update/${id_user}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(workExpPayload),
    success: function (res1) {
      console.log('Work experiences updated:', res1);

      // Jika sukses, lanjutkan kirim Portfolios
      $.ajax({
        url: `https://capstone-project-nodejs.onrender.com/api/portfolios/update/${id_user}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(portfolioPayload),
        success: function (res2) {
          console.log('Portfolios updated:', res2);
          Swal.fire('Sukses', 'Seluruh data berhasil diperbarui.', 'success');
          setTimeout(function () {
            location.reload();
          }, 3000);
        },
        error: function (err2) {
          console.error('Gagal update portfolios:', err2);
          Swal.fire('Gagal', 'Gagal memperbarui data portfolio.', 'error');
        }
      });
    },
    error: function (err1) {
      console.error('Gagal update work experiences:', err1);
      Swal.fire('Gagal', 'Gagal memperbarui data pengalaman kerja.', 'error');
    }
  });
}