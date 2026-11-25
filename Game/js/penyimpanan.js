/**
 * File: js/penyimpanan.js
 * Deskripsi: Mengelola penyimpanan nama pemain, progres wilayah, dan skor
 * menggunakan localStorage browser.
 */

const KUNCI_PENYIMPANAN = "misi_pulau_logika_data";
const KUNCI_NOTIFIKASI_RESET = "mpl_notifikasi_reset";

const PETA_MODE_KESULITAN = {
    easy: {
        kode: "easy",
        label: "Easy",
        judul: "Easy (Santai)",
        deskripsiSingkat: "Penalti salah ringan (-5), skor minimal terjaga, tanpa penalti langkah & waktu.",
        hutan: {
            penaltiSalah: 5,
            skorMinimal: 20,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        },
        desa: {
            penaltiSalah: 5,
            skorMinimalSoal: 5,
            gagalLangsungNol: false,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        },
        gunung: {
            penaltiSalah: 5,
            skorMinimalSoal: 5,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        },
        kastil: {
            penaltiGagal: 5,
            skorMinimalSoal: 5,
            pakaiPenaltiLangkah: false,
            toleransiLangkah: 99,
            penaltiPerLangkahBerlebih: 0,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        }
    },
    normal: {
        kode: "normal",
        label: "Normal",
        judul: "Normal (Seimbang)",
        deskripsiSingkat: "Penalti ketat (-8 s/d -12), bisa 0 poin jika sering salah, dan Kastil menghitung efisiensi langkah.",
        hutan: {
            penaltiSalah: 10,
            skorMinimal: 0,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        },
        desa: {
            penaltiSalah: 12,
            skorMinimalSoal: 0,
            gagalLangsungNol: false,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        },
        gunung: {
            penaltiSalah: 8,
            skorMinimalSoal: 0,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        },
        kastil: {
            penaltiGagal: 8,
            skorMinimalSoal: 0,
            pakaiPenaltiLangkah: true,
            toleransiLangkah: 2,
            penaltiPerLangkahBerlebih: 2,
            batasWaktuDetik: 0,
            intervalPenaltiWaktu: 0,
            penaltiPerIntervalWaktu: 0
        }
    },
    hard: {
        kode: "hard",
        label: "Hard",
        judul: "Hard (Master Logika)",
        deskripsiSingkat: "Penalti berat (Desa salah 1x = 0 poin), Kastil wajib jalur terpendek, plus penalti waktu!",
        hutan: {
            penaltiSalah: 15,
            skorMinimal: 0,
            batasWaktuDetik: 45,
            intervalPenaltiWaktu: 3,
            penaltiPerIntervalWaktu: 1
        },
        desa: {
            penaltiSalah: 20,
            skorMinimalSoal: 0,
            gagalLangsungNol: true,
            batasWaktuDetik: 12,
            intervalPenaltiWaktu: 2,
            penaltiPerIntervalWaktu: 1
        },
        gunung: {
            penaltiSalah: 10,
            skorMinimalSoal: 0,
            batasWaktuDetik: 15,
            intervalPenaltiWaktu: 2,
            penaltiPerIntervalWaktu: 1
        },
        kastil: {
            penaltiGagal: 12,
            skorMinimalSoal: 0,
            pakaiPenaltiLangkah: true,
            toleransiLangkah: 0,
            penaltiPerLangkahBerlebih: 3,
            batasWaktuDetik: 20,
            intervalPenaltiWaktu: 3,
            penaltiPerIntervalWaktu: 1
        }
    }
};

/**
 * Membuat struktur data awal permainan.
 */
function buatDataAwal() {
    return {
        namaPemain: "",
        modeKesulitan: "normal",
        progres: {
            hutan: false,
            desa: false,
            gunung: false,
            kastil: false
        },
        skor: {
            dekomposisi: 0,
            pengenalanPola: 0,
            abstraksi: 0,
            algoritma: 0
        }
    };
}

/**
 * Mengambil seluruh data permainan dari localStorage.
 */
