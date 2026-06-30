"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

import {
  FaMapMarkerAlt,
  FaHeart,
  FaSearch,
} from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  const [sitios, setSitios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    cargarSitios();
  }, []);
 
  async function cargarSitios() {
    const { data, error } = await supabase
      .from("Sitios_Intereses")
      .select("*");
 
    if (error) {
      console.error(error);
      return;
    }
 
    setSitios(data);
  }
 
  async function agregarFavorito(idSitio) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
 
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
 
    const { data: usuarioDB, error: errorUsuario } = await supabase
      .from("Usuarios")
      .select("id_usuario")
      .eq("id_auth", user.id)
      .single();
 
    if (errorUsuario) {
      console.error(errorUsuario);
      alert("No se encontró el usuario");
      return;
    }
 
    const { error } = await supabase
      .from("Lugares_Favoritos")
      .insert([
        {
          id_usuario: usuarioDB.id_usuario,
          id_sitio: idSitio,
        },
      ]);
 
    if (error) {
      console.error(error);
      alert("Error al guardar favorito");
      return;
    }
 
    alert("Favorito guardado correctamente");
  }
 
  function manejarBusqueda(e) {
    const texto = e.target.value;
 
    setBusqueda(texto);
 
    if (texto.trim() === "") {
      setSugerencias([]);
      return;
    }
 
    const resultados = sitios.filter(
      (sitio) =>
        sitio.Nombre.toLowerCase().includes(texto.toLowerCase()) ||
        sitio.Ubicacion.toLowerCase().includes(texto.toLowerCase())
    );
 
    setSugerencias(resultados.slice(0, 5));
  }
 
  const sitiosFiltrados = sitios.filter(
    (sitio) =>
      sitio.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      sitio.Ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );
 
  return (
    <main className="min-h-screen bg-slate-100">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <h1 className="text-5xl md:text-6xl font-black">
            Descubre Panamá 🇵🇦
          </h1>
 
          <p className="text-xl mt-6 max-w-2xl text-blue-100">
            Encuentra playas, montañas, parques nacionales,
            museos y los lugares más increíbles del país.
          </p>
 
          {/* BUSCADOR */}
          <div className="relative mt-10">
            <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4">
              <FaSearch className="text-gray-400 text-xl" />
 
              <input
                type="text"
                placeholder="Buscar un lugar..."
                value={busqueda}
                onChange={manejarBusqueda}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
 
            {/* SUGERENCIAS */}
            {sugerencias.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
{sugerencias.map((sitio) => (
  <div
    key={sitio.id_sitio}
    onClick={() => {
      setBusqueda(sitio.Nombre);
      setSugerencias([]);
      router.push(`/sitio/${sitio.id_sitio}`);
    }}
    className="cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-4 flex items-center gap-3"
  >
    <FaSearch className="text-gray-400" />

    <div>
      <p className="font-semibold text-gray-800">
        {sitio.Nombre}
      </p>

      <p className="text-sm text-gray-500">
        {sitio.Ubicacion}
      </p>
    </div>
  </div>
))}              </div>
            )}
          </div>
        </div>
      </section>
 
      {/* TARJETAS */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-10">
          Lugares de interés
        </h2>
 
        {sitiosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">
            No se encontraron lugares.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sitiosFiltrados.map((sitio) => (
              <div
                key={sitio.id_sitio}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
{sitio.imagen_url ? (
  <img
    src={sitio.imagen_url}
    alt={sitio.Nombre}
    className="w-full h-52 object-cover"
  />
) : (
  <div className="h-52 bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center text-7xl">
    🌴
  </div>
)}                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-slate-800">
                      {sitio.Nombre}
                    </h3>
 
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {sitio.Categoria}
                    </span>
                  </div>
 
                  <div className="flex items-center gap-2 mt-4 text-gray-500">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{sitio.Ubicacion}</span>
                  </div>
 
<p className="mt-5 text-gray-600 leading-7">
  {sitio.Descripcion}
</p>

<button
  onClick={() => router.push(`/sitio/${sitio.id_sitio}`)}
  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
>
  Ver detalles
</button>

<button
  onClick={() => agregarFavorito(sitio.id_sitio)}
  className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
>
  <FaHeart />
  Agregar a Favoritos
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
 