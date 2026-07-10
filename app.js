const state = {
  bodyGoal: "recomp",
  mindGoal: "calm"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const goalLabels = {
  recomp: "Recomp",
  lean: "Lean",
  muscle: "Muscle",
  endurance: "Endurance",
  starter: "Starter",
  performance: "Performance"
};

const mindLabels = {
  calm: "Calm",
  success: "Success",
  confidence: "Confidence",
  focus: "Focus",
  connection: "Connection",
  happiness: "Happiness"
};

const resources = {
  fitnessResources: [
    {
      kind: "video",
      title: "YouTube form searches",
      tag: "Video layer",
      url: "https://www.youtube.com/results?search_query=beginner+strength+training+proper+form",
      note: "Use video to learn technique, then keep the first weeks simple and repeatable."
    },
    {
      kind: "library",
      title: "ACE Exercise Library",
      tag: "Exercise guide",
      url: "https://www.acefitness.org/resources/everyone/exercise-library/",
      note: "Browse movement patterns, target muscles, and beginner-friendly alternatives."
    },
    {
      kind: "forum",
      title: "Fitness Wiki routines",
      tag: "Community guide",
      url: "https://thefitness.wiki/routines/",
      note: "Compare proven beginner and intermediate routine structures."
    }
  ],
  mentalResources: [
    {
      kind: "mind",
      title: "NIMH stress guide",
      tag: "Science basis",
      url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet",
      note: "Understand stress signals and low-risk coping strategies."
    },
    {
      kind: "video",
      title: "YouTube stress skills",
      tag: "Video layer",
      url: "https://www.youtube.com/results?search_query=NIMH+stress+management+breathing+skills",
      note: "Look for breathing, grounding, and sleep-friendly routines."
    },
    {
      kind: "sleep",
      title: "CDC sleep basics",
      tag: "Recovery",
      url: "https://www.cdc.gov/sleep/about/index.html",
      note: "Anchor your sleep target before trying complicated hacks."
    }
  ],
  nutritionResources: [
    {
      kind: "food",
      title: "CDC healthy eating",
      tag: "Plate design",
      url: "https://www.cdc.gov/healthy-weight-growth/healthy-eating/index.html",
      note: "Public-health basics for building a consistent plate."
    },
    {
      kind: "food",
      title: "MyPlate",
      tag: "Food groups",
      url: "https://www.myplate.gov/",
      note: "A simple visual model for fruit, vegetables, grains, protein, and dairy."
    },
    {
      kind: "warning",
      title: "CDC added sugar",
      tag: "Limit list",
      url: "https://www.cdc.gov/healthy-weight-growth/be-sugar-smart/index.html",
      note: "Spot drinks and snacks that quietly push calories high."
    }
  ],
  skinResources: [
    {
      kind: "skin",
      title: "CDC sun safety",
      tag: "Protection",
      url: "https://www.cdc.gov/skin-cancer/sun-safety/index.html",
      note: "Use shade, clothing, and sunscreen for outdoor training."
    },
    {
      kind: "skin",
      title: "AAD sunscreen guide",
      tag: "Derm guide",
      url: "https://www.aad.org/public/everyday-care/sun-protection/sunscreen/how-to-select-sunscreen",
      note: "Choose broad-spectrum sunscreen and use it correctly."
    },
    {
      kind: "video",
      title: "YouTube skin basics",
      tag: "Video layer",
      url: "https://www.youtube.com/results?search_query=dermatologist+basic+skincare+sunscreen+routine",
      note: "Keep the routine simple: cleanser, moisturizer, sunscreen, slow changes."
    }
  ]
};

function readNumber(id, fallback) {
  const value = Number($(id).value);
  return Number.isFinite(value) ? value : fallback;
}

function profile() {
  return {
    age: readNumber("#age", 20),
    sex: $("#sex").value,
    height: readNumber("#height", 175),
    weight: readNumber("#weight", 70),
    medical: $("#medical").value,
    training: readNumber("#training", 0),
    days: readNumber("#days", 4),
    activity: readNumber("#activity", 1.375),
    skinType: $("#skinType").value,
    skinGoal: $("#skinGoal").value,
    stress: readNumber("#stress", 5),
    sleepQuality: $("#sleepQuality").value,
    attention: $("#attention").value,
    caffeine: $("#caffeine").value
  };
}

function bmrFor(data) {
  const base = 10 * data.weight + 6.25 * data.height - 5 * data.age;
  if (data.sex === "male") return base + 5;
  if (data.sex === "female") return base - 161;
  return base - 78;
}

function calculate(data) {
  const heightM = data.height / 100;
  const bmi = data.weight / (heightM * heightM);
  const bmr = bmrFor(data);
  const tdee = bmr * data.activity;
  const adultSafe = data.age >= 18 && data.medical === "none";
  let calorieDelta = 0;

  if (state.bodyGoal === "lean") calorieDelta = adultSafe ? -Math.min(450, tdee * 0.16) : 0;
  if (state.bodyGoal === "muscle") calorieDelta = adultSafe ? 220 : 0;
  if (state.bodyGoal === "starter") calorieDelta = adultSafe ? -120 : 0;
  if (state.bodyGoal === "endurance") calorieDelta = adultSafe ? 120 : 0;
  if (state.bodyGoal === "performance") calorieDelta = adultSafe ? 80 : 0;

  const target = Math.round((tdee + calorieDelta) / 10) * 10;
  const proteinMultiplier = state.bodyGoal === "muscle" ? 2 : state.bodyGoal === "lean" ? 1.9 : 1.7;
  const protein = Math.round(data.weight * proteinMultiplier);
  const fat = Math.round((target * 0.27) / 9);
  const carbs = Math.max(90, Math.round((target - protein * 4 - fat * 9) / 4));

  return {
    bmi,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target,
    protein,
    fat,
    carbs,
    adultSafe
  };
}

function bmiLabel(bmi) {
  if (bmi < 18.5) return "lower BMI";
  if (bmi < 25) return "standard BMI";
  if (bmi < 30) return "elevated BMI";
  return "high BMI";
}

function sleepTarget(data) {
  if (data.age < 18) return "8-10 hours";
  if (data.age <= 60) return "7-9 hours";
  if (data.age <= 64) return "7-9 hours";
  return "7-8 hours";
}

function trainingTemplate(data) {
  const beginner = data.training < 1 || state.bodyGoal === "starter" || data.medical === "yes";
  const days = Math.min(data.days, beginner ? 4 : data.days);
  const base = {
    recomp: [
      `${days} resistance sessions weekly: full-body or upper/lower split with 6-10 hard sets per major muscle group.`,
      "Add 2 zone-2 cardio sessions for 25-35 minutes to support fat loss without crushing recovery.",
      "Progress one variable at a time: reps first, then load, then sets."
    ],
    lean: [
      `${days} training days: 3-4 lifting sessions plus 2-3 low-impact cardio blocks.`,
      "Keep heavy compound lifts early in the session, then finish with controlled accessory work.",
      "Daily target: 7,000-10,000 steps unless your joints or clinician say otherwise."
    ],
    muscle: [
      `${Math.max(4, days)} hypertrophy sessions weekly: push, pull, legs, upper or full-body split.`,
      "Use 8-15 rep ranges, stop 1-3 reps before failure, and add load when top reps feel clean.",
      "Keep cardio easy and short, 2 sessions of 20 minutes, so calories support growth."
    ],
    endurance: [
      "Run, bike, row, or brisk walk 3 times weekly: one easy, one interval, one longer steady session.",
      "Strength train 2 days weekly using squats, hinges, rows, presses, carries, and core work.",
      "Hard cardio works best after a warm-up and away from heavy lower-body lifting."
    ],
    starter: [
      "Start with 3 full-body sessions weekly: squat pattern, hinge, push, pull, carry, and core.",
      "Keep every set smooth. Stop before form breaks and add only 5-10% weekly volume.",
      "Walk 10 minutes after two meals. This is easy but powerful for consistency."
    ],
    performance: [
      `${days} sessions weekly: 2 strength days, 1 power day, 1 conditioning day, and 1 mobility/recovery block if available.`,
      "Place explosive work first, strength second, conditioning last.",
      "Track jump, sprint, or rep speed quality. Performance drops signal recovery debt."
    ]
  };
  return base[state.bodyGoal];
}

function dietTemplate(data, calc) {
  const deficitNote = calc.adultSafe
    ? "The target uses a conservative calorie adjustment from estimated maintenance."
    : "Calories are kept near maintenance because age or medical flags require professional guidance.";
  return [
    `${calc.target} kcal/day estimate: ${calc.protein} g protein, ${calc.carbs} g carbs, ${calc.fat} g fat.`,
    deficitNote,
    "Build plates with protein, colorful vegetables, fruit, whole grains or potatoes, and healthy fats.",
    "Helpful foods: Greek yogurt, eggs, fish, tofu, beans, berries, leafy greens, oats, rice, potatoes, olive oil, nuts, and water.",
    "Limit frequent sugary drinks, heavy alcohol, deep-fried fast food, and ultra-processed snacks because they add calories with low satiety and can disrupt skin, sleep, and energy."
  ];
}

function skinTemplate(data) {
  const typeAdvice = {
    balanced: "Use a gentle cleanser, light moisturizer, and daily sun protection.",
    dry: "Use a creamy cleanser, richer moisturizer, and avoid harsh exfoliation while repairing the barrier.",
    oily: "Use a gentle gel cleanser, non-comedogenic moisturizer, and avoid stripping the skin.",
    sensitive: "Patch test new products, avoid fragrance-heavy products, and keep the routine minimal."
  };
  const goalAdvice = {
    glow: "Support texture with sleep consistency, vegetables and fruit, and gentle exfoliation only if tolerated.",
    acne: "Keep sweat rinse simple after training, avoid picking, and consider dermatologist support for persistent acne.",
    barrier: "Prioritize moisturizer, reduce strong actives, and protect from sun and wind.",
    sun: "Use broad-spectrum sunscreen, shade, protective clothing, and reapply during outdoor exposure."
  };
  return [
    typeAdvice[data.skinType],
    goalAdvice[data.skinGoal],
    "Morning: cleanse if needed, moisturize, then broad-spectrum sunscreen on exposed skin.",
    "Night: cleanse sweat or sunscreen, moisturize, and keep active ingredients slow and consistent.",
    "Outdoor training: schedule earlier or later when possible and reapply sunscreen after sweating."
  ];
}

function mentalTemplate(data) {
  const common = [
    "Use a 5-minute daily check-in: mood, stress, sleep, movement, and one next action.",
    "When stress rises, pause for slow breathing or a short walk before solving the problem."
  ];
  const mind = {
    calm: [
      "Practice 4 minutes of longer-exhale breathing after school or work.",
      "Reduce worry loops with a 10-minute worry window, then write the next practical action."
    ],
    success: [
      "Plan tomorrow with three targets: body, study/work, and relationship.",
      "Use implementation intentions: if it is 7 PM, then I start the workout warm-up."
    ],
    confidence: [
      "Create proof: record one completed rep, meal, study block, or hard conversation every day.",
      "Train self-talk like a skill: specific, honest, and action-focused."
    ],
    focus: [
      "Use 45-minute deep work blocks with phone away and one visible task.",
      "Close loops at night by writing tomorrow's first task before sleep."
    ],
    connection: [
      "Send one sincere message daily and schedule one real conversation each week.",
      "Practice listening without immediately fixing the other person's emotion."
    ],
    happiness: [
      "Get morning light, move outside, and write three specific gratitude notes daily.",
      "Build joy deliberately: music, friends, sport, creativity, and recovery are not extras."
    ]
  };

  if (data.stress >= 8) {
    common.unshift("High stress signal: choose lighter training intensity this week and ask for support if stress feels unmanageable.");
  }
  if (data.caffeine === "late") {
    common.push("Move caffeine earlier when possible because afternoon caffeine can make sleep quality worse.");
  }
  return [...mind[state.mindGoal], ...common];
}

function sleepTemplate(data) {
  const target = sleepTarget(data);
  const quality = data.sleepQuality === "low"
    ? "Because your sleep quality is low, protect a 30-minute wind-down and keep training intensity moderate at night."
    : "Keep the same wake time most days so circadian timing becomes predictable.";
  return [
    `Target: ${target} of sleep opportunity, adjusted by age.`,
    quality,
    "Best timing: strength training late morning to early evening when possible; avoid very hard sessions right before bed.",
    "Cut off caffeine 8-10 hours before bedtime if sleep is light or delayed.",
    "Bedroom rule: cool, dark, quiet, and no screens for the final 30 minutes."
  ];
}

function renderList(selector, items) {
  $(selector).innerHTML = `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderResources() {
  Object.entries(resources).forEach(([id, items]) => {
    $(`#${id}`).innerHTML = items
      .map(
        (item) => `
          <a class="resourceCard" href="${item.url}" target="_blank" rel="noreferrer">
            <span class="resourceThumb ${item.kind}">
              <i>${item.tag}</i>
            </span>
            <span>
              <strong>${item.title}</strong>
              <em>${item.note}</em>
            </span>
          </a>
        `
      )
      .join("");
  });
}