function ambilDataPermainan() {
    const dataTersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (!dataTersimpan) {
        return buatDataAwal();
    }

    try {
        const dataObjek = JSON.parse(dataTersimpan);
        const dataDefault = buatDataAwal();
        const modeValid = Object.prototype.hasOwnProperty.call(
            PETA_MODE_KESULITAN,
            dataObjek.modeKesulitan
        )
            ? dataObjek.modeKesulitan
            : dataDefault.modeKesulitan;

        return {
            namaPemain: dataObjek.namaPemain || dataDefault.namaPemain,
            modeKesulitan: modeValid,
            progres: Object.assign({}, dataDefault.progres, dataObjek.progres || {}),
            skor: Object.assign({}, dataDefault.skor, dataObjek.skor || {})
        };
    } catch (kesalahan) {
        console.warn("Gagal membaca data penyimpanan, menggunakan data awal.", kesalahan);
        return buatDataAwal();
    }
}

/**
 * Menyimpan seluruh objek data permainan ke localStorage.
 */
function simpanDataPermainan(data) {
    try {
        const teksJson = JSON.stringify(data);
        localStorage.setItem(KUNCI_PENYIMPANAN, teksJson);
    } catch (kesalahan) {
        console.error("Gagal menyimpan data ke localStorage:", kesalahan);
    }
}

/**
 * Menyimpan nama pemain ke localStorage.
 */
function simpanNamaPemain(nama) {
    const data = ambilDataPermainan();
    data.namaPemain = nama.trim();
    simpanDataPermainan(data);
}

/**
 * Mengambil nama pemain dari localStorage.
 */
function ambilNamaPemain() {
    const data = ambilDataPermainan();
    return data.namaPemain || "Penjelajah";
}

/**
 * Menyimpan mode kesulitan ('easy', 'normal', 'hard') ke localStorage.
 */
function simpanModeKesulitan(mode) {
    const modeAman = Object.prototype.hasOwnProperty.call(PETA_MODE_KESULITAN, mode)
        ? mode
        : "normal";
    const data = ambilDataPermainan();
    data.modeKesulitan = modeAman;
    simpanDataPermainan(data);
}

/**
 * Mengambil kode mode kesulitan yang aktif saat ini.
 */
function ambilModeKesulitan() {
    const data = ambilDataPermainan();
    return Object.prototype.hasOwnProperty.call(PETA_MODE_KESULITAN, data.modeKesulitan)
        ? data.modeKesulitan
        : "normal";
}

/**
 * Mengambil objek konfigurasi lengkap aturan skoring untuk mode tertentu atau mode aktif.
 */
function ambilAturanMode(modeOpsional) {
    const kode = modeOpsional && Object.prototype.hasOwnProperty.call(PETA_MODE_KESULITAN, modeOpsional)
        ? modeOpsional
        : ambilModeKesulitan();
    return PETA_MODE_KESULITAN[kode];
}

/**
 * Menghitung pengurangan poin berdasarkan kelebihan waktu dari target ideal tahap.
 */
function hitungPenaltiWaktu(detikAktif, aturanTahap) {
    if (
        !aturanTahap ||
        !aturanTahap.batasWaktuDetik ||
        aturanTahap.batasWaktuDetik <= 0 ||
        !aturanTahap.intervalPenaltiWaktu ||
        detikAktif <= aturanTahap.batasWaktuDetik
    ) {
        return 0;
    }
    const kelebihanDetik = detikAktif - aturanTahap.batasWaktuDetik;
    return (
        Math.ceil(kelebihanDetik / aturanTahap.intervalPenaltiWaktu) *
        (aturanTahap.penaltiPerIntervalWaktu || 1)
    );
}

/**
 * Menerapkan teks dan kelas warna badge mode ke elemen target.
 */
function terapkanBadgeMode(elemen, pakaiPrefix) {
    if (!elemen) {
        return;
    }
    const aturan = ambilAturanMode();
    elemen.textContent = pakaiPrefix ? "Mode: " + aturan.label : aturan.label;
    elemen.classList.remove("mode-easy", "mode-normal", "mode-hard");
    elemen.classList.add("mode-" + aturan.kode);
}

/**
 * Memperbarui tampilan timer misi pada status bar (khusus mode dengan target waktu).
 */
