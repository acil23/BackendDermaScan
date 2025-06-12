import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { supabase } from '../connect/supabase.js';

const API_BASE_URL = "https://api-model-v1.onrender.com/";

export default [
  {
    method: 'POST',
    path: '/predict',
    options: {
      payload: {
        output: 'file',         // Supaya bisa akses file path
        parse: true,
        multipart: true,
        allow: 'multipart/form-data',
        maxBytes: 5 * 1024 * 1024, // Max 5 MB
      },
    },
    handler: async (request, h) => {
      try {
        const file = request.payload.image; // Key harus 'image'

        // Buat form-data untuk dikirim ke API model ML
        const form = new FormData();
        form.append('image', fs.createReadStream(file.path), file.filename);

        // Kirim file ke API model ML
        const response = await axios.post(
          `${API_BASE_URL}/predict`,
          form,
          {
            headers: form.getHeaders(),
          }
        );

        const { prediction } = response.data;

        // Ambil data dari tabel dataDisease berdasarkan prediksi
        const { data: diseaseData, error } = await supabase
          .from('dataDisease')
          .select('explanation, treatment')
          .eq('name', prediction)
          .single();

        if (error) {
          console.error('Error fetching disease data:', error.message);
          return h.response({ error: 'Failed to fetch disease data' }).code(500);
        }

        // Gabungkan hasil prediksi dengan data dari Supabase
        const result = {
          prediction,
          explanation: diseaseData.explanation,
          treatment: diseaseData.treatment,
        };

        return h.response(result).code(200);
      } catch (err) {
        console.error('[PREDICT ERROR]', err.message);
        return h.response({ error: 'Prediction failed' }).code(500);
      }
    },
  },
];

