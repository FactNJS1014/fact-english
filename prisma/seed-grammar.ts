// ---------------------------------------------------------------------------
// Grammar banks — one per course (course order matches the seed level files).
// Each entry is real content plus ONE quiz MCQ used by every topic in the course.
// ---------------------------------------------------------------------------

export interface GrammarMcq {
  q: string;
  options: string[];
  answer: string;
  why: string;
}

export interface GrammarBank {
  title: string;
  explanation: string;
  structure: string;
  examples: string[];
  business: string[];
  mistakes: string[];
  mcq: GrammarMcq;
}

export const grammarByLevel: GrammarBank[][] = [
  // ============================================================ LEVEL 1
  [
    // Course 1 — Workplace Basics
    {
      title: "Present simple of be (am / is / are)",
      explanation:
        "We use am, is and are to give personal information, describe people and talk about where things are. It is the most common verb in business English for introducing yourself and your company.",
      structure: "I am / He-She-It is / You-We-They are  (+ not, ? before subject)",
      examples: [
        "I am a new employee in the sales team.",
        "She is the marketing manager.",
        "They are from our Singapore office.",
      ],
      business: [
        "We are very happy to work with you.",
        "This report is ready for the client.",
      ],
      mistakes: ["✗ He are my colleague. → ✓ He is my colleague.", "✗ I is from Bangkok. → ✓ I am from Bangkok."],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["She are the finance manager.", "She is the finance manager.", "She am the finance manager.", "She be the finance manager."],
        answer: "She is the finance manager.",
        why: "With she (third person singular) we use is.",
      },
    },
    // Course 2 — Business Introductions
    {
      title: "This / that and possessive adjectives",
      explanation:
        "Use this for people or things near you and that for people or things further away. Possessive adjectives (my, your, his, her, our, their) show who something belongs to — a key tool when introducing yourself and colleagues.",
      structure: "This is + name/role · my/your/his/her/our/their + noun",
      examples: [
        "This is our CEO, Mr. Tanaka.",
        "That is her office on the third floor.",
        "My name is Napa and this is my colleague.",
      ],
      business: [
        "This is our latest product catalogue.",
        "That department handles their accounts.",
      ],
      mistakes: ["✗ This is John, he's my colleague. → this is fine; but ✗ 'This is she office' → ✓ 'This is her office'.", "✗ They are our's clients. → ✓ They are our clients."],
      mcq: {
        q: "Complete the sentence: 'This is ___ colleague, Sarah.'",
        options: ["me", "my", "I", "mine"],
        answer: "my",
        why: "A possessive adjective (my) must come before a noun (colleague).",
      },
    },
    // Course 3 — Office Communication
    {
      title: "Imperatives for instructions and requests",
      explanation:
        "The imperative is the base verb without a subject. It gives instructions, makes polite requests with please, and is used all the time in the office: 'Please send the file', 'Open the attachment'.",
      structure: "Verb (base) + object · Please + verb · Don't + verb",
      examples: [
        "Please check your email before the meeting.",
        "Don't forget to sign the attendance sheet.",
        "Send the report to the whole team.",
      ],
      business: [
        "Please confirm the order by Friday.",
        "Don't share confidential files outside the company.",
      ],
      mistakes: ["✗ 'You please call me.' → ✓ 'Please call me.'", "✗ 'Not late for the meeting.' → ✓ 'Don't be late for the meeting.'"],
      mcq: {
        q: "Which sentence is a polite instruction?",
        options: ["Please sending the invoice.", "Please send the invoice.", "You please send the invoice.", "Send please the invoice."],
        answer: "Please send the invoice.",
        why: "Imperatives use the base verb: please + send.",
      },
    },
    // Course 4 — Telephone English
    {
      title: "Polite questions with can, could and would",
      explanation:
        "On the phone we soften requests and questions with modal verbs. Could and would are more polite than can. These forms help you sound professional with clients you do not know well.",
      structure: "Can/Could/Would + subject + verb …?",
      examples: [
        "Could you say that again, please?",
        "Would you like to leave a message?",
        "Can I speak to the manager, please?",
      ],
      business: [
        "Could you hold for a moment while I check?",
        "Would you mind spelling your name, please?",
      ],
      mistakes: ["✗ 'Could you to call back later?' → ✓ 'Could you call back later?'", "✗ 'Would you like leave a message?' → ✓ 'Would you like to leave a message?'"],
      mcq: {
        q: "Choose the most polite request.",
        options: ["Give me your email.", "You must give me your email.", "Could you give me your email?", "Give me email you."],
        answer: "Could you give me your email?",
        why: "Could + subject + verb is a polite phone request.",
      },
    },
    // Course 5 — Basic Emails
    {
      title: "Prepositions of time: at, on, in",
      explanation:
        "Emails are full of dates and times. Use at for clock times (at 9 a.m.), on for days and dates (on Monday), and in for months, years and longer periods (in March, in 2026).",
      structure: "at + time · on + day/date · in + month/year/period",
      examples: [
        "The meeting starts at 10:00.",
        "We will send the contract on Friday.",
        "The project begins in April.",
      ],
      business: [
        "Please reply in writing by the end of the week.",
        "The training is on 14 May at 2 p.m.",
      ],
      mistakes: ["✗ 'on 9 o'clock' → ✓ 'at 9 o'clock'", "✗ 'in Monday' → ✓ 'on Monday'"],
      mcq: {
        q: "Complete the sentence: 'The webinar is ___ Wednesday ___ 3 p.m.'",
        options: ["on / at", "at / on", "in / at", "on / in"],
        answer: "on / at",
        why: "Days take on; clock times take at.",
      },
    },
    // Course 6 — Meetings Basics
    {
      title: "Making suggestions: Let's, Shall we, How about",
      explanation:
        "In meetings we rarely give orders. Instead we make suggestions. Let's + verb is direct; Shall we + verb is a question; How about + -ing is informal and friendly.",
      structure: "Let's + verb · Shall we + verb? · How about + verb-ing?",
      examples: [
        "Let's start with the agenda.",
        "Shall we move to the next point?",
        "How about taking a short break?",
      ],
      business: [
        "Let's confirm the action points before we finish.",
        "How about scheduling a follow-up next week?",
      ],
      mistakes: ["✗ 'Let's to start.' → ✓ 'Let's start.'", "✗ 'How about we take a break?' → acceptable informally; in formal meetings prefer 'How about taking a break?'"],
      mcq: {
        q: "Choose the correct suggestion.",
        options: ["Let's to review the numbers.", "Let's review the numbers.", "Let's reviewing the numbers.", "Let's we review the numbers."],
        answer: "Let's review the numbers.",
        why: "Let's is followed by the base verb.",
      },
    },
    // Course 7 — Business Vocabulary
    {
      title: "Question forms with do/does and question words",
      explanation:
        "To ask about facts and habits use do/does with the base verb. Question words (what, when, where, who, why, how) come first. Getting questions right unlocks real workplace conversations.",
      structure: "Question word + do/does + subject + base verb …?",
      examples: [
        "What does your company do?",
        "Where do you usually have lunch?",
        "How many people work in your office?",
      ],
      business: [
        "When does the sales report need to be ready?",
        "Who do you report to?",
      ],
      mistakes: ["✗ 'What your company does?' → ✓ 'What does your company do?'", "✗ 'Do she works here?' → ✓ 'Does she work here?'"],
      mcq: {
        q: "Choose the correct question.",
        options: ["Where you work?", "Where do you work?", "Where does you work?", "Where are you work?"],
        answer: "Where do you work?",
        why: "Questions with do use the base verb after the subject.",
      },
    },
    // Course 8 — Daily Workplace English
    {
      title: "Present simple vs present continuous",
      explanation:
        "Use the present simple for habits and facts ('I check email every morning'). Use the present continuous for things happening now or around now ('I am checking email — I will reply soon').",
      structure: "Present simple: subject + verb(s/es) · Present continuous: am/is/are + verb-ing",
      examples: [
        "I usually arrive at 8:45.",
        "Today I am arriving late because of traffic.",
        "She handles customer calls every day.",
      ],
      business: [
        "We are preparing the quarterly figures this week.",
        "He often works from home on Fridays.",
      ],
      mistakes: ["✗ 'I am working here since 2020.' → for a habit: ✓ 'I work here.' / for duration use present perfect.", "✗ 'She is checking email every morning.' → ✓ 'She checks email every morning.'"],
      mcq: {
        q: "Choose the sentence about a daily routine.",
        options: ["She is finishing the report now.", "She finishes reports every Friday.", "She finishing reports now.", "She finish reports every Friday."],
        answer: "She finishes reports every Friday.",
        why: "Every Friday is a routine, so we use the present simple with -s.",
      },
    },
  ],

  // ============================================================ LEVEL 2
  [
    // Course 1 — Daily Work Activities
    {
      title: "Present continuous for now vs present simple for routines",
      explanation:
        "Talk about what you are doing at the moment with the present continuous, and what you do regularly with the present simple. Colleagues switch between the two all day long.",
      structure: "am/is/are + verb-ing (now) · verb/verb-s (routines)",
      examples: [
        "Right now I am updating the price list.",
        "Every Monday we review the sales figures.",
        "This week she is covering for a colleague.",
      ],
      business: [
        "We are running behind schedule on the report.",
        "He deals with supplier enquiries every morning.",
      ],
      mistakes: ["✗ 'I am working on the annual report every year.' → use present simple for yearly routines.", "✗ 'She is knowing the answer.' → know is a state verb: ✓ 'She knows the answer.'"],
      mcq: {
        q: "Which sentence describes an action happening now?",
        options: ["She prepares the invoice.", "She is preparing the invoice.", "She prepared the invoice.", "She has prepared the invoice."],
        answer: "She is preparing the invoice.",
        why: "The present continuous (is + -ing) describes action in progress now.",
      },
    },
    // Course 2 — Talking About Jobs and Responsibilities
    {
      title: "Modals of obligation: have to, need to, must",
      explanation:
        "Describe responsibilities with have to and need to (obligation) and must (strong obligation or rule). The negative forms have different meanings: don't have to = not necessary, mustn't = not allowed.",
      structure: "subject + have to/need to/must + base verb",
      examples: [
        "I have to prepare the weekly stock report.",
        "She must follow the safety guidelines.",
        "You don't have to work at weekends.",
      ],
      business: [
        "Managers need to approve every expense above 500 baht.",
        "We mustn't share client data outside the team.",
      ],
      mistakes: ["✗ 'I must to finish the task.' → ✓ 'I must finish the task.'", "✗ 'She have to attend.' → ✓ 'She has to attend.'"],
      mcq: {
        q: "Choose the sentence that means 'it is not necessary'.",
        options: ["You mustn't come early.", "You don't have to come early.", "You must come early.", "You need come early."],
        answer: "You don't have to come early.",
        why: "Don't have to expresses lack of necessity.",
      },
    },
    // Course 3 — Appointments and Scheduling
    {
      title: "Would like and prepositions of time for schedules",
      explanation:
        "Arrange appointments politely with would like. Use in for parts of the day and longer periods, on for days and dates, at for exact times.",
      structure: "Would you like to + verb? · I would like to + verb · at/on/in + time",
      examples: [
        "Would you like to meet on Thursday?",
        "I would like to reschedule our appointment.",
        "The site visit is at 10 a.m. on Monday.",
      ],
      business: [
        "We would like to confirm the delivery for next Tuesday.",
        "Would you like to join the call at 3 p.m.?",
      ],
      mistakes: ["✗ 'I would like meeting you.' → ✓ 'I would like to meet you.'", "✗ 'at Monday' → ✓ 'on Monday'"],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["I would like to move the meeting to Friday.", "I would like moving the meeting on Friday.", "I would like move the meeting at Friday.", "I like would to move the meeting."],
        answer: "I would like to move the meeting to Friday.",
        why: "Would like is followed by to + base verb; days take on, not at.",
      },
    },
    // Course 4 — Telephone and Customer Service
    {
      title: "Polite requests with could, would and may",
      explanation:
        "In customer service, polite language keeps the call calm. Could you… is a soft request, Would you mind + -ing is very polite, and May I… asks permission.",
      structure: "Could you + verb? · Would you mind + verb-ing? · May I + verb?",
      examples: [
        "Could you hold the line for a moment?",
        "Would you mind repeating your order number?",
        "May I put you on hold briefly?",
      ],
      business: [
        "Could you confirm your address for the delivery?",
        "May I transfer you to our billing team?",
      ],
      mistakes: ["✗ 'Would you mind to wait?' → ✓ 'Would you mind waiting?'", "✗ 'Could you repeat again the number?' → ✓ 'Could you repeat the number?'"],
      mcq: {
        q: "Complete the sentence: 'Would you mind ___ a moment?'",
        options: ["to hold", "holding", "hold", "held"],
        answer: "holding",
        why: "Would you mind is followed by the -ing form.",
      },
    },
    // Course 5 — Products, Prices and Orders
    {
      title: "Comparatives and superlatives",
      explanation:
        "Compare products and prices with comparatives (-er or more) and superlatives (-est or the most). This is the language of value: cheaper, more reliable, the best price.",
      structure: "adjective-er than · more + adjective than · the adjective-est / the most + adjective",
      examples: [
        "This model is cheaper than the older one.",
        "Their delivery is more reliable than ours.",
        "That is the most popular option.",
      ],
      business: [
        "We can offer a better price for a larger order.",
        "This is the fastest service in the market.",
      ],
      mistakes: ["✗ 'more cheaper' → ✓ 'cheaper'", "✗ 'the most best' → ✓ 'the best'"],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["This is more cheaper than that.", "This is cheaper than that.", "This is cheapest than that.", "This is the more cheap."],
        answer: "This is cheaper than that.",
        why: "Short adjectives take -er + than, never more cheaper.",
      },
    },
    // Course 6 — Simple Presentations
    {
      title: "Sequencing language for presentations",
      explanation:
        "Presentations follow a clear order. Signposting words help listeners follow you: first, next, then, after that, finally. They also structure your speaking so you never get lost.",
      structure: "First/To begin with … · Next/Then/After that … · Finally/To sum up …",
      examples: [
        "First, let me introduce our main goals.",
        "Next, I will show you the sales data.",
        "Finally, I will answer your questions.",
      ],
      business: [
        "To begin with, we looked at customer feedback.",
        "To sum up, we recommend launching in June.",
      ],
      mistakes: ["✗ 'Firstly… secondly… at last' → use finally, not 'at last', for the last point.", "✗ mixing 'next' and 'then' as nouns — they are signposts, not sections."],
      mcq: {
        q: "Choose the correct way to start a presentation.",
        options: ["First, I want to introduce our goals.", "The first, I introduce goals.", "At first, introducing goals.", "First of, introducing the goals."],
        answer: "First, I want to introduce our goals.",
        why: "Sequencers like first are followed by a full clause.",
      },
    },
    // Course 7 — Business Travel and Social English
    {
      title: "Past simple for travel and social stories",
      explanation:
        "Tell stories about trips, visits and meetings using the past simple. Regular verbs end in -ed; many common verbs are irregular: go-went, meet-met, take-took, fly-flew.",
      structure: "subject + past verb · irregular forms: go→went, meet→met, fly→flew",
      examples: [
        "I flew to Singapore last Monday.",
        "We met the client at their office.",
        "The flight was delayed by two hours.",
      ],
      business: [
        "She visited three distributors during the trip.",
        "We took the client to dinner after the meeting.",
      ],
      mistakes: ["✗ 'I goed to the airport.' → ✓ 'I went to the airport.'", "✗ 'We meet yesterday.' → ✓ 'We met yesterday.'"],
      mcq: {
        q: "Choose the correct past simple sentence.",
        options: ["I flown to Hanoi yesterday.", "I flew to Hanoi yesterday.", "I flyed to Hanoi yesterday.", "I was fly to Hanoi yesterday."],
        answer: "I flew to Hanoi yesterday.",
        why: "Fly is irregular: fly → flew in the past simple.",
      },
    },
    // Course 8 — Workplace Problems and Giving Instructions
    {
      title: "Instructions with imperatives and sequence words",
      explanation:
        "When you solve a problem or teach a process, give clear step-by-step instructions. Use imperatives with sequence words: first, then, next, after that, finally.",
      structure: "First + verb … · Then/Next + verb … · Finally + verb …",
      examples: [
        "First, unplug the machine and wait one minute.",
        "Then restart it and try printing again.",
        "Finally, call IT if the problem continues.",
      ],
      business: [
        "Next, back up the file before you install the update.",
        "After that, send the confirmation to the customer.",
      ],
      mistakes: ["✗ 'First you will unplug and then restart.' → instructions prefer direct imperatives.", "✗ 'Finally of all' → ✓ 'finally' or 'last of all'."],
      mcq: {
        q: "Choose the clearest instruction.",
        options: ["First you will go to settings and changing the password.", "First, open settings and change the password.", "First opening settings and changing password.", "First, you opening settings."],
        answer: "First, open settings and change the password.",
        why: "Sequenced imperatives: First, + base verb + and + base verb.",
      },
    },
  ],

  // ============================================================ LEVEL 3
  [
    // Course 1 — Business Meetings
    {
      title: "Making and responding to suggestions",
      explanation:
        "Meetings run on suggestions. Propose ideas with Why don't we…? / What about…? / I suggest + -ing, then respond: That sounds good, or politely disagree: I see your point, but…",
      structure: "Why don't we + verb? · I suggest + verb-ing · I'd recommend + noun",
      examples: [
        "Why don't we review the budget first?",
        "I suggest postponing the launch by a week.",
        "That sounds reasonable — let's do that.",
      ],
      business: [
        "I'd recommend cutting the marketing spend for Q3.",
        "I see your point, but the timeline is too tight.",
      ],
      mistakes: ["✗ 'I suggest to postpone the meeting.' → ✓ 'I suggest postponing the meeting.'", "✗ 'Why don't we to ask marketing?' → ✓ 'Why don't we ask marketing?'"],
      mcq: {
        q: "Choose the correct suggestion.",
        options: ["I suggest to delay the project.", "I suggest delaying the project.", "I suggest delay the project.", "I suggesting delay the project."],
        answer: "I suggest delaying the project.",
        why: "Suggest is followed by the -ing form, not to + verb.",
      },
    },
    // Course 2 — Negotiation Basics
    {
      title: "First conditional for offers and outcomes",
      explanation:
        "In negotiation you link actions to results with the first conditional: if + present, will + verb. It sounds professional and concrete: 'If you order today, we will give you a discount.'",
      structure: "If + present simple, will + base verb",
      examples: [
        "If you increase the order, we will reduce the price.",
        "We will extend the warranty if you sign by Friday.",
        "If the payment is late, we will pause delivery.",
      ],
      business: [
        "If you commit to a yearly contract, we will offer 10% off.",
        "You will get faster support if you upgrade the plan.",
      ],
      mistakes: ["✗ 'If you will order, we will give…' → ✓ remove will after if.", "✗ 'If we agree, we give discount.' → keep will in the main clause."],
      mcq: {
        q: "Choose the correct first conditional sentence.",
        options: ["If you will pay early, we ship faster.", "If you pay early, we will ship faster.", "If you pay early, we ship will faster.", "If you paid early, we will ship faster."],
        answer: "If you pay early, we will ship faster.",
        why: "First conditional: if + present, will + base verb.",
      },
    },
    // Course 3 — Presentations and Reports
    {
      title: "Passive voice in reports and presentations",
      explanation:
        "Reports focus on actions, not who did them. The passive lets you say what happened without naming people: 'The survey was conducted in June.' Useful when the doer is unknown or unimportant.",
      structure: "be + past participle (by + agent)",
      examples: [
        "The results were published last week.",
        "The new policy was approved by the board.",
        "Sales figures are updated every month.",
      ],
      business: [
        "The report was prepared by the finance team.",
        "Three factories were visited during the audit.",
      ],
      mistakes: ["✗ 'The report was prepare by me.' → ✓ 'was prepared'", "✗ 'was published' vs 'is published' — keep the tense consistent with the time."],
      mcq: {
        q: "Choose the correct passive sentence.",
        options: ["The decision was made at the board meeting.", "The decision was make at the board meeting.", "The decision made was at the board meeting.", "The decision is made by the board meeting."],
        answer: "The decision was made at the board meeting.",
        why: "Passive = be (was) + past participle (made).",
      },
    },
    // Course 4 — Business Emails and Customer Complaints
    {
      title: "Present perfect with just, already, yet",
      explanation:
        "In professional emails we link the past to now with the present perfect: 'We have already sent the invoice' or 'I haven't received the files yet.' just = a moment ago, already = sooner than expected.",
      structure: "have/has + past participle (+ just/already) · haven't/hasn't + participle + yet",
      examples: [
        "We have just received your complaint.",
        "I have already checked the delivery records.",
        "The refund hasn't been processed yet.",
      ],
      business: [
        "Our team has already started investigating the issue.",
        "Have you sent the revised quote yet?",
      ],
      mistakes: ["✗ 'I have sent the invoice yesterday.' → with yesterday use past simple: 'I sent the invoice yesterday.'", "✗ 'I didn't received it.' → ✓ 'I didn't receive it.'"],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["We have already emailed the new terms.", "We already emailed have the new terms.", "We have emailed already the new terms yesterday.", "We already have email the new terms."],
        answer: "We have already emailed the new terms.",
        why: "Present perfect + already sits between have and the participle.",
      },
    },
    // Course 5 — Problem Solving and Project Management
    {
      title: "Future forms: will, going to, present continuous",
      explanation:
        "Project talk needs precise futures: will for decisions made now and predictions, going to for plans, present continuous for fixed arrangements: 'The launch will be in June' vs 'We are meeting on Friday.'",
      structure: "will + verb (decision/prediction) · be going to + verb (plan) · am/is/are + verb-ing (arrangement)",
      examples: [
        "I will send the revised timeline this afternoon.",
        "We are going to hire two more developers.",
        "The client is visiting our office next week.",
      ],
      business: [
        "The project will finish on schedule if we start now.",
        "We are launching the pilot in May.",
      ],
      mistakes: ["✗ 'We are agree to the deadline.' → ✓ 'We agree to the deadline.' or 'We will agree…'", "✗ 'I will going to call you.' → ✓ 'I will call you.' / 'I am going to call you.'"],
      mcq: {
        q: "Choose the sentence for a fixed arrangement.",
        options: ["We are meeting the supplier on Monday.", "We will meeting the supplier on Monday.", "We meet the supplier yesterday.", "We are meet the supplier on Monday."],
        answer: "We are meeting the supplier on Monday.",
        why: "Fixed arrangements use the present continuous with a future time.",
      },
    },
    // Course 6 — Sales and Marketing
    {
      title: "Comparisons: as…as, more…than, the most",
      explanation:
        "Marketing compares constantly. Use as + adjective + as for equality, more/less + adjective + than for difference, and the most/least for extremes. Support claims with numbers.",
      structure: "as + adj + as · more/less + adj + than · the most/least + adj",
      examples: [
        "Our new app is as fast as the leading competitor.",
        "Email marketing is more cost-effective than print ads.",
        "Social media is the most effective channel for us.",
      ],
      business: [
        "This campaign reached twice as many customers as last year's.",
        "Repeat buyers are the most profitable segment.",
      ],
      mistakes: ["✗ 'as more popular as' → ✓ 'as popular as'", "✗ 'more faster' → ✓ 'faster'"],
      mcq: {
        q: "Choose the correct comparison.",
        options: ["Our price is as low than theirs.", "Our price is as low as theirs.", "Our price is as lower as theirs.", "Our price is so low as theirs."],
        answer: "Our price is as low as theirs.",
        why: "Equality comparisons use as + adjective + as.",
      },
    },
    // Course 7 — Finance and HR Vocabulary
    {
      title: "Quantifiers: much, many, a lot of, some, any",
      explanation:
        "Talk about money, budgets and staff numbers with the right quantifier: much with uncountable nouns (money, time), many with countable nouns (employees, invoices), some in positive sentences, any in questions and negatives.",
      structure: "much + uncountable · many + countable · some/any + noun",
      examples: [
        "We don't have much budget left this quarter.",
        "How many employees joined the training?",
        "There are some savings we can reinvest.",
      ],
      business: [
        "We need a lot of data before the review.",
        "Are there any open positions in finance?",
      ],
      mistakes: ["✗ 'many money' → money is uncountable: 'much money'", "✗ 'some' in negative sentences → 'any'"],
      mcq: {
        q: "Complete the sentence: 'There isn't ___ time to finish the audit.'",
        options: ["many", "much", "a few", "several"],
        answer: "much",
        why: "Time is uncountable, and negatives use much.",
      },
    },
    // Course 8 — Management and Team Communication
    {
      title: "Giving advice: should, ought to, I'd recommend",
      explanation:
        "Managers advise, not command. Should is the everyday word, ought to is slightly more formal, and I'd recommend adds weight. Soften criticism with I think, maybe, perhaps.",
      structure: "subject + should/ought to + base verb · I'd recommend + verb-ing",
      examples: [
        "You should share the minutes after the meeting.",
        "The team ought to review the plan together.",
        "I'd recommend delegating the routine tasks.",
      ],
      business: [
        "We should set clearer expectations for the interns.",
        "You ought to talk to HR about the workload.",
      ],
      mistakes: ["✗ 'You should to talk to me first.' → ✓ 'You should talk to me first.'", "✗ 'I'd recommend to delegate.' → ✓ 'I'd recommend delegating.'"],
      mcq: {
        q: "Choose the correct advice.",
        options: ["You should to ask your manager.", "You should ask your manager.", "You should asking your manager.", "You should asked your manager."],
        answer: "You should ask your manager.",
        why: "Should is followed by the base verb.",
      },
    },
  ],

  // ============================================================ LEVEL 4
  [
    // Course 1 — Advanced Meetings and Negotiation
    {
      title: "Second and third conditionals",
      explanation:
        "Second conditionals talk about unreal present situations ('If we had more staff, we would finish faster'). Third conditionals look back at unreal past situations ('If we had negotiated harder, we would have saved more').",
      structure: "2nd: If + past simple, would + verb · 3rd: If + past perfect, would have + past participle",
      examples: [
        "If we offered a longer payment term, they would sign today.",
        "If the exchange rate had been stable, we would have made a profit.",
        "What would you do if sales dropped by 20%?",
      ],
      business: [
        "If we had included the training in the quote, the client would have accepted.",
        "We would be more competitive if we reduced lead times.",
      ],
      mistakes: ["✗ 'If I would be you…' → ✓ 'If I were you…'", "✗ 'If we had known, we will have…' → third conditional: 'we would have known'."],
      mcq: {
        q: "Choose the correct third conditional sentence.",
        options: ["If we had checked the contract, we would avoid the fee.", "If we had checked the contract, we would have avoided the fee.", "If we checked the contract, we would have avoided the fee.", "If we would have checked, we avoided the fee."],
        answer: "If we had checked the contract, we would have avoided the fee.",
        why: "Third conditional: if + past perfect, would have + past participle.",
      },
    },
    // Course 2 — Leadership and Conflict Resolution
    {
      title: "Reported speech: reporting requests and questions",
      explanation:
        "When you pass on what someone said, you often backshift the tense: 'She said, \"I am busy\"' → 'She said she was busy.' Report requests with ask + to: 'He asked me to send the files.'",
      structure: "say/tell + that + clause (backshifted) · ask/tell someone + to + verb",
      examples: [
        "The director said the project was behind schedule.",
        "He told me the meeting had been moved.",
        "She asked us to prepare the slides in advance.",
      ],
      business: [
        "The client said they were not satisfied with the delivery time.",
        "Our CEO asked the teams to focus on retention.",
      ],
      mistakes: ["✗ 'She said me that…' → say is not followed by a person: 'She told me…' / 'She said that…'", "✗ 'He asked to me to wait.' → ✓ 'He asked me to wait.'"],
      mcq: {
        q: "Report the sentence: 'I am reviewing the contract,' said Maria.",
        options: ["Maria said she is reviewing the contract.", "Maria said she was reviewing the contract.", "Maria said me she was reviewing the contract.", "Maria said I was reviewing the contract."],
        answer: "Maria said she was reviewing the contract.",
        why: "Reported speech backshifts am → was.",
      },
    },
    // Course 3 — Business Strategy
    {
      title: "Passive with modals for strategy language",
      explanation:
        "Strategy documents remove the actor: 'The budget must be reviewed' sounds objective and neutral. Combine the passive with modal verbs: must be done, should be measured, can be improved.",
      structure: "modal + be + past participle",
      examples: [
        "The strategy must be reviewed every quarter.",
        "Costs can be reduced by automating the process.",
        "New markets should be evaluated carefully.",
      ],
      business: [
        "The rollout plan needs to be approved by the board.",
        "Customer churn should be measured monthly.",
      ],
      mistakes: ["✗ 'must be review' → ✓ 'must be reviewed'", "✗ 'The strategy can improved.' → ✓ 'can be improved.'"],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["The plan must be approved before launch.", "The plan must approved before launch.", "The plan must be approve before launch.", "The plan must to be approved before launch."],
        answer: "The plan must be approved before launch.",
        why: "Passive with a modal: must + be + past participle.",
      },
    },
    // Course 4 — Financial Discussions and Performance Reviews
    {
      title: "Present perfect vs past simple for results",
      explanation:
        "Use the present perfect for results that matter now ('Revenue has grown 8% this year'), and the past simple for finished past moments ('Revenue grew 8% in 2024'). Reviews and financial updates depend on this contrast.",
      structure: "have/has + past participle (no finished time) · past simple (+ finished time)",
      examples: [
        "We have reduced operating costs by 5%.",
        "Last quarter we reduced costs by 5%.",
        "She has improved her closing rate since January.",
      ],
      business: [
        "The team has exceeded its target for two months in a row.",
        "In the last review, we set three development goals.",
      ],
      mistakes: ["✗ 'We have achieved the target last month.' → finished time (last month) takes past simple.", "✗ 'Sales grew 8% this year.' → unfinished year takes present perfect."],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["She has met her targets in 2024.", "She met her targets in 2024.", "She has met her targets since 2024 and stopped.", "She have met her targets in 2024."],
        answer: "She met her targets in 2024.",
        why: "A finished year (2024) takes the past simple.",
      },
    },
    // Course 5 — Persuasion and Formal Communication
    {
      title: "Emphasis: not only…but also, it is…that",
      explanation:
        "Persuasive writing adds weight to key points. Not only…but also adds a second strong reason; it is…that focuses attention: 'It is reliability that clients value most.'",
      structure: "not only + clause, but also + clause · It is/was + focus + that + clause",
      examples: [
        "The proposal is not only cheaper, but also faster to deploy.",
        "It is the after-sales support that wins us contracts.",
        "She not only presented the data, but also answered every question.",
      ],
      business: [
        "Not only did sales rise, but customer satisfaction improved too.",
        "It is our delivery record that separates us from competitors.",
      ],
      mistakes: ["✗ 'not only…but also' inversion needs the auxiliary: 'Not only did sales rise…'", "✗ 'It is the price that matters the most important.' → redundant."],
      mcq: {
        q: "Choose the correct emphatic sentence.",
        options: ["It is quality that customers pay for.", "It is quality what customers pay for.", "That is quality customers pay for it.", "It is customers that quality pay for."],
        answer: "It is quality that customers pay for.",
        why: "It is + focus + that emphasises a specific element.",
      },
    },
    // Course 6 — Sales Negotiation and Marketing Strategy
    {
      title: "Mixed and third conditionals for negotiation reviews",
      explanation:
        "After a negotiation you analyse what could have been different. Third conditionals look back ('If we had offered support, they would have signed'), while mixed conditionals connect past causes to present results.",
      structure: "If + past perfect, would have + participle (past) · If + past perfect, would + verb (present result)",
      examples: [
        "If we had lowered the minimum order, they would have accepted.",
        "If the launch had gone well, we would be market leaders now.",
        "We would not be in this position if we had ignored the feedback.",
      ],
      business: [
        "If we had locked the exchange rate, the margin would be higher today.",
        "They would still be our client if the account manager had stayed.",
      ],
      mistakes: ["✗ 'If we would have offered…' → never use would in the if-clause.", "✗ mixing time frames without intent — choose pure third or mixed deliberately."],
      mcq: {
        q: "Choose the correct mixed conditional sentence.",
        options: ["If we had hired faster, we would launch now.", "If we had hired faster, we would be launching now.", "If we hired faster, we would be launching now.", "If we would have hired faster, we launch now."],
        answer: "If we had hired faster, we would be launching now.",
        why: "Mixed conditional: past condition (had hired) + present result (would be).",
      },
    },
    // Course 7 — Project Leadership and Business Problem Solving
    {
      title: "Narrative tenses for project updates",
      explanation:
        "Project updates tell a story: what started it (past simple), what was in progress (past continuous), and what happened before (past perfect): 'We were testing the system when the client reported a bug that had appeared after the update.'",
      structure: "past simple (events) · was/were + -ing (background) · had + participle (earlier events)",
      examples: [
        "We delivered the pilot while the team was still training users.",
        "The delay happened because the vendor had sent the wrong parts.",
        "By the time we noticed, the error had affected ten accounts.",
      ],
      business: [
        "We were preparing the launch when the budget was cut.",
        "The issue had existed for weeks before anyone reported it.",
      ],
      mistakes: ["✗ 'We was testing' → ✓ 'We were testing'", "✗ 'had sent' vs 'sent' — use past perfect when the order would be unclear."],
      mcq: {
        q: "Choose the correct narrative sentence.",
        options: ["The server crashed while we was updating it.", "The server crashed while we were updating it.", "The server had crashed while we are updating it.", "The server crashed while we updating it."],
        answer: "The server crashed while we were updating it.",
        why: "Past continuous (were updating) describes the background action.",
      },
    },
    // Course 8 — Networking and Cross-Cultural Communication
    {
      title: "Indirect questions for polite communication",
      explanation:
        "Direct questions can sound blunt across cultures. Indirect questions soften them: 'Where is the office?' → 'Could you tell me where the office is?' Note the word order changes to statement order.",
      structure: "Could you tell me / Do you know / I wonder + question word + subject + verb",
      examples: [
        "Could you tell me when the meeting starts?",
        "Do you know if the client prefers email?",
        "I wonder whether they expect a formal dress code.",
      ],
      business: [
        "Could you tell me who handles procurement at your firm?",
        "Do you know whether the presentation is in English?",
      ],
      mistakes: ["✗ 'Could you tell me where is the office?' → statement order: 'where the office is.'", "✗ 'Do you know what time does it start?' → 'what time it starts.'"],
      mcq: {
        q: "Choose the correct indirect question.",
        options: ["Could you tell me when does the call start?", "Could you tell me when the call starts?", "Could you tell me when the call start?", "Could you tell me when is the call starting?"],
        answer: "Could you tell me when the call starts?",
        why: "Indirect questions use statement word order (subject before verb).",
      },
    },
  ],

  // ============================================================ LEVEL 5
  [
    // Course 1 — Executive Communication
    {
      title: "Hedging language for diplomatic communication",
      explanation:
        "Executives hedge to stay precise and diplomatic. Hedges soften claims: it seems, it appears, we believe, to some extent, arguably. They protect you when data is incomplete.",
      structure: "It seems/appears + that · We believe/may/ might + verb · to some extent / arguably / in principle",
      examples: [
        "It appears that the figures were misreported.",
        "We believe the market will recover in Q4.",
        "Arguably, the merger created more value than expected.",
      ],
      business: [
        "The results seem to suggest a slowdown in the region.",
        "We may need to revisit the capital structure.",
      ],
      mistakes: ["✗ over-hedging: 'I kind of think maybe it might perhaps be…' weakens authority.", "✗ 'It is arguably that…' → 'arguably' stands alone: 'Arguably, it is…'"],
      mcq: {
        q: "Choose the most diplomatic sentence.",
        options: ["The figures are wrong — fix them.", "It appears the figures may contain an error.", "The figures were definitely wrong.", "Somebody made the figures wrong."],
        answer: "It appears the figures may contain an error.",
        why: "It appears + may softens the claim while staying precise.",
      },
    },
    // Course 2 — Complex Negotiation
    {
      title: "Mixed conditionals in negotiation",
      explanation:
        "Master negotiators mix conditions and results across time: a past condition with a present result ('If we had signed in March, we would be protected now') or a present condition with a past result.",
      structure: "If + past perfect, would + verb · If + past simple, would have + participle",
      examples: [
        "If we had secured the patent earlier, we would dominate the market today.",
        "If the CFO were here, she would have challenged that clause.",
        "We wouldn't be paying these penalties if the contract had been reviewed.",
      ],
      business: [
        "If the supplier hadn't raised prices, our margins would look healthy now.",
        "If demand were stronger, we would have built the second factory.",
      ],
      mistakes: ["✗ 'If we had known, we would not pay now.' → present result still 'would not be paying'.", "✗ double past: 'would have had paid' — never stack have."],
      mcq: {
        q: "Choose the correct mixed conditional.",
        options: ["If we had bought the licence, we would save now.", "If we had bought the licence, we would be saving now.", "If we bought the licence, we would save now.", "If we would have bought the licence, we saved now."],
        answer: "If we had bought the licence, we would be saving now.",
        why: "Past condition (had bought) → present ongoing result (would be saving).",
      },
    },
    // Course 3 — Corporate Strategy and Financial Analysis
    {
      title: "Participle clauses for concise reports",
      explanation:
        "Participle clauses pack information into one elegant sentence: 'Having reviewed the data, we recommend…' or 'Based on the Q2 results, the board decided…' They make strategy writing dense and professional.",
      structure: "Having + participle, + main clause · Based on / Given + noun phrase, + clause",
      examples: [
        "Having analyzed the regional data, we propose a phased entry.",
        "Given the current interest rates, borrowing is unattractive.",
        "Faced with rising costs, the board postponed expansion.",
      ],
      business: [
        "Having secured the distribution deal, the team turned to pricing.",
        "Adjusted for currency effects, revenue grew 4%.",
      ],
      mistakes: ["✗ dangling: 'Having reviewed the report, the decision was made.' → the subject of having… must be the main-clause subject.", "✗ 'Based on the data, we…' fine, but never 'Based from'."],
      mcq: {
        q: "Choose the correct participle clause sentence.",
        options: ["Having reviewed the contracts, we found two errors.", "Having reviewed the contracts, two errors were found by us.", "Reviewed the contracts, we found two errors.", "Having review the contracts, we found errors."],
        answer: "Having reviewed the contracts, we found two errors.",
        why: "Having + past participle introduces a completed action before the main clause.",
      },
    },
    // Course 4 — Contracts and Legal Business English
    {
      title: "Modal verbs in legal English: shall, must, may",
      explanation:
        "Contracts use a special modal system: shall imposes an obligation on a party, must states requirements, may grants permission. Precision here protects the business.",
      structure: "Party + shall/must/may + base verb · shall not / may not",
      examples: [
        "The supplier shall deliver the goods within 30 days.",
        "Either party may terminate this agreement with notice.",
        "Confidential information must not be disclosed to third parties.",
      ],
      business: [
        "The buyer shall pay the invoice within 14 days of receipt.",
        "The distributor may resell the products only in the assigned territory.",
      ],
      mistakes: ["✗ 'shall will deliver' → never combine modals.", "✗ using 'must' where 'shall' is the contractual term — keep the contract's own system consistent."],
      mcq: {
        q: "Choose the sentence that grants permission.",
        options: ["The tenant shall pay rent monthly.", "The tenant may renew the lease for one more year.", "The tenant must renew the lease.", "The tenant shall not renew the lease."],
        answer: "The tenant may renew the lease for one more year.",
        why: "May expresses permission in legal English.",
      },
    },
    // Course 5 — International Business and Diplomacy
    {
      title: "Expressing concession: although, despite, however",
      explanation:
        "Diplomacy means conceding a point without losing your position. Use although/even though + clause, despite/in spite of + noun/-ing, and however to pivot between paragraphs.",
      structure: "Although + clause, + clause · Despite + noun/-ing, + clause · …; however, …",
      examples: [
        "Although the market is volatile, we will keep our position.",
        "Despite the tariff changes, exports grew.",
        "The negotiation was long; however, both sides gained value.",
      ],
      business: [
        "Even though the euro weakened, our European revenue held steady.",
        "Despite cultural differences, the joint venture succeeded.",
      ],
      mistakes: ["✗ 'Despite the market is volatile' → after despite use a noun or -ing.", "✗ 'Although…, however…' in one sentence is redundant."],
      mcq: {
        q: "Choose the correct sentence.",
        options: ["Despite the delay, we met the deadline.", "Despite the delay was long, we met the deadline.", "Although the delay, we met the deadline.", "Despite of the delay, we met the deadline."],
        answer: "Despite the delay, we met the deadline.",
        why: "Despite is followed by a noun phrase, not a clause.",
      },
    },
    // Course 6 — Persuasion and Influence at Scale
    {
      title: "Hypotheticals: suppose, were to, as if",
      explanation:
        "Influence deals in scenarios. Suppose invites the listener to imagine; if + were to make hypotheticals feel concrete; as if compares unreal situations. These forms sell visions and test reactions.",
      structure: "Suppose/Imagine + clause · If + subject + were to + verb · as if + past",
      examples: [
        "Suppose the market doubles in three years — what do we do?",
        "If we were to enter Vietnam, we would need local partners.",
        "He talks as if the project were already funded.",
      ],
      business: [
        "Imagine if every branch adopted this playbook.",
        "If we were to lose our biggest client, would we survive?",
      ],
      mistakes: ["✗ 'If I was to decide' → in hypotheticals use were: 'If I were to decide'", "✗ 'as if it is funded' (real) vs 'as if it were funded' (unreal)."],
      mcq: {
        q: "Choose the correct hypothetical sentence.",
        options: ["If we were to cut prices, rivals would follow.", "If we was to cut prices, rivals would follow.", "If we are to cut prices, rivals followed.", "If we would were to cut prices, rivals follow."],
        answer: "If we were to cut prices, rivals would follow.",
        why: "Hypothetical future uses were to in the if-clause.",
      },
    },
    // Course 7 — Crisis Communication
    {
      title: "Reported speech in crisis statements",
      explanation:
        "Crisis statements pass information up and out precisely. Reported speech with correct backshifting prevents misquoting: 'The CEO said the outage had been resolved' — never guess who said what.",
      structure: "said/told/reported + that + backshifted clause · according to + source",
      examples: [
        "The spokesperson said the incident had been contained.",
        "Management told staff that salaries would be paid on time.",
        "According to the regulator, no customer data was exposed.",
      ],
      business: [
        "The airline confirmed that two flights had been cancelled.",
        "We reported that the fix had been deployed overnight.",
      ],
      mistakes: ["✗ 'She said the system is down' → backshift for past frame: '…was down' unless still true and clearly stated as current.", "✗ quoting opinions as facts: 'Experts said the crisis…' needs a source."],
      mcq: {
        q: "Choose the correctly reported statement.",
        options: ["The CEO said the leak had been fixed.", "The CEO said the leak has fixed.", "The CEO said the leak was fixing.", "The CEO said the leak is been fixed."],
        answer: "The CEO said the leak had been fixed.",
        why: "A past report of a completed event uses past perfect: had been fixed.",
      },
    },
    // Course 8 — Advanced Business Negotiation Mastery
    {
      title: "Complex concession and conditionals in negotiation",
      explanation:
        "At the highest level, negotiators combine concession and condition in one fluent sentence: 'Provided that you accept the warranty clause, we are willing to extend the payment term.' Provided that, as long as and on condition that make offers precise.",
      structure: "Provided that / as long as / on condition that + clause, + main clause",
      examples: [
        "Provided that volumes reach 10,000 units, we will reduce the unit price.",
        "We can accept the exclusivity clause as long as it expires after two years.",
        "On condition that the deposit arrives this week, we will reserve the licence.",
      ],
      business: [
        "Provided that the audit passes, the acquisition will close in June.",
        "We will extend the warranty on condition that you sign a service contract.",
      ],
      mistakes: ["✗ 'Provided that' + will clause → the condition clause never takes will.", "✗ 'as long as' vs 'as long' — the phrase needs the full 'as long as'."],
      mcq: {
        q: "Choose the correct conditional offer.",
        options: ["Provided that you order 500 units, we will give a discount.", "Provided that you will order 500 units, we give a discount.", "Provided you ordering 500 units, we will give a discount.", "Provided that you order 500 units, we gave a discount."],
        answer: "Provided that you order 500 units, we will give a discount.",
        why: "Provided that takes the present tense; the main clause takes will.",
      },
    },
  ],
];
