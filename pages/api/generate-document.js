export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { job } = req.body;

    const cv = `ANTONIO ÁLVAREZ RAMÍREZ
═══════════════════════════════════════════════════════════
📍 Ciudad de México, México | 📞 55 8686 5830
✉️ Antonio.Alv.Ram81@gmail.com | 🔗 linkedin.com/in/antonioalvarezramirez

PERFIL EJECUTIVO - ADAPTADO PARA: ${job.jobTitle}

Líder en Revenue Integrity y Finanzas Comerciales con 20+ años en telecomunicaciones.

LOGROS DESTACADOS
────────────────────────────────────────────────────────
▪ Gestión y protección de más de $4,000M MXN en ingresos
▪ Recuperación de $36M MXN anuales en fuga de ingresos
▪ Identificación de $120M MXN en oportunidades incrementales
▪ Resultado de +38% sobre plan
▪ Reducción de 33% en tiempo de análisis

EXPERIENCIA PROFESIONAL
────────────────────────
GERENTE SENIOR - REVENUE B2B & VAS | AT&T Mexico (2024–2026)
- Protección de ingresos en B2B por más de $4,000M MXN anuales
- Recuperación de ~$3M MXN mensuales en ingresos IoT
- Identificación de oportunidad incremental de $120M MXN anuales

COMPETENCIAS TÉCNICAS
─────────────────────
Excel Avanzado | SQL | Power BI | Python (Básico) | Databricks | SAS | SAP
Revenue Integrity | FP&A | Pricing Strategy | Business Intelligence | EBITDA Analysis

EDUCACIÓN
─────────
Licenciatura en Economía
`;

    const letter = `CARTA DE PRESENTACIÓN PERSONALIZADA

${new Date().toLocaleDateString('es-MX')}

Estimado/a [Nombre del Reclutador],

Me dirijo a usted para expresar mi interés genuino en la posición de ${job.jobTitle} en ${job.company}.

Con más de 20 años de experiencia en finanzas y telecomunicaciones, he desarrollado expertise sólida en las áreas críticas para esta oportunidad: Revenue Integrity, FP&A, Pricing Strategy y Business Intelligence.

LOGROS DESTACADOS
─────────────────
✓ Gestión de $4,000M+ MXN en ingresos anuales
✓ Recuperación de $36M MXN anuales en fugas de ingresos
✓ Identificación de $120M MXN en oportunidades incrementales
✓ Resultados de +38% sobre plan
✓ Reducción de tiempos de análisis en 33%

HABILIDADES TÉCNICAS
────────────────────
✓ Excel Avanzado | ✓ SQL | ✓ Power BI | ✓ Python | ✓ Databricks

Considero que mi experiencia y habilidades se alinean perfectamente con los requisitos de esta posición. 
Estoy disponible para una entrevista en su conveniencia.

Cordialmente,

ANTONIO ÁLVAREZ RAMÍREZ
Ciudad de México, México
📞 55 8686 5830
✉️ Antonio.Alv.Ram81@gmail.com
🔗 linkedin.com/in/antonioalvarezramirez
`;

    return res.status(200).json({
      success: true,
      cv,
      letter,
      fileName: `Personalizacion_${job.jobTitle.replace(/\s/g, '_')}`
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
