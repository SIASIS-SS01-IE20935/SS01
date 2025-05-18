// src/routes/authRoutes.ts

import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu-secreto-aqui";

// Ruta para login y obtener token JWT
router.post("/login", ((req: Request, res: Response) => {
  const { username, password, role } = req.body;

  // Aquí normalmente verificarías contra la base de datos
  // Simulación simple para pruebas
  if (username && password) {
    // Generar token JWT
    const token = jwt.sign(
      { id: "123", username, role: role || "profesor-primaria" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ success: true, token });
  }

  return res
    .status(401)
    .json({ success: false, message: "Credenciales inválidas" });
}) as any);

export default router;
