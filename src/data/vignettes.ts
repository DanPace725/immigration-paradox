import { Vignette } from "@/lib/types";

export const vignettes: Vignette[] = [
  {
    id: 1,
    title: "Student → Employment Gap",
    person: "Maria",
    scenario:
      "Maria entered the U.S. from Brazil in 2014 on an F-1 student visa. She completed her degree in 2018 and received Optional Practical Training (OPT). Her employer agreed to sponsor her for an H-1B visa, but the petition was not selected in the lottery. Her OPT expired while she was still employed. She remained in the U.S. after her status expired and continued working for several months.",
    q1: {
      text: "Is Maria currently in the U.S. legally?",
      answer: "No",
      feedback: "No, Maria does not currently have legal status.",
    },
    q2: {
      text: "Did Maria consistently comply with her visa terms?",
      answer: "No",
      feedback:
        "No, Maria ceased to comply when she stayed past her expiration date.",
    },
    explanation:
      "Maria is currently out of status because she remained after her OPT expired. Although she followed the process for years, the moment she stayed past her expiration date without a new status, she ceased to comply with her visa terms.",
    conflictType: "Consistent",
    conflictText: "Status matches compliance (both negative).",
    scaleEstimate: "Hundreds of thousands",
    scaleDescription:
      "exposed to this pathway over time due to H-1B lottery odds below 50%",
    affectedPopulation: {
      low: 100000,
      high: 300000,
      unit: "people over time",
    },
    sources: [
      {
        title: "DHS SEVIS by the Numbers (2023–2024)",
        url: "https://studyinthestates.dhs.gov/2025/06/read-the-2024-sevis-by-the-numbers-report",
        description: "~1.58 million active F-1 and M-1 student records",
      },
      {
        title: "USCIS H-1B Registration Data",
        url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
        description:
          "~350,000+ registrations competing for ~85,000 cap slots annually",
      },
    ],
  },
  {
    id: 2,
    title: "H-1B Layoff",
    person: "Arjun",
    scenario:
      "Arjun entered the U.S. from India in 2016 on an H-1B work visa. In 2023, his employer conducted layoffs and terminated his position. He was unable to secure a new sponsoring employer within the 60-day grace period. He remained in the U.S. while applying for new positions.",
    q1: {
      text: "Is Arjun currently in the U.S. legally?",
      answer: "No",
      feedback: "No, Arjun does not currently have legal status.",
    },
    q2: {
      text: "Did Arjun consistently comply with his visa terms?",
      answer: "No",
      feedback:
        "No, Arjun technically did not comply with the strict employment terms.",
    },
    explanation:
      "Arjun entered legally and worked legally. However, H-1B status strictly requires employment. By staying past the 60-day grace period, he technically violated the terms of his stay, even though the layoff was not his fault.",
    conflictType: "Consistent",
    conflictText:
      "Status matches compliance (both negative), despite sympathetic circumstances.",
    scaleEstimate: "Tens of thousands",
    scaleDescription: "of workers affected, particularly during economic downturns",
    affectedPopulation: {
      low: 10000,
      high: 50000,
      unit: "people during downturns",
    },
    sources: [
      {
        title: "8 CFR §214.1(l) - Grace Period Regulation",
        url: "https://www.law.cornell.edu/cfr/text/8/214.1",
        description: "Discretionary grace period of up to 60 days",
      },
      {
        title: "USCIS H-1B Characteristics Report (FY 2024)",
        url: "https://www.uscis.gov/tools/reports-and-studies",
        description: "Concentrated H-1B workforce in layoff-prone sectors",
      },
    ],
  },
  {
    id: 3,
    title: "Marriage-Based Adjustment",
    person: "Elena",
    scenario:
      "Elena entered the U.S. from Mexico in 2012 on a tourist visa and overstayed. In 2018, she married a U.S. citizen. Her spouse filed an immediate-relative petition and adjustment of status application (I-485). The application has been pending with USCIS for 3 years. She has not left the U.S. during this time.",
    q1: {
      text: "Is Elena currently in the U.S. legally?",
      answer: "Yes",
      feedback: "Yes, Elena is currently in a period of authorized stay.",
    },
    q2: {
      text: "Did Elena consistently comply with her visa terms?",
      answer: "No",
      feedback:
        "No, Elena did not comply with her original visitor visa terms.",
    },
    explanation:
      "Elena violated her original visa terms by overstaying in 2012. However, her marriage to a U.S. citizen allowed her to file for adjustment of status, which grants her a period of 'authorized stay' and protection from deportation.",
    conflictType: "Paradox",
    conflictText: "She broke the rules (overstayed) but is now protected legally.",
    scaleEstimate: "Hundreds of thousands",
    scaleDescription: "of pending family-based adjustment cases",
    affectedPopulation: {
      low: 200000,
      high: 500000,
      unit: "pending cases",
    },
    sources: [
      {
        title: "USCIS Policy Manual - Lawful Status vs Authorized Stay",
        url: "https://www.uscis.gov/policy-manual/volume-7-part-b-chapter-3",
        description: "Vol. 7, Part B, Ch. 3 explains the legal distinction",
      },
      {
        title: "USCIS Processing Time Reports",
        url: "https://egov.uscis.gov/processing-times",
        description: "Multi-year pendency in high-volume field offices",
      },
    ],
  },
  {
    id: 4,
    title: "Long Visa Bulletin Backlog",
    person: "Chen",
    scenario:
      "Chen entered the U.S. from China in 2009 on an H-1B visa. His employer filed an employment-based green card petition the same year. His priority date is not current due to visa bulletin backlogs. He has maintained valid H-1B extensions tied to his employer and lived continuously in the U.S. for 15 years.",
    q1: {
      text: "Is Chen currently in the U.S. legally?",
      answer: "Yes",
      feedback: "Yes, Chen currently has legal status.",
    },
    q2: {
      text: "Did Chen consistently comply with his visa terms?",
      answer: "Yes",
      feedback: "Yes, Chen has consistently complied with all regulations.",
    },
    explanation:
      "Chen has followed every rule and maintained his H-1B status through valid extensions while waiting for his priority date. He represents the system working as designed—albeit with decade-plus waits.",
    conflictType: "Consistent",
    conflictText: "Status matches compliance (both positive).",
    scaleEstimate: "Tens of thousands",
    scaleDescription: "of long-term workers waiting 10-20+ years for green cards",
    affectedPopulation: {
      low: 50000,
      high: 150000,
      unit: "people in backlog",
    },
    sources: [
      {
        title: "U.S. Department of State Visa Bulletin",
        url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
        description: "Shows per-country backlogs exceeding 10-20 years",
      },
      {
        title: "Morgan Lewis Visa Bulletin Analyses",
        url: "https://www.morganlewis.com/pubs/2025/09/us-department-of-state-releases-october-2025-visa-bulletin",
        description: "EB-2 and EB-3 category wait time projections",
      },
    ],
  },
  {
    id: 5,
    title: "Asylum Applicant Pending",
    person: "Samuel",
    scenario:
      "Samuel entered the U.S. from Cameroon in 2021 on a visitor visa. Within one year, he applied for asylum based on political persecution. His asylum application has not yet been adjudicated. He does not hold any other visa status but has work authorization while the case is pending.",
    q1: {
      text: "Is Samuel currently in the U.S. legally?",
      answer: "Yes",
      feedback: "Yes, Samuel is authorized to stay while his case is pending.",
    },
    q2: {
      text: "Did Samuel consistently comply with legal process?",
      answer: "Yes",
      feedback:
        "Yes, Samuel followed the correct legal process for seeking asylum.",
    },
    explanation:
      "Applying for asylum is a legal right. Even though he entered on a visitor visa, applying for asylum within one year is the correct legal process for seeking protection. He is in a period of authorized stay.",
    conflictType: "Nuanced",
    conflictText:
      "He is following a specific legal pathway that grants protection without a traditional visa.",
    scaleEstimate: "Over one million",
    scaleDescription: "people with pending asylum applications",
    affectedPopulation: {
      low: 1000000,
      high: 3000000,
      unit: "pending applications",
    },
    sources: [
      {
        title: "American Immigration Council - Asylum Fact Sheet",
        url: "https://www.americanimmigrationcouncil.org/fact-sheet/asylum-united-states/",
        description: "~1.45 million affirmative asylum applications pending (2024)",
      },
      {
        title: "TRAC Immigration - Asylum Court Backlogs",
        url: "https://tracreports.org/reports/766/",
        description: "Millions of additional cases pending in immigration court",
      },
    ],
  },
  {
    id: 6,
    title: "Child Aging Out",
    person: "Ana",
    scenario:
      "Ana entered the U.S. from the Philippines in 2005 with her parents on temporary visas. Her U.S. citizen aunt filed a family-based petition for Ana and her family. Due to visa bulletin backlogs, the petition took over 20 years. Ana turned 21 before a green card became available. She no longer qualifies as a dependent under the petition.",
    q1: {
      text: "Is Ana currently in the U.S. legally?",
      answer: "No",
      feedback: "No, Ana sadly does not currently have legal status.",
    },
    q2: {
      text: "Did Ana consistently comply with her visa terms?",
      answer: "Yes",
      feedback: "Yes, Ana and her family followed every rule correctly.",
    },
    explanation:
      "This is the 'Aging Out' tragedy. Ana and her family followed the legal process perfectly. However, because the system took so long, she turned 21 and lost her eligibility. She became undocumented through no fault of her own.",
    conflictType: "Tragedy",
    conflictText: "She followed every rule, yet she is now here illegally.",
    scaleEstimate: "Thousands",
    scaleDescription: "of children and young adults affected over time",
    affectedPopulation: {
      low: 5000,
      high: 20000,
      unit: "people over time",
    },
    sources: [
      {
        title: "USCIS - Child Status Protection Act (CSPA) Guidance",
        url: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/child-status-protection-act-cspa",
        description: "CSPA mitigates but does not eliminate aging out",
      },
      {
        title: "American Immigration Council - CSPA Analysis",
        url: "https://www.americanimmigrationcouncil.org/blog/uscis-updates-key-cspa-interpretation-to-protect-some-immigrant-youth-but-visa-backlogs-continue-to-cause-hardships/",
        description: "Aging out is a predictable result of prolonged backlogs",
      },
    ],
  },
];

// Helper to calculate total scale impact based on deportation opinions
export function calculateScaleImpact(
  history: { deportationOpinion: "Yes" | "No" | "Unsure" | null; affectedPopulation: { low: number; high: number } }[]
): { low: number; high: number } {
  return history.reduce(
    (acc, item) => {
      if (item.deportationOpinion === "Yes") {
        return {
          low: acc.low + item.affectedPopulation.low,
          high: acc.high + item.affectedPopulation.high,
        };
      }
      return acc;
    },
    { low: 0, high: 0 }
  );
}

// Format large numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " million";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + ",000+";
  }
  return num.toLocaleString();
}
