
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';

const API = 'http://localhost:3000/api';

const modulos = [
  { id: 'generos', nombre: 'Géneros', icono: '🎬' },
  { id: 'directores', nombre: 'Directores', icono: '🎥' },
  { id: 'productoras', nombre: 'Productoras', icono: '🏢' },
  { id: 'tipos', nombre: 'Tipos', icono: '📁' },
  { id: 'media', nombre: 'Películas y series', icono: '🍿' }
];

const campos = {
  generos: [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado', type: 'estado' }
  ],
  directores: [
    { key: 'nombres', label: 'Nombres', required: true },
    { key: 'estado', label: 'Estado', type: 'estado' }
  ],
  productoras: [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'slogan', label: 'Slogan' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado', type: 'estado' }
  ],
  tipos: [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'descripcion', label: 'Descripción' }
  ],
  media: [
    { key: 'serial', label: 'Serial', required: true },
    { key: 'titulo', label: 'Título', required: true },
    { key: 'sinopsis', label: 'Sinopsis' },
    { key: 'url', label: 'URL', required: true },
    { key: 'imagen_portada', label: 'Imagen de portada' },
    { key: 'anio', label: 'Año de estreno', type: 'number' },
    { key: 'genero_id', label: 'Género', type: 'genero' },
    { key: 'director_id', label: 'Director', type: 'director' },
    { key: 'productora_id', label: 'Productora', type: 'productora' },
    { key: 'tipo_id', label: 'Tipo', type: 'tipo' }
  ]
};

const vacio = (modulo) => {
  const objeto = {};
  campos[modulo].forEach(c => objeto[c.key] = '');
  return objeto;
};

