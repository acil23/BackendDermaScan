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
      const file = request.payload.image;
      if (!file?.path) {
        console.error("File not received!");
        return h.response({ error: "Image file missing" }).code(400);
      }

      const form = new FormData();
      form.append("image", fs.createReadStream(file.path), file.filename);

      try {
        const response = await axios.post(
          "https://api-model-v1.onrender.com/predict",
          form,
          { headers: form.getHeaders() }
        );

        const { prediction } = response.data;
        const { data: diseaseData, error } = await supabase
          .from("dataDisease")
          .select("explanation, treatment")
          .eq("name", prediction)
          .single();

        if (error) {
          console.error("Supabase error:", error.message);
          return h.response({ error: "Failed to fetch explanation" }).code(500);
        }

        return h.response({
          prediction,
          explanation: diseaseData.explanation,
          treatment: diseaseData.treatment,
        }).code(200);
      } catch (err) {
        console.error("[PREDICT ERROR]", err.message);
        return h.response({ error: "Prediction failed" }).code(500);
      }
    },
  },
];
