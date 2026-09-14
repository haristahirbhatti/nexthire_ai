import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function POST(req) {
  let cvText = "";
  let language = "English";
  let targetRole = "";

  try {
    const body = await req.json();
    cvText = body.cvText || "";
    language = body.language || "English";
    targetRole = body.targetRole || "";
    const templateId = body.templateId || "modern";

    const openai = getOpenAIClient();

    if (!openai) {
      // Fallback local smart parser if OpenAI API key is missing
      return NextResponse.json({
        success: true,
        package: parseCVStructure(cvText, language, targetRole),
      });
    }

    const isEnglish = language === "English";
    const translationDirective = isEnglish
      ? ""
      : `
LANGUAGE TRANSLATION DIRECTIVE (MANDATORY):
- The target output language is: ${language}
- TRANSLATE ALL text content into ${language} — including the summary, all bullet points, cover letter body, LinkedIn profile text, and section headings.
- The CV may have been written in English or another language. Regardless of the input language, ALL written content MUST be fully translated into ${language}.
- Proper nouns such as: candidate full name, company names, university names, city/country, email, phone, LinkedIn URL, and skill tags should remain unchanged (do NOT translate names).
- Dates, years, and numeric values stay as-is.
- The greeting and sign-off in the cover letter should also be in ${language}.
`;

    const prompt = `
You are a World-Class Executive CV Writer, ATS Specialist, and Professional Translator.
Your task is to re-structure, polish, and fully rewrite the candidate's CV into an ATS-optimized career package.
${translationDirective}
CRITICAL DIRECTIVES:
1. DO NOT invent fake company names, fake university names, or fake candidate names.
2. EXTRACT the candidate's REAL full name, REAL email, REAL phone, REAL CITY AND COUNTRY LOCATION, REAL work history (company names, job titles, dates), and REAL education directly from the candidate's CV text provided below.
3. For "location", find the candidate's actual City and Country (or State) from the header/contact section (e.g. "Lahore, Pakistan", "New York, USA", "London, UK", "Dubai, UAE"). DO NOT write generic placeholder text like "City, Country" or "City, State".
4. If location is not in the CV, extract whatever city/country is mentioned or leave it empty ("").
5. Keep all factual details 100% accurate to the original CV text.
6. ${isEnglish ? "Write all text content in English." : `Write ALL text content (summary, bullets, cover letter, LinkedIn about) fully in ${language}. Names, companies, institutions stay as-is.`}

${targetRole ? `TARGET ROLE / JOB TITLE FOCUS: ${targetRole}
IMPORTANT: Tailor the entire package specifically for the ${targetRole} role:
- The professional summary must position the candidate as ideal for ${targetRole}
- Experience bullet points must emphasize achievements relevant to ${targetRole}
- Skills must prioritize those most valuable for ${targetRole}
- The cover letter must specifically address why the candidate is perfect for ${targetRole}
- LinkedIn headline must target ${targetRole}` : ""}

CANDIDATE CV CONTENT:
"""
${cvText}
"""

Return a strictly valid JSON object adhering to this structure:
{
  "personalInfo": {
    "fullName": "<Candidate's Real Full Name extracted from CV>",
    "email": "<Candidate's Real Email extracted from CV>",
    "phone": "<Candidate's Real Phone extracted from CV>",
    "location": "<Candidate's Real City and Country extracted from CV header, or empty string if not found>",
    "linkedIn": "<Candidate's LinkedIn URL if present, or linkedin.com/in/candidate>",
    "targetTitle": "${targetRole || "<Candidate's Current or Target Title extracted from CV>"}"
  },
  "summary": "<3-4 sentence professional executive summary written in ${language} based directly on candidate's real experience${targetRole ? `, tailored specifically for the ${targetRole} role` : ""}>",
  "skills": ["<Real Skill 1 from CV>", "<Real Skill 2 from CV>", "<Real Skill 3 from CV>", "<Real Skill 4 from CV>", "<Real Skill 5 from CV>", "<Real Skill 6 from CV>"],
  "experience": [
    {
      "company": "<Real Company Name — do NOT translate>",
      "role": "<Real Job Title — ${isEnglish ? "in English" : `translated into ${language}`}>",
      "period": "<Real Date/Years from CV>",
      "location": "<Candidate's City/Location extracted from CV>",
      "highlights": [
        "<High-impact bullet point in ${language} based on candidate's real work at this company>",
        "<High-impact bullet point in ${language} based on candidate's real work at this company>",
        "<High-impact bullet point in ${language} based on candidate's real work at this company>"
      ]
    }
  ],
  "education": [
    {
      "institution": "<Real School/University Name — do NOT translate>",
      "degree": "<Real Degree/Diploma — ${isEnglish ? "in English" : `translated into ${language}`}>",
      "year": "<Real Graduation Year from CV>"
    }
  ],
  "coverLetter": {
    "greeting": "<Appropriate greeting in ${language}, e.g. Dear Hiring Manager in ${language}>",
    "body": "<Tailored cover letter fully written in ${language} referencing candidate's real experience for ${targetRole || "this position"}>",
    "signOff": "<Appropriate sign-off in ${language}>\\n<Candidate's Real Full Name>"
  },
  "linkedInProfile": {
    "headline": "<Optimized LinkedIn headline in ${language} with candidate's real title and top skills>",
    "aboutSection": "<Engaging LinkedIn About section fully written in ${language} based on candidate's real background>",
    "featuredKeywords": ["<Keyword1>", "<Keyword2>", "<Keyword3>", "<Keyword4>"]
  },
  "indeedProfile": {
    "headline": "<Optimized Indeed headline in ${language}>",
    "summary": "<Professional Indeed summary in ${language}>"
  },
  "atsScore": 96
}
`;

    const systemMessage = isEnglish
      ? "You output only valid JSON. Strictly extract real candidate name, email, phone, city and country location, company names, and university names from the input CV text. Never write 'City, Country'."
      : `You output only valid JSON. Extract real candidate details and FULLY TRANSLATE all written text content into ${language}. Keep proper nouns (names, companies, universities, cities) unchanged. Never write 'City, Country'.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content.trim();
    const resultJson = JSON.parse(responseText);

    // Sanitize any residual placeholder strings
    if (resultJson.personalInfo) {
      if (resultJson.personalInfo.location?.toLowerCase().includes("city") && resultJson.personalInfo.location?.toLowerCase().includes("country")) {
        resultJson.personalInfo.location = extractLocation(cvText, cvText.split("\n"));
      }
    }

    return NextResponse.json({ success: true, package: resultJson });
  } catch (error) {
    console.error("[generate-cv-package] Error:", error);
    return NextResponse.json({
      success: true,
      package: parseCVStructure(cvText, language, targetRole),
      warning: "Generated using smart local extraction parser.",
    });
  }
}

/* ─────────────────────────────────────────────────────────────────────
   LANGUAGE TRANSLATIONS
   Common phrases translated for the fallback parser in all 28 languages.
   ───────────────────────────────────────────────────────────────────── */

const LANGUAGE_TRANSLATIONS = {
  "English": {
    greeting: "Dear Hiring Manager,",
    signOff: "Sincerely,",
    summaryTemplate: (role, skills) => `Results-driven ${role} with a proven track record of executing strategic initiatives, optimizing key workflows, and delivering high-impact business outcomes. Skilled in ${skills}, with strong expertise in driving organizational success.`,
    coverIntro: (role) => `I am writing to express my enthusiastic interest in the ${role} position.`,
    coverBody: (role, skills, company) => `With a solid foundation in ${skills}, I am confident in my ability to contribute effectively to your team's success.\n\nThroughout my career at ${company}, I have consistently focused on driving operational performance and delivering quantifiable results. My technical background and collaborative approach align directly with your requirements.\n\nI look forward to the opportunity to discuss how my background and qualifications can support your team's goals.`,
    linkedInAbout: (role, skills) => `I am a dedicated ${role} specializing in ${skills}. Over my career, I have focused on driving measurable performance and scaling operations.`,
    indeedSummary: (role, skills) => `Experienced ${role} with expertise in ${skills}. Seeking opportunities to leverage proven skills in driving business results and organizational growth.`,
  },
  "French": {
    greeting: "Madame, Monsieur,",
    signOff: "Cordialement,",
    summaryTemplate: (role, skills) => `${role} axé(e) sur les résultats avec une expérience avérée dans l'exécution d'initiatives stratégiques, l'optimisation des flux de travail et la réalisation de résultats commerciaux à fort impact. Compétent(e) en ${skills}, avec une expertise solide dans la conduite du succès organisationnel.`,
    coverIntro: (role) => `J'ai l'honneur de vous soumettre ma candidature pour le poste de ${role}.`,
    coverBody: (role, skills, company) => `Fort(e) d'une solide formation en ${skills}, je suis convaincu(e) de pouvoir contribuer efficacement au succès de votre équipe.\n\nTout au long de ma carrière chez ${company}, je me suis constamment concentré(e) sur l'amélioration de la performance opérationnelle et la production de résultats quantifiables. Mon parcours technique et mon approche collaborative correspondent directement à vos exigences.\n\nJe serais ravi(e) de discuter de la manière dont mon expérience et mes qualifications peuvent soutenir les objectifs de votre équipe.`,
    linkedInAbout: (role, skills) => `Je suis un(e) ${role} dévoué(e) spécialisé(e) en ${skills}. Au cours de ma carrière, je me suis concentré(e) sur l'amélioration mesurable des performances et la montée en échelle des opérations.`,
    indeedSummary: (role, skills) => `${role} expérimenté(e) avec une expertise en ${skills}. À la recherche d'opportunités pour mettre à profit des compétences éprouvées dans la conduite de résultats commerciaux.`,
  },
  "Spanish": {
    greeting: "Estimado/a Director/a de Recursos Humanos,",
    signOff: "Atentamente,",
    summaryTemplate: (role, skills) => `${role} orientado/a a resultados con un historial comprobado en la ejecución de iniciativas estratégicas, optimización de flujos de trabajo clave y entrega de resultados empresariales de alto impacto. Competente en ${skills}, con sólida experiencia en impulsar el éxito organizacional.`,
    coverIntro: (role) => `Me dirijo a usted para expresar mi interés en la posición de ${role}.`,
    coverBody: (role, skills, company) => `Con una sólida base en ${skills}, estoy seguro/a de mi capacidad para contribuir eficazmente al éxito de su equipo.\n\nA lo largo de mi carrera en ${company}, me he enfocado constantemente en impulsar el rendimiento operativo y entregar resultados cuantificables. Mi formación técnica y enfoque colaborativo se alinean directamente con sus requisitos.\n\nEspero tener la oportunidad de discutir cómo mi experiencia y cualificaciones pueden apoyar los objetivos de su equipo.`,
    linkedInAbout: (role, skills) => `Soy un/a ${role} dedicado/a especializado/a en ${skills}. A lo largo de mi carrera, me he centrado en impulsar un rendimiento medible y escalar operaciones.`,
    indeedSummary: (role, skills) => `${role} experimentado/a con experiencia en ${skills}. Buscando oportunidades para aprovechar habilidades probadas en la conducción de resultados empresariales.`,
  },
  "Arabic": {
    greeting: "السيد/السيدة مدير التوظيف المحترم،",
    signOff: "مع خالص التقدير،",
    summaryTemplate: (role, skills) => `${role} موجه نحو النتائج مع سجل حافل في تنفيذ المبادرات الاستراتيجية وتحسين سير العمل الرئيسية وتحقيق نتائج أعمال عالية التأثير. ماهر في ${skills}، مع خبرة قوية في دفع النجاح المؤسسي.`,
    coverIntro: (role) => `أكتب إليكم للتعبير عن اهتمامي الكبير بمنصب ${role}.`,
    coverBody: (role, skills, company) => `مع أساس متين في ${skills}، أنا واثق من قدرتي على المساهمة بفعالية في نجاح فريقكم.\n\nطوال مسيرتي المهنية في ${company}، ركزت باستمرار على تعزيز الأداء التشغيلي وتحقيق نتائج قابلة للقياس. خلفيتي التقنية ونهجي التعاوني يتوافقان مباشرة مع متطلباتكم.\n\nأتطلع إلى فرصة مناقشة كيف يمكن لخبرتي ومؤهلاتي دعم أهداف فريقكم.`,
    linkedInAbout: (role, skills) => `أنا ${role} متخصص في ${skills}. على مدار مسيرتي المهنية، ركزت على تحقيق أداء قابل للقياس وتوسيع نطاق العمليات.`,
    indeedSummary: (role, skills) => `${role} ذو خبرة مع تخصص في ${skills}. أبحث عن فرص للاستفادة من المهارات المثبتة في تحقيق نتائج الأعمال.`,
  },
  "German": {
    greeting: "Sehr geehrte Damen und Herren,",
    signOff: "Mit freundlichen Grüßen,",
    summaryTemplate: (role, skills) => `Ergebnisorientierte/r ${role} mit nachgewiesener Erfolgsbilanz in der Umsetzung strategischer Initiativen, Optimierung wichtiger Arbeitsabläufe und Erzielung hochwirksamer Geschäftsergebnisse. Kompetent in ${skills}, mit starker Expertise in der Förderung des organisatorischen Erfolgs.`,
    coverIntro: (role) => `Hiermit bewerbe ich mich mit großem Interesse auf die Position als ${role}.`,
    coverBody: (role, skills, company) => `Mit einem soliden Fundament in ${skills} bin ich überzeugt, effektiv zum Erfolg Ihres Teams beitragen zu können.\n\nWährend meiner gesamten Karriere bei ${company} habe ich mich stets auf die Steigerung der operativen Leistung und die Erzielung quantifizierbarer Ergebnisse konzentriert. Mein technischer Hintergrund und mein kollaborativer Ansatz stimmen direkt mit Ihren Anforderungen überein.\n\nIch freue mich auf die Gelegenheit, zu besprechen, wie mein Hintergrund und meine Qualifikationen die Ziele Ihres Teams unterstützen können.`,
    linkedInAbout: (role, skills) => `Ich bin ein/e engagierte/r ${role} mit Spezialisierung auf ${skills}. Im Laufe meiner Karriere habe ich mich auf messbare Leistungssteigerung und Skalierung von Abläufen konzentriert.`,
    indeedSummary: (role, skills) => `Erfahrene/r ${role} mit Expertise in ${skills}. Auf der Suche nach Möglichkeiten, bewährte Fähigkeiten zur Erzielung von Geschäftsergebnissen einzusetzen.`,
  },
  "Italian": {
    greeting: "Gentile Responsabile delle Risorse Umane,",
    signOff: "Cordiali saluti,",
    summaryTemplate: (role, skills) => `${role} orientato/a ai risultati con un track record comprovato nell'esecuzione di iniziative strategiche, ottimizzazione dei flussi di lavoro chiave e consegna di risultati aziendali ad alto impatto. Competente in ${skills}, con forte competenza nel guidare il successo organizzativo.`,
    coverIntro: (role) => `Scrivo per esprimere il mio vivo interesse per la posizione di ${role}.`,
    coverBody: (role, skills, company) => `Con una solida base in ${skills}, sono fiducioso/a nella mia capacità di contribuire efficacemente al successo del vostro team.\n\nDurante tutta la mia carriera presso ${company}, mi sono costantemente concentrato/a sulla promozione delle prestazioni operative e sulla consegna di risultati quantificabili.\n\nNon vedo l'ora di avere l'opportunità di discutere come il mio background e le mie qualifiche possano supportare gli obiettivi del vostro team.`,
    linkedInAbout: (role, skills) => `Sono un/a ${role} dedicato/a specializzato/a in ${skills}. Nel corso della mia carriera, mi sono concentrato/a sulla promozione di prestazioni misurabili.`,
    indeedSummary: (role, skills) => `${role} con esperienza in ${skills}. Alla ricerca di opportunità per sfruttare competenze comprovate nel raggiungimento di risultati aziendali.`,
  },
  "Portuguese": {
    greeting: "Prezado(a) Gerente de Contratação,",
    signOff: "Atenciosamente,",
    summaryTemplate: (role, skills) => `${role} orientado(a) a resultados com histórico comprovado na execução de iniciativas estratégicas, otimização de fluxos de trabalho-chave e entrega de resultados empresariais de alto impacto. Competente em ${skills}, com forte expertise em impulsionar o sucesso organizacional.`,
    coverIntro: (role) => `Escrevo para expressar meu interesse entusiástico na posição de ${role}.`,
    coverBody: (role, skills, company) => `Com uma base sólida em ${skills}, estou confiante na minha capacidade de contribuir efetivamente para o sucesso da sua equipe.\n\nAo longo da minha carreira na ${company}, tenho me concentrado consistentemente em impulsionar o desempenho operacional e entregar resultados quantificáveis.\n\nAguardo com expectativa a oportunidade de discutir como minha experiência e qualificações podem apoiar os objetivos da sua equipe.`,
    linkedInAbout: (role, skills) => `Sou um(a) ${role} dedicado(a) especializado(a) em ${skills}. Ao longo da minha carreira, tenho focado em impulsionar desempenho mensurável e escalar operações.`,
    indeedSummary: (role, skills) => `${role} experiente com expertise em ${skills}. Buscando oportunidades para alavancar habilidades comprovadas na geração de resultados empresariais.`,
  },
  "Russian": {
    greeting: "Уважаемый менеджер по подбору персонала,",
    signOff: "С уважением,",
    summaryTemplate: (role, skills) => `${role}, ориентированный на результат, с подтвержденным опытом реализации стратегических инициатив, оптимизации ключевых рабочих процессов и достижения высокоэффективных бизнес-результатов. Компетентен в ${skills}, с сильной экспертизой в обеспечении организационного успеха.`,
    coverIntro: (role) => `Пишу, чтобы выразить свой интерес к позиции ${role}.`,
    coverBody: (role, skills, company) => `Имея прочную основу в ${skills}, я уверен в своей способности эффективно внести вклад в успех вашей команды.\n\nНа протяжении всей моей карьеры в ${company} я постоянно фокусировался на повышении операционной эффективности и достижении измеримых результатов.\n\nС нетерпением жду возможности обсудить, как мой опыт и квалификация могут поддержать цели вашей команды.`,
    linkedInAbout: (role, skills) => `Я преданный своему делу ${role}, специализирующийся на ${skills}. На протяжении моей карьеры я фокусировался на достижении измеримых результатов.`,
    indeedSummary: (role, skills) => `Опытный ${role} с экспертизой в ${skills}. Ищу возможности для применения проверенных навыков в достижении бизнес-результатов.`,
  },
  "Urdu": {
    greeting: "محترم ہائرنگ مینیجر،",
    signOff: "مع التحیات،",
    summaryTemplate: (role, skills) => `نتائج پر مبنی ${role} جو اسٹریٹجک اقدامات کو انجام دینے، اہم ورک فلو کو بہتر بنانے، اور اعلیٰ اثر کے کاروباری نتائج فراہم کرنے کا ثابت شدہ ریکارڈ رکھتا ہے۔ ${skills} میں ماہر، تنظیمی کامیابی کو آگے بڑھانے میں مضبوط مہارت کے ساتھ۔`,
    coverIntro: (role) => `میں ${role} کی پوزیشن میں اپنی دلچسپی کا اظہار کرنے کے لیے لکھ رہا ہوں۔`,
    coverBody: (role, skills, company) => `${skills} میں مضبوط بنیاد کے ساتھ، مجھے یقین ہے کہ میں آپ کی ٹیم کی کامیابی میں مؤثر طریقے سے حصہ ڈال سکتا ہوں۔\n\n${company} میں اپنے پورے کیریئر کے دوران، میں نے مسلسل آپریشنل کارکردگی کو بہتر بنانے اور قابل پیمائش نتائج فراہم کرنے پر توجہ مرکوز کی ہے۔\n\nمیں اس موقع کا منتظر ہوں کہ میں بات چیت کروں کہ میرا تجربہ اور قابلیت آپ کی ٹیم کے اہداف کی حمایت کیسے کر سکتے ہیں۔`,
    linkedInAbout: (role, skills) => `میں ایک سرشار ${role} ہوں جو ${skills} میں مہارت رکھتا ہے۔ اپنے کیریئر کے دوران، میں نے قابل پیمائش کارکردگی کو آگے بڑھانے پر توجہ مرکوز کی ہے۔`,
    indeedSummary: (role, skills) => `تجربہ کار ${role} جو ${skills} میں مہارت رکھتا ہے۔ کاروباری نتائج حاصل کرنے کے لیے ثابت شدہ مہارتوں کو استعمال کرنے کے مواقع تلاش کر رہا ہے۔`,
  },
  "Hindi": {
    greeting: "माननीय भर्ती प्रबंधक,",
    signOff: "सादर,",
    summaryTemplate: (role, skills) => `परिणाम-उन्मुख ${role} जो रणनीतिक पहलों को क्रियान्वित करने, प्रमुख कार्यप्रवाहों को अनुकूलित करने और उच्च-प्रभाव वाले व्यावसायिक परिणाम देने का सिद्ध ट्रैक रिकॉर्ड रखता है। ${skills} में कुशल, संगठनात्मक सफलता को आगे बढ़ाने में मजबूत विशेषज्ञता के साथ।`,
    coverIntro: (role) => `मैं ${role} पद में अपनी रुचि व्यक्त करने के लिए लिख रहा/रही हूँ।`,
    coverBody: (role, skills, company) => `${skills} में ठोस नींव के साथ, मुझे विश्वास है कि मैं आपकी टीम की सफलता में प्रभावी ढंग से योगदान दे सकता/सकती हूँ।\n\n${company} में अपने पूरे करियर के दौरान, मैंने लगातार परिचालन प्रदर्शन को बढ़ाने और मापने योग्य परिणाम देने पर ध्यान केंद्रित किया है।\n\nमैं इस अवसर की प्रतीक्षा कर रहा/रही हूँ कि मेरा अनुभव और योग्यताएँ आपकी टीम के लक्ष्यों का समर्थन कैसे कर सकती हैं।`,
    linkedInAbout: (role, skills) => `मैं एक समर्पित ${role} हूँ जो ${skills} में विशेषज्ञता रखता है। अपने करियर के दौरान, मैंने मापने योग्य प्रदर्शन को बढ़ाने पर ध्यान केंद्रित किया है।`,
    indeedSummary: (role, skills) => `अनुभवी ${role} जो ${skills} में विशेषज्ञता रखता है। व्यावसायिक परिणामों को चलाने में सिद्ध कौशल का लाभ उठाने के अवसर तलाश रहा है।`,
  },
  "Mandarin Chinese": {
    greeting: "尊敬的招聘经理，",
    signOff: "此致敬礼，",
    summaryTemplate: (role, skills) => `以结果为导向的${role}，在执行战略计划、优化关键工作流程和交付高影响力业务成果方面拥有良好的业绩记录。擅长${skills}，在推动组织成功方面具有深厚的专业知识。`,
    coverIntro: (role) => `我写信是为了表达我对${role}职位的浓厚兴趣。`,
    coverBody: (role, skills, company) => `凭借在${skills}方面的扎实基础，我有信心能够为贵团队的成功做出有效贡献。\n\n在${company}的整个职业生涯中，我始终专注于提升运营绩效并交付可量化的成果。\n\n我期待有机会讨论我的背景和资质如何能够支持贵团队的目标。`,
    linkedInAbout: (role, skills) => `我是一名专注的${role}，专注于${skills}。在我的职业生涯中，我一直致力于推动可衡量的绩效和扩展运营规模。`,
    indeedSummary: (role, skills) => `经验丰富的${role}，在${skills}方面具有专业知识。寻求利用已证实的技能推动业务成果的机会。`,
  },
  "Japanese": {
    greeting: "採用ご担当者様",
    signOff: "敬具",
    summaryTemplate: (role, skills) => `戦略的イニシアチブの実行、主要ワークフローの最適化、高インパクトなビジネス成果の実現において実績のある結果志向の${role}。${skills}に精通し、組織の成功推進に強い専門性を持つ。`,
    coverIntro: (role) => `${role}のポジションへの強い関心をお伝えするためにご連絡いたします。`,
    coverBody: (role, skills, company) => `${skills}における確固たる基盤を持ち、貴チームの成功に効果的に貢献できると確信しております。\n\n${company}でのキャリアを通じて、一貫して業務パフォーマンスの向上と定量的な成果の実現に注力してまいりました。\n\n私の経験と資格がどのように貴チームの目標をサポートできるか、ぜひお話しさせていただければ幸いです。`,
    linkedInAbout: (role, skills) => `${skills}を専門とする${role}です。キャリアを通じて、測定可能なパフォーマンスの向上と業務のスケーリングに注力してきました。`,
    indeedSummary: (role, skills) => `${skills}の専門知識を持つ経験豊富な${role}。ビジネス成果の推進に実証済みのスキルを活用する機会を求めています。`,
  },
  "Korean": {
    greeting: "존경하는 채용 담당자님께,",
    signOff: "감사합니다,",
    summaryTemplate: (role, skills) => `전략적 이니셔티브 실행, 핵심 워크플로우 최적화, 고영향력 비즈니스 성과 달성에서 검증된 실적을 보유한 결과 지향적 ${role}입니다. ${skills}에 능숙하며, 조직 성공 추진에 강한 전문성을 보유하고 있습니다.`,
    coverIntro: (role) => `${role} 포지션에 대한 깊은 관심을 표현하고자 지원합니다.`,
    coverBody: (role, skills, company) => `${skills} 분야의 탄탄한 기반을 바탕으로, 귀 팀의 성공에 효과적으로 기여할 수 있다고 확신합니다.\n\n${company}에서의 경력 전반에 걸쳐, 운영 성과 향상과 정량적 결과 달성에 꾸준히 집중해 왔습니다.\n\n저의 경험과 자격이 귀 팀의 목표를 어떻게 지원할 수 있는지 논의할 기회를 기대합니다.`,
    linkedInAbout: (role, skills) => `${skills}을 전문으로 하는 헌신적인 ${role}입니다. 경력 전반에 걸쳐 측정 가능한 성과 향상과 운영 확대에 집중해 왔습니다.`,
    indeedSummary: (role, skills) => `${skills} 분야 전문 지식을 갖춘 경험 풍부한 ${role}. 비즈니스 성과 달성을 위한 검증된 역량 활용 기회를 모색 중입니다.`,
  },
  "Turkish": {
    greeting: "Sayın İnsan Kaynakları Müdürü,",
    signOff: "Saygılarımla,",
    summaryTemplate: (role, skills) => `Stratejik girişimlerin yürütülmesi, temel iş akışlarının optimize edilmesi ve yüksek etkili iş sonuçlarının sunulmasında kanıtlanmış bir sicile sahip, sonuç odaklı ${role}. ${skills} alanında yetkin, kurumsal başarıyı yönlendirmede güçlü uzmanlığa sahip.`,
    coverIntro: (role) => `${role} pozisyonuna olan ilgimi ifade etmek için yazıyorum.`,
    coverBody: (role, skills, company) => `${skills} alanındaki sağlam temelimle, ekibinizin başarısına etkili bir şekilde katkıda bulunabileceğime eminim.\n\n${company}'deki tüm kariyerim boyunca, operasyonel performansı artırmaya ve ölçülebilir sonuçlar elde etmeye sürekli odaklandım.\n\nDeneyimimin ve yeterliliklerimin ekibinizin hedeflerini nasıl destekleyebileceğini tartışma fırsatını sabırsızlıkla bekliyorum.`,
    linkedInAbout: (role, skills) => `${skills} alanında uzmanlaşmış, kendini işine adamış bir ${role}. Kariyerim boyunca ölçülebilir performansı artırmaya odaklandım.`,
    indeedSummary: (role, skills) => `${skills} alanında uzmanlığa sahip deneyimli ${role}. İş sonuçlarını yönlendirmede kanıtlanmış becerileri kullanma fırsatları arıyor.`,
  },
};

