"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function HomePage() {
  const [sitios, setSitios] = useState([]);

  useEffect(() => {
    cargarSitios();
  }, []);

  async function cargarSitios() {
    const { data, error } = await supabase
      .from("Sitios_Intereses")
      .select("*");

    console.log("DATOS:", data);

    if (error) {
      console.error("ERROR:", error);
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

    const { data: usuarioDB, error: errorUsuario } =
      await supabase
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

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Sitios de Interés
      </h1>

      {sitios.map((sitio) => (
        <div
          key={sitio.id_sitio}
          className="border p-4 rounded mb-3"
        >
          <h2 className="font-bold text-xl">
            {sitio.Nombre}
          </h2>

          <p>{sitio.Descripcion}</p>

          <p>
            <strong>Ubicación:</strong> {sitio.Ubicacion}
          </p>

          <p>
            <strong>Categoría:</strong> {sitio.Categoria}
          </p>

          <button
            onClick={() => agregarFavorito(sitio.id_sitio)}
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
          >
            ⭐ Agregar a Favoritos
          </button>
        </div>
      ))}
    </main>
  );
}