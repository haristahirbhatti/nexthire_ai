// Phase 1 mock generator: simulates what the real CV/job-title analysis
// endpoint returns, with full multilingual support for Arabic, French, Spanish, German, etc.

const CV_QUESTION_BANK = {
  English: [
    { q: "Walk me through your CV, starting with your most recent role.", a: "A concise 90-second walkthrough moving from current role backward, tying each stop to measurable outcomes and the throughline that explains why the next role makes sense." },
    { q: "You list three years at your last company — what's the achievement you're proudest of there?", a: "One specific, metric-backed win (e.g. \"cut onboarding time 40%\") described in Situation → Action → Result form, not a restated job duty." },
    { q: "Your CV shows a gap between roles — can you tell me about that period?", a: "A direct, non-defensive account of what happened and what was learned or built during the gap, then a bridge back to current readiness." },
    { q: "I see you moved from a technical role into a leadership one. What prompted that shift?", a: "A clear motivation (mentoring, systems thinking, wanting broader impact) paired with one concrete example of leadership already exercised before the formal title." },
    { q: "Which tools or systems on your CV have you used most recently, and how confident are you with them?", a: "An honest self-rating per tool, anchored to a recent project, avoiding blanket claims of expertise across everything listed." },
    { q: "Your CV mentions cross-functional collaboration — describe a time that collaboration was difficult.", a: "A specific conflict, the concrete step taken to resolve it, and the measurable outcome, told without blaming the other party." },
    { q: "What's a responsibility on your CV that you'd want to leave behind in your next role?", a: "A candid answer that reframes as growth-seeking rather than complaint, tied to what the candidate wants to do more of instead." },
    { q: "One of your bullet points mentions a project that shipped late — what happened?", a: "Ownership of the root cause, the specific corrective action taken, and what changed in the candidate's process afterward." },
    { q: "How did the scope of your role change over the time you were there?", a: "A before/after comparison showing expanding scope or responsibility, with one concrete marker of trust earned (budget, headcount, ownership)." },
    { q: "If I called your last manager right now, what would they say your biggest strength is?", a: "A specific, verifiable strength (not a soft-skill cliché) that the candidate can back with one recent example." },
  ],
  Arabic: [
    { q: "تحدث عن مسيرتك المهنية وسيرتك الذاتية، بدءاً من أحدث دور وظيفي قمت به.", a: "إجابة موجزة ومركزة في دقيقة ونصف تنتقل من الدور الحالي إلى السابق، مع ربط كل محطة بنتائج ملموسة وسبب ملاءمة هذا المنصب لمسارك." },
    { q: "لديك خبرة في شركتك السابقة — ما هو الإنجاز العملي الأبرز الذي تفتخر به هناك؟", a: "إنجاز ملموس ومحدد مدعوم بالأرقام والنتائج، بصيغة الموقف ثم الإجراء ثم النتيجة، بدلاً من الاكتفاء بسرد المهام الوظيفية." },
    { q: "توضح سيرتك الذاتية فترة انقطاع بين الوظائف — هل يمكنك إخباري عن تلك الفترة وما تعلمته خلالها؟", a: "شرح مباشر وإيجابي لما تم بناؤه أو تعلمه خلال فترة الانقطاع، مع إبراز الجاهزية التامة للعودة بقوة إلى بيئة العمل." },
    { q: "نلاحظ انتقالك من دور تقني وتنفيذي إلى دور قيادي. ما الدافع الحقيقي وراء هذا التحول؟", a: "توضيح الدوافع المهنية كالرغبة في التوجيه والتأثير الأوسع، مدعومة بمثال عملي على ممارسة القيادة قبل الحصول على المسمى الرسمي." },
    { q: "ما هي الأدوات والأنظمة في سيرتك الذاتية التي استخدمتها مؤخراً، وما مدى ثقتك وإتقانك لها؟", a: "تقييم ذاتي دقيق وصادق لكل مهارة مرتبطة بمشروع حديث، وتجنب الادعاءات المطلقة بالخبرة دون أمثلة واقعية." },
    { q: "تذكر سيرتك الذاتية العمل مع فرق متعددة التخصصات — صف موقفاً كان فيه التعاون صعباً وكيف تجاوزته.", a: "ذكر تحدٍ حقيقي والخطوات الملموسة المتخذة لحله والوصول إلى نتيجة إيجابية دون إلقاء اللوم على الزملاء." },
    { q: "ما هي المسؤولية في سيرتك الذاتية التي ترغب في التخلي عنها في دورك القادم للتركيز على نموك المهني؟", a: "إجابة صريحة وإيجابية تؤطر التغيير كفرصة للنمو والتطوير بدلاً من التذمر، وتحدد المجالات التي يسعى المرشح للتخصص فيها." },
    { q: "حدثنا عن مشروع واجه تأخيراً في موعد التسليم — ما هي الأسباب وكيف تعاملت مع الموقف؟", a: "تحمل مسؤولية السبب الجذري وشرح الإجراء التصحيحي المتخذ وما تم تغييره في آلية العمل بعد ذلك." },
    { q: "كيف تطور نطاق مسؤولياتك وحجم الثقة التي اكتسبتها خلال فترة عملك السابقة؟", a: "مقارنة قبل وبعد توضح اتساع نطاق الصلاحيات، مع تقديم دليل واضح على الثقة المكتسبة مثل إدارة ميزانية أو فريق." },
    { q: "إذا تواصلنا مع مديرك السابق الآن، ما هي أبرز نقطة قوة حقيقية سيشيد بها في أدائك؟", a: "نقطة قوة مهنية محددة وقابلة للإثبات، يدعمها المرشح بمثال حديث وواقعي من تجاربه السابقة." },
  ],
  French: [
    { q: "Parlez-moi de votre parcours professionnel en commençant par votre rôle le plus récent.", a: "Un résumé concis reliant vos expériences précédentes à des résultats concrets et expliquant la suite logique de votre carrière." },
    { q: "Vous avez passé plusieurs années dans votre dernière entreprise — quelle est votre plus grande réussite ?", a: "Un succès mesurable et précis décrit avec la méthode STAR (Situation, Tâche, Action, Résultat)." },
    { q: "Votre CV présente une période d'inactivité — que pouvez-vous m'en dire ?", a: "Une explication honnête et constructive des compétences acquises pendant cette période et de votre motivation actuelle." },
    { q: "Pourquoi avez-vous choisi de vous orienter vers des responsabilités plus stratégiques ?", a: "Une vision claire de votre leadership accompagnée d'exemples concrets de projets menés avec succès." },
    { q: "Quels outils techniques mentionnés sur votre CV maîtrisez-vous le mieux aujourd'hui ?", a: "Une évaluation honnête et argumentée de vos compétences techniques appliquée à des cas réels." },
    { q: "Décrivez une situation de collaboration inter-équipes difficile et la façon dont vous l'avez surmontée.", a: "Un cas concret de résolution de conflit axé sur les résultats et la cohésion d'équipe." },
    { q: "Quelle responsabilité souhaitez-vous laisser derrière vous dans votre prochain poste ?", a: "Une réponse constructive orientée vers le développement professionnel et les nouvelles compétences visées." },
    { q: "Racontez-nous un projet qui a pris du retard — que s'est-il passé et comment avez-vous réagi ?", a: "Prise de responsabilité claire, mesures correctives mises en place et leçons apprises." },
    { q: "Comment votre champ d'action et vos responsabilités ont-ils évolué au fil du temps ?", a: "Démonstration de votre progression, autonomie accrue et confiance gagnée auprès de la direction." },
    { q: "Si nous contactions votre précédent manager, quelle serait votre principale qualité selon lui ?", a: "Une force professionnelle concrète et vérifiable, illustrée par un exemple probant." },
  ],
  Spanish: [
    { q: "Cuénteme sobre su trayectoria profesional, comenzando por su puesto más reciente.", a: "Un recorrido conciso de 90 segundos conectando sus logros pasados con las razones por las que este puesto es el siguiente paso lógico." },
    { q: "¿Cuál es el mayor logro profesional del que se siente más orgulloso en su último empleo?", a: "Un logro específico respaldado con métricas, explicado mediante la estructura Situación, Acción y Resultado." },
    { q: "Hay un espacio entre empleos en su currículum — ¿podría explicarme sobre ese período?", a: "Un relato transparente y propositivo de lo aprendido o desarrollado durante ese tiempo, mostrando preparación actual." },
    { q: "¿Qué le motivó a asumir mayores responsabilidades de liderazgo?", a: "Una motivación auténtica hacia la mentoría y el impacto estratégico, respaldada con ejemplos de liderazgo efectivo." },
    { q: "¿Cuáles son las herramientas de su currículum con las que se siente más seguro trabajando?", a: "Una autoevaluación honesta y demostrable vinculada a proyectos recientes exitosos." },
    { q: "Describa una ocasión en la que la colaboración con otro equipo fue difícil y cómo lo resolvió.", a: "Un conflicto profesional abordado con madurez, pasos de acción claros y un resultado favorable sin culpar a terceros." },
    { q: "¿Qué responsabilidad de su currículum le gustaría dejar atrás en su próximo rol?", a: "Un enfoque constructivo de búsqueda de crecimiento y nuevas áreas de impacto en lugar de quejas." },
    { q: "Mencione un proyecto que sufrió retrasos — ¿qué ocurrió y cómo actuó para solucionarlo?", a: "Aceptación de responsabilidad, soluciones implementadas y mejoras duraderas en sus procesos." },
    { q: "¿Cómo creció el alcance de su trabajo y la confianza depositada en usted con el tiempo?", a: "Una comparación clara de antes y después que evidencie un aumento en responsabilidades y liderazgo." },
    { q: "Si llamáramos a su supervisor anterior ahora mismo, ¿cuál diría que es su mayor fortaleza?", a: "Una fortaleza sólida, comprobable y respaldada por un caso real de trabajo en equipo." },
  ],
  German: [
    { q: "Führen Sie mich durch Ihren Lebenslauf, beginnend mit Ihrer jüngsten Position.", a: "Eine präzise Zusammenfassung der wichtigsten Stationen und messbaren Ergebnisse, die Ihre Eignung für diese Rolle belegt." },
    { q: "Auf welchen messbaren Erfolg in Ihrem letzten Unternehmen sind Sie besonders stolz?", a: "Ein konkreter, datengestützter Erfolg, dargestellt nach dem Prinzip Situation → Handlung → Ergebnis." },
    { q: "Ihr Lebenslauf zeigt eine Pause zwischen Stationen — können Sie mir diesen Zeitraum erläutern?", a: "Eine transparente Darstellung der Weiterbildung oder persönlichen Entwicklung während dieser Zeit." },
    { q: "Was hat Sie dazu bewogen, Führungsverantwortung zu übernehmen?", a: "Eine klare Motivation für Mentoring und strategisches Handeln, untermauert mit konkreten Praxisbeispielen." },
    { q: "Mit welchen der in Ihrem Lebenslauf genannten Werkzeuge arbeiten Sie aktuell am sichersten?", a: "Eine ehrliche und fundierte Selbsteinschätzung bezogen auf aktuelle Arbeitsprojekte." },
    { q: "Beschreiben Sie eine herausfordernde Zusammenarbeit zwischen verschiedenen Teams.", a: "Lösungsorientierter Umgang mit Konflikten und das Erreichen gemeinsamer Ziele." },
    { q: "Welche bisherige Aufgabe möchten Sie in Ihrer nächsten Rolle nicht mehr übernehmen?", a: "Ein konstruktiver Fokus auf berufliche Weiterentwicklung und neue Schwerpunkte." },
    { q: "Berichten Sie von einem Projekt, das verzögert wurde — wie haben Sie reagiert?", a: "Verantwortungsbewusstsein, proaktive Korrekturmaßnahmen und Prozessverbesserungen." },
    { q: "Wie hat sich Ihr Verantwortungsbereich im Laufe der Zeit erweitert?", a: "Ein sichtbarer Nachweis von Vertrauenszuwachs und zunehmender Eigenverantwortung." },
    { q: "Was würde Ihre vorherige Führungskraft als Ihre größte Stärke bezeichnen?", a: "Eine greifbare, belegbare Kernkompetenz mit direktem Bezug zu Ihren Erfolgen." },
  ],
};

