function calculateAffinity(job) {
  let score = 0;
  const jobTitle = (job.jobTitle || '').toLowerCase();
  const jobDesc = (job.jobDescription || '').toLowerCase();
  const company = (job.company || '').toLowerCase();

  const highAffinityRoles = ['pricing', 'revenue', 'planning', 'fp&a', 'forecast'];
  const mediumAffinityRoles = ['analyst', 'finance', 'business intelligence'];
  
  if (highAffinityRoles.some(role => jobTitle.includes(role) || jobDesc.includes(role))) {
    score += 20;
  } else if (mediumAffinityRoles.some(role => jobTitle.includes(role) || jobDesc.includes(role))) {
    score += 14;
  } else {
    score += 5;
  }

  const matches = (job.salary || '').match(/\$?([\d,]+)k?/gi);
  const salaryMin = matches ? Math.min(...matches.map(m => parseInt(m.replace(/\$|,|k/gi, '')) * (m.includes('k') ? 1000 : 1))) : 0;
  if (salaryMin >= 100000) score += 20;
  else if (salaryMin >= 80000) score += 18;
  else if (salaryMin >= 60000) score += 16;
  else if (salaryMin >= 50000) score += 14;
  else score += 3;

  const multinational = ['google', 'microsoft', 'amazon', 'apple', 'ibm', 'telefonica', 'at&t', 'accenture', 'deloitte'];
  score += multinational.some(c => company.includes(c)) ? 20 : 10;

  const basicEng = jobDesc.includes('english');
  score += !basicEng ? 20 : 16;

  const skills = ['excel', 'power bi', 'sql', 'python'];
  const matched = skills.filter(s => jobDesc.includes(s)).length;
  score += matched >= 3 ? 20 : matched === 2 ? 16 : matched === 1 ? 12 : 8;

  return Math.max(0, Math.min(100, score));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Datos de ejemplo para testing
    const mockJobs = [
      {
        jobTitle: 'Senior Revenue Analyst',
        company: 'Telefónica México',
        salary: '$60,000 - $75,000 monthly',
        location: 'Mexico City - Hybrid',
        jobDescription: 'Revenue Analyst Senior con experiencia en Revenue Integrity, SQL y Power BI, forecasting presupuestal.',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        applyUrl: 'https://mx.indeed.com/jobs?q=revenue+analyst'
      },
      {
        jobTitle: 'FP&A Senior Analyst',
        company: 'Google Mexico',
        salary: '$55,000 - $70,000 monthly',
        location: 'Mexico City - Remote',
        jobDescription: 'Financial Planning & Analysis Senior. Excel avanzado, SQL, Power BI, análisis financiero, forecasting.',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        applyUrl: 'https://mx.indeed.com/jobs?q=fpa+analyst'
      },
      {
        jobTitle: 'Pricing Strategy Manager',
        company: 'Microsoft',
        salary: '$70,000 - $90,000 monthly',
        location: 'Naucalpan - Hybrid',
        jobDescription: 'Líder en estrategia de pricing y rentabilidad. EBITDA, forecasting, Excel, Power BI, SQL.',
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        applyUrl: 'https://mx.indeed.com/jobs?q=pricing+manager'
      },
      {
        jobTitle: 'Business Intelligence Analyst',
        company: 'Amazon Web Services',
        salary: '$52,000 - $68,000 monthly',
        location: 'Cuauhtémoc - Remote',
        jobDescription: 'BI Analyst con Power BI, SQL, Python básico. Dashboards, análisis de datos complejos.',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        applyUrl: 'https://mx.indeed.com/jobs?q=bi+analyst'
      },
      {
        jobTitle: 'Financial Planning Specialist',
        company: 'IBM Mexico',
        salary: '$58,000 - $72,000 monthly',
        location: 'Miguel Hidalgo - Hybrid',
        jobDescription: 'Planificación financiera. Excel avanzado, SQL, Power BI, forecasting de ingresos, EBITDA analysis.',
        postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        applyUrl: 'https://mx.indeed.com/jobs?q=financial+planning'
      },
      {
        jobTitle: 'Revenue Operations Manager',
        company: 'Salesforce',
        salary: '$65,000 - $82,000 monthly',
        location: 'Tlalnepantla - Hybrid',
        jobDescription: 'Revenue Operations con foco en Revenue Integrity. Excel, Power BI, SQL obligatorio. Experiencia telecom.',
        postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        applyUrl: 'https://mx.indeed.com/jobs?q=revenue+operations'
      }
    ];

    const jobsWithAffinity = mockJobs
      .map(job => ({
        ...job,
        affinity: calculateAffinity(job),
        jobId: `${job.company}-${job.jobTitle}`.replace(/\s/g, '-').substring(0, 50)
      }))
      .sort((a, b) => b.affinity - a.affinity);

    const skillsFreq = {};
    const skillsList = ['Revenue', 'Pricing', 'Excel', 'SQL', 'Power BI', 'Python', 'FP&A', 'Finance'];
    
    jobsWithAffinity.forEach(job => {
      skillsList.forEach(skill => {
        if (job.jobDescription?.toLowerCase().includes(skill.toLowerCase())) {
          skillsFreq[skill] = (skillsFreq[skill] || 0) + 1;
        }
      });
    });

    return res.status(200).json({
      success: true,
      totalJobs: jobsWithAffinity.length,
      jobs: jobsWithAffinity,
      skills: skillsFreq
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar empleos: ' + error.message
    });
  }
}
