// --- SELEKSI ELEMEN ---
const body = document.body;
const btnTheme = document.getElementById("btn-theme");

// FORM UTAMA
const formTugas = document.getElementById("form-tugas");
const inputTugas = document.getElementById("input-tugas");
const inputTanggal = document.getElementById("input-tanggal");
const inputJam = document.getElementById("input-jam");
const msgError = document.getElementById("msg-error"); // Pesan Error

const listBelum = document.getElementById("list-belum");
const listSelesai = document.getElementById("list-selesai");
const judulBelum = document.getElementById("judul-belum");
const judulSelesai = document.getElementById("judul-selesai");

// MODAL & FORM EDIT
const modalEdit = document.getElementById("modal-edit");
const formEdit = document.getElementById("form-edit");
const inputEditModal = document.getElementById("input-edit-modal");
const inputEditTanggal = document.getElementById("input-edit-tanggal");
const inputEditJam = document.getElementById("input-edit-jam");
const btnBatalEdit = document.getElementById("btn-batal-edit");

// MODAL HAPUS
const modalHapus = document.getElementById("modal-hapus");
const btnBatalHapus = document.getElementById("btn-batal-hapus");
const btnConfirmHapus = document.getElementById("btn-confirm-hapus");

// VARIABEL GLOBAL
let itemYangAkanDihapus = null;
let liYangSedangDiedit = null;

// ==========================================
// 1. MANAJEMEN WARNA INPUT DATE/TIME
// ==========================================
function updateInputColor(input) {
  if (input.value) {
    input.classList.add("has-value");
  } else {
    input.classList.remove("has-value");
  }
}

const inputsDateTime = [inputTanggal, inputJam, inputEditTanggal, inputEditJam];
inputsDateTime.forEach((input) => {
  input.addEventListener("change", () => updateInputColor(input));
  input.addEventListener("blur", () => updateInputColor(input));
});

// ==========================================
// 2. FUNGSI ERROR & VALIDASI
// ==========================================
function tampilkanError(pesan) {
  msgError.innerText = pesan;
  msgError.classList.remove("hidden");
  inputTugas.classList.add("input-error");
}

function hapusError() {
  msgError.classList.add("hidden");
  inputTugas.classList.remove("input-error");
}

// Hapus error saat user mulai mengetik
inputTugas.addEventListener("input", hapusError);

