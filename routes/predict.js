import fs from 'fs';
import path from 'path';

export default [
  {
    method: 'POST',
    path: '/predict',
    handler: (request, h) => {
      try {
        // Baca isi file diagnosis
        const filePath = path.resolve('data/diseases-data.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Ambil 1 data secara acak
        const randomDiagnosis = data[Math.floor(Math.random() * data.length)];

        // Return sebagai respons
        return h.response(randomDiagnosis).code(200);
      } catch (err) {
        console.error('Error in /predict demo:', err);
        return h.response({ error: 'Prediction failed (demo)' }).code(500);
      }
    },
  }
];



// import axios from 'axios';
// import FormData from 'form-data';
// import fs from 'fs';

// export default [
//   {
//     method: 'POST',
//     path: '/predict',
//     options: {
//       payload: {
//         output: 'file',         // supaya bisa akses file path
//         parse: true,
//         multipart: true,
//         allow: 'multipart/form-data',
//         maxBytes: 5 * 1024 * 1024, // max 5 MB
//       },
//     },
//     handler: async (request, h) => {
//       try {
//         const file = request.payload.image; // key harus 'image'

//         const form = new FormData();
//         form.append('file', fs.createReadStream(file.path), file.filename);

//         const response = await axios.post(
//           'https://api-model-v1.onrender.com/predict',
//           form,
//           {
//             headers: form.getHeaders(),
//           }
//         );

//         return h.response(response.data).code(200);
//       } catch (err) {
//         console.error('[PREDICT ERROR]', err.message);
//         return h.response({ error: 'Prediction failed' }).code(500);
//       }
//     },
//   },
// ];

