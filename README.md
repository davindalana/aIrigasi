# AIrigasi

![AIrigasi Logo]([link_logo_anda_disini](https://drive.google.com/file/d/1Q41hN30iu3nNm0yeuQYBBsKLnoneEiva/view?usp=sharing))

AIrigasi adalah aplikasi web inovatif yang memanfaatkan kekuatan *machine learning* (ML) untuk memberikan prediksi cerdas mengenai kebutuhan penyiraman tanaman. Dengan menganalisis data kondisi tanah secara *real-time* seperti kelembaban, suhu, dan pH, AIrigasi memberdayakan petani dan penghobi tanaman untuk merawat tanaman mereka secara otomatis dan efisien, tanpa memerlukan perangkat keras tambahan yang rumit.

## ⚙️ Alur Data

Alur data pada sistem AIrigasi, baik secara *realtime* maupun berdasarkan permintaan, adalah sebagai berikut:

1.  **Pengiriman Data Sensor:**
    * **Sensor** (baik fisik melalui IoT di masa depan, maupun input manual saat ini) mengirimkan data kondisi tanah (misalnya, kelembaban, suhu, pH) ke **MongoDB**.

2.  **Permintaan Data & Prediksi (Frontend atau Internal Backend):**
    * **Frontend (React.js):** Aplikasi frontend melakukan permintaan ke backend **Node.js/Hapi** melalui RESTful API untuk mendapatkan data sensor terbaru beserta prediksinya.
    * **Internal Backend (Node.js/Hapi):** Backend secara internal (misalnya, saat menerima data baru dari sensor melalui endpoint khusus, atau berdasarkan *timer* untuk pemrosesan berkala) memutuskan untuk melakukan prediksi.

3.  **Pengambilan Data dari MongoDB (Backend Node.js/Hapi):**
    * Backend **Node.js/Hapi** melakukan *query* ke **MongoDB** (menggunakan MongoDB Node.js Driver atau Mongoose) untuk mengambil data sensor yang diperlukan untuk prediksi. Ini bisa berupa:
        * Data sensor terbaru.
        * Beberapa data sensor terakhir (untuk analisis tren jangka pendek).
        * Data sensor berdasarkan kriteria tertentu.

4.  **Pengiriman Data untuk Prediksi (Backend Node.js/Hapi):**
    * Backend **Node.js/Hapi** mempersiapkan data yang diambil dari MongoDB. Data ini kemudian dikirimkan ke sistem atau skrip ML untuk prediksi. Ini bisa dilakukan melalui pemanggilan *child process* ke skrip Python (yang memuat model `.joblib`), melalui antrian pesan, atau dengan memanggil *endpoint* layanan ML terpisah jika model di-deploy sebagai layanan mikro.

5.  **Pemrosesan Prediksi ML (Layanan/Skrip Prediksi):**
    * **Model *Machine Learning*** (misalnya, skrip Python yang memuat `model.joblib`, atau layanan ML) menerima data dan melakukan prediksi kebutuhan penyiraman.

6.  **Pengiriman Hasil Prediksi ke Backend (Layanan/Skrip Prediksi ke Node.js/Hapi):**
    * Hasil prediksi dikirimkan kembali ke backend **Node.js/Hapi**.

7.  **Penyimpanan Hasil Prediksi (Backend Node.js/Hapi):**
    * Backend **Node.js/Hapi** menyimpan hasil prediksi ke **MongoDB**, menghubungkannya dengan data sensor yang relevan (misalnya, menggunakan *timestamp* atau ID data sensor).

8.  **Penyajian Data ke Frontend (Backend Node.js/Hapi):**
    * Backend **Node.js/Hapi** (saat menerima permintaan dari frontend) mengambil data sensor terbaru dan hasil prediksinya dari **MongoDB** dan mengirimkannya sebagai respons RESTful API ke aplikasi **Frontend (React.js)** untuk ditampilkan pada dashboard pengguna.

## ✨ Fitur Utama

* **💧 Prediksi Penyiraman Cerdas:** Algoritma *machine learning* yang canggih menganalisis data kelembaban tanah, suhu, dan pH untuk menentukan secara akurat apakah tanaman memerlukan penyiraman.
* **📊 Dashboard Interaktif:** Visualisasikan status penting tanaman Anda, termasuk kelembaban tanah, suhu, pH, dan prediksi penyiraman melalui grafik yang intuitif dan mudah dipahami.
* **🕰️ Data Historis Komprehensif:** Akses dan analisis data historis kondisi tanah dan hasil prediksi untuk mendapatkan wawasan yang lebih mendalam tentang tren dan kebutuhan tanaman Anda dari waktu ke waktu.
* **🔔 Notifikasi Cerdas (Implementasi Mendatang):** Terima pemberitahuan tepat waktu ketika tanah tanaman Anda mencapai ambang batas penyiraman yang ditentukan oleh model, memastikan tanaman Anda selalu mendapatkan perawatan yang optimal.
* **⚙️ Input Data Manual:** Fasilitas untuk memasukkan data kondisi tanah secara manual melalui antarmuka pengguna.

## 🛠️ Teknologi yang Digunakan

**🧠 Machine Learning:**

* **IDE & Tools:** Jupyter Notebook / Google Colab
* **Libraries:** Scikit-learn, Pandas, NumPy, Matplotlib & Seaborn, Joblib
* **Bahasa (Pelatihan Model):** Python

**🌐 Front End:**

* **Bahasa:** HTML, CSS, JavaScript
* **Framework:** Tailwind CSS, React.js
* **Manajemen Paket:** npm
* **Text Editor & Tools:** Visual Studio Code, Figma

**⚙️ Back End:**

* **Bahasa/Runtime:** Node.js (JavaScript/TypeScript)
* **Framework:** Hapi
* **API Style:** RESTful API
* **Database:** MongoDB
* **Driver MongoDB:** MongoDB Node.js Driver (misalnya, `mongodb`) atau Mongoose
* **Manajemen Paket:** npm (atau yarn)
* **Text Editor:** Visual Studio Code

**📡 Alat (Opsional):** Sensor IoT, ESP32 (untuk integrasi data otomatis di masa depan)

## ⚙️ Instalasi

Ikuti langkah-langkah di bawah ini untuk menyiapkan AIrigasi di lingkungan pengembangan lokal Anda:

1.  **Prasyarat:**
    * Pastikan Anda telah menginstal **Node.js** dan **npm** (atau yarn) (untuk frontend dan backend).
    * Pastikan Anda telah menginstal **Python 3.8+** dan **pip** (untuk melatih model ML).
    * Pastikan Anda memiliki instance **MongoDB** yang berjalan.

2.  **Kloning Repositori:**
    ```bash
    git clone [https://github.com/davindalana/AIrigasi](https://github.com/davindalana/AIrigasi)
    cd AIrigasi
    ```

3.  **Instalasi Dependensi:**

    * **Frontend:**
        ```bash
        cd client
        npm install
        ```

    * **Backend (Node.js/Hapi):**
        ```bash
        cd server # Sesuaikan dengan nama direktori backend Anda
        npm install
        ```
        
    * **Machine Learning (untuk Pelatihan Model):**
        ```bash
        cd ml
        pip install -r requirements.txt 
        ```
        Pastikan file `ml/requirements.txt` berisi library ML yang dibutuhkan (misalnya, `scikit-learn`, `pandas`, `numpy`, `joblib`).

## 🚀 Menjalankan Proyek

1.  **Menjalankan Backend (Node.js/Hapi):**
    ```bash
    cd server # Sesuaikan dengan nama direktori backend Anda
    npm start 
    # atau 'node server.js' (atau file entri utama Anda)
    ```
    Server backend akan berjalan (misalnya di `http://localhost:8000` atau port lain yang Anda konfigurasikan di Hapi). Pastikan Anda memiliki file server utama (misalnya, `server.js` atau `index.js`) di direktori `server` yang menginisialisasi aplikasi Hapi.

2.  **Menjalankan Frontend:**
    ```bash
    cd client
    npm start
    ```
    Aplikasi frontend akan berjalan di `http://localhost:3000` secara default.

3.  **Menjalankan Model AI (Pelatihan Ulang - Opsional):**
    Model AI akan dipanggil atau layanannya digunakan oleh backend (Node.js/Hapi) saat data baru diterima. Proses pelatihan (`train_model.py`) tetap menghasilkan file model (misalnya, `model.joblib`) yang kemudian digunakan oleh mekanisme prediksi yang diatur oleh backend Node.js (misalnya, melalui *child process* Python, API ke layanan ML terpisah, atau menggunakan model yang dikonversi ke format yang kompatibel dengan Node.js seperti ONNX jika Anda mengimplementasikannya).

    * Untuk melatih model (opsional):
        ```bash
        cd ml
        python train_model.py
        ```
        Pastikan script `train_model.py` Anda membaca data, melatih model, dan menyimpan model yang telah dilatih (misalnya, sebagai `model.joblib` di direktori `ml` atau direktori lain yang bisa diakses).

## 🧑‍🌾 Penggunaan

1.  **Akses Aplikasi Web:** Buka `http://localhost:3000` (atau port frontend Anda) di browser Anda untuk mengakses antarmuka pengguna AIrigasi.
2.  **Input Data Manual:** Navigasi ke bagian input data dan masukkan nilai kelembaban tanah, suhu, dan pH tanaman Anda.
3.  **Analisis dan Prediksi Realtime:** Setelah Anda mengirimkan data, backend Node.js/Hapi akan menerima data, memicu proses prediksi menggunakan model *machine learning*, menyimpan hasilnya, dan (saat ini) menampilkan hasilnya di antarmuka pengguna melalui API.
4.  **Tampilan Data Historis:** Navigasi ke bagian data historis untuk melihat grafik dan analisis data kondisi tanah dan prediksi penyiraman dari waktu ke waktu. Data historis akan mencerminkan data yang telah dianalisis dan disimpan.

## 🧑‍🤝‍🧑 Tim Pengembang

**ID Tim:** CC25-CF032
**Anggota Tim:**
**(ML)** MC006D5Y1351 - Ananta Boemi Adji - Universitas Brawijaya
**(ML)** MC006D5Y1193 - Rakha Apta Pradhana D R - Universitas Brawijaya
**(ML)** MC006D5Y2187 - Daffa Aprilian Herdikaputra - Universitas Brawijaya
**(FEBE)** FC006D5Y1473 - Davin Dalana Fidelio Fredra - Universitas Brawijaya
**(FEBE)** FC006D5Y1244 - Qyan Rommy Mario - Universitas Brawijaya

## 📧 Kontak

Jika Anda memiliki pertanyaan, saran, atau umpan balik, jangan ragu untuk menghubungi kami melalui email: [email@example.com](mailto:email@example.com).
Terima kasih telah menggunakan **AIrigasi**! Kami berharap aplikasi ini dapat membantu Anda merawat tanaman dengan lebih cerdas dan efisien. Selamat berkebun! 🪴