// Cek Duplikat di List Belum Selesai (Case Insensitive)
function cekDuplikat(text) {
  const listItems = listBelum.querySelectorAll("li");
  for (let li of listItems) {
    if (li.dataset.text.toLowerCase() === text.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// ==========================================
// 3. FUNGSI BANTUAN
// ==========================================
function updateJudulVisibility() {
  if (listBelum.children.length === 0) judulBelum.classList.add("hidden");
  else judulBelum.classList.remove("hidden");

  if (listSelesai.children.length === 0) judulSelesai.classList.add("hidden");
  else judulSelesai.classList.remove("hidden");
}

function formatTenggat(tgl, jam) {
  if (!tgl) return { text: "Tanpa Tenggat", isSet: false };
  const dateOptions = { day: "numeric", month: "short", year: "numeric" };
  const dateObj = new Date(tgl);
  const tglStr = dateObj.toLocaleDateString("id-ID", dateOptions);

  if (jam) return { text: `Tenggat: ${tglStr} - Pukul ${jam}`, isSet: true };
  return { text: `Tenggat: ${tglStr}`, isSet: true };
}

// --- FITUR TEMA ---
btnTheme.addEventListener("click", function () {
  body.classList.toggle("light-mode");
  btnTheme.innerText = body.classList.contains("light-mode")
    ? "Dark Mode"
    : "Light Mode";
});

// ==========================================
// 4. LOGIKA TAMBAH TUGAS (FORM SUBMIT)
// ==========================================
formTugas.addEventListener("submit", function (e) {
  e.preventDefault(); // Matikan submit bawaan

  const teks = inputTugas.value.trim();
  const tglValue = inputTanggal.value;
  const jamValue = inputJam.value;

  // 1. Cek Required (Manual)
  if (teks === "") {
    tampilkanError("Tugas wajib diisi!");
    return;
  }

  // 2. Cek Duplikat
  if (cekDuplikat(teks)) {
    tampilkanError("Tugas ini sudah ada di daftar!");
    return;
  }

  // Jika lolos validasi
  hapusError();

  const li = document.createElement("li");

  li.dataset.text = teks;
  li.dataset.date = tglValue;
  li.dataset.time = jamValue;

  const infoTenggat = formatTenggat(tglValue, jamValue);

  const divInfo = document.createElement("div");
  divInfo.classList.add("task-info");

  const spanTeks = document.createElement("span");
  spanTeks.classList.add("task-text");
  spanTeks.innerText = teks;

  const smallTanggal = document.createElement("small");
  smallTanggal.classList.add("task-date");
  smallTanggal.innerText = infoTenggat.text;

  if (infoTenggat.isSet) {
    smallTanggal.style.color = "var(--accent)";
    smallTanggal.style.fontWeight = "bold";
  } else {
    smallTanggal.style.color = "var(--text-secondary)";
    smallTanggal.style.fontStyle = "italic";
  }

  divInfo.appendChild(spanTeks);
  divInfo.appendChild(smallTanggal);
  li.appendChild(divInfo);

  const divTombol = document.createElement("div");
  divTombol.classList.add("btn-group");

  const btnStatus = document.createElement("button");
  btnStatus.innerText = "Selesai";
  btnStatus.classList.add("btn-action", "btn-check");
  btnStatus.type = "button";

  const btnEdit = document.createElement("button");
  btnEdit.innerText = "Edit";
  btnEdit.classList.add("btn-action", "btn-edit");
  btnEdit.type = "button";

  const btnHapus = document.createElement("button");
  btnHapus.innerText = "Hapus";
  btnHapus.classList.add("btn-action", "btn-delete");
  btnHapus.type = "button";

  // Events
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
    updateJudulVisibility();
  });

  btnEdit.addEventListener("click", function () {
    liYangSedangDiedit = li;

    inputEditModal.value = li.dataset.text;
    inputEditTanggal.value = li.dataset.date;
    inputEditJam.value = li.dataset.time;

    updateInputColor(inputEditTanggal);
    updateInputColor(inputEditJam);

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

  // Reset Form & Colors
  formTugas.reset();
  inputsDateTime.forEach((input) => input.classList.remove("has-value"));
  updateJudulVisibility();
});

// ==========================================
// 5. LOGIKA SIMPAN EDIT
// ==========================================
formEdit.addEventListener("submit", function (e) {
  e.preventDefault();

  const teksBaru = inputEditModal.value.trim();
  const tglBaru = inputEditTanggal.value;
  const jamBaru = inputEditJam.value;

  // Untuk edit, kita biarkan saja validasi required browser (tidak perlu duplicate check disini, opsional)

  if (liYangSedangDiedit) {
    liYangSedangDiedit.dataset.text = teksBaru;
    liYangSedangDiedit.dataset.date = tglBaru;
    liYangSedangDiedit.dataset.time = jamBaru;

    const spanTeks = liYangSedangDiedit.querySelector(".task-text");
    const smallTanggal = liYangSedangDiedit.querySelector(".task-date");

    spanTeks.innerText = teksBaru;

    const infoTenggat = formatTenggat(tglBaru, jamBaru);
    smallTanggal.innerText = infoTenggat.text;

    if (infoTenggat.isSet) {
      smallTanggal.style.color = "var(--accent)";
      smallTanggal.style.fontWeight = "bold";
      smallTanggal.style.fontStyle = "normal";
    } else {
      smallTanggal.style.color = "var(--text-secondary)";
      smallTanggal.style.fontStyle = "italic";
      smallTanggal.style.fontWeight = "normal";
    }
  }
  tutupModalEdit();
});

// --- Modal Helper Functions ---
function tutupModalEdit() {
  modalEdit.classList.add("hidden");
  liYangSedangDiedit = null;
}
btnBatalEdit.addEventListener("click", tutupModalEdit);

function tutupModalHapus() {
  modalHapus.classList.add("hidden");
  itemYangAkanDihapus = null;
}
btnBatalHapus.addEventListener("click", tutupModalHapus);

btnConfirmHapus.addEventListener("click", function () {
  if (itemYangAkanDihapus) {
    itemYangAkanDihapus.remove();
    tutupModalHapus();
    updateJudulVisibility();
  }
});

window.addEventListener("click", (e) => {
  if (e.target === modalHapus) tutupModalHapus();
  if (e.target === modalEdit) tutupModalEdit();
});

// Init
updateJudulVisibility();
