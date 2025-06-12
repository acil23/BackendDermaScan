import { supabase } from '../connect/supabase.js';

export default [
  {
    method: 'POST',
    path: '/register',
    handler: async (req, h) => {
      const { name, email, password } = req.payload;

      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        return h.response({ error: 'Email sudah terdaftar.' }).code(409);
      }

      const { error } = await supabase
        .from('users')
        .insert([{ name, email, password }]);

      if (error) {
        return h.response({ error: 'Registrasi gagal' }).code(500);
      }

      return h.response({ message: 'Registrasi berhasil' }).code(201);
    },
  },

  {
    method: 'POST',
    path: '/login',
    handler: async (req, h) => {
      const { email, password } = req.payload;

      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !user) {
        return h.response({ error: 'Email atau password salah' }).code(401);
      }

      return h.response({ message: 'Login berhasil', user }).code(200);
    },
  },
];