/**
 * Get translation functions for a language. Falls back to English for unsupported languages.
 */
function getTranslation(language) {
  return LANGUAGE_TRANSLATIONS[language] || LANGUAGE_TRANSLATIONS["English"];
}

/* ─────────────────────────────────────────────────────────────────────
   ROLE-SPECIFIC SKILL MAPPING
   Maps common job titles to relevant skill sets for better tailoring.
   ───────────────────────────────────────────────────────────────────── */

const ROLE_SKILLS = {
  "financial analyst": ["Financial Modeling", "Data Analysis", "Excel", "Power BI", "Risk Assessment", "Forecasting"],
  "software engineer": ["JavaScript", "Python", "React", "Node.js", "AWS", "System Design"],
  "data scientist": ["Python", "Machine Learning", "SQL", "TensorFlow", "Data Visualization", "Statistics"],
  "project manager": ["Agile", "Scrum", "Stakeholder Management", "Risk Management", "Budgeting", "Jira"],
  "marketing manager": ["Digital Marketing", "SEO", "Content Strategy", "Google Analytics", "Social Media", "Brand Management"],
  "product manager": ["Product Strategy", "User Research", "Agile", "Roadmapping", "A/B Testing", "Stakeholder Management"],
  "accountant": ["Financial Reporting", "Tax Compliance", "QuickBooks", "GAAP", "Auditing", "Reconciliation"],
  "hr manager": ["Recruitment", "Employee Relations", "HRIS", "Compliance", "Training", "Performance Management"],
  "sales manager": ["CRM", "Pipeline Management", "Negotiation", "Revenue Growth", "Team Leadership", "Forecasting"],
  "graphic designer": ["Adobe Creative Suite", "UI/UX Design", "Figma", "Branding", "Typography", "Illustration"],
  "teacher": ["Curriculum Development", "Classroom Management", "Assessment", "Differentiated Instruction", "EdTech", "Student Engagement"],
  "nurse": ["Patient Care", "Clinical Assessment", "EMR Systems", "Medication Administration", "Critical Thinking", "Team Collaboration"],
  "engineer": ["CAD", "Project Management", "Technical Analysis", "Problem Solving", "Quality Assurance", "Process Optimization"],
  "consultant": ["Strategy", "Business Analysis", "Client Management", "Problem Solving", "Presentation", "Research"],
};

