/*!
 * Start Bootstrap - Freelancer v6.0.5 (https://startbootstrap.com/theme/freelancer)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
 */
$(document).ready(function () {
  $('#members-name').on('change', function () {
    const selectedUserId = $(this).val();
    if (!selectedUserId) return;

    //Get Work Experience
    $.ajax({
      url: 'https://capstone-project-nodejs.onrender.com/api/work-experiences/getWorkExperience',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        id_user: selectedUserId
      }),
      success: function (response) {
        const experiences = response?.data?.[0]?.data_experiences || [];

        // Clear previous entries
        //SET name
        const userNameData = document.getElementById('user-name');
        const userNameJSON = response?.data?.[0]?.name;
        if (userNameJSON) {
          userNameData.innerHTML = `<h1 id="user-name" class="masthead-heading text-uppercase mb-0">${userNameJSON}</h1>`;
        } else {
          userNameData.innerHTML = `<h1 id="user-name" class="masthead-heading text-uppercase mb-0">''</h1>`;
        }

        //SET current position
        const currentPosition = document.getElementById('current-position');
        const currentPositionJSON = response?.data?.[0]?.current_position;
        if (currentPositionJSON) {
          currentPosition.innerHTML = `<p id="current-position" class="masthead-subheading font-weight-light mb-0">${currentPositionJSON}</p>`;
        } else {
          currentPosition.innerHTML = `<p id="current-position" class="masthead-subheading font-weight-light mb-0">''</p>`;
        }

        //SET about
        const aboutData = document.getElementById('about');
        const aboutJSON = response?.data?.[0]?.about;
        aboutData.innerHTML = '';
        if (aboutJSON) {
          const aboutHTML = `<div class="container">
                <!-- About Section Heading-->
                <h2 class="page-section-heading text-center text-uppercase text-white">About</h2>
                <!-- Icon Divider-->
                <div class="divider-custom divider-light">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                    <div class="divider-custom-line"></div>
                </div>
                <!-- About Section Content-->
                <div class="row">
                <div class="col-lg-12 ml-auto">
                    <p class="lead">${aboutJSON}</p>
                </div>
                <!-- About Section Button-->
            </div>
        </div>`;
          aboutData.insertAdjacentHTML('beforeend', aboutHTML);
        }

        //SET container data work experience & modal dynamically
        const containerData = document.getElementById('experiences-items-container');
        const containerModalExperiences = document.getElementById("experiences-modals-container");
        containerData.innerHTML = '';
        containerModalExperiences.innerHTML = '';

        experiences.forEach(item => {
          const portfolioHTML = `
          <div class="col-md-6 col-lg-4 mb-5">
            <div class="portfolio-item mx-auto" data-toggle="modal" data-target="#modal-${item.work_exp_id}">
              <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                <div class="portfolio-item-caption-content text-center text-white">
                  <i class="fas fa-plus fa-3x"></i>
                </div>
              </div>
              <img class="img-fluid" src="${item.img_icon_src}" alt="" style="max-width: 200px; height: auto; display: block; margin: 0 auto; margin-top: 70px;" />
            </div>
          </div>`;
          containerData.insertAdjacentHTML('beforeend', portfolioHTML);
        });

        console.log(experiences);
        experiences.forEach(item => {
          const responsibilities = Array.isArray(item.work_responsibilities)
            ? item.work_responsibilities.map(resp => {
                const [first, ...rest] = resp.split(" ");
                return `<li><strong>${first}</strong> ${rest.join(" ")}</li>`;
              }).join("")
            : "";

          const infoText = item.info
            ? `<p class="text-muted mb-3" style="font-size: 15px;">${item.info}</p>`
            : `<p class="text-muted mb-3" style="font-size: 15px;"></p>`;

          const modalHTML = `
            <div class="portfolio-modal modal fade" id="modal-${item.work_exp_id}" tabindex="-1" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                  <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"><i class="fas fa-times"></i></span>
                  </button>
                  <div class="modal-body text-center">
                    <div class="container">
                      <div class="row justify-content-center">
                        <div class="col-lg-8">
                          <h3 class="text-primary text-uppercase mb-3" style="font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                            ${item.work_position || ""}
                          </h3>
                          <h5 class="text-muted mb-4" style="font-size: 16px; font-weight: 400;">
                            ${item.company || ""}<br>
                            <span style="font-style: italic;">${item.start_year || ""} – ${item.end_year || ""}</span><br>
                            ${item.work_location || ""}
                          </h5>
                          ${infoText}
                          <div class="divider-custom">
                            <div class="divider-custom-line"></div>
                            <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                            <div class="divider-custom-line"></div>
                          </div>
                          <img class="img-fluid rounded shadow-sm mb-4" src="${item.img_modal_src || ""}" alt="${item.company || ""} Logo" style="max-width: 220px;" />
                          <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 10px;">
                            <strong>Responsibilities</strong>
                          </div>
                          <ul class="text-left px-2" style="font-size: 15.5px; line-height: 1.8; color: #4a4a4a;">
                            ${responsibilities}
                          </ul>
                          <button class="btn btn-outline-primary mt-4" data-dismiss="modal">
                            <i class="fas fa-times fa-fw"></i> Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;

          containerModalExperiences.insertAdjacentHTML("beforeend", modalHTML);
        });
      },
      error: function (xhr, status, error) {
        console.error('Error fetching work experiences:', xhr.responseText || error);
      }
    });

    // Get Portfolios
    $.ajax({
      url: 'https://capstone-project-nodejs.onrender.com/api/portfolios/getPortfolio',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        id_user: selectedUserId
      }),
      success: function (response) {
        const portfolios = response?.data?.[0]?.data_portfolios;

        if (!Array.isArray(portfolios)) {
          console.warn('No portfolio data available.');
          return;
        }

        const containerPortfolio = document.getElementById('portfolio-items-container');
        containerPortfolio.innerHTML = ''; // Clear existing content

        //set portofolio items
        portfolios.forEach(item => {
          const col = document.createElement('div');
          col.className = 'col-md-6 col-lg-4 mb-5';

          col.innerHTML = `
            <div class="portfolio-item mx-auto" data-toggle="modal" data-target="#portfolioModal${item.portfolio_id}">
              <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                <div class="portfolio-item-caption-content text-center text-white">
                  <i class="fas fa-plus fa-3x"></i>
                </div>
              </div>
              <img class="img-fluid" src="${item.img_portfolio_src}" alt="${item.project}"
                  style="max-width: 300px; height: auto; display: block; margin: 0 auto; margin-top: 70px;" />
            </div>
          `;

          containerPortfolio.appendChild(col);
        });

        const container = document.getElementById("portfolio-modals-container");
        container.innerHTML = ''; // Clear existing modals before appending new ones

        //set portofolio modal
        portfolios.forEach(item => {
          const responsibilities = item.project_responsibilities
            .map(res => `<li><strong>${res.split(' ')[0]}</strong> ${res.slice(res.indexOf(' ') + 1)}</li>`)
            .join("");

          const modalHTML = `
            <div class="portfolio-modal modal fade" id="portfolioModal${item.portfolio_id}" tabindex="-1" role="dialog"
                aria-labelledby="portfolioModal${item.portfolio_id}Label" aria-hidden="true">
              <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                  <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"><i class="fas fa-times"></i></span>
                  </button>
                  <div class="modal-body text-center">
                    <div class="container">
                      <div class="row justify-content-center">
                        <div class="col-lg-8">
                          <h3 class="text-primary text-uppercase mb-2" id="portfolioModal${item.portfolio_id}Label"
                              style="font-size: 22px; font-weight: 700;">
                            ${item.project}
                          </h3>
                          <p class="text-muted mb-4" style="font-size: 15px;">
                            ${item.info}
                          </p>
                          <div class="divider-custom">
                            <div class="divider-custom-line"></div>
                            <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                            <div class="divider-custom-line"></div>
                          </div>
                          <img class="img-fluid rounded shadow-sm mb-4" src="${item.img_portfolio_src}"
                              alt="${item.project} Screenshot" style="max-width: 100%; height: auto; margin-top: 10px;" />
                          <p class="mb-3 px-2" style="text-align: justify; font-size: 15.5px; color: #4a4a4a;">
                            ${item.description}
                          </p>
                          <ul class="text-left px-2" style="font-size: 15.5px; line-height: 1.8; color: #4a4a4a;">
                            ${responsibilities}
                          </ul>
                          <button class="btn btn-outline-primary mt-4" data-dismiss="modal">
                            <i class="fas fa-times fa-fw"></i> Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;

          container.innerHTML += modalHTML;
        });
      },
      error: function (xhr, status, error) {
        console.error('Error fetching portfolios:', error);
      }
    });
  });
});

(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 71)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Scroll to top button appear
  $(document).scroll(function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 80
  });

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Floating label headings for the contact form
  $(function () {
    $("body").on("input propertychange", ".floating-label-form-group", function (e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function () {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function () {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  });

})(jQuery); // End of use strict