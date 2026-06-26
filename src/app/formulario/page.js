"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Formulario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  async function registrarUsuario(e) {
    e.preventDefault();

    // Crear usuario en Authentication
    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    // Guardar en tabla Usuarios
    const { error: errorDB } = await supabase
      .from("Usuarios")
      .insert([
        {
          Nombre: nombre,
          correo: correo,
          id_auth: data.user.id,
        },
      ]);

    if (errorDB) {
      alert("Error al guardar en Usuarios");
      console.error(errorDB);
      return;
    }

    alert("Usuario registrado correctamente");

    setNombre("");
    setCorreo("");
    setPassword("");
  }

  return (
    <main className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={registrarUsuario}
        className="w-full max-w-md p-6 border rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-4">
          Registro de Usuario
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          Registrarse
        </button>
      </form>
    </main>
  );
}