function perbaruiTampilanWaktuMisi(idContainerWaktu, idTeksWaktu, detikAktif, batasWaktuDetik) {
    const container = document.getElementById(idContainerWaktu);
    const teks = document.getElementById(idTeksWaktu);
    if (!container || !teks) {
        return;
    }
    if (!batasWaktuDetik || batasWaktuDetik <= 0) {
        container.classList.add("tersembunyi");
        return;
    }
    container.classList.remove("tersembunyi");
    teks.textContent = detikAktif + " / " + batasWaktuDetik + " dtk";
    teks.classList.toggle("waktu-terlewati", detikAktif > batasWaktuDetik);
}

/**
 * Menyimpan status selesai untuk suatu wilayah ('hutan', 'desa', 'gunung', 'kastil').
 */
function simpanProgres(namaWilayah, statusSelesai) {
    const data = ambilDataPermainan();
    if (Object.prototype.hasOwnProperty.call(data.progres, namaWilayah)) {
        data.progres[namaWilayah] = Boolean(statusSelesai);
        simpanDataPermainan(data);
    }
}

/**
 * Mengambil objek progres seluruh wilayah.
 */
function ambilProgres() {
    const data = ambilDataPermainan();
    return data.progres;
}

/**
 * Menyimpan skor untuk pilar tertentu
 * ('dekomposisi', 'pengenalanPola', 'abstraksi', 'algoritma').
 * Nilai skor disimpan dalam rentang 0 - 100.
 */
function simpanSkor(namaPilar, nilaiSkor) {
    const data = ambilDataPermainan();
    if (Object.prototype.hasOwnProperty.call(data.skor, namaPilar)) {
        const skorValid = Math.max(0, Math.min(100, Math.round(Number(nilaiSkor) || 0)));
        data.skor[namaPilar] = skorValid;
        simpanDataPermainan(data);
    }
}

/**
 * Mengambil objek skor seluruh pilar Computational Thinking.
 */
function ambilSkor() {
    const data = ambilDataPermainan();
    return data.skor;
}

/**
 * Menghitung rata-rata atau persentase total skor dari keempat pilar (0 - 100).
 */
function hitungTotalPersentaseSkor() {
    const skor = ambilSkor();
    const totalPerolehan =
        Number(skor.dekomposisi || 0) +
        Number(skor.pengenalanPola || 0) +
        Number(skor.abstraksi || 0) +
        Number(skor.algoritma || 0);
    const skorMaksimum = 400;
    return Math.round((totalPerolehan / skorMaksimum) * 100);
}

/**
 * Memeriksa apakah ada progres permainan yang sedang tersimpan di localStorage.
 */
function apakahAdaProgresTersimpan() {
    const dataMentah = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (!dataMentah) {
        return false;
    }
    const data = ambilDataPermainan();
    const adaNama = Boolean(data.namaPemain && data.namaPemain.trim() !== "");
    const adaWilayahSelesai = Boolean(
        data.progres.hutan ||
        data.progres.desa ||
        data.progres.gunung ||
        data.progres.kastil
    );
    const adaSkor =
        Number(data.skor.dekomposisi || 0) > 0 ||
        Number(data.skor.pengenalanPola || 0) > 0 ||
        Number(data.skor.abstraksi || 0) > 0 ||
        Number(data.skor.algoritma || 0) > 0;

    return adaNama || adaWilayahSelesai || adaSkor;
}

/**
 * Menghapus hanya data progres milik game dari localStorage
 * tanpa menghapus pengaturan suara atau data aplikasi lain.
 */
function resetPermainan() {
    localStorage.removeItem(KUNCI_PENYIMPANAN);
}

/**
 * Menandai bahwa progres baru saja direset agar halaman Home dapat menampilkan notifikasi.
 */
function tandaiNotifikasiReset() {
    sessionStorage.setItem(KUNCI_NOTIFIKASI_RESET, "true");
}

/**
 * Mengambil dan menghapus tanda notifikasi reset satu kali pakai.
 */
function ambilDanHapusNotifikasiReset() {
    const status = sessionStorage.getItem(KUNCI_NOTIFIKASI_RESET);
    if (status === "true") {
        sessionStorage.removeItem(KUNCI_NOTIFIKASI_RESET);
        return true;
    }
    return false;
}
