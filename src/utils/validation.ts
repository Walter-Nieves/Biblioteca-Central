/* =========================
   VALIDACIÓN Y SANITIZACIÓN
   ========================= */

/**
 * Elimina caracteres no permitidos y normaliza espacios
 */
export const sanitizarTexto = (texto: string): string => {
  return texto
    .replace(/[<>]/g, "")        // elimina < >
    .replace(/\s{4,}/g, " ")     // reduce +3 espacios a 1
    .trim();
};

/**
 * Valida reglas de negocio
 */
export const validarTexto = (texto: string): string | null => {
  if (/[<>]/.test(texto)) {
    return "❌ No se permiten los caracteres < o >";
  }

  if (/\s{4,}/.test(texto)) {
    return "❌ No se permiten más de 3 espacios seguidos";
  }

  return null; // válido
};