const ROLE_QUESTION_BANK = {
  English: (role) => [
    { q: `What do you think is the hardest part of succeeding as a ${role} in the first 90 days?`, a: "Naming a concrete, role-specific challenge and a realistic plan to address it early." },
    { q: `Which metric would you consider most important to track in a ${role} role, and why?`, a: "One well-chosen metric tied directly to core output, explained in terms of value." },
    { q: `Describe a project you'd tackle first if you were hired as ${role} tomorrow.`, a: "A realistic, scoped first project that demonstrates deep understanding of priorities." },
    { q: `What's a common mistake people make early in a ${role} position?`, a: "A specific, credible pitfall paired with how the candidate avoids it." },
    { q: `Why does this ${role} role interest you specifically, beyond the job title?`, a: "A reason grounded in actual day-to-day impact and career trajectory." },
  ],
  Arabic: (role) => [
    { q: `ما هو برأيك التحدي الأكبر لتحقيق النجاح كـ ${role} خلال أول 90 يوماً؟`, a: "تحديد تحدٍ جوهري واقعي مرتبط بطبيعة المنصب، مع وضع خطة واضحة ومبكرة للتعامل معه وإثبات الكفاءة." },
    { q: `ما هو المؤشر أو المقياس الأكثر أهمية الذي تعتمد عليه لتقييم الأداء في دور ${role}، ولماذا؟`, a: "اختيار مقياس ذكي يرتبط مباشرة بمخرجات المنصب الرئيسية، وشرح ما يعكسه هذا المؤشر بدقة." },
    { q: `صف أول مشروع ستعمل عليه إذا تم تعيينك في وظيفة ${role} غداً.`, a: "مشروع أولي واقعي ومحدد يوضح الفهم العميق لأولويات العمل وتقديم قيمة سريعة للفريق." },
    { q: `ما هو الخطأ الشائع الذي يقع فيه الكثيرون في بداية عملهم كـ ${role} وكيف تتفاداه؟` , a: "تحديد خطأ مهني معروف في هذا المجال مع شرح كيفية تجنبه استناداً إلى الوعي والخبرة." },
    { q: `لماذا تثير وظيفة ${role} اهتمامك تحديداً في هذه المرحلة من مسيرتك المهنية؟`, a: "سبب نابع من صميم مهام المنصب وتطلعات المرشح للمساهمة والتطوير وليس مجرد المسمى الوظيفي." },
  ],
  French: (role) => [
    { q: `Selon vous, quelle est la plus grande difficulté pour réussir en tant que ${role} durant les 90 premiers jours ?`, a: "Identifier un défi concret et présenter un plan d'action réaliste pour y répondre rapidement." },
    { q: `Quel indicateur de performance considérez-vous comme le plus crucial pour un ${role} et pourquoi ?`, a: "Un indicateur pertinent aligné directement sur la valeur ajoutée et les objectifs de l'entreprise." },
    { q: `Décrivez le premier projet que vous lanceriez si vous étiez recruté en tant que ${role} demain.`, a: "Un projet ciblé montrant une excellente compréhension des priorités stratégiques." },
    { q: `Quelle est l'erreur la plus fréquente commise par les débutants au poste de ${role} ?`, a: "Un écueil réaliste accompagné de mesures préventives fondées sur votre expérience." },
    { q: `Pourquoi ce poste de ${role} vous intéresse-t-il particulièrement, au-delà du titre ?`, a: "Un alignement authentique entre les missions concrètes du poste et vos compétences clés." },
  ],
  Spanish: (role) => [
    { q: `¿Cuál considera que es el mayor desafío para tener éxito como ${role} en los primeros 90 días?`, a: "Identificar un reto operativo o estratégico específico con un plan claro de ejecución." },
    { q: `¿Qué métrica considera la más importante para monitorear en una posición de ${role}, y por qué?`, a: "Una métrica clave vinculada al valor del negocio y los resultados fundamentales." },
    { q: `Describa el primer proyecto que abordaría si comenzara mañana como ${role}.`, a: "Un proyecto viable que demuestre comprensión de las prioridades del equipo." },
    { q: `¿Cuál es un error común que suelen cometer las personas al iniciar como ${role}?`, a: "Un tropiezo común y creíble junto con las medidas que tomará para evitarlo." },
    { q: `¿Por qué le interesa este puesto de ${role} específicamente, más allá del título profesional?`, a: "Una motivación conectada con el trabajo práctico del día a día y su trayectoria." },
  ],
  German: (role) => [
    { q: `Was ist aus Ihrer Sicht die größte Herausforderung als ${role} in den ersten 90 Tagen?`, a: "Ein konkreter, rollenspezifischer Schwerpunkt mit einem realistischen Umsetzungsplan." },
    { q: `Welche Kennzahl halten Sie für einen ${role} für am wichtigsten und warum?`, a: "Eine fundierte Messgröße, die direkt an den Kernergebnissen der Position ansetzt." },
    { q: `Welches erste Projekt würden Sie angehen, wenn Sie morgen als ${role} starten?`, a: "Ein fokussiertes Vorhaben, das tiefes Verständnis für die operativen Prioritäten belegt." },
    { q: `Welcher Fehler wird zu Beginn in einer ${role}-Rolle häufig gemacht und wie vermeiden Sie ihn?`, a: "Ein realistischer Fehler mit einer professionellen Vermeidungsstrategie." },
    { q: `Warum reizt Sie genau diese Rolle als ${role}, abgesehen von der Berufsbezeichnung?`, a: "Eine nachvollziehbare Motivation basierend auf inhaltlichen Aufgaben und Ihrer Entwicklung." },
  ],
};

