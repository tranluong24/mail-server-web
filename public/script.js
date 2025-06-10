document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap modals
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  const registerModal = new bootstrap.Modal(
    document.getElementById("registerModal")
  );
  const loadingModal = new bootstrap.Modal(
    document.getElementById("loadingModal")
  );

  // Get main content element
  const mainContent = document.getElementById("mainContent");
  const projectCards = document.getElementById("projectCards");
  const projects = [];
  let userEmails = []; // Store user's emails

  // Khi trang load, kiểm tra trạng thái đăng nhập
  window.onload = function () {
    const statusLogin = localStorage.getItem("currentUser");
    if (statusLogin) {
      // Tận dụng đoạn code hiển thị UI khi đã đăng nhập
      document.getElementById("logoutBtn").style.display = "block";
      mainContent.style.display = "block";

      // Hiển thị tên người dùng
      const userData = JSON.parse(currentUser);
      const userInfoDiv = document.createElement("div");
      userInfoDiv.className = "user-info";
      userInfoDiv.innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-user-circle"></i>
                    <span>Xin chào, ${userData.username}</span>
                </div>
            `;
      document
        .querySelector(".container")
        .insertBefore(
          userInfoDiv,
          document.querySelector(".container").firstChild
        );
      loginModal.hide();
      registerModal.hide();
    } else {
      // Tận dụng đoạn code UI khi chưa đăng nhập
      document.getElementById("logoutBtn").style.display = "none";
      mainContent.style.display = "none";
      loginModal.show();
    }
  };

  // Check login status
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    mainContent.style.display = "none";
    loginModal.show();
  } else {
    // Load user's emails
    const currentUserJSON = localStorage.getItem("currentUser");
    let storedEmails = [];
    if (currentUserJSON) {
      const currentUser = JSON.parse(currentUserJSON);
      storedEmails = localStorage.getItem(`${currentUser.username}-emails`);
    }
    if (storedEmails) {
      userEmails = JSON.parse(storedEmails);
      document.getElementById("logoutBtn").style.display = "block";
      mainContent.style.display = "block";
    } else {
      // If no emails found, clear current user and show login
      mainContent.style.display = "none";
      // loginModal.show();
    }
  }

  // Modal navigation
  document
    .getElementById("showRegister")
    .addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.hide();
      registerModal.show();
    });

  document.getElementById("showLogin").addEventListener("click", function (e) {
    e.preventDefault();
    registerModal.hide();
    loginModal.show();
  });

  // Handle register
  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // --- THÊM ĐOẠN KIỂM TRA TÀI KHOẢN TỒN TẠI TẠI ĐÂY ---
      //   if (localStorage.getItem("currentUser")) {
      //     alert(
      //       "Mỗi thiết bị chỉ được đăng ký một tài khoản duy nhất. Nếu bạn đã có tài khoản, vui lòng đăng nhập."
      //     );
      //     // Chuyển người dùng về modal đăng nhập để tiện lợi hơn
      //     registerModal.hide();
      //     loginModal.show();
      //     return; // Dừng hàm ngay lập tức
      //   }
      // --- KẾT THÚC ĐOẠN KIỂM TRA ---

      const username = this.querySelector('input[type="text"]').value;
      const password = this.querySelector('input[type="password"]').value;
      const confirmPassword = this.querySelectorAll('input[type="password"]')[1]
        .value;

      if (password !== confirmPassword) {
        alert("Mật khẩu không khớp!");
        return;
      }

      // Validate username format
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        alert("Tên tài khoản chỉ được chứa chữ cái và số!");
        return;
      }

      // Show loading modal with custom message
    //   const loadingModalEl = document.getElementById("loadingModal");
    //   const loadingMessage = loadingModalEl.querySelector(".modal-body");
    //   loadingMessage.innerHTML = `
    //         <div class="text-center">
    //             <div class="spinner-border text-primary mb-3" role="status">
    //                 <span class="visually-hidden">Loading...</span>
    //             </div>
    //             <p>Đang tạo các nhóm dự án cho bạn..</p>
    //             <p class="text-muted small">Vui lòng đợi trong giây lát</p>
    //         </div>
    //     `;
    //   loadingModal.show();

      try {
        // Call API to create emails
        // const response = await fetch("/api/emails/create", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ username }),
        // });

        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.error || "Không thể tạo email");
        // }

        // const data = await response.json();
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username, password })
        );
        const suffixes = ["a", "b", "c"];
        const emails = suffixes.map((suf) => {
          return {
            email: `${username}${suf}@email.tekmonk.edu.vn`,
            password: password,
          };
        });

        // Nếu muốn lưu vào localStorage:
        localStorage.setItem(`${username}-emails`, JSON.stringify(emails));

        // // Store emails in localStorage
        // localStorage.setItem(`${username}-emails`, JSON.stringify(data.emails));

        // Save account information
        // const accountResponse = await fetch("/api/accounts/register", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ username, password }),
        // });

        // if (!accountResponse.ok) {
        //   console.error("Failed to save account information");
        // }

        // Hide loading modal
        // loadingModal.hide();
                    // ${
                    //   data.failedEmails
                    //     ? `
                    //     <hr>
                    //     <p class="text-warning">Một số email không thể tạo thư mục mail:</p>
                    //     <ul>
                    //         ${data.failedEmails
                    //           .map(
                    //             (failed) => `
                    //             <li>${failed.email} - ${failed.error}</li>
                    //         `
                    //           )
                    //           .join("")}
                    //     </ul>
                    //     <p class="small text-muted">Bạn vẫn có thể sử dụng các email đã tạo thành công.</p>
                    // `
                    //     : ""
                    // }
        // Show success message
        const successMessage = `
                <div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">Đăng ký thành công!</h4>
                    <p>Đã tạo ${emails.length} nhóm dự án cho bạn:</p>
                    <ul>
                        ${emails
                          .map((email) => `<li>${email.length}</li>`)
                          .join("")}
                    </ul>

                    <hr>
                    <p class="mb-0">Vui lòng đăng nhập để tiếp tục.</p>
                </div>
            `;

        // Create and show success modal
        const successModal = new bootstrap.Modal(document.createElement("div"));
        const modalEl = document.createElement("div");
        modalEl.className = "modal fade";
        modalEl.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${successMessage}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Đăng nhập ngay</button>
                        </div>
                    </div>
                </div>
            `;
        document.body.appendChild(modalEl);

        // Show success modal
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();

        // Hide register modal
        registerModal.hide();

        // When success modal is closed, show login modal
        modalEl.addEventListener("hidden.bs.modal", function () {
          loginModal.show();
          // Remove the modal from DOM
          document.body.removeChild(modalEl);
        });
      } catch (error) {
        console.error("Error:", error);
        loadingModal.hide();

        // Show error message
        const errorMessage = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Đăng ký thất bại!</h4>
                    <p>Có lỗi xảy ra khi tạo tài khoản: ${error.message}</p>
                    <hr>
                    <p class="mb-0">Vui lòng thử lại sau.</p>
                </div>
            `;

        // Create and show error modal
        const errorModal = new bootstrap.Modal(document.createElement("div"));
        const modalEl = document.createElement("div");
        modalEl.className = "modal fade";
        modalEl.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${errorMessage}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            `;
        document.body.appendChild(modalEl);

        // Show error modal
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();

        // When error modal is closed, remove it from DOM
        modalEl.addEventListener("hidden.bs.modal", function () {
          document.body.removeChild(modalEl);
        });
      }
    });

  // Handle login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;

    // Lấy currentUser từ localStorage
    // const savedUserJSON = localStorage.getItem("currentUser");
    // if (!savedUserJSON) {
    //   alert("Chưa có tài khoản nào được đăng ký");
    //   return;
    // }

    // const savedUser = JSON.parse(savedUserJSON);

    // So sánh username và password
    if (username.includes("student") && password) {
      // Lấy emails đã lưu trong localStorage
      // const savedEmailsJSON = localStorage.getItem(`${username}-emails`);
      // if (!savedEmailsJSON) {
      //   alert("Không tìm thấy dữ liệu của tài khoản");
      //   return;
      // }

      // const userEmails = JSON.parse(savedEmailsJSON);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username, password })
        );
        const suffixes = ["a", "b", "c"];
        const emails = suffixes.map((suf) => {
          return {
            email: `${username}${suf}@email.tekmonk.edu.vn`,
            password: password,
          };
        });

        // Nếu muốn lưu vào localStorage:
        localStorage.setItem(`${username}-emails`, JSON.stringify(emails));

      // Hiển thị giao diện đăng nhập thành công
      loginModal.hide();
      document.getElementById("logoutBtn").style.display = "block";
      mainContent.style.display = "block";
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu");
    }
  });

  // Handle logout
  document.getElementById("logoutBtn").addEventListener("click", function () {
    // Clear current user and emails
    userEmails = [];
    document.getElementById("logoutBtn").style.display = "none";
    mainContent.style.display = "none";
    loginModal.show();
  });

  // Function to generate a random device ID
  function generateDeviceId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Get or create device ID
  function getDeviceId() {
    let deviceId = localStorage.getItem("amplitudeDeviceId");
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem("amplitudeDeviceId", deviceId);
    }
    return deviceId;
  }

  async function handleCardClick(index) {
    if (!localStorage.getItem("currentUser")) {
      alert("Vui lòng đăng nhập trước!");
      loginModal.show();
      mainContent.style.display = "none";
      return;
    }

    if (userEmails.length === 0) {
      alert("Không tìm thấy thông tin email!");
      return;
    }

    if (index >= userEmails.length) {
      alert("Không tìm thấy email tương ứng!");
      return;
    }

    // Modal và các element của nó sẽ được quản lý bởi các hàm bên dưới
    let successModalEl = null;
    let bsSuccessModal = null;

    // --- Hàm 1: Hiển thị Modal ở trạng thái Loading ---
    function showSuccessModalLoadingState() {
      const loadingContent = `
                <div class="alert alert-success mb-0" role="alert">
                    <h4 class="alert-heading">Yêu cầu thành công!</h4>
                    <p>Đã gửi yêu cầu đến Máy chủ. Hệ thống đang chờ nhận xác nhận.</p>
                    <hr>
                    <div class="text-center py-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2 mb-0">Đang tìm kiếm yêu cầu, vui lòng đợi trong giây lát...</p>
                    </div>
                </div>
            `;

      successModalEl = document.createElement("div");
      successModalEl.className = "modal fade";
      successModalEl.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${loadingContent}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            `;
      document.body.appendChild(successModalEl);

      bsSuccessModal = new bootstrap.Modal(successModalEl);
      bsSuccessModal.show();

      successModalEl.addEventListener("hidden.bs.modal", function () {
        document.body.removeChild(successModalEl);
      });
    }

    // --- Hàm 2: Cập nhật Modal khi có Link ---
    function updateSuccessModalWithLink(loginLink) {
      if (!successModalEl) return; // Đảm bảo modal đã tồn tại

      const successContent = `
                <div class="alert alert-success mb-0" role="alert">
                    <h4 class="alert-heading">Tìm thấy email xác nhận!</h4>
                    <p>Hệ thống đã nhận được email chứa liên kết đăng nhập từ Thunkable.</p>
                    <hr>
                    <p>Nhấn vào nút bên dưới để mở dự án trong Thunkable.</p>
                    <div class="mt-3 text-center">
                        <a href="${loginLink}" target="_blank" class="btn btn-primary btn-lg">
                            Mở dự án trên Thunkable <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            `;

      const modalBody = successModalEl.querySelector(".modal-body");
      const modalFooter = successModalEl.querySelector(".modal-footer");

      // Cập nhật nội dung và thay nút "Đóng"
      modalBody.innerHTML = successContent;
      modalFooter.innerHTML =
        '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Hoàn tất</button>';
    }

    // --- Hàm 3: Hiển thị Modal Lỗi ---
    function showErrorModal(message) {
      // Nếu có modal loading đang mở, đóng nó đi
      if (bsSuccessModal) {
        bsSuccessModal.hide();
      }

      const errorMessage = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Lỗi!</h4>
                    <p>Không thể hoàn tất quá trình:</p>
                    <p class="mb-0">${message}</p>
                </div>
            `;

      const errorModalEl = document.createElement("div");
      errorModalEl.className = "modal fade";
      errorModalEl.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${errorMessage}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            `;
      document.body.appendChild(errorModalEl);

      const bsErrorModal = new bootstrap.Modal(errorModalEl);
      bsErrorModal.show();

      errorModalEl.addEventListener("hidden.bs.modal", function () {
        document.body.removeChild(errorModalEl);
      });
    }

    // --- Luồng xử lý chính ---
    try {
      // 1. Gửi yêu cầu đến Thunkable (không cần modal loading riêng ở đây)
      const deviceId = getDeviceId();
      const currentHour = new Date().getHours();

      const response = await fetch("/api/emails/proxy-thunkable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmails[index].email,
          trackingData: { isHoc: null, path: "login" },
          platform: "web",
          currentHours: currentHour,
          redirectOptions: { search: "" },
          amplitudeDeviceId: deviceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Lỗi ${response.status}: Không thể gửi yêu cầu đến Máy chủ`
        );
      }

      // 2. Ngay lập tức hiển thị Modal thành công ở trạng thái "loading"
      showSuccessModalLoadingState();

      // 3. Bắt đầu quá trình kiểm tra email
      //   let checkCount = 0;
      //   const maxChecks = 5; // Tăng số lần kiểm tra cho chắc chắn
      //   let checkInterval = null; // Biến để quản lý interval

      //   async function checkForNewEmail() {
      //     checkCount++;
      //     console.log(`Checking for email... Attempt ${checkCount}/${maxChecks}`);

      //     try {
      //       const emailResponse = await fetch(
      //         `/api/emails/${userEmails[index].email}/latest/v2`
      //       );
      //       if (!emailResponse.ok) {
      //         throw new Error("Không thể lấy thông tin email từ server");
      //       }
      //       const emailData = await emailResponse.json();

      //       if (emailData && emailData.loginLink) {
      //         // Tìm thấy link, cập nhật modal và dừng kiểm tra
      //         console.log("Login link found!", emailData.loginLink);
      //         clearInterval(checkInterval); // Dừng vòng lặp
      //         updateSuccessModalWithLink(emailData.loginLink);
      //       } else if (checkCount >= maxChecks) {
      //         // Đã hết số lần kiểm tra mà không có link
      //         console.log("Max checks reached without finding login link.");
      //         clearInterval(checkInterval); // Dừng vòng lặp
      //         showErrorModal(
      //           "Không nhận được email xác nhận từ Máy chủ sau một khoảng thời gian. Vui lòng thử lại sau."
      //         );
      //       }
      //     } catch (error) {
      //       console.error("Error checking email:", error);
      //       clearInterval(checkInterval); // Dừng vòng lặp khi có lỗi
      //       showErrorModal(error.message);
      //     }
      //   }

      //   // Bắt đầu kiểm tra sau 5 giây, và lặp lại mỗi 6 giây
      //   checkInterval = setInterval(checkForNewEmail, 6000);
      //   setTimeout(checkForNewEmail, 5000); // Lần check đầu tiên

      function longPollForEmail() {
        console.log("Bắt đầu long poll...");
        fetch(`/api/emails/${userEmails[index].email}/latest/v2`, {
          method: "GET",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Không thể lấy thông tin email từ server");
            }
            return res.json();
          })
          .then((data) => {
            console.log("Tin nhắn Kafka:", data);

            if (data && data.loginLink) {
              updateSuccessModalWithLink(data.loginLink);
            } else {
              // Nếu không có link => tiếp tục long poll lại sau 1s
              setTimeout(longPollForEmail, 1000);
            }
          })
          .catch((error) => {
            console.error("Lỗi long polling:", error);
            showErrorModal(error.message);
          });
      }

      // Gọi lần đầu
      longPollForEmail();
    } catch (error) {
      console.error("Error in handleCardClick:", error);
      showErrorModal(error.message); // Hiển thị lỗi chung nếu gửi yêu cầu ban đầu thất bại
    }
  }

  async function handleProjectClick(index) {
    if (!localStorage.getItem("currentUser")) {
      alert("Vui lòng đăng nhập trước!");
      loginModal.show();
      mainContent.style.display = "none";
      return;
    }

    if (!projects[index]) return;

    loadingModal.show();

    try {
      // Check for new emails
      const response = await fetch(`/api/emails/${projects[index].username}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Không thể lấy danh sách email");
      }

      const data = await response.json();

      if (data.emails && data.emails.length > 0) {
        // TODO: Handle new emails
        console.log("New emails:", data.emails);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("Failed to fetch")) {
        alert(
          "Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Server đã được khởi động\n2. Địa chỉ server đúng\n3. Không có lỗi CORS"
        );
      } else {
        alert("Có lỗi xảy ra: " + error.message);
      }
    } finally {
      loadingModal.hide();
    }
  }

  // Thêm đoạn này sau khi khởi tạo các biến
  const cards = projectCards.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.addEventListener("click", () => handleCardClick(index));
  });
});
