import { supabase } from "../connect/supabase.js";

export default [
  {
    method: "GET",
    path: "/history",
    handler: async (req, h) => {
      const userId = req.query.user_id;

      const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) {
        return h.response({ error: "Gagal mengambil data" }).code(500);
      }

      return h.response(data).code(200);
    },
  },

  {
    method: "POST",
    path: "/history",
    handler: async (req, h) => {
      const { label, explanation, imageUrl, userId } = req.payload;

      const { error } = await supabase.from("history").insert([
        {
          label,
          explanation,
          image_url: imageUrl,
          user_id: userId,
        },
      ]);

      if (error) {
        return h.response({ error: "Gagal menyimpan data" }).code(500);
      }

      return h.response({ message: "Berhasil disimpan" }).code(201);
    },
  },

  {
    method: "DELETE",
    path: "/history/{id}",
    handler: async (req, h) => {
      const { id } = req.params;

      const { error } = await supabase.from("history").delete().eq("id", id);

      if (error) {
        return h.response({ error: "Gagal menghapus data" }).code(500);
      }

      return h.response({ message: "Data berhasil dihapus" }).code(200);
    },
  },
];
