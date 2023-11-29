# Gunakan image resmi Node.js sebagai base image
FROM node:14

# Setel direktori kerja di dalam kontainer
WORKDIR /src

# Salin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh kode aplikasi ke direktori kerja
COPY . .

# Ungkapkan port tempat aplikasi akan berjalan (sesuaikan jika perlu)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi (sesuaikan jika perlu)
CMD ["node", "src/app.js"]
