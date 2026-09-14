import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Thermometer, AlertTriangle, Send, MapPin } from 'lucide-react';
import { supabase } from './supabaseClient';
import fichasData from './fichasInia.json';

export default function App() {
  const [clima, setClima] = useState(null);
  const [incidencias, setIncidencias] = useState([]);
  const [sector, setSector] = useState('');
  const [tipoCultivo, setTipoCultivo] = useState('Papa');
  const [tipoAlerta, setTipoAlerta] = useState('Helada');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  const LAT = -9.5489;
  const LON = -76.8181;

  useEffect(() => {
    // Consultar API Climatológica
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`)
      .then((res) => res.json())
      .then((data) => setClima(data));

    // Cargar incidencias registradas en Supabase
    obtenerIncidencias();
  }, []);

  const obtenerIncidencias = async () => {
    const { data, error } = await supabase.from('incidencias').select('*').order('created_at', { ascending: false });
    if (!error && data) setIncidencias(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const { error } = await supabase.from('incidencias').insert([
      {
        sector: sector,
        tipo_cultivo: tipoCultivo,
        tipo_alerta: tipoAlerta,
        descripcion: descripcion,
      },
    ]);

    if (error) {
      alert('Error al registrar la alerta');
    } else {
      alert('¡Alerta registrada exitosamente!');
      setSector('');
      setDescripcion('');
      obtenerIncidencias(); // Recargar lista de alertas
    }
    setEnviando(false);
  };

  const tempActual = clima?.current_weather?.temperature;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '15px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      
      <header style={{ backgroundColor: '#1b5e20', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>AgroClima Llata</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>Plataforma Agrícola y Alertas Comunitarias - Huamalíes</p>
      </header>

      {/* Clima Actual */}
      <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Estado del Tiempo</h3>
        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          <Thermometer color={tempActual <= 2 ? 'red' : 'green'} /> Temperatura Actual: {tempActual !== undefined ? `${tempActual} °C` : 'Cargando...'}
        </p>
      </div>

      {/* Mapa Interactivo de Llata */}
      <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin color="#d32f2f" /> Mapa de Ubicación - Llata
        </h3>
        <div style={{ height: '250px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer center={[LAT, LON]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[LAT, LON]}>
              <Popup>Llata - Centro de Monitoreo AgroClima</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Formulario de Registro de Alertas */}
      <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle color="#f57c00" /> Registrar Incidencia en Parcela
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Sector / Barrio / Parcela (Ej. Cazapampa)"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={tipoCultivo} onChange={(e) => setTipoCultivo(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Papa">Papa</option>
              <option value="Maíz">Maíz</option>
              <option value="Cebada">Cebada</option>
              <option value="Otro">Otro Cultivo</option>
            </select>
            <select value={tipoAlerta} onChange={(e) => setTipoAlerta(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Helada">Helada</option>
              <option value="Granizada">Granizada</option>
              <option value="Plaga/Enfermedad">Plaga / Enfermedad</option>
              <option value="Sequía">Sequía</option>
            </select>
          </div>
          <textarea
            placeholder="Descripción del daño o riesgo observado..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={enviando}
            style={{ backgroundColor: '#1b5e20', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <Send size={16} /> {enviando ? 'Guardando...' : 'Enviar Alerta'}
          </button>
        </form>
      </div>

      {/* Lista de Alertas Recientes */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px' }}>Alertas Reportadas por la Comunidad</h3>
        {incidencias.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#666' }}>No hay alertas registradas aún.</p>
        ) : (
          incidencias.map((item) => (
            <div key={item.id} style={{ backgroundColor: 'white', borderLeft: '4px solid #f57c00', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
              <strong>{item.sector}</strong> - <span style={{ color: '#d32f2f' }}>{item.tipo_alerta}</span> ({item.tipo_cultivo})
              <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>{item.descripcion}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}