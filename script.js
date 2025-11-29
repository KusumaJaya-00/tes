// --- Seleksi Elemen Utama ---
const body = document.body;
const btnTheme = document.getElementById("btn-theme");
const inputTugas = document.getElementById("input-tugas");
// Seleksi Input Tanggal Baru
const inputTanggal = document.getElementById("input-tanggal");
const btnTambah = document.getElementById("btn-tambah");
const listBelum = document.getElementById("list-belum");
const listSelesai = document.getElementById("list-selesai");

// --- Modal Elements ---
const modalHapus = document.getElementById("modal-hapus");
const btnBatalHapus = document.getElementById("btn-batal-hapus");
const btnConfirmHapus = document.getElementById("btn-confirm-hapus");

const modalEdit = document.getElementById("modal-edit");
const inputEditModal = document.getElementById("input-edit-modal");
const btnBatalEdit = document.getElementById("btn-batal-edit");
const btnSimpanEdit = document.getElementById("btn-simpan-edit");

const modalAlert = document.getElementById("modal-alert");
const alertMessage = document.getElementById("alert-message");
const btnOkAlert = document.getElementById("btn-ok-alert");

let itemYangAkanDihapus = null;
let spanYangSedangDiedit = null;

// --- Fungsi Alert Custom ---
function showAlert(pesan) {
  alertMessage.innerText = pesan;
  modalAlert.classList.remove("hidden");
  btnOkAlert.focus();
}
btnOkAlert.addEventListener("click", () => modalAlert.classList.add("hidden"));

// --- Fitur Tema ---
btnTheme.addEventListener("click", function () {
  body.classList.toggle("light-mode");
  if (body.classList.contains("light-mode")) {
    btnTheme.innerText = "Dark Mode";
  } else {
    btnTheme.innerText = "Light Mode";
  }
});

// --- LOGIKA UTAMA ---
function tambahTugas() {
  const teks = inputTugas.value.trim();
  const tanggalValue = inputTanggal.value; // Ambil nilai tanggal

  if (teks === "") {
    showAlert("Tugas tidak boleh kosong!");
    return;
  }

  // Tentukan Tanggal yang akan ditampilkan
  let waktuTampil = "";
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (tanggalValue) {
    // Jika user memilih tanggal
    const dateObj = new Date(tanggalValue);
    waktuTampil = "Tenggat: " + dateObj.toLocaleString("id-ID", options);
  } else {
    // Jika kosong, pakai waktu sekarang (Default)
    const now = new Date();
    waktuTampil = "Dibuat: " + now.toLocaleString("id-ID", options);
  }

  // Buat Elemen
  const li = document.createElement("li");

  const divInfo = document.createElement("div");
  divInfo.classList.add("task-info");

  const spanTeks = document.createElement("span");
  spanTeks.classList.add("task-text");
  spanTeks.innerText = teks;

  const smallTanggal = document.createElement("small");
  smallTanggal.classList.add("task-date");
  smallTanggal.innerText = waktuTampil;

  // Beri warna khusus jika itu adalah tenggat waktu
  if (tanggalValue) {
    smallTanggal.style.color = "var(--accent)";
    smallTanggal.style.fontWeight = "bold";
  }

  divInfo.appendChild(spanTeks);
  divInfo.appendChild(smallTanggal);
  li.appendChild(divInfo);

  const divTombol = document.createElement("div");
  divTombol.classList.add("btn-group");

  const btnStatus = document.createElement("button");
  btnStatus.innerText = "Selesai";
  btnStatus.classList.add("btn-action", "btn-check");

  const btnEdit = document.createElement("button");
  btnEdit.innerText = "Edit";
  btnEdit.classList.add("btn-action", "btn-edit");

  const btnHapus = document.createElement("button");
  btnHapus.innerText = "Hapus";
  btnHapus.classList.add("btn-action", "btn-delete");

  // Logic Buttons
  btnStatus.addEventListener("click", function () {
    if (btnStatus.innerText === "Selesai") {
      listSelesai.appendChild(li);
      li.classList.add("selesai");
      btnStatus.innerText = "Batal";
      btnStatus.classList.remove("btn-check");
      btnStatus.classList.add("btn-undo");
    } else {
      listBelum.appendChild(li);
      li.classList.remove("selesai");
      btnStatus.innerText = "Selesai";
      btnStatus.classList.remove("btn-undo");
      btnStatus.classList.add("btn-check");
    }
  });

  btnEdit.addEventListener("click", function () {
    spanYangSedangDiedit = spanTeks;
    inputEditModal.value = spanTeks.innerText;
    modalEdit.classList.remove("hidden");
    inputEditModal.focus();
  });

  btnHapus.addEventListener("click", function () {
    itemYangAkanDihapus = li;
    modalHapus.classList.remove("hidden");
  });

  divTombol.appendChild(btnStatus);
  divTombol.appendChild(btnEdit);
  divTombol.appendChild(btnHapus);
  li.appendChild(divTombol);
  listBelum.appendChild(li);

  // Reset Input
  inputTugas.value = "";
  inputTanggal.value = ""; // Reset tanggal juga
}

// --- Logic Modals ---
function tutupModalEdit() {
  modalEdit.classList.add("hidden");
  spanYangSedangDiedit = null;
}
btnBatalEdit.addEventListener("click", tutupModalEdit);

btnSimpanEdit.addEventListener("click", function () {
  const teksBaru = inputEditModal.value.trim();
  if (teksBaru === "") {
    showAlert("Tugas tidak boleh kosong!");
    return;
  }
  if (spanYangSedangDiedit) spanYangSedangDiedit.innerText = teksBaru;
  tutupModalEdit();
});
inputEditModal.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnSimpanEdit.click();
});

function tutupModalHapus() {
  modalHapus.classList.add("hidden");
  itemYangAkanDihapus = null;
}
btnBatalHapus.addEventListener("click", tutupModalHapus);
btnConfirmHapus.addEventListener("click", function () {
  if (itemYangAkanDihapus) {
    itemYangAkanDihapus.remove();
    tutupModalHapus();
  }
});

window.addEventListener("click", (e) => {
  if (e.target === modalHapus) tutupModalHapus();
  if (e.target === modalEdit) tutupModalEdit();
  if (e.target === modalAlert) modalAlert.classList.add("hidden");
});

btnTambah.addEventListener("click", tambahTugas);
inputTugas.addEventListener("keypress", (e) => {
  if (e.key === "Enter") tambahTugas();
});
