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

        const { data: diseaseData, error } = await supabase
          .from("dataDisease")
          .select("explanation, treatment")
          .eq("name", prediction)
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error.message);
          return h.response({ error: "Failed to fetch explanation" }).code(500);
        }

        if (!diseaseData) {
          return h
            .response({ error: `No explanation found for "${prediction}"` })
            .code(404);
        }

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
