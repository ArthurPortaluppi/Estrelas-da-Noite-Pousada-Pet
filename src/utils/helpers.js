// Funções utilitárias auxiliares para o PetShop Hub

/**
 * Formata uma data no formato YYYY-MM-DD de forma segura contra desvios de timezone.
 * Evita o clássico bug de converter para data local e retroceder um dia.
 * @param {string} dateStr - Data no formato "YYYY-MM-DD" ou similar
 * @returns {string} Data formatada "DD/MM/YYYY"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  // Se contiver hífen (YYYY-MM-DD)
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      // Se a parte do ano tiver 4 dígitos e estiver no início
      if (parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
  }
  
  // Fallback caso receba Date object ou outro formato
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    // Formata usando UTC para evitar deslocamento de fuso horário local
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
};
