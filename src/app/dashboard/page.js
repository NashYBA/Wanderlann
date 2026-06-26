"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
   const [favoritos, setFavoritos] = useState([]);

  const router = useRouter();

  useEffect(() => {
    cargarUsuario();
  }, []);

  async function cargarUsuario() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id_auth", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setUsuario(data);
    const { data: favoritosDB, error: errorFavoritos } = await supabase
  .from("Lugares_Favoritos")
  .select(`
    id_sitio,
    Sitios_Intereses (
      Nombre,
      Categoria
    )
  `)
  .eq("id_usuario", data.id_usuario);

if (errorFavoritos) {
  alert(JSON.stringify(errorFavoritos, null, 2));
  console.log(JSON.stringify(errorFavoritos, null, 2));
  return;
}  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      {usuario && (
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold">
            Bienvenido, {usuario.Nombre}
          </h2>

          <p className="mt-2">
            Correo: {usuario.correo}
          </p>
        </div>
      )}
<div className="border rounded-lg p-6 mb-6">
  <h2 className="text-2xl font-bold mb-4">
    ⭐ Mis Favoritos
  </h2>

  {favoritos.length === 0 ? (
    <p>No tienes favoritos todavía.</p>
  ) : (
    favoritos.map((favorito) => (
      <div
        key={favorito.id_sitio}
        className="border rounded p-3 mb-2"
      >
        <h3 className="font-bold">
          {favorito.Sitios_Intereses?.Nombre}
        </h3>

        <p>
          {favorito.Sitios_Intereses?.Categoria}
        </p>
      </div>
    ))
  )}
</div>
      <button
        onClick={cerrarSesion}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Cerrar Sesión
      </button>
    </main>
  );
}