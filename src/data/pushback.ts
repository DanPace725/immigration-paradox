export interface PushbackItem {
  statement: string;
  response: string;
}

export const pushbackResponses: PushbackItem[] = [
  {
    statement: "Scale doesn't negate the law.",
    response:
      "Correct. The size of a population affected by a rule does not invalidate the rule itself. The purpose of presenting scale is not to argue that enforcement is illegitimate, but to make explicit what enforcement entails in practice. If a policy implies enforcement actions against hundreds of thousands or millions of people, that implication exists regardless of whether one approves of it.",
  },
  {
    statement: "Authorized stay is not lawful status.",
    response:
      "Correct. Authorized stay and lawful immigration status are legally distinct. The vignettes intentionally reflect that distinction. The point is not to collapse the two, but to show that many people are lawfully present by government authorization for extended periods without holding a traditional visa status.",
  },
  {
    statement: "Hard cases should not drive policy.",
    response:
      "Agreed. Policy cannot be optimized for every individual hardship. However, the scenarios presented are not rare anomalies; they are common outcomes produced by structural features such as visa caps, backlogs, employer-tied status, and processing delays. When a system produces the same outcomes at scale, those outcomes are no longer edge cases but predictable results of design.",
  },
  {
    statement: "People know the risks when they come.",
    response:
      "Risk awareness varies, but many of the most consequential risks—multi-decade backlogs, policy reversals, adjudication delays, and sudden loss of status due to employer actions—are not reasonably forecastable by individuals at the time of entry. These risks are governed by political and administrative decisions made long after entry.",
  },
  {
    statement: "Swift deportation is more humane than prolonged limbo.",
    response:
      "This is a coherent position. Prolonged uncertainty can impose significant psychological, economic, and social harm. If one prefers faster removal over extended discretionary stays, that preference implies accepting higher volumes of deportation as a tradeoff for clarity. The vignettes make visible how many people would be affected by such a policy choice.",
  },
  {
    statement: "Enforcement must come before reform.",
    response:
      "This is a legitimate sequencing argument. However, many of the scenarios presented involve individuals who complied with existing rules and later fell out of status due to system constraints. Enforcing first in these cases means applying penalties before correcting the mechanisms that generated noncompliance.",
  },
];

export const closingNote = `This project does not claim that immigration enforcement is inherently wrong, nor that borders should not exist. It examines whether commonly held intuitions about legality, rule-following, and enforcement remain stable when applied consistently across real administrative scenarios and at realistic population scales. Disagreement is expected; clarity is the objective.`;
