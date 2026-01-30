export interface CrimeQuestion {
  id: number;
  category: string;
  question: string;
  context?: string;
  options: {
    label: string;
    value: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
  actualData: string;
  explanation: string;
  surprise: "low" | "medium" | "high"; // How surprising this typically is to people
  sources: {
    title: string;
    url: string;
  }[];
}

export const crimeQuestions: CrimeQuestion[] = [
  {
    id: 1,
    category: "Incarceration Rates",
    question: "Compared to native-born U.S. citizens, how likely are immigrants to be incarcerated?",
    context: "Based on a 150-year longitudinal study by the National Bureau of Economic Research (NBER) analyzing Census data from 1870-2020.",
    options: [
      { label: "Much less likely (60%+ lower)", value: "much-lower", isCorrect: true },
      { label: "Somewhat less likely", value: "somewhat-lower", isCorrect: false },
      { label: "About the same", value: "same", isCorrect: false },
      { label: "Somewhat more likely", value: "somewhat-higher", isCorrect: false },
      { label: "Much more likely (2x or higher)", value: "much-higher", isCorrect: false },
    ],
    correctAnswer: "much-lower",
    actualData: "60% less likely",
    explanation: "As of 2020 Census data, immigrants are 60% less likely to be incarcerated than native-born U.S. citizens. This gap persists across all major sending regions, including Mexico and Central America. Even when comparing only low-education cohorts (those most economically marginalized), the immigrant incarceration rate is significantly lower.",
    surprise: "high",
    sources: [
      {
        title: "NBER: The Incarceration Gap Between Immigrants and the US-born, 1870–2020",
        url: "https://www.nber.org/papers/w31440",
      },
      {
        title: "American Economic Association Publication",
        url: "https://www.aeaweb.org/articles?id=10.1257/aeri.20230459",
      },
    ],
  },
  {
    id: 2,
    category: "Texas Homicide Data",
    question: "In Texas (2013-2022), what was the homicide conviction rate for undocumented immigrants compared to native-born citizens?",
    context: "Texas is the only state that systematically cross-references every arrestee's fingerprints against DHS databases, allowing direct comparison by legal status.",
    options: [
      { label: "Higher than native-born rate", value: "higher", isCorrect: false },
      { label: "About the same as native-born", value: "same", isCorrect: false },
      { label: "Slightly lower (10-15%)", value: "slightly-lower", isCorrect: false },
      { label: "Moderately lower (26%)", value: "moderately-lower", isCorrect: true },
      { label: "Much lower (50%+)", value: "much-lower", isCorrect: false },
    ],
    correctAnswer: "moderately-lower",
    actualData: "26% lower (2.2 vs 3.0 per 100,000)",
    explanation: "The homicide conviction rate for native-born Texans was 3.0 per 100,000. For undocumented immigrants, it was 2.2 per 100,000—meaning an undocumented individual in Texas is approximately 26% less likely to be convicted of homicide than a native-born citizen. Legal immigrants had the lowest rate at 1.2 per 100,000.",
    surprise: "high",
    sources: [
      {
        title: "Cato Institute: Illegal Immigrant Murderers in Texas, 2013–2022",
        url: "https://www.cato.org/policy-analysis/illegal-immigrant-murderers-texas-2013-2022",
      },
      {
        title: "Texas DPS Criminal Illegal Noncitizen Data",
        url: "https://www.dps.texas.gov/section/crime-records/texas-criminal-illegal-noncitizen-data",
      },
    ],
  },
  {
    id: 3,
    category: "NYC Migrant Influx",
    question: "New York City received 170,000+ migrants between 2022-2024. What happened to violent crime rates during this period?",
    context: "This was the largest migrant influx to NYC in recent history, straining city resources and generating intense media coverage.",
    options: [
      { label: "Violent crime surged significantly", value: "surged", isCorrect: false },
      { label: "Violent crime decreased", value: "decreased", isCorrect: true },
      { label: "Violent crime increased moderately", value: "increased", isCorrect: false },
      { label: "Violent crime stayed about the same", value: "same", isCorrect: false },
    ],
    correctAnswer: "decreased",
    actualData: "Murders and shootings dropped by double digits",
    explanation: "Contrary to the 'migrant crime wave' narrative, NYPD data shows that during the peak of the migrant influx (2023–2024), major violent crime categories trended downward. Murders and shootings dropped by double digits compared to 2022 levels. Crime near migrant shelters represented less than 1% of the city's total crime volume.",
    surprise: "high",
    sources: [
      {
        title: "Brennan Center: 2025 Trends in Crime and Safety in New York City",
        url: "https://www.brennancenter.org/our-work/research-reports/2025-trends-crime-and-safety-new-york-city",
      },
      {
        title: "John Jay College Research",
        url: "https://johnjayrec.nyc/2024/02/15/nytimes20240215/",
      },
    ],
  },
  {
    id: 4,
    category: "Chicago Crime Trends",
    question: "Chicago received 35,000+ migrants during 2022-2024. How did homicide rates change?",
    context: "Chicago has struggled with gun violence for decades. Critics predicted the migrant influx would worsen the situation.",
    options: [
      { label: "Homicides decreased (~16%)", value: "decreased", isCorrect: true },
      { label: "Homicides increased significantly", value: "increased-sig", isCorrect: false },
      { label: "Homicides stayed about the same", value: "same", isCorrect: false },
      { label: "Homicides increased slightly", value: "increased-slight", isCorrect: false },
    ],
    correctAnswer: "decreased",
    actualData: "Homicides down ~16%, shootings down 30%+",
    explanation: "Far from causing a crime wave, the period of highest migrant arrival coincided with a historic drop in violence. By the end of 2024, homicides in Chicago were down roughly 16%, and shootings had decreased by over 30%, reaching their lowest levels since 2019.",
    surprise: "high",
    sources: [
      {
        title: "University of Chicago Crime Lab: 2024 End-of-Year Analysis",
        url: "https://crimelab.uchicago.edu/resources/2024-end-of-year-analysis-chicago-crime-trends/",
      },
      {
        title: "Chicago Police Department: 2024 in Review",
        url: "https://www.chicagopolice.org/wp-content/uploads/2024-in-Review.pdf",
      },
    ],
  },
  {
    id: 5,
    category: "Federal Prosecutions",
    question: "What percentage of noncitizens sentenced in federal courts (2018-2023) were convicted of immigration violations specifically?",
    context: "Immigration violations (illegal entry, reentry) are crimes that, by definition, can only be committed by noncitizens.",
    options: [
      { label: "About 25%", value: "25", isCorrect: false },
      { label: "About 40%", value: "40", isCorrect: false },
      { label: "About 76%", value: "76", isCorrect: true },
      { label: "About 55%", value: "55", isCorrect: false },
    ],
    correctAnswer: "76",
    actualData: "76% were immigration violations",
    explanation: "In federal courts, 'immigrant crime' is largely a tautology. 76% of noncitizens sentenced in federal courts were convicted of immigration violations—crimes that by definition can only be committed by noncitizens. This statistic is often cited to show high 'immigrant criminality' without acknowledging that these are status-based offenses, not violent or property crimes.",
    surprise: "medium",
    sources: [
      {
        title: "U.S. Sentencing Commission: Federally Sentenced Non-U.S. Citizens",
        url: "https://www.ussc.gov/research/quick-facts/federally-sentenced-non-us-citizens",
      },
    ],
  },
  {
    id: 6,
    category: "ICE Detention",
    question: "As of January 2026, what percentage of people in ICE detention had NO criminal convictions (excluding immigration violations)?",
    context: "ICE arrests increased significantly in late 2025 following policy changes.",
    options: [
      { label: "About 20%", value: "20", isCorrect: false },
      { label: "About 73%", value: "73", isCorrect: true },
      { label: "About 40%", value: "40", isCorrect: false },
      { label: "About 55%", value: "55", isCorrect: false },
    ],
    correctAnswer: "73",
    actualData: "73% had no criminal convictions",
    explanation: "By January 2026, 73% of individuals booked into ICE detention had no criminal convictions (excluding immigration violations). Only 5% had violent crime convictions. This represents a dramatic shift from late 2024, when enforcement focused more on individuals with criminal records. Rising 'criminal alien' arrest numbers increasingly reflect enforcement of civil violations, not dangerous criminality.",
    surprise: "high",
    sources: [
      {
        title: "Cato Institute: ICE Detainee Conviction Analysis",
        url: "https://www.cato.org/blog/5-ice-detainees-have-violent-convictions-73-no-convictions",
      },
      {
        title: "FactCheck.org: ICE Arrest Analysis",
        url: "https://www.factcheck.org/2026/01/as-ice-arrests-increased-a-higher-portion-had-no-u-s-criminal-record/",
      },
    ],
  },
  {
    id: 7,
    category: "Victimization Rates",
    question: "Compared to native-born Americans, how likely are immigrants to be victims of violent crime?",
    context: "Based on National Crime Victimization Survey (NCVS) data from 2017-2023.",
    options: [
      { label: "44% less likely to be victims", value: "less", isCorrect: true },
      { label: "About equally likely to be victims", value: "equal", isCorrect: false },
      { label: "Somewhat more likely to be victims", value: "somewhat-more", isCorrect: false },
      { label: "Much more likely to be victims", value: "much-more", isCorrect: false },
    ],
    correctAnswer: "less",
    actualData: "44% less likely to be victims",
    explanation: "Immigrants are 44% less likely to be victims of violent crime than native-born Americans. This challenges the assumption that immigrant communities are hotbeds of disorder. However, aggressive immigration enforcement can create a 'chilling effect' where immigrants stop reporting crimes, potentially making this safety advantage fragile.",
    surprise: "medium",
    sources: [
      {
        title: "Cato Institute: Immigrants Cut Victimization Rates, Boost Crime Reporting",
        url: "https://www.cato.org/policy-analysis/immigrants-cut-victimization-rates-boost-crime-reporting",
      },
    ],
  },
  {
    id: 8,
    category: "Arizona Prison Data",
    question: "In Arizona, non-citizens make up about 13% of the population. What percentage of the state prison population are non-citizens?",
    context: "Arizona Department of Corrections tracks citizenship status of inmates.",
    options: [
      { label: "About 20% (overrepresented)", value: "20", isCorrect: false },
      { label: "About 13% (proportional)", value: "13", isCorrect: false },
      { label: "About 6.8% (significantly under)", value: "6.8", isCorrect: true },
      { label: "About 10% (slightly under)", value: "10", isCorrect: false },
    ],
    correctAnswer: "6.8",
    actualData: "6.8% of prison population",
    explanation: "Non-citizens make up approximately 6.8% of Arizona's state prison population, despite comprising about 13% of the state's population. This significant underrepresentation directly contradicts claims that immigrants are disproportionately criminal.",
    surprise: "medium",
    sources: [
      {
        title: "Arizona Dept. of Corrections Monthly Data Report (Dec 2024)",
        url: "https://corrections.az.gov/sites/default/files/2025-01/ADCRR_MDR%20-%20December%202024_FINAL.pdf",
      },
    ],
  },
];

// Calculate how many questions the user got "wrong" (their intuition differed from reality)
export function calculatePerceptionGap(
  answers: { questionId: number; userAnswer: string }[]
): {
  totalQuestions: number;
  correctIntuitions: number;
  gapPercentage: number;
} {
  const questions = crimeQuestions;
  let correct = 0;
  
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && answer.userAnswer === question.correctAnswer) {
      correct++;
    }
  }
  
  return {
    totalQuestions: answers.length,
    correctIntuitions: correct,
    gapPercentage: Math.round(((answers.length - correct) / answers.length) * 100),
  };
}
