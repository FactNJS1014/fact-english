// ---------------------------------------------------------------------------
// Writing practice banks — one task per course (order matches the seed level
// files). Attached to the first lesson of the course.
// ---------------------------------------------------------------------------

export interface WritingTask {
  title: string;
  prompt: string;
  model: string;
  checklist: string[];
}

export const writingByLevel: WritingTask[][] = [
  // ============================================================ LEVEL 1
  [
    {
      title: "Welcome email",
      prompt:
        "You just joined a new company. Write a short email to your new team introducing yourself: your name, your job, and one sentence about what you will help with.",
      model:
        "Subject: Nice to meet you all\n\nHello everyone,\n\nMy name is Napa Srisai and I am the new marketing assistant. I am very happy to join the team. I will help with social media and customer emails. Please feel free to say hello when you see me in the office.\n\nBest regards,\nNapa",
      checklist: [
        "Greeting and a clear subject line",
        "Your name and your role",
        "One sentence about your work",
        "A polite closing",
      ],
    },
    {
      title: "About me profile",
      prompt:
        "Your company asks every employee to write a short profile for the internal directory. Write 3–4 sentences about yourself: name, job title, department, and one personal fact.",
      model:
        "My name is Napa Srisai. I work in the Sales Department as a sales coordinator. I look after customer orders and help the sales team with reports. In my free time I enjoy cooking and watching football.",
      checklist: [
        "Name and job title",
        "Department or team",
        "Daily responsibilities",
        "One personal detail",
      ],
    },
    {
      title: "Office notice",
      prompt:
        "Write a short notice to your team about the printer on the second floor. It is broken today. Tell people to use the printer on the first floor and to report problems to the office manager.",
      model:
        "Notice to all staff\n\nThe printer on the second floor is out of order today. Please use the printer on the first floor until it is repaired. If you see any problem, please tell the office manager. Thank you for your patience.",
      checklist: [
        "A clear heading",
        "What is wrong",
        "What people should do",
        "Who to contact",
      ],
    },
    {
      title: "Telephone message",
      prompt:
        "A caller phoned for Mr. Smith, but he was in a meeting. Write the message you will leave on his desk: who called, why, and the callback number 02-555-0198.",
      model:
        "Message for Mr. Smith\n\nMs. Kim from ABC Trading called at 10:30. She would like to talk about the order for next month. Her callback number is 02-555-0198. She is available after 2 p.m.",
      checklist: [
        "Who the message is for",
        "Who called and when",
        "The reason for the call",
        "The callback number",
      ],
    },
    {
      title: "Confirming an appointment",
      prompt:
        "Write a short email to confirm your appointment with a client on Friday at 10 a.m. at your office. Ask them to confirm and to bring their documents.",
      model:
        "Subject: Confirming our appointment on Friday\n\nDear Mr. Chen,\n\nThis email is to confirm our appointment on Friday at 10 a.m. at our office, meeting room 2. Please bring the contract documents with you. Could you reply to this email to confirm?\n\nBest regards,\nNapa Srisai",
      checklist: [
        "Subject line with the date",
        "Day, time and place",
        "What to bring",
        "A request to confirm",
      ],
    },
    {
      title: "Meeting invitation",
      prompt:
        "Write an email to invite your team to a short meeting on Monday at 9:30 a.m. to plan the week. Ask everyone to come with their task lists.",
      model:
        "Subject: Weekly planning meeting — Monday 9:30\n\nHi team,\n\nWe will have our weekly planning meeting on Monday at 9:30 a.m. in the main meeting room. The meeting will take about 30 minutes. Please bring your task list for the week. Let me know if you cannot come.\n\nThanks,\nNapa",
      checklist: [
        "Subject line with time and topic",
        "Day, time and place",
        "What people should prepare",
        "A request to reply",
      ],
    },
    {
      title: "My job in a paragraph",
      prompt:
        "Describe your job using at least five new words from this course (for example: colleague, report, schedule, meeting, task). Write 4–5 sentences.",
      model:
        "I am an office assistant. My main tasks are answering emails and making schedules. Every morning I check my diary and write a task list. I usually have two or three meetings a day. I enjoy working with my colleagues because we help each other.",
      checklist: [
        "At least five course words",
        "Present simple for routines",
        "3–5 full sentences",
        "Check spelling and articles",
      ],
    },
    {
      title: "My week summary",
      prompt:
        "It is Friday afternoon. Write a short email to your manager about your week: what you finished, one problem you solved, and what you will do next week.",
      model:
        "Subject: Week summary\n\nHi Khun Somchai,\n\nThis week I finished the customer list and updated the price table. On Wednesday the printer broke, and I called IT — they fixed it the same day. Next week I will prepare the monthly report and call two new customers.\n\nBest regards,\nNapa",
      checklist: [
        "A greeting and subject line",
        "What you finished",
        "One problem and the solution",
        "Plans for next week",
      ],
    },
  ],

  // ============================================================ LEVEL 2
  [
    {
      title: "Project update email",
      prompt:
        "Your manager asks about your current project. Write an email describing what you are working on now, what is finished, and what is still in progress.",
      model:
        "Subject: Update on the price list project\n\nDear Khun David,\n\nI am updating the price list this week. The product photos are finished, and I am now checking the new prices with the suppliers. I expect to send you the first draft by Friday. Please let me know if you need anything else.\n\nBest regards,\nNapa",
      checklist: [
        "Present continuous for current work",
        "What is finished vs in progress",
        "A clear deadline",
        "Polite closing",
      ],
    },
    {
      title: "Describing your responsibilities",
      prompt:
        "For a new colleague, describe your responsibilities in writing. Use verbs such as: be in charge of, handle, deal with, look after, report to.",
      model:
        "I am in charge of stock control. I handle supplier enquiries and deal with delivery problems. I look after the warehouse records, and I report to the operations manager. I also help the sales team when they need stock information.",
      checklist: [
        "At least four responsibility verbs",
        "Explain reporting lines",
        "Give an example of a duty",
        "Keep it clear and simple",
      ],
    },
    {
      title: "Rescheduling politely",
      prompt:
        "Write an email to move your appointment with a client from Thursday to next Monday. Apologize once, give a short reason, and offer two alternative times.",
      model:
        "Subject: Moving our appointment\n\nDear Ms. Lin,\n\nI am sorry, but I need to move our appointment on Thursday. An urgent supplier visit has come up. Would next Monday at 10 a.m. or 2 p.m. suit you? Please let me know which time works better.\n\nKind regards,\nNapa",
      checklist: [
        "Apologize once, briefly",
        "A short reason",
        "Two alternative times",
        "Polite tone throughout",
      ],
    },
    {
      title: "Customer service response",
      prompt:
        "A customer emailed about a late delivery. Write a reply: apologize, explain the delay simply, say when the delivery will arrive, and offer to check the tracking number.",
      model:
        "Subject: Your delivery — update\n\nDear Mr. Wilson,\n\nWe apologize for the delay with your order. The courier had a problem at the warehouse, so your delivery will now arrive on Tuesday. I can check the tracking number for you if you send me your order ID. Thank you for your patience.\n\nBest regards,\nNapa",
      checklist: [
        "Apologize clearly",
        "Simple explanation",
        "New delivery date",
        "Offer of help",
      ],
    },
    {
      title: "Order confirmation email",
      prompt:
        "Confirm a customer's order in writing: the product, the quantity, the price with discount, the delivery date, and the payment terms.",
      model:
        "Subject: Order confirmation #8821\n\nDear Ms. Garcia,\n\nThank you for your order. We confirm 50 units of the Pro printer at 1,900 baht each. With your 10% discount, the total is 85,500 baht. Delivery will be on 20 May, and payment is due within 30 days of the invoice date.\n\nBest regards,\nNapa",
      checklist: [
        "Order number",
        "Product, quantity and price",
        "Discount and total",
        "Delivery and payment terms",
      ],
    },
    {
      title: "Presentation outline",
      prompt:
        "Write a short outline for a presentation about your department's monthly results. Use sequence words: first, next, then, finally.",
      model:
        "Presentation: May results\n\nFirst, I will show the sales figures for May. Next, I will explain the reasons for the growth. Then, we will look at the customer feedback. Finally, I will present our targets for June and answer questions.",
      checklist: [
        "Clear title",
        "Sequence words (first, next, then, finally)",
        "One idea per section",
        "A clear ending",
      ],
    },
    {
      title: "Trip summary email",
      prompt:
        "You visited a client in another city. Write an email to your manager summarizing the trip: where you went, who you met, what you agreed, and the next step.",
      model:
        "Subject: Visit to Chiang Mai\n\nDear Khun David,\n\nLast Tuesday I visited our client in Chiang Mai. I met the purchasing team and we reviewed the new catalogue. We agreed on a trial order of 200 units starting next month. I will send the contract draft for their signature by Friday.\n\nBest regards,\nNapa",
      checklist: [
        "Past simple for the trip",
        "Who you met",
        "What you agreed",
        "The next step",
      ],
    },
    {
      title: "How-to instructions",
      prompt:
        "Write step-by-step instructions for a new employee on how to request a day off, using first, then, next, after that and finally.",
      model:
        "How to request a day off\n\nFirst, open the HR system and find 'Leave Request'. Then, choose the date and the type of leave. Next, write a short reason in the box. After that, click 'Submit'. Finally, wait for your manager's approval email before making plans.",
      checklist: [
        "Sequencing words in order",
        "Imperative verbs",
        "Complete steps",
        "Clear final step",
      ],
    },
  ],

  // ============================================================ LEVEL 3
  [
    {
      title: "Meeting minutes email",
      prompt:
        "After a team meeting, write a short email with the decisions and action points: who will do what, and by when.",
      model:
        "Subject: Minutes and actions from today's meeting\n\nHi team,\n\nThank you for the productive meeting. We decided to move the launch to 2 June. Actions: Napa will update the timeline by Friday; David will confirm the venue by Monday; and the whole team will review the draft plan before next Thursday's check-in.\n\nBest,\nNapa",
      checklist: [
        "Decisions clearly stated",
        "One action per owner",
        "Deadlines for each action",
        "Short and neutral tone",
      ],
    },
    {
      title: "Negotiation summary",
      prompt:
        "After a price discussion with a supplier, email your manager the outcome: what you offered, what they asked, and the point where you stopped.",
      model:
        "Subject: Price discussion with ACME\n\nDear Khun David,\n\nWe held the price discussion with ACME today. They asked for a 12% reduction; we offered 6% on volumes above 5,000 units. We did not agree yet — they will confirm next week. I recommend we hold at 6% plus a longer payment term.\n\nBest regards,\nNapa",
      checklist: [
        "Both positions stated",
        "Current status of the talks",
        "Your recommendation",
        "First conditional where useful",
      ],
    },
    {
      title: "Report summary paragraph",
      prompt:
        "Summarize a quarterly report in one short paragraph using the passive voice: what was analyzed, what was found, and what is recommended.",
      model:
        "The Q2 data was analyzed across all three regions. Sales growth was confirmed in Asia, while European revenue was slightly lower. It was found that delivery delays caused most complaints. It is recommended that the warehouse process be reviewed before Q4.",
      checklist: [
        "Passive voice (was analyzed, was found)",
        "What was analyzed and found",
        "One recommendation",
        "Professional tone",
      ],
    },
    {
      title: "Complaint response",
      prompt:
        "A customer complains that their order arrived damaged. Write a reply using the present perfect: acknowledge the complaint, say what you have already done, and promise the next step.",
      model:
        "Subject: Your damaged order #3310\n\nDear Ms. Rossi,\n\nThank you for telling us about the damaged order. We have already opened an investigation with the courier, and our team has started preparing a replacement. You will receive the replacement within five working days, at no cost to you.\n\nWe apologize for the inconvenience.\n\nBest regards,\nNapa",
      checklist: [
        "Acknowledge the complaint",
        "Present perfect (have already opened)",
        "Concrete next step",
        "Sincere apology",
      ],
    },
    {
      title: "Project status update",
      prompt:
        "Write a status update for your project: current progress, one risk, and the plan to stay on schedule. Use future forms (will / going to).",
      model:
        "Subject: Website project — status\n\nHi team,\n\nThe website redesign is 70% complete. The design phase is finished and we are testing the checkout. One risk: the payment provider approval may take longer than expected. We are going to submit the application this week so we will stay on schedule for the 30 June launch.",
      checklist: [
        "Current progress in numbers",
        "One clear risk",
        "Future plan (will / going to)",
        "Launch date stated",
      ],
    },
    {
      title: "Sales email",
      prompt:
        "Write a short email to a prospect introducing a new service. Compare it with the market (comparatives) and end with one call to action.",
      model:
        "Subject: Faster reporting for your finance team\n\nDear Mr. Tan,\n\nOur new reporting service gives your finance team weekly dashboards automatically. It is faster than traditional reports and more accurate than manual summaries. Would you be available for a 20-minute demo next week?\n\nBest regards,\nNapa",
      checklist: [
        "Clear subject line",
        "Two comparative benefits",
        "One call to action",
        "Short and specific",
      ],
    },
    {
      title: "Budget explanation",
      prompt:
        "Explain to your manager why the department needs a larger budget next quarter. Use quantifiers (much, many, a lot of) and give two reasons.",
      model:
        "Subject: Budget request for next quarter\n\nDear Khun David,\n\nI would like to request a 15% increase in our budget. We don't have much room in the current budget, and many of our tools need upgrading. A lot of our work now depends on new software licences, so the increase will cover training as well.",
      checklist: [
        "Clear request with a number",
        "Quantifiers used correctly",
        "Two supporting reasons",
        "Polite tone",
      ],
    },
    {
      title: "Team feedback email",
      prompt:
        "Write a short email giving positive feedback to a colleague. Use should/ought to for one recommendation for the future.",
      model:
        "Subject: Great work on the launch\n\nDear Maria,\n\nI want to say that the launch went really well, and your organization was a big part of that. The schedule was clear and every supplier was informed on time. For future launches, you should keep a shared checklist so others can help even earlier. Thank you again!\n\nBest,\nNapa",
      checklist: [
        "Specific praise, not general",
        "One future recommendation",
        "A personal tone",
        "Short length",
      ],
    },
  ],

  // ============================================================ LEVEL 4
  [
    {
      title: "Negotiation follow-up memo",
      prompt:
        "You are the lead negotiator. Write a follow-up memo using the second conditional about what you would do if the client accepts your terms, and what the third conditional says about last quarter's lost deal.",
      model:
        "Memo: ACME follow-up\n\nIf the client accepts our terms, we would lock in a two-year contract and protect our margins. We should avoid repeating last quarter's mistake: if we had offered faster onboarding then, we would have kept the Delta account. Recommendation: include a free onboarding session to close this deal.",
      checklist: [
        "Second conditional for the future",
        "Third conditional for the past",
        "A concrete recommendation",
        "Concise memo format",
      ],
    },
    {
      title: "Reported speech update",
      prompt:
        "The director has just told you two things. Report them in an email to your team: the meeting has been moved to Thursday, and the budget for training is now approved.",
      model:
        "Subject: Two updates from the director\n\nHi team,\n\nThe director said that the project review had been moved to Thursday at 10 a.m. She also told me that the training budget had been approved, so you can now book the courses. Please update your calendars before the end of today.",
      checklist: [
        "Correct backshifting",
        "Say vs tell used correctly",
        "Both messages clear",
        "Deadline for action",
      ],
    },
    {
      title: "Strategy memo",
      prompt:
        "Write a short strategy memo with the passive voice and modals: what must be reviewed, what can be reduced, and what should be measured next quarter.",
      model:
        "Strategy memo — Q3 focus\n\nThe pricing model must be reviewed before the September launch. Logistics costs can be reduced by consolidating two warehouses. Customer churn should be measured weekly, and the results must be shared with every regional manager.",
      checklist: [
        "Passive with modals (must be, can be)",
        "Three clear actions",
        "A timeframe",
        "Objective, no personal opinion",
      ],
    },
    {
      title: "Performance review self-summary",
      prompt:
        "Write a short self-review: what you achieved this year (present perfect), one area to improve, and two goals for next year.",
      model:
        "Self-review 2026\n\nThis year I have reduced response times by 20% and have completed all major projects on time. One area I want to improve is presenting to senior stakeholders — I still feel nervous in board meetings. Next year I plan to lead two client reviews and complete the advanced negotiation course.",
      checklist: [
        "Present perfect for achievements",
        "Honest development area",
        "Two measurable goals",
        "Professional tone",
      ],
    },
    {
      title: "Persuasive proposal paragraph",
      prompt:
        "Persuade your manager to invest in new software. Use at least two emphatic structures (not only…but also / it is…that) and one piece of evidence.",
      model:
        "Why we should invest in the CRM\n\nIt is the lost follow-ups that are costing us sales. Not only does the new CRM automate reminders, but it also gives the team a single view of every client. The pilot team has already reported 15% more completed calls, so the investment will pay for itself within a year.",
      checklist: [
        "One emphatic structure",
        "At least one piece of evidence",
        "Clear financial argument",
        "Persuasive but factual",
      ],
    },
    {
      title: "Deal post-mortem",
      prompt:
        "You lost a big negotiation last month. Write an analysis using the third and mixed conditionals about what would have changed the outcome and what it means for today.",
      model:
        "Deal review — Meridian account\n\nIf we had offered a service-level agreement, Meridian would have signed last month. Today we are still spending more on acquisition because that contract went to a competitor. Going forward, if we had included SLAs in future proposals, we would not be losing deals on the same point.",
      checklist: [
        "Third conditional for the past",
        "Mixed conditional for today's result",
        "One lesson to apply",
        "Factual, not emotional",
      ],
    },
    {
      title: "Project retrospective",
      prompt:
        "Write a short retrospective using narrative tenses: what was happening when problems started, and what had already gone wrong before the team noticed.",
      model:
        "Retrospective — mobile app launch\n\nWe were finalizing the release when users reported slow loading. It turned out the image server had been misconfigured for weeks before anyone noticed. The fix was deployed in two hours, but the launch was moved. Lesson: add server checks to the weekly routine.",
      checklist: [
        "Past continuous for background",
        "Past perfect for earlier events",
        "One concrete lesson",
        "Concise structure",
      ],
    },
    {
      title: "Networking follow-up",
      prompt:
        "You met a potential partner at a conference. Write a follow-up email using indirect questions to ask about their decision process and timeline.",
      model:
        "Subject: Great to meet you at the conference\n\nDear Ms. Aoki,\n\nIt was a pleasure to meet you at the Asia Tech conference. I enjoyed learning about your expansion plans. Could you tell me who is involved in the partnership decision? I would also like to know whether a pilot project is possible before the end of the year.\n\nBest regards,\nNapa",
      checklist: [
        "Reference to where you met",
        "Two indirect questions",
        "One clear interest",
        "Polite, low-pressure tone",
      ],
    },
  ],

  // ============================================================ LEVEL 5
  [
    {
      title: "Executive briefing",
      prompt:
        "Write a one-paragraph executive briefing on the regional results. Hedge appropriately (appears, seems, may) and end with one clear recommendation.",
      model:
        "Regional briefing — Q2\n\nIt appears that the region has recovered faster than projected, although the growth seems concentrated in two markets. The May figures may be overstated by one-off orders, so we should verify them before the board pack. We recommend maintaining the current guidance but reviewing it after the June data is confirmed.",
      checklist: [
        "Hedging language used precisely",
        "Data referenced, not invented",
        "One clear recommendation",
        "Short enough for a busy executive",
      ],
    },
    {
      title: "Complex negotiation strategy",
      prompt:
        "Write your negotiation plan for a complex deal. Use a mixed conditional about the past, and one conditional offer with provided that / on condition that.",
      model:
        "Negotiation plan — Vega licence deal\n\nIf we had locked the pricing tier in the first meeting, we would be negotiating from a stronger position now. Our main offer: on condition that Vega commits to a three-year term, we will include the enterprise support package at no extra cost. We will not move on exclusivity unless volumes are guaranteed.",
      checklist: [
        "One mixed conditional",
        "One conditional offer (provided/on condition that)",
        "A clear non-negotiable",
        "Logical structure",
      ],
    },
    {
      title: "Corporate strategy memo",
      prompt:
        "Write a strategy memo using participle clauses: having analyzed the market, given the current conditions, and one action based on your analysis.",
      model:
        "Strategy memo — Southeast Asia\n\nHaving analyzed five years of market data, we see the strongest growth in Indonesia. Given the current regulatory climate, a joint venture carries less risk than a full acquisition. Based on these findings, we recommend signing a term sheet with a local partner before the end of Q3.",
      checklist: [
        "Two participle-clause openings",
        "Data-driven reasoning",
        "One clear strategic action",
        "Formal register",
      ],
    },
    {
      title: "Contract clause commentary",
      prompt:
        "Explain two clauses of a draft contract to a colleague who is not a lawyer: one obligation using shall, and one permission using may. Explain why each matters.",
      model:
        "Clause notes — draft supply agreement\n\nClause 7: the supplier shall maintain safety stock of 30 days. This is an obligation — it protects us if demand spikes suddenly. Clause 11: the buyer may terminate with 60 days' written notice. This is a permission — it gives us an exit but prevents either side from walking away overnight.",
      checklist: [
        "Shall shown as obligation",
        "May shown as permission",
        "Business reason for each clause",
        "Plain-language explanation",
      ],
    },
    {
      title: "Cross-cultural briefing",
      prompt:
        "Before a visit to a new market, write a briefing note for your team using concession language (although, despite, however) about cultural expectations.",
      model:
        "Briefing — Japan visit\n\nAlthough business cards may seem formal, exchanging them properly is essential. Despite the relaxed office culture at our company, please follow local hierarchy during meetings. We will use English, however; only the opening and closing should include the Japanese phrases in the attached sheet.",
      checklist: [
        "At least one of although/despite/however",
        "Concrete, practical advice",
        "Respectful framing",
        "No stereotyping",
      ],
    },
    {
      title: "Influence strategy",
      prompt:
        "Plan how to win support for a new initiative. Write a paragraph with one hypothetical (suppose / if…were to), one coalition idea, and one social proof element.",
      model:
        "Winning support for the flex-time pilot\n\nSuppose we pilot flex-time in one department for three months — the data will answer most objections before they start. If the finance team were to sponsor the measurement, their credibility would carry the proposal. Two competitors already publish flexible-work results, so we can cite their experience as social proof.",
      checklist: [
        "One hypothetical structure",
        "One coalition idea",
        "One social proof element",
        "Persuasive but concrete",
      ],
    },
    {
      title: "Crisis statement",
      prompt:
        "Write the first internal statement for a service outage. Use reported speech for what the CEO said, and reassure staff about what is being done.",
      model:
        "Internal update — service outage\n\nAt 09:40 this morning we experienced a service outage affecting customer portals. The CEO said the incident was being treated as the highest priority and that the technical team had already identified the cause. Please reassure customers that no data has been lost and that we will share a full update by 14:00.",
      checklist: [
        "Facts: what, when, impact",
        "Reported speech from leadership",
        "Reassurance with evidence",
        "Clear time for next update",
      ],
    },
    {
      title: "Master negotiator playbook",
      prompt:
        "Write the 'game plan' section of your negotiation playbook for a high-stakes deal: preparation, one anchor strategy, one concession pattern, and the closing plan.",
      model:
        "Game plan — Meridian renewal\n\nPreparation: model three volume scenarios and confirm their alternatives in writing first. Opening: anchor at the top of the published range with market data visible on the screen. Concession pattern: move only on payment terms, never on price, and make each move smaller. Closing: summarize every term on one page and confirm it before the lawyers meet.",
      checklist: [
        "A preparation step",
        "An explicit anchoring move",
        "A disciplined concession pattern",
        "A written closing step",
      ],
    },
  ],
];