/**
 * Builds 15 interview questions tailored to the candidate's CV and role,
 * in the selected language (e.g. Arabic, French, Spanish, German, English).
 *
 * @param {string} jobTitle - The target job title
 * @param {string} language - Interview language name (e.g. "Arabic", "French", "English")
 * @returns {Array<{ id: string, source: string, question: string, ideal: string }>}
 */
export function buildQuestionSet(jobTitle, language = "English") {
  const normLang = normalizeLanguage(language);
  const role = jobTitle?.trim() || getDefaultRoleTitle(normLang);

  const cvList = CV_QUESTION_BANK[normLang] || CV_QUESTION_BANK.English;
  const roleFn = ROLE_QUESTION_BANK[normLang] || ROLE_QUESTION_BANK.English;

  const cvQs = cvList.map((item, i) => ({
    id: `cv-${i + 1}`,
    source: "cv",
    question: item.q,
    ideal: item.a,
  }));

  const roleQs = roleFn(role).map((item, i) => ({
    id: `role-${i + 1}`,
    source: "role",
    question: item.q,
    ideal: item.a,
  }));

  return [...cvQs, ...roleQs];
}

function normalizeLanguage(lang) {
  if (!lang) return "English";
  const l = String(lang).trim().toLowerCase();
  if (l.includes("arab") || l.includes("عربي") || l === "ar") return "Arabic";
  if (l.includes("french") || l.includes("français") || l === "fr") return "French";
  if (l.includes("span") || l.includes("español") || l === "es") return "Spanish";
  if (l.includes("germ") || l.includes("deutsch") || l === "de") return "German";
  return "English";
}

function getDefaultRoleTitle(lang) {
  switch (lang) {
    case "Arabic":
      return "هذا المنصب المهني";
    case "French":
      return "ce poste";
    case "Spanish":
      return "este puesto";
    case "German":
      return "diese Rolle";
    default:
      return "this role";
  }
}