function App() {
  const [modulo, setModulo] = useState('generos');
  const [datos, setDatos] = useState([]);
  const [catalogos, setCatalogos] = useState({});
  const [formulario, setFormulario] = useState({});
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);

  const actual = modulos.find(m => m.id === modulo);

  useEffect(() => {
    cargarDatos();
    cargarCatalogos();
  }, [modulo]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const respuesta = await axios.get(`${API}/${modulo}`);
      setDatos(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo consultar la API. Verifica que el Backend esté activo.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const cargarCatalogos = async () => {
    try {
      const [g, d, p, t] = await Promise.all([
        axios.get(`${API}/generos`),
        axios.get(`${API}/directores`),
        axios.get(`${API}/productoras`),
        axios.get(`${API}/tipos`)
      ]);
      setCatalogos({
        genero: g.data,
        director: d.data,
        productora: p.data,
        tipo: t.data
      });
    } catch (error) {
      console.error('No se pudieron cargar los catálogos', error);
    }
  };

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(vacio(modulo));
    setMostrarForm(true);
  };

  const abrirEditar = (registro) => {
    setEditando(registro.id);
    const nuevo = vacio(modulo);
    campos[modulo].forEach(c => {
      nuevo[c.key] = registro[c.key] ?? '';
    });
    setFormulario(nuevo);
    setMostrarForm(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${API}/${modulo}/${editando}`, formulario);
      } else {
        await axios.post(`${API}/${modulo}`, formulario);
      }
      setMostrarForm(false);
      await cargarDatos();
      Swal.fire('¡Correcto!', editando ? 'Registro actualizado.' : 'Registro creado.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.mensaje || 'No se pudo guardar el registro. Revisa los datos.', 'error');
    }
  };

  const eliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirmacion.isConfirmed) return;
    try {
      await axios.delete(`${API}/${modulo}/${id}`);
      await cargarDatos();
      Swal.fire('Eliminado', 'El registro fue eliminado.', 'success');
    } catch (error) {
      Swal.fire('No se pudo eliminar', 'Puede estar relacionado con otros registros.', 'error');
    }
  };

  const nombreRelacionado = (tipo, id) => {
    const lista = catalogos[tipo] || [];
    const encontrado = lista.find(x => String(x.id) === String(id));
    return encontrado?.nombre || encontrado?.nombres || id || '-';
  };

  const renderCampo = (campo) => {
    if (campo.type === 'estado') {
      return (
        <select className="form-control" value={formulario[campo.key] || 'activo'}
          onChange={e => setFormulario({...formulario, [campo.key]: e.target.value})}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      );
    }

    if (['genero', 'director', 'productora', 'tipo'].includes(campo.type)) {
      const lista = catalogos[campo.type] || [];
      return (
        <select className="form-control" required value={formulario[campo.key]}
          onChange={e => setFormulario({...formulario, [campo.key]: e.target.value})}>
          <option value="">Seleccione...</option>
          {lista.filter(x => campo.type === 'tipo' || x.estado === 'activo')
            .map(x => <option key={x.id} value={x.id}>{x.nombre || x.nombres}</option>)}
        </select>
      );
    }

    return (
      <input className="form-control"
        type={campo.type === 'number' ? 'number' : 'text'}
        required={campo.required}
        value={formulario[campo.key] ?? ''}
        onChange={e => setFormulario({...formulario, [campo.key]: e.target.value})}
      />
    );
  };

  const mostrarValor = (registro, campo) => {
    if (campo.type === 'estado') return registro[campo.key] || '-';
    if (['genero', 'director', 'productora', 'tipo'].includes(campo.type)) {
      return nombreRelacionado(campo.type, registro[campo.key]);
    }
    return registro[campo.key] ?? '-';
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🎞️</span>
          <div><h2>MovieAdmin</h2><small>Panel administrativo</small></div>
        </div>
        <p className="menu-title">MENÚ PRINCIPAL</p>
        {modulos.map(item => (
          <button key={item.id}
            className={`menu-item ${modulo === item.id ? 'active' : ''}`}
            onClick={() => {setModulo(item.id); setMostrarForm(false);}}>
            <span>{item.icono}</span>{item.nombre}
          </button>
        ))}
        <div className="sidebar-footer"><span>Proyecto Integrado II</span><small>Gestión audiovisual</small></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="breadcrumb">Administración /</span><strong>{actual.nombre}</strong></div>
          <span className="admin-badge">Administrador</span>
        </header>

        <section className="content">
          <div className="welcome">
            <div><h1>Bienvenido a MovieAdmin</h1><p>Administra películas, series y su información.</p></div>
            <span className="welcome-icon">🎬</span>
          </div>

          <div className="cards">
            {modulos.map(item => (
              <button className="module-card" key={item.id} onClick={() => {setModulo(item.id); setMostrarForm(false);}}>
                <span className="card-icon">{item.icono}</span>
                <h3>{item.nombre}</h3><p>Gestionar información</p><span className="card-arrow">→</span>
              </button>
            ))}
          </div>

          <div className="section-panel">
            <div><h2>{actual.nombre}</h2><p>Consulta y administra los registros del módulo.</p></div>
            <button className="primary-button" onClick={abrirNuevo}>+ Nuevo registro</button>
          </div>

          {mostrarForm && (
            <form className="form-panel" onSubmit={guardar}>
              <h3>{editando ? 'Editar registro' : 'Nuevo registro'}</h3>
              <div className="form-grid">
                {campos[modulo].map(campo => (
                  <label key={campo.key}>
                    {campo.label}{campo.required ? ' *' : ''}
                    {renderCampo(campo)}
                  </label>
                ))}
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setMostrarForm(false)}>Cancelar</button>
                <button type="submit" className="primary-button">Guardar</button>
              </div>
            </form>
          )}

          <div className="table-panel">
            <div className="table-heading"><h3>Registros</h3><span>{datos.length} registros</span></div>
            {cargando ? <p>Cargando...</p> : (
              <div className="table-scroll">
                <table>
                  <thead><tr>
                    <th>ID</th>
                    {campos[modulo].map(c => <th key={c.key}>{c.label}</th>)}
                    <th>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {datos.map(registro => (
                      <tr key={registro.id}>
                        <td>{registro.id}</td>
                        {campos[modulo].map(c => <td key={c.key}>{mostrarValor(registro,c)}</td>)}
                        <td className="actions">
                          <button className="edit-button" onClick={() => abrirEditar(registro)}>Editar</button>
                          <button className="delete-button" onClick={() => eliminar(registro.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                    {datos.length === 0 && <tr><td colSpan={campos[modulo].length + 2}>No hay registros para mostrar.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
