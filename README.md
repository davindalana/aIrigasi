# AmbatuGrow

![AmbatuGrow Logo](link_logo_anda_disini)

AmbatuGrow adalah aplikasi web inovatif yang memanfaatkan kekuatan *machine learning* (ML) untuk memberikan prediksi cerdas mengenai kebutuhan penyiraman tanaman. Dengan menganalisis data kondisi tanah secara *real-time* seperti kelembaban, suhu, dan pH, AmbatuGrow memberdayakan petani dan penghobi tanaman untuk merawat tanaman mereka secara otomatis dan efisien, tanpa memerlukan perangkat keras tambahan yang rumit.

## ✨ Fitur Utama

* **💧 Prediksi Penyiraman Cerdas:** Algoritma *machine learning* yang canggih menganalisis data kelembaban tanah untuk menentukan secara akurat apakah tanaman memerlukan penyiraman.
* **📊 Dashboard Interaktif:** Visualisasikan status penting tanaman Anda, termasuk kelembaban tanah, suhu, pH, dan prediksi penyiraman melalui grafik yang intuitif dan mudah dipahami.
* **🕰️ Data Historis Komprehensif:** Akses dan analisis data historis kelembaban tanah dan hasil prediksi untuk mendapatkan wawasan yang lebih mendalam tentang tren dan kebutuhan tanaman Anda dari waktu ke waktu.
* **🔔 Notifikasi Cerdas:** Terima pemberitahuan tepat waktu ketika tanah tanaman Anda mencapai ambang batas penyiraman yang ditentukan oleh model, memastikan tanaman Anda selalu mendapatkan perawatan yang optimal.

## 🛠️ Teknologi yang Digunakan

**🧠 Machine Learning:**

* **IDE & Tools:** Jupyter Notebook / Google Colab
* **Libraries:** Scikit-learn, Pandas, NumPy, Matplotlib & Seaborn

**🌐 Front End:**

* **Bahasa:** HTML, CSS, JavaScript
* **Framework:** Tailwind CSS, React.js
* **Text Editor & Tools:** Visual Studio Code, Figma

**⚙️ Back End:**

* **Bahasa:** JavaScript
* **Framework:** Express JS
* **Database:** MongoDB
* **Text Editor:** Visual Studio Code

**📡 Alat:** Sensor IoT, ESP32 (opsional untuk integrasi data otomatis di masa depan)

## ⚙️ Instalasi

Ikuti langkah-langkah di bawah ini untuk menyiapkan AmbatuGrow di lingkungan lokal Anda:

1.  **Kloning Repositori:**
    ```bash
    git clone [https://github.com/davindalana/AmbatuGrow](https://github.com/davindalana/AmbatuGrow)
    cd AmbatuGrow
    ```

2.  **Instalasi Dependensi:**

    * **Frontend:**
        ```bash
        cd frontend
        npm install
        ```

    * **Backend:**
        ```bash
        cd backend
        npm install
        ```

    * **Machine Learning:**
        Pastikan Anda telah menginstal Python 3.x dan kemudian instal dependensi yang diperlukan:
        ```bash
        pip install -r requirements.txt
        ```

## 🚀 Menjalankan Proyek

1.  **Menjalankan Frontend:**
    ```bash
    cd frontend
    npm start
    ```
    Aplikasi frontend akan berjalan di `http://localhost:3000`.

2.  **Menjalankan Backend:**
    ```bash
    cd backend
    npm start
    ```
    Server backend akan berjalan di `http://localhost:5000`.

3.  **Menjalankan Model AI:**
    Model AI akan dijalankan oleh server backend saat data baru diterima. Untuk melatih model dengan dataset awal atau memperbarui model, jalankan:
    ```bash
    cd ml
    python train_model.py
    ```
    Ini akan melatih model *machine learning* menggunakan dataset yang tersedia dan menyimpan model yang telah dilatih untuk digunakan oleh backend.

## 🧑‍🌾 Penggunaan

1.  **Input Data Manual:** Saat ini, Anda dapat memasukkan data kondisi tanah seperti kelembaban, suhu, dan pH secara manual melalui antarmuka pengguna aplikasi web.
2.  **Analisis dan Prediksi:** Model *machine learning* di backend akan menganalisis data yang Anda masukkan dan memberikan prediksi apakah tanaman Anda perlu disiram.
3.  **Visualisasi Data:** Pantau tren kelembaban tanah dan hasil prediksi penyiraman secara visual melalui *dashboard* yang interaktif.
4.  **Notifikasi (Implementasi Mendatang):** Di masa mendatang, Anda akan menerima notifikasi otomatis berdasarkan analisis model ketika tanaman Anda membutuhkan penyiraman.

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

Terima kasih telah menggunakan **AmbatuGrow**! Kami berharap aplikasi ini dapat membantu Anda merawat tanaman dengan lebih cerdas dan efisien. Selamat berkebun! 🪴
