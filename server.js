const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({
  origin: '*' // Esto permite que cualquier origen (como tu nuevo link de Vercel) se conecte
}));
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta para obtener sitios
app.get('/api/sites', async (req, res) => {
  const { data, error } = await supabase.from('sites').select('*');
  if (error) return res.status(500).json(error);
  res.json(data);
});

// Ruta para reportar un error en un sitio específico
app.patch('/api/sites/:id/report-error', async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await supabase
    .from('sites')
    .update({ status: 'offline' }) // Cambiamos el estado a error
    .eq('id', id);

  if (error) return res.status(500).json(error);
  res.json({ message: "Error reportado exitosamente", data });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));