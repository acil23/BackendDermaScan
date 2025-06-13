import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { supabase } from "../connect/supabase.js";

export default [
  {
    method: "POST",
    path: "/predict",
    options: {
      payload: {
        output: "file",
        parse: true,
        multipart: true,
        allow: "multipart/form-data",
        maxBytes: 5 * 1024 * 1024,
      },
    },
    handler: async (request, h) => {
      try {
        const file = request.payload.image;

        console.log("=== File Metadata ===");
        console.log("Filename:", file?.filename);
        console.log("Path:", file?.path);
        console.log("Mimetype:", file?.headers?.["content-type"]);
        console.log("Size:", file?.bytes);

        if (!file || !file.path) {
          return h.response({ error: "No file received" }).code(400);
        }

        const form = new FormData();
        form.append("image", fs.createReadStream(file.path), file.filename);

        console.log("Sending to ML API...");

        const response = await axios.post(
          `https://api-model-v1.onrender.com/predict`,
          form,
          {
            headers: form.getHeaders(),
            timeout: 15000,
          }
        );

        console.log("ML API response:", response.data);

        const { prediction } = response.data;

        const cleanedPrediction = prediction.trim();

        const { data, error } = await supabase
          .from("disease_data")
          .select("explanation, treatment")
          .eq("name", prediction.trim())
          .maybeSingle();

        console.log("Hasil query:", data);

        if (!data || data.length === 0) {
          return h
            .response({ error: `No explanation found for "${prediction}"` })
            .code(404);
        }

        const diseaseData = data[0];

        return h
          .response({
            prediction,
            explanation: diseaseData.explanation,
            treatment: diseaseData.treatment,
          })
          .code(200);
      } catch (err) {
        console.error("[PREDICT ERROR]", err.message);
        return h.response({ error: "Prediction failed" }).code(500);
      }
    },
  },
];
