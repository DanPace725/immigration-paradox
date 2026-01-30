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
  reflection?: string; // Gentle prompt to think about WHY they might have had a different impression
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
    reflection: "If this pattern has held for 150 years, what sources shaped your initial impression? How often do you encounter this statistic in news coverage?",
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
    reflection: "Texas publishes this data publicly. Why might this finding receive less media attention than individual high-profile crimes?",
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
    reflection: "The phrase 'migrant crime wave' appeared frequently in headlines during this period. How do editorial choices about which stories to emphasize shape public perception?",
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
    reflection: "When predictions of disaster don't materialize, how often do those who made the predictions revisit them publicly?",
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
    reflection: "When you hear statistics about 'crimes committed by immigrants,' do you typically learn whether those are violent crimes, property crimes, or immigration paperwork violations?",
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
    reflection: "Headlines often report rising 'criminal alien arrests' without this breakdown. What impression does that create, and is it accurate?",
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
    reflection: "If immigrant neighborhoods are actually safer, why might some people perceive them as dangerous? What shapes those perceptions?",
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
    reflection: "This data is publicly available from Arizona's government. Have you ever seen it cited in debates about immigration policy?",
    surprise: "medium",
    sources: [
      {
        title: "Arizona Dept. of Corrections Monthly Data Report (Dec 2024)",
        url: "https://corrections.az.gov/sites/default/files/2025-01/ADCRR_MDR%20-%20December%202024_FINAL.pdf",
      },
    ],
  },
  {
    id: 9,
    category: "Historical Patterns",
    question: "In the early 1900s, which immigrant group was widely portrayed in American media as inherently criminal and a threat to public safety?",
    context: "Newspapers and political cartoons of the era frequently associated this group with organized crime, violence, and moral degeneracy.",
    options: [
      { label: "Italian and Irish immigrants", value: "italian-irish", isCorrect: true },
      { label: "German immigrants", value: "german", isCorrect: false },
      { label: "Scandinavian immigrants", value: "scandinavian", isCorrect: false },
      { label: "British immigrants", value: "british", isCorrect: false },
    ],
    correctAnswer: "italian-irish",
    actualData: "Italian and Irish immigrants faced intense criminalization",
    explanation: "Italian and Irish immigrants were subjected to the same 'criminal immigrant' narrative now applied to Latino immigrants. Newspapers ran stories about 'Italian crime waves,' politicians warned of the 'Irish menace,' and restrictive laws were passed. Research later showed these groups had similar or lower crime rates than native-born Americans—the same pattern we see today.",
    reflection: "The specific group changes, but the narrative structure remains remarkably consistent across centuries. Why might this pattern repeat?",
    surprise: "medium",
    sources: [
      {
        title: "Harvard Political Review: The History of Immigrant Criminalization",
        url: "https://harvardpolitics.com/the-history-of-immigrant-criminalization/",
      },
      {
        title: "NBER: Immigration and Crime (Historical Analysis)",
        url: "https://www.nber.org/papers/w31440",
      },
    ],
  },
  {
    id: 10,
    category: "Media Coverage",
    question: "Studies of television news coverage find that crimes committed by immigrants receive how much more coverage than comparable crimes by native-born citizens?",
    context: "Researchers analyzed local and national TV news coverage, comparing airtime given to similar crimes based on perpetrator background.",
    options: [
      { label: "About the same coverage", value: "same", isCorrect: false },
      { label: "4-6x more coverage", value: "4-6x", isCorrect: true },
      { label: "Slightly less coverage", value: "less", isCorrect: false },
      { label: "2-3x more coverage", value: "2-3x", isCorrect: false },
    ],
    correctAnswer: "4-6x",
    actualData: "4-6x more coverage for immigrant perpetrators",
    explanation: "Multiple media studies have found that crimes committed by immigrants—particularly undocumented immigrants—receive dramatically disproportionate news coverage. This 'availability heuristic' effect means that even though immigrant crime is statistically less common, it feels more common because each instance is more memorable and widely reported.",
    reflection: "If your news sources cover certain crimes more than others, how might that affect your sense of how common those crimes are?",
    surprise: "high",
    sources: [
      {
        title: "Journal of Ethnic and Migration Studies: Media Coverage Analysis",
        url: "https://www.tandfonline.com/doi/full/10.1080/1369183X.2019.1622824",
      },
      {
        title: "Pew Research: News Coverage and Public Perception",
        url: "https://www.pewresearch.org/journalism/",
      },
    ],
  },
  {
    id: 11,
    category: "Enforcement Economics",
    question: "What is the approximate cost to U.S. taxpayers to detain one person in ICE custody for one year?",
    context: "ICE detention costs include housing, food, medical care, security, transportation, and administrative overhead.",
    options: [
      { label: "About $15,000", value: "15k", isCorrect: false },
      { label: "About $45,000", value: "45k", isCorrect: false },
      { label: "About $30,000", value: "30k", isCorrect: false },
      { label: "About $60,000", value: "60k", isCorrect: true },
    ],
    correctAnswer: "60k",
    actualData: "~$60,000 per detainee per year",
    explanation: "ICE detention costs approximately $150-170 per day per person, totaling around $55,000-$62,000 annually. With detention populations expanding, this represents billions in contracts—primarily to private prison companies. When 73% of detainees have no criminal record, the question becomes: what public safety benefit justifies this expenditure?",
    reflection: "Private detention companies are among the largest donors to politicians who advocate for expanded enforcement. How might financial incentives shape policy priorities?",
    surprise: "medium",
    sources: [
      {
        title: "American Immigration Council: The Cost of Immigration Detention",
        url: "https://www.americanimmigrationcouncil.org/research/cost-immigration-detention",
      },
      {
        title: "DHS Budget Allocation Reports",
        url: "https://www.dhs.gov/publication/budget-fiscal-year-2025",
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