function activateTilt() {
  $$(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function updateLive() {
  const data = profile();
  const calc = calculate(data);
  $("#liveBmi").textContent = calc.bmi.toFixed(1);
  $("#liveTdee").textContent = `${calc.tdee}`;
  $("#liveGoal").textContent = goalLabels[state.bodyGoal];
}

function renderPlan(shouldScroll = true) {
  const data = profile();
  const calc = calculate(data);
  const body = goalLabels[state.bodyGoal];
  const mind = mindLabels[state.mindGoal];

  $("#summaryTitle").textContent = `${body} body plan + ${mind} mindset protocol`;
  $("#scoreGrid").innerHTML = [
    ["BMI", `${calc.bmi.toFixed(1)}`, bmiLabel(calc.bmi)],
    ["BMR", `${calc.bmr}`, "kcal estimate"],
    ["TDEE", `${calc.tdee}`, "maintenance"],
    ["Target", `${calc.target}`, "kcal/day"],
    ["Protein", `${calc.protein} g`, "daily target"],
    ["Carbs", `${calc.carbs} g`, "training fuel"],
    ["Fat", `${calc.fat} g`, "hormone support"],
    ["Sleep", sleepTarget(data), "daily target"]
  ]
    .map(([label, value, detail]) => `<span>${label}<strong>${value}</strong><small>${detail}</small></span>`)
    .join("");

  const flags = [];
  if (data.medical === "yes") flags.push("Medical flag detected: use conservative intensity and consult a clinician before major diet or training changes.");
  if (data.age < 18) flags.push("Teen mode: avoid aggressive dieting; prioritize sleep, skills, strength basics, and trusted adult guidance.");
  if (calc.bmi < 18.5) flags.push("Lower BMI signal: avoid fat-loss dieting and focus on strength, energy intake, and professional advice if appetite or health is a concern.");
  $("#safetyNote").textContent = flags.length ? flags.join(" ") : "No major caution flag entered. Still adjust for pain, fatigue, symptoms, and professional advice.";

  $("#foodWhy").textContent =
    "The plate model favors protein for muscle repair, carbohydrates for training output, healthy fats for hormones, and colorful plants for fiber and micronutrients.";

  renderList("#workoutCard .resultText", trainingTemplate(data));
  renderList("#sleepCard .resultText", sleepTemplate(data));
  renderList("#dietCard .resultText", dietTemplate(data, calc));
  renderList("#skinCard .resultText", skinTemplate(data));
  renderList("#mindCard .resultText", mentalTemplate(data));

  updateLive();
  if (shouldScroll) $("#report").scrollIntoView({ behavior: "smooth", block: "start" });
}

function planText() {
  return $$("#dashboard .resultPanel")
    .map((panel) => panel.innerText.trim())
    .filter(Boolean)
    .join("\n\n---\n\n");
}

$$("[data-goal]").forEach((button) => {
  button.addEventListener("click", () => {
    state.bodyGoal = button.dataset.goal;
    $$("[data-goal]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
    updateLive();
  });
});

$$("[data-mind]").forEach((button) => {
  button.addEventListener("click", () => {
    state.mindGoal = button.dataset.mind;
    $$("[data-mind]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
  });
});

$$("input, select").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.id === "stress") $("#stressValue").textContent = `${field.value} / 10`;
    updateLive();
  });
});