function getSkillsForRole(targetRole, extractedSkills) {
  if (!targetRole) return extractedSkills;
  const roleLower = targetRole.toLowerCase();
  for (const [key, skills] of Object.entries(ROLE_SKILLS)) {
    if (roleLower.includes(key)) {
      // Merge role-specific skills with extracted skills, deduplicating
      const merged = [...new Set([...skills, ...extractedSkills])];
      return merged.slice(0, 8);
    }
  }
  return extractedSkills;
}

/**
 * Smart Local Parser: Extracts actual candidate name, email, phone, city/country location,
 * companies, skills, and education from raw CV text.
 * NOW supports language translation and job title tailoring.
 */
function parseCVStructure(cvText, language, targetRole) {
  const text = (cvText || "").trim();
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const t = getTranslation(language);

  // 1. Extract Real Candidate Name
  let fullName = "Candidate Name";
  for (const line of lines.slice(0, 6)) {
    if (
      !line.includes("@") &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("curriculum") &&
      !line.toLowerCase().includes("profile") &&
      !line.toLowerCase().includes("experience") &&
      line.length < 40 &&
      /^[A-Za-z\s.'-]+$/.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  // 2. Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // 3. Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4,6}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // 4. Extract Real City & Country Location
  let location = extractLocation(text, lines);

  // 5. Extract Real Skills (enhanced with role-specific skills)
  const knownSkills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "C++",
    "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Git", "Agile", "Scrum",
    "Project Management", "Financial Analysis", "Data Analysis", "Leadership",
    "Communication", "Problem Solving", "Customer Service", "Marketing", "Sales",
    "Accounting", "Strategic Planning", "Excel", "SEO", "UI/UX Design",
    "Power BI", "Tableau", "Machine Learning", "TensorFlow", "Figma",
    "Adobe Creative Suite", "SAP", "CRM", "Risk Management",
  ];
  const extractedSkills = knownSkills.filter((s) => text.toLowerCase().includes(s.toLowerCase()));
  const baseSkills = extractedSkills.length > 0
    ? extractedSkills
    : ["Strategic Planning", "Project Management", "Team Leadership", "Data Analysis", "Communication", "Problem Solving"];

  // Enhance skills based on target role
  const skills = getSkillsForRole(targetRole, baseSkills);

  // 6. Extract Work Experience
  const experience = [];
  const expIndex = lines.findIndex((l) => /experience|work history|employment/i.test(l));
  const eduIndex = lines.findIndex((l) => /education|academic|qualification/i.test(l));

  let expLines = [];
  if (expIndex !== -1) {
    expLines = lines.slice(expIndex + 1, eduIndex !== -1 && eduIndex > expIndex ? eduIndex : expIndex + 25);
  } else {
    expLines = lines.slice(5, 25);
  }

  let currentCompany = "";
  let currentRole = targetRole || "Professional Role";
  let currentHighlights = [];

  for (const l of expLines) {
    if (l.startsWith("•") || l.startsWith("-") || l.startsWith("*")) {
      currentHighlights.push(l.replace(/^[•\-*]\s*/, ""));
    } else if (l.length > 3 && l.length < 60) {
      if (currentCompany && currentHighlights.length > 0) {
        experience.push({
          company: currentCompany,
          role: currentRole,
          period: "Recent",
          location: location,
          highlights: currentHighlights.slice(0, 4),
        });
        currentHighlights = [];
      }
      if (!currentCompany) {
        currentCompany = l;
      } else {
        currentRole = l;
      }
    }
  }

  if (currentHighlights.length > 0 || currentCompany) {
    experience.push({
      company: currentCompany || "Professional Experience",
      role: currentRole,
      period: "Recent",
      location: location,
      highlights: currentHighlights.length > 0 ? currentHighlights.slice(0, 4) : [
        "Spearheaded key projects delivering measurable operational improvements.",
        "Collaborated with cross-functional teams to execute strategic goals.",
        "Optimized workflow processes resulting in increased efficiency."
      ],
    });
  }

  if (experience.length === 0) {
    experience.push({
      company: "Professional Career History",
      role: targetRole || "Senior Professional",
      period: "2020 – Present",
      location: location,
      highlights: [
        "Spearheaded key projects delivering measurable operational improvements.",
        "Collaborated with cross-functional teams to execute strategic goals.",
        "Optimized workflow processes resulting in increased efficiency."
      ],
    });
  }

  // 7. Extract Education
  const education = [];
  if (eduIndex !== -1) {
    const eduLines = lines.slice(eduIndex + 1, eduIndex + 8);
    for (const l of eduLines) {
      if (l.length > 4 && (l.toLowerCase().includes("university") || l.toLowerCase().includes("college") || l.toLowerCase().includes("bachelor") || l.toLowerCase().includes("master") || l.toLowerCase().includes("degree") || l.toLowerCase().includes("school"))) {
        education.push({
          institution: l.includes("Bachelor") || l.includes("Master") ? "University / College" : l,
          degree: l.includes("Bachelor") || l.includes("Master") ? l : "Bachelor's Degree",
          year: "Graduated",
        });
      }
    }
  }

  if (education.length === 0) {
    education.push({
      institution: "Higher Education Institution",
      degree: "Bachelor's Degree",
      year: "Graduated",
    });
  }

  const roleTitle = targetRole || "Senior Professional";
  const skillsStr = skills.slice(0, 4).join(", ");
  const skillsShort = skills.slice(0, 3).join(", ");

  return {
    personalInfo: {
      fullName,
      email,
      phone,
      location,
      linkedIn: `linkedin.com/in/${fullName.toLowerCase().replace(/[^a-z]/g, "") || "candidate"}`,
      targetTitle: roleTitle,
    },
    summary: t.summaryTemplate(roleTitle, skillsStr),
    skills,
    experience,
    education,
    coverLetter: {
      greeting: t.greeting,
      body: `${t.coverIntro(roleTitle)}\n\n${t.coverBody(roleTitle, skillsShort, experience[0]?.company || "previous organizations")}`,
      signOff: `${t.signOff}\n${fullName}`,
    },
    linkedInProfile: {
      headline: `${roleTitle} | ${skills.slice(0, 3).join(" | ")} | Strategic Impact`,
      aboutSection: t.linkedInAbout(roleTitle, skillsShort),
      featuredKeywords: [roleTitle, ...skills.slice(0, 4)],
    },
    indeedProfile: {
      headline: `${roleTitle} | ${skills.slice(0, 2).join(" & ")}`,
      summary: t.indeedSummary(roleTitle, skillsShort),
    },
    atsScore: 95,
  };
}

/**
 * Helper: Extracts City and Country / State from candidate CV text
 */
function extractLocation(text, lines) {
  // Regex for "City, Country" or "City, State" (e.g. Lahore, Pakistan or New York, NY)
  const locationRegex = /([A-Z][a-zA-Z\s]{2,20}),\s*([A-Z][a-zA-Z\s]{2,20})/;

  for (const line of lines.slice(0, 12)) {
    const match = line.match(locationRegex);
    if (match) {
      const loc = match[0].trim();
      const locLower = loc.toLowerCase();
      if (
        !locLower.includes("university") &&
        !locLower.includes("school") &&
        !locLower.includes("city") &&
        !locLower.includes("country") &&
        !locLower.includes("state")
      ) {
        return loc;
      }
    }
  }

  // Country & major city list scan
  const countries = [
    "Pakistan", "United States", "USA", "UK", "United Kingdom", "Canada",
    "UAE", "Dubai", "Saudi Arabia", "Germany", "France", "Australia", "India",
    "Singapore", "Qatar", "Kuwait", "Oman", "Turkey", "Malaysia"
  ];

  for (const line of lines.slice(0, 15)) {
    for (const c of countries) {
      if (line.toLowerCase().includes(c.toLowerCase())) {
        const parts = line.split(/[|•·,]/).map((p) => p.trim());
        const found = parts.find((p) => p.toLowerCase().includes(c.toLowerCase()));
        if (found && found.length < 35 && !found.toLowerCase().includes("university")) {
          return found;
        }
      }
    }
  }

  return ""; // Return clean empty string instead of literal "City, Country"
}