$("#generatePlan").addEventListener("click", renderPlan);

$("#resetDemo").addEventListener("click", () => {
  $("#profileForm").reset();
  $("#stress").value = 5;
  $("#stressValue").textContent = "5 / 10";
  state.bodyGoal = "recomp";
  state.mindGoal = "calm";
  $$("[data-goal]").forEach((item) => {
    const active = item.dataset.goal === "recomp";
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  $$("[data-mind]").forEach((item) => {
    const active = item.dataset.mind === "calm";
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  updateLive();
});

$("#captureMode").addEventListener("click", () => {
  document.body.classList.toggle("capture");
  if (document.body.classList.contains("capture")) $("#report").scrollIntoView({ behavior: "smooth" });
});

$("#printPlan").addEventListener("click", () => window.print());

$("#copyPlan").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(planText());
    $("#copyPlan").textContent = "Copied";
    setTimeout(() => {
      $("#copyPlan").textContent = "Copy Summary";
    }, 1200);
  } catch {
    $("#copyPlan").textContent = "Copy blocked";
  }
});

$("#developerToggle").addEventListener("click", () => {
  const card = $("#developerCard");
  card.hidden = !card.hidden;
  if (!card.hidden) card.scrollIntoView({ behavior: "smooth", block: "center" });
});

updateLive();
renderResources();
activateTilt();
renderPlan(false);
