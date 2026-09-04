// ---------------------------------------------------------------------------
// Levels 2-5 authored structure. Compact but real: each course defines its
// 5 topics + a business dialogue bank + brief topic notes. Vocabulary,
// grammar, listening and quiz questions are composed in seed.ts from these
// atoms plus per-level grammar and vocabulary banks (all authored, real).
// ---------------------------------------------------------------------------

export interface AtomTopic {
  title: string;
  desc: string;
  note: string; // 1-2 sentences of real lesson content
}

export interface AtomCourse {
  title: string;
  short: string;
  desc: string;
  dialogue: { speaker: string; text: string }[];
  topics: AtomTopic[];
}

export interface LevelContent {
  name: string;
  label: string;
  slug: string;
  description: string;
  courses: AtomCourse[];
}

export const level2: LevelContent = {
  name: "Elementary Business English",
  label: "Elementary",
  slug: "elementary",
  description:
    "Build confidence in everyday work English: describing your job and responsibilities, making appointments, telephoning, emails, customer service, prices, orders, delivery and simple presentations.",
  courses: [
    {
      title: "Daily Work Activities",
      short: "Talk about your tasks, projects and work week",
      desc: "Describe what you do day to day, what you are working on right now, and how you organize your week with colleagues.",
      dialogue: [
        { speaker: "You", text: "What are you working on at the moment?" },
        { speaker: "Alex", text: "I'm preparing the monthly sales figures." },
        { speaker: "You", text: "Are you still dealing with the client reports?" },
        { speaker: "Alex", text: "I finished those yesterday, actually." },
        { speaker: "You", text: "Nice. Let me know if you need a hand with the figures." },
        { speaker: "Alex", text: "Thanks — I might take you up on that." },
      ],
      topics: [
        { title: "Describing Your Work Week", desc: "Talk about what you do on different days.", note: "Colleagues often compare their weeks at Monday stand-ups. Use the present simple for routines: 'On Mondays I review the orders.' Use time phrases such as every morning, twice a week and at the end of the day." },
        { title: "What Are You Working On Now?", desc: "Talk about current projects.", note: "Use the present continuous for things happening around now: 'I'm updating the price list this week.' Progress language: in progress, almost finished, on hold." },
        { title: "Dividing Up Tasks", desc: "Agree who does what.", note: "Useful patterns: 'Who is taking care of the venue?' 'I'll handle the invitations if you deal with the catering.' Confirm with: 'That works for me.'" },
        { title: "Dealing With Daily Problems", desc: "Report small issues calmly.", note: "Structure a problem report: what happened, when, the impact, and what you propose. Keep it factual: 'The printer is down, so the handouts will be ready an hour late.'" },
        { title: "Ending the Week With a Review", desc: "Summarize wins and next steps.", note: "Review meetings ask: 'What went well? What could be better? What are next week's priorities?' Answer in short, concrete sentences." },
      ],
    },
    {
      title: "Talking About Jobs and Responsibilities",
      short: "Explain your role and what you are responsible for",
      desc: "Describe responsibilities with the right verbs, talk about reporting lines, and present your duties clearly at work or in an interview.",
      dialogue: [
        { speaker: "Interviewer", text: "Could you describe your current responsibilities?" },
        { speaker: "You", text: "I'm in charge of stock control and I also handle supplier inquiries." },
        { speaker: "Interviewer", text: "How many people do you work with?" },
        { speaker: "You", text: "I'm part of a six-person operations team." },
        { speaker: "Interviewer", text: "And who do you report to?" },
        { speaker: "You", text: "I report directly to the operations manager." },
      ],
      topics: [
        { title: "Verbs for Responsibility", desc: "be in charge of, handle, deal with, look after", note: "Match the verb to the task: you look after people or accounts, you handle complaints or orders, you deal with problems, and you are in charge of a whole area." },
        { title: "My Main Duties", desc: "Present a clear list of duties.", note: "Order duties by importance and use sequence words: primarily, in addition, and finally. 'My primary duty is…; in addition, I support the sales team.'" },
        { title: "Reporting Lines", desc: "Explain your place in the structure.", note: "Report to means your manager; work with means colleagues; report on means you give updates about a subject. Keep the three straight to avoid confusion." },
        { title: "Describing Projects You Own", desc: "Talk about projects you lead.", note: "Own a project means you are accountable for it. Describe: objective, scope, timeline, current status and the support you need." },
        { title: "The Job Interview", desc: "Answer common interview questions.", note: "Common questions: 'Why are you interested in this role?' 'Where do you see yourself in three years?' Answer with a reason plus one concrete example." },
      ],
    },
    {
      title: "Appointments and Scheduling",
      short: "Arrange, move and confirm meetings",
      desc: "The language of calendars: proposing times, checking availability, rescheduling politely and confirming appointments in writing and speech.",
      dialogue: [
        { speaker: "You", text: "Would Thursday morning suit you for a site visit?" },
        { speaker: "Client", text: "I have a slot at ten, if that works." },
        { speaker: "You", text: "Ten is fine. Shall I send a confirmation email?" },
        { speaker: "Client", text: "Please do. Could you also include directions?" },
        { speaker: "You", text: "Of course. I'll add a map link and my mobile number." },
      ],
      topics: [
        { title: "Proposing Times", desc: "Offer times politely.", note: "Softer suggestions work best: 'Would Tuesday at two work for you?' or 'How does Thursday sound?' Avoid the blunt 'You must come on Friday.'" },
        { title: "Checking Availability", desc: "Ask what suits the other person.", note: "Useful questions: 'When are you free?' 'Is the afternoon better for you?' In English, free means available, not without cost." },
        { title: "Rescheduling Politely", desc: "Move an appointment without friction.", note: "Apologize once, give a brief reason, and offer alternatives: 'I'm sorry, I need to move our meeting. Would Wednesday at the same time be possible?'" },
        { title: "Confirming Appointments", desc: "Restate details so nothing is missed.", note: "A confirmation restates the date, time, place and who attends: 'Just to confirm — Tuesday 14 May, 10:00 a.m., Room B, with Khun Aom and me.'" },
        { title: "Calendar Habits", desc: "Manage your schedule professionally.", note: "Keep your calendar accurate: block focus time, accept or decline promptly, and set reminders a day before important meetings." },
      ],
    },
    {
      title: "Telephone and Customer Service",
      short: "Professional calls with customers and suppliers",
      desc: "Handle routine calls, clarify information, manage waiting customers and close calls with clear next steps.",
      dialogue: [
        { speaker: "Customer", text: "My order hasn't arrived and I need it by Friday." },
        { speaker: "You", text: "I'm sorry to hear that. Let me check the tracking right away." },
        { speaker: "Customer", text: "It said 'delivered', but I never received it." },
        { speaker: "You", text: "I understand. I'll contact the courier and call you back within the hour." },
        { speaker: "Customer", text: "Thank you. I appreciate the fast response." },
        { speaker: "You", text: "You're welcome. I'll keep you updated." },
      ],
      topics: [
        { title: "Opening a Customer Call", desc: "Start calls warmly and take control.", note: "Greet, give your name and company, and show you are ready: 'Good morning, FactBusiness Support, Napa speaking. How can I help you today?'" },
        { title: "Listening and Clarifying", desc: "Check you understood the problem.", note: "Reflect the problem back: 'So the invoice shows 2,000 baht, but you were quoted 1,800 — is that right?' Clarifying prevents costly mistakes." },
        { title: "Explaining Delays", desc: "Give bad news with a reason and a fix.", note: "Pattern: apologize, state the cause simply, and commit to a specific next action: 'There's a delay at the warehouse, so delivery moves to Monday. You'll get the new tracking number today.'" },
        { title: "Offering Solutions", desc: "Suggest options, not just apologies.", note: "Offer choices so the customer feels in control: 'Would you prefer a replacement, or a refund to your account?'" },
        { title: "Closing and Follow-Up", desc: "End the call with clear next steps.", note: "Summarize what you will do and when: 'I'll email the revised invoice today and confirm the payment date tomorrow.' Then actually follow up." },
      ],
    },
    {
      title: "Products, Prices and Orders",
      short: "Talk about what you sell, what it costs and how to order",
      desc: "Describe products and services, discuss prices and discounts, place and confirm orders, and track delivery.",
      dialogue: [
        { speaker: "You", text: "Could you tell me more about the A-20 model?" },
        { speaker: "Sales rep", text: "It's our best seller — it lasts twice as long as the A-10." },
        { speaker: "You", text: "What's the unit price for fifty pieces?" },
        { speaker: "Sales rep", text: "At that volume I can offer you a five percent discount." },
        { speaker: "You", text: "Does that include delivery?" },
        { speaker: "Sales rep", text: "Delivery is free for orders over ten thousand baht." },
      ],
      topics: [
        { title: "Describing a Product", desc: "Explain features and benefits.", note: "Separate features (what it has) from benefits (what it does for the customer): 'It has a 20-hour battery — so your team can work all day without charging.'" },
        { title: "Prices and Discounts", desc: "Talk about cost, discounts and deals.", note: "Key terms: unit price, bulk order, discount, trade price, offer and valid until. 'We can offer 5% off for orders above one hundred units.'" },
        { title: "Placing an Order", desc: "Order goods clearly and completely.", note: "State the product code, quantity, price agreed and delivery address. End with: 'Please confirm the order by email.'" },
        { title: "Confirming Order Details", desc: "Restate and verify the order.", note: "Read the order back: quantity, code, color or size, price, and date. Confirmation emails prevent expensive misunderstandings." },
        { title: "Tracking Delivery", desc: "Follow up on shipments.", note: "Useful language: dispatch date, estimated arrival, tracking number, carrier and signature on delivery. 'Can you confirm when the goods left the warehouse?'" },
      ],
    },
    {
      title: "Simple Presentations",
      short: "Introduce topics and present ideas clearly",
      desc: "Structure a short talk: opening, three clear points, and a conclusion with questions.",
      dialogue: [
        { speaker: "You", text: "Good morning, everyone. Thanks for coming." },
        { speaker: "You", text: "Today I'll talk about three things: the results, the reasons, and our next steps." },
        { speaker: "Colleague", text: "How long do you have?" },
        { speaker: "You", text: "About ten minutes, so I'll keep each point short." },
        { speaker: "You", text: "If you have questions, please save them for the end." },
      ],
      topics: [
        { title: "Structuring a Short Talk", desc: "Opening, body, conclusion.", note: "Tell the audience the plan up front: 'I'll cover three points: the background, the options, and my recommendation.'" },
        { title: "Opening and Signposting", desc: "Guide listeners through your talk.", note: "Signposts keep people with you: first of all, moving on to, and to sum up. They are the traffic lights of a presentation." },
        { title: "Using Visuals Simply", desc: "Talk about charts and slides.", note: "Describe what the visual shows: 'As you can see, sales rose steadily from March.' Point to the exact line or bar you mean." },
        { title: "Handling Questions", desc: "Answer questions calmly.", note: "If you don't know, say so and offer to follow up: 'That's a good question. Let me check and get back to you today.'" },
        { title: "Concluding and Next Steps", desc: "End with a clear ask.", note: "Finish with one clear message and one action: 'So my recommendation is Option B, and I'd like your approval by Friday.'" },
      ],
    },
    {
      title: "Business Travel and Social English",
      short: "Airports, hotels, taxis and polite social chat",
      desc: "Handle the practical English of a business trip and the social English that keeps relationships warm.",
      dialogue: [
        { speaker: "Receptionist", text: "Welcome. Do you have a reservation?" },
        { speaker: "You", text: "Yes, under Srisuwan. I booked a single room for three nights." },
        { speaker: "Receptionist", text: "Here we are — room 402, with a city view. Would you like a wake-up call?" },
        { speaker: "You", text: "Yes please, at seven. And what time is breakfast?" },
        { speaker: "Receptionist", text: "Breakfast runs from six-thirty to ten." },
      ],
      topics: [
        { title: "At the Airport", desc: "Check in, board and arrive.", note: "Useful terms: check-in desk, boarding pass, gate, departure and arrival. 'I'd like a window seat, please.'" },
        { title: "Checking Into a Hotel", desc: "Arrive and settle in.", note: "Confirm your reservation, ask about breakfast and wifi, and request a wake-up call if you have an early meeting." },
        { title: "Getting Around", desc: "Taxis, transport and directions.", note: "Give the driver the address in writing on your phone, and confirm the route and rough price before you leave." },
        { title: "Social English Over Lunch", desc: "Chat while you eat.", note: "Safe topics for business lunches: food, travel, hometowns and hobbies. Avoid politics, salaries and personal questions." },
        { title: "Thanking Your Host", desc: "Close a visit graciously.", note: "Send a thank-you note within 24 hours: 'Thank you for your hospitality — it was a pleasure meeting your team, and I look forward to working together.'" },
      ],
    },
    {
      title: "Workplace Problems and Giving Instructions",
      short: "Report issues and guide people clearly",
      desc: "Describe workplace problems factually and give instructions others can follow without confusion.",
      dialogue: [
        { speaker: "Manager", text: "What's the situation with the delivery?" },
        { speaker: "You", text: "The truck broke down, so the stock won't arrive until tomorrow." },
        { speaker: "Manager", text: "Have you informed the customers?" },
        { speaker: "You", text: "We emailed everyone affected this morning." },
        { speaker: "Manager", text: "Good work. Please also update the website notice." },
      ],
      topics: [
        { title: "Describing a Problem", desc: "Facts first, feelings second.", note: "Report problems with cause, effect and action: 'The server crashed at nine, so invoices were delayed; IT restarted it at ten.'" },
        { title: "Giving Clear Instructions", desc: "Step-by-step guidance.", note: "Use short commands with sequence words: first, next, then, finally. Check understanding: 'Does that make sense?'" },
        { title: "Asking for Instructions", desc: "Request direction politely.", note: "'Could you walk me through the process?' and 'What should I do if the system asks for a code?' show initiative." },
        { title: "Apologizing and Owning Mistakes", desc: "Say sorry professionally.", note: "Accept responsibility and move to repair: 'That was my error. I've corrected the file and sent the right version.'" },
        { title: "Learning From Problems", desc: "Turn issues into improvements.", note: "After a problem, ask: what happened, why, and what stops it recurring. Write the fix into a simple checklist." },
      ],
    },
  ],
};

export const level3: LevelContent = {
  name: "Intermediate Business English",
  label: "Intermediate",
  slug: "intermediate",
  description:
    "Work confidently in meetings, negotiations and projects: express opinions, agree and disagree professionally, handle complaints, and use the language of sales, marketing, finance, HR and management.",
  courses: [
    {
      title: "Business Meetings",
      short: "Lead and join discussions with confidence",
      desc: "Chair and participate in meetings: set the agenda, keep discussion on track, manage time and capture decisions.",
      dialogue: [
        { speaker: "You", text: "Let's move on to the second agenda item." },
        { speaker: "Mia", text: "Before that, could we revisit the budget question?" },
        { speaker: "You", text: "We're tight on time — could we park that and come back to it?" },
        { speaker: "Mia", text: "Sure, as long as it's on the record." },
        { speaker: "You", text: "Absolutely. I'll add it to the action points." },
      ],
      topics: [
        { title: "Chairing a Meeting", desc: "Guide the room with confidence.", note: "A chair controls pace, not content: 'Let's give everyone two minutes on this.' Keep the meeting to its stated end time." },
        { title: "Managing Discussion", desc: "Invite voices and cut repetition.", note: "Useful chair language: 'What's your take, Khun Dan?' and 'We're covering that point — let's park it.'" },
        { title: "Handling Interruptions", desc: "Deal with people who talk over others.", note: "Politely regain the floor: 'Sorry, let me finish this point first.' Later, invite the interrupter: 'You had something to add?'" },
        { title: "Recording Decisions", desc: "Make sure agreements stick.", note: "End each decision with who does what by when: 'So Mia will draft the proposal, and I'll review it by Thursday.'" },
        { title: "Virtual Meeting Etiquette", desc: "Work well on video calls.", note: "State your name before speaking, mute when not talking, and avoid side conversations in the chat while others present." },
      ],
    },
    {
      title: "Negotiation Basics",
      short: "Prepare, trade and reach agreement",
      desc: "The fundamentals of negotiation: stating positions, trading concessions, and closing a deal that both sides can accept.",
      dialogue: [
        { speaker: "Buyer", text: "Your price is above our budget." },
        { speaker: "You", text: "I understand. We could look at a longer contract to bring the unit price down." },
        { speaker: "Buyer", text: "What would a two-year deal cost?" },
        { speaker: "You", text: "On a two-year term, we can offer a 10% reduction." },
        { speaker: "Buyer", text: "That could work. Let me discuss it with my team." },
      ],
      topics: [
        { title: "Preparing to Negotiate", desc: "Know your limits before you start.", note: "Define your best alternative, your target, and your walk-away point before the meeting. Write them down — vague limits lead to weak deals." },
        { title: "Opening Positions", desc: "State your position clearly.", note: "Separate people from the problem: attack the issue, not the person. 'The price is the issue, not the partnership.'" },
        { title: "Making Concessions", desc: "Trade, don't give.", note: "Every concession should be conditional: 'If you commit to two years, we can reduce the price by ten percent.'" },
        { title: "Handling Deadlock", desc: "Unstick a stalled negotiation.", note: "Introduce new elements: payment terms, delivery dates, training or warranty. 'We're stuck on price — what if we split the difference on delivery instead?'" },
        { title: "Closing the Deal", desc: "Summarize and confirm agreement.", note: "Close by summarizing every point agreed and stating the next step: 'I'll send the revised contract today for signature by Friday.'" },
      ],
    },
    {
      title: "Presentations and Reports",
      short: "Present data and write clear business reports",
      desc: "Present results persuasively and write structured reports that busy managers can read fast.",
      dialogue: [
        { speaker: "You", text: "I'll summarize the quarter in three charts." },
        { speaker: "You", text: "This first chart shows revenue against target." },
        { speaker: "Manager", text: "What explains the dip in May?" },
        { speaker: "You", text: "A major client delayed their order. We recovered in June." },
        { speaker: "Manager", text: "Understood. What's your forecast for next quarter?" },
      ],
      topics: [
        { title: "Describing Trends", desc: "Up, down, flat — with numbers.", note: "Use precise verbs: rise, grow, fall, drop, recover, level off. Add degree: rose slightly, fell sharply, recovered steadily." },
        { title: "Comparing Figures", desc: "Contrast this year with last year.", note: "Useful comparatives: up by, down from, twice as much, half of last year's figure. Compare like with like — same period, same scope." },
        { title: "Structuring a Report", desc: "Executive summary first.", note: "Busy readers want the conclusion first: background, findings, analysis, recommendation. Put the detail in appendices." },
        { title: "Making Recommendations", desc: "Turn findings into action.", note: "Frame recommendations with reasons: 'I recommend option two because it cuts costs without delaying the launch.'" },
        { title: "Reporting to Management", desc: "Give status updates that earn trust.", note: "Report honestly on risks early. Managers trust people who flag problems with proposed fixes, not people who hide them." },
      ],
    },
    {
      title: "Business Emails and Customer Complaints",
      short: "Write professional emails and handle complaints",
      desc: "Write clear, structured emails for every situation, and resolve customer complaints without losing the relationship.",
      dialogue: [
        { speaker: "Customer", text: "I'm very disappointed with the late delivery." },
        { speaker: "You", text: "I completely understand your frustration, and I apologize." },
        { speaker: "Customer", text: "This is the second time it's happened." },
        { speaker: "You", text: "You're right, and that's unacceptable. Let me make it right." },
        { speaker: "Customer", text: "What can you do?" },
        { speaker: "You", text: "I'll refund the delivery fee and prioritize your next order." },
      ],
      topics: [
        { title: "Email Tone and Structure", desc: "Clarity over cleverness.", note: "One email, one topic, one clear ask. Put the ask in the first paragraph so the reader knows what you need and by when." },
        { title: "Writing to Complain", desc: "Firm but professional.", note: "State the problem, the expectation, and a deadline: 'The invoice was due on the 1st; please confirm payment by Friday.' No threats, no caps." },
        { title: "Responding to Complaints", desc: "Empathize, own, resolve.", note: "Pattern: acknowledge the feeling, apologize for the failure, explain the fix, and confirm the timeline." },
        { title: "Apology Emails That Work", desc: "Sincere and specific.", note: "A good apology names the mistake and the repair: 'We sent the wrong item. The correct one ships today, and the return is free.'" },
        { title: "Following Up Professionally", desc: "Nudge without nagging.", note: "If there's no reply, send one polite follow-up after a few days: 'I wanted to check whether you had a chance to review my proposal.'" },
      ],
    },
    {
      title: "Problem Solving and Project Management",
      short: "Plan projects, meet deadlines and solve problems",
      desc: "Structure projects with clear scopes and deadlines, run stand-ups, track risks and solve problems methodically.",
      dialogue: [
        { speaker: "PM", text: "We're two weeks behind on the design phase." },
        { speaker: "You", text: "What's causing the delay?" },
        { speaker: "PM", text: "We're waiting on feedback from the client." },
        { speaker: "You", text: "Shall I chase them and set a clear deadline?" },
        { speaker: "PM", text: "Please. And let's agree a revised milestone today." },
      ],
      topics: [
        { title: "Project Basics", desc: "Scope, timeline, budget, team.", note: "A project has a clear objective, a finish date, a budget and named owners. If any of the four is unclear, the project will drift." },
        { title: "Planning and Milestones", desc: "Break work into checkable steps.", note: "Milestones are moments to check progress: design complete, prototype approved, launch ready. Celebrate or correct at each one." },
        { title: "Running a Stand-Up", desc: "Fifteen minutes, three questions.", note: "Each person answers: what I did yesterday, what I'll do today, what's blocking me. Managers remove blocks — they don't run the stand-up." },
        { title: "Managing Deadlines", desc: "Protect the date or renegotiate early.", note: "If a deadline is at risk, say so as soon as you know, propose options (extra resource, reduced scope, later date), and let the sponsor choose." },
        { title: "Risk Management", desc: "Find problems before they find you.", note: "List risks by likelihood and impact. For each, decide: avoid, reduce, transfer, or accept — and who watches it." },
      ],
    },
    {
      title: "Sales and Marketing",
      short: "Present offers, handle objections and promote products",
      desc: "The language of selling and promotion: presenting value, answering objections, and talking about markets, campaigns and customers.",
      dialogue: [
        { speaker: "Prospect", text: "It's more expensive than your competitor's product." },
        { speaker: "You", text: "It is — but it lasts twice as long, so the yearly cost is lower." },
        { speaker: "Prospect", text: "Can you prove that?" },
        { speaker: "You", text: "Yes, I can share a cost comparison from three of our clients." },
        { speaker: "Prospect", text: "I'd like to see that." },
      ],
      topics: [
        { title: "Selling Value, Not Price", desc: "Talk about what the product does for the buyer.", note: "Translate features into outcomes: faster processing means lower overtime; a longer warranty means less risk. Money saved or made wins deals." },
        { title: "Answering Objections", desc: "Listen, acknowledge, respond.", note: "Objections are questions in disguise. 'It's expensive' means 'justify the value.' Answer the real question, not the surface one." },
        { title: "Marketing Basics", desc: "Audience, message, channel.", note: "Marketing language: target audience, positioning, campaign, conversion and brand. One clear message on the right channel beats five weak ones." },
        { title: "Product Launches", desc: "Plan a launch that lands.", note: "A launch needs a date, a story, materials, and a team who knows the talking points. Tease before, announce clearly, and follow up after." },
        { title: "Customer Research", desc: "Learn what customers actually want.", note: "Ask open questions and listen: 'What made you choose us?' 'What almost stopped you?' The words customers use become your marketing." },
      ],
    },
    {
      title: "Finance and HR Vocabulary",
      short: "Understand the numbers and the people side",
      desc: "Read financial statements, talk about budgets and costs, and use the vocabulary of hiring, training and performance.",
      dialogue: [
        { speaker: "CFO", text: "Margins are under pressure this quarter." },
        { speaker: "You", text: "Where is the cost coming from?" },
        { speaker: "CFO", text: "Freight costs jumped after the route change." },
        { speaker: "You", text: "Have we compared other carriers?" },
        { speaker: "CFO", text: "Not yet — could you run that analysis?" },
      ],
      topics: [
        { title: "Money Language", desc: "Revenue, cost, profit and margin.", note: "Revenue is money in; cost is money out; profit is the difference; margin is profit as a percentage of revenue. Keep the four clear." },
        { title: "Budgets and Forecasts", desc: "Planned versus actual.", note: "Budget is the plan; forecast is the current best guess; actual is what happened. Variances are explained, not hidden." },
        { title: "Hiring Vocabulary", desc: "Recruitment from job ad to offer.", note: "Key terms: vacancy, candidate, shortlist, interview, reference check and offer. Screen carefully so you hire attitude and train skill." },
        { title: "Training and Development", desc: "Help people grow.", note: "People grow through training, feedback and stretch assignments. Link development to business needs: 'This course prepares the team for the new system.'" },
        { title: "Performance Conversations", desc: "Feedback that helps, not hurts.", note: "Describe specific behavior, its impact, and the change you want: 'When reports arrive late, the client review slips. Can we agree a Wednesday deadline?'" },
      ],
    },
    {
      title: "Management and Team Communication",
      short: "Give opinions, agree, disagree and decide",
      desc: "Communicate as a manager or senior team member: structured opinions, professional disagreement, delegation and decision-making.",
      dialogue: [
        { speaker: "You", text: "I see your point, but I see it differently." },
        { speaker: "Dan", text: "Go on." },
        { speaker: "You", text: "I think we're underestimating the setup cost." },
        { speaker: "Dan", text: "That's fair — I hadn't priced the training." },
        { speaker: "You", text: "Let's add it to the estimate before we decide." },
      ],
      topics: [
        { title: "Giving Opinions Confidently", desc: "State views with reasons.", note: "Opinions persuade with structure: your view, one reason, one example. 'I'd delay the launch because the app still crashes in testing.'" },
        { title: "Agreeing With Conditions", desc: "Support without surrendering judgment.", note: "'I agree in principle, but we need to check the numbers first.' Conditional agreement keeps you honest and adds value." },
        { title: "Disagreeing Professionally", desc: "Attack the idea, respect the person.", note: "Useful openers: 'I see it differently.' 'Have we considered the downside?' Disagree with evidence, not emotion." },
        { title: "Delegating Effectively", desc: "Hand over outcomes, not tasks.", note: "Delegate the goal, the deadline and the authority: 'You own this; decide and tell me if you hit a blocker.' Then don't micromanage." },
        { title: "Making Team Decisions", desc: "Consult, then decide.", note: "Consult broadly, decide clearly, and explain the why: 'We chose option A because it fits the deadline. Here's how we'll roll it out.'" },
      ],
    },
  ],
};

export const level4: LevelContent = {
  name: "Upper Intermediate Business English",
  label: "Upper Intermediate",
  slug: "upper-intermediate",
  description:
    "Lead advanced conversations: difficult negotiations, conflict resolution, strategy, performance reviews, persuasive communication and cross-cultural work.",
  courses: [
    {
      title: "Advanced Meetings and Negotiation",
      short: "Lead tough discussions and negotiate complex deals",
      desc: "Run difficult meetings, negotiate multi-issue deals, and read the room while protecting your interests.",
      dialogue: [
        { speaker: "You", text: "Let's agree on the principles before we talk numbers." },
        { speaker: "Partner", text: "Agreed — but our lawyers need the liability clause settled first." },
        { speaker: "You", text: "We can work on that language together. What's the specific concern?" },
        { speaker: "Partner", text: "The warranty period feels one-sided." },
        { speaker: "You", text: "Understood. Let's look at a mutual warranty with clear carve-outs." },
      ],
      topics: [
        { title: "Negotiating Multiple Issues", desc: "Trade across issues, not within one.", note: "Package deals unlock value: 'We'll accept your delivery terms if you extend the warranty.' Always have more than one issue to trade." },
        { title: "Managing Difficult People", desc: "Stay calm when others don't.", note: "Lower your voice, slow your pace, and name the behavior without blaming: 'We seem to be going in circles. Can we step back?'" },
        { title: "Reading the Room", desc: "Listen for what is not said.", note: "Notice hesitation, repeated words and who goes quiet. Silence often hides the real concern — invite it out: 'You seem unsure about point three.'" },
        { title: "Anchoring and Framing", desc: "Shape how the deal looks.", note: "The first number anchors the discussion, so set it deliberately and justify it. Frame every proposal around what the other side gains." },
        { title: "Walking Away", desc: "Know when no deal beats a bad deal.", note: "Your walk-away point protects you from sunk-cost thinking. Saying 'let's revisit this later' is a professional exit." },
      ],
    },
    {
      title: "Leadership and Conflict Resolution",
      short: "Lead teams and resolve conflict constructively",
      desc: "Communicate as a leader, give difficult feedback, and turn team conflict into better outcomes.",
      dialogue: [
        { speaker: "Lead", text: "I've noticed tension between your team and operations." },
        { speaker: "You", text: "Honestly, we feel operations changes priorities without warning." },
        { speaker: "Lead", text: "What would fix that from your side?" },
        { speaker: "You", text: "A shared priority list we both update weekly." },
        { speaker: "Lead", text: "Let's set that up — I'll chair the first session." },
      ],
      topics: [
        { title: "Leadership Communication", desc: "Clarity, consistency, care.", note: "Leaders repeat the message until it lands: what we're doing, why it matters, and what I need from you. Then they listen twice as much as they talk." },
        { title: "Giving Difficult Feedback", desc: "Specific, timely, kind.", note: "Deliver feedback soon, in private, about behavior: 'When you interrupt the client, it undermines the call. Please let them finish.'" },
        { title: "Receiving Feedback", desc: "Listen before you defend.", note: "Thank the giver, ask a clarifying question, and take time to reflect: 'Thanks for telling me. Can you give me an example?'" },
        { title: "Resolving Team Conflict", desc: "Interests over positions.", note: "Ask each side what they need, find the shared interest, and build options together. Mediators facilitate — they don't take sides." },
        { title: "Building Trust", desc: "Trust comes from reliability.", note: "Trust is built by small promises kept: showing up on time, following up, admitting errors. It is lost in an instant and rebuilt slowly." },
      ],
    },
    {
      title: "Business Strategy",
      short: "Talk about direction, markets and competition",
      desc: "Discuss strategy with confidence: markets, competitors, positioning, growth options and strategic trade-offs.",
      dialogue: [
        { speaker: "CEO", text: "Our growth in the region has flattened." },
        { speaker: "You", text: "The market is maturing — most accounts already use a competitor." },
        { speaker: "CEO", text: "So where's the next growth engine?" },
        { speaker: "You", text: "Two options: win share with a service bundle, or open the SME segment." },
        { speaker: "CEO", text: "Let's pressure-test both at the strategy offsite." },
      ],
      topics: [
        { title: "Analyzing Markets", desc: "Size, growth, segments, trends.", note: "A market analysis covers size, growth rate, customer segments and trends. Data beats opinion — cite the source and the year." },
        { title: "Understanding Competition", desc: "Know who you really compete with.", note: "Map competitors by price, quality and service. Your real competitor may be 'do nothing' or 'build it in-house'." },
        { title: "Positioning and Differentiation", desc: "Own a clear space in the customer's mind.", note: "Positioning answers: who we serve, what we offer, and why we're different. 'For busy SMEs, we are the accounting service that answers in a day.'" },
        { title: "Growth Options", desc: "Grow, partner, or acquire.", note: "Growth levers: sell more to current customers, win new customers, expand products, or enter new markets. Each carries different risk." },
        { title: "Strategic Trade-offs", desc: "Strategy means choosing what not to do.", note: "Every 'yes' is a 'no' to something else. Write down what the company will deliberately not do — that protects the strategy." },
      ],
    },
    {
      title: "Financial Discussions and Performance Reviews",
      short: "Talk numbers with executives and review performance",
      desc: "Join financial conversations at a higher level and run performance reviews that develop people.",
      dialogue: [
        { speaker: "Manager", text: "Your review is positive overall, with one concern." },
        { speaker: "You", text: "Thanks — please be direct with me." },
        { speaker: "Manager", text: "Your project work is excellent, but documentation lags." },
        { speaker: "You", text: "Fair point. I'll block thirty minutes daily for updates." },
        { speaker: "Manager", text: "That's the kind of ownership I like to see." },
      ],
      topics: [
        { title: "Talking to Executives", desc: "Big picture, then detail.", note: "Executives want the conclusion, the confidence level, and the ask — in that order. Prepare the appendix for questions they ask." },
        { title: "Financial Statements", desc: "Income, balance sheet, cash flow.", note: "The income statement shows profit; the balance sheet shows what the company owns and owes; cash flow shows actual money moving. All three matter." },
        { title: "Investment Decisions", desc: "Payback, risk and return.", note: "Frame investments with payback period and risk: 'The upgrade pays back in fourteen months and cuts downtime risk significantly.'" },
        { title: "Running a Performance Review", desc: "Review the year, plan the next.", note: "Structure: what went well, what to improve, development goals, and what the employee needs from you. Agree both sides' actions." },
        { title: "Setting Development Goals", desc: "Goals that actually develop people.", note: "One stretch goal plus one skill goal beats a list of ten. Check progress quarterly, not annually." },
      ],
    },
    {
      title: "Persuasion and Formal Communication",
      short: "Influence decisions and write with weight",
      desc: "Persuade with evidence and narrative, write formal proposals, and communicate with diplomacy in sensitive situations.",
      dialogue: [
        { speaker: "You", text: "I'd like to propose a pilot before the full rollout." },
        { speaker: "Executive", text: "Why a pilot and not a direct launch?" },
        { speaker: "You", text: "A pilot costs a tenth of a full launch and gives us real user data." },
        { speaker: "Executive", text: "How long would it run?" },
        { speaker: "You", text: "Six weeks, with a decision gate at the end." },
      ],
      topics: [
        { title: "The Art of Persuasion", desc: "Logic, evidence, emotion.", note: "Persuade with a clear logic chain, credible evidence, and a story that makes it real. Anticipate the strongest objection and answer it first." },
        { title: "Writing Business Proposals", desc: "Problem, solution, proof, ask.", note: "A proposal states the problem, the solution, why you can deliver, the cost, and what you need to proceed. Write it so a busy reader can skim it." },
        { title: "Formal Email and Letter Writing", desc: "Register that fits the occasion.", note: "Formal writing uses full words (regarding, however, therefore), no contractions, and measured tone. Match formality to the relationship." },
        { title: "Diplomatic Language", desc: "Be direct without being blunt.", note: "Softening works: 'I'm afraid that won't be possible' beats 'No.' 'Could we reconsider the timeline?' invites rather than attacks." },
        { title: "Communicating Bad News", desc: "Deliver bad news with respect.", note: "Give the news early and clearly, explain the reason briefly, state what happens next, and show what you did to soften it." },
      ],
    },
    {
      title: "Sales Negotiation and Marketing Strategy",
      short: "Negotiate sales deals and plan campaigns",
      desc: "Negotiate with buyers who know the game and design marketing strategy with clear targets and measurement.",
      dialogue: [
        { speaker: "Buyer", text: "Your competitor offered us a deeper discount." },
        { speaker: "You", text: "I can't match that number, and I won't pretend I can." },
        { speaker: "Buyer", text: "Then why should we stay with you?" },
        { speaker: "You", text: "Because our uptime is 99.9%, and their service reviews are mixed." },
        { speaker: "Buyer", text: "Prove that with a service report and we'll talk." },
      ],
      topics: [
        { title: "Negotiating With Professional Buyers", desc: "Don't play their game unprepared.", note: "Professional buyers test limits. Hold your value story, use silence, and never discount without a concession in return." },
        { title: "Defending Your Price", desc: "Justify the number with value.", note: "Show the cost of switching, the risk of cheap, and the return your solution delivers. Price defends itself when value is quantified." },
        { title: "Marketing Strategy Frameworks", desc: "Target, message, channel, budget.", note: "Strategy precedes tactics: decide the audience and the promise first; only then choose channels, content and budget." },
        { title: "Campaign Metrics", desc: "Measure what matters.", note: "Track reach, engagement, conversion and cost per lead. A campaign without a target number is an expense, not an investment." },
        { title: "Brand Storytelling", desc: "Facts make you credible; stories make you memorable.", note: "A brand story has a hero (the customer), a problem, and how you help. Keep it honest — stories die when they meet reality." },
      ],
    },
    {
      title: "Project Leadership and Business Problem Solving",
      short: "Lead complex projects and crack hard problems",
      desc: "Lead cross-functional projects, manage stakeholders, and solve unstructured business problems with structure.",
      dialogue: [
        { speaker: "Sponsor", text: "The project is at risk because two teams disagree on scope." },
        { speaker: "You", text: "Let me map where the scope actually diverges." },
        { speaker: "Sponsor", text: "Marketing wants more features; engineering wants fewer." },
        { speaker: "You", text: "I'll frame it as a trade-off with costs so the decision is visible." },
        { speaker: "Sponsor", text: "Good. Bring that to Friday's steering meeting." },
      ],
      topics: [
        { title: "Leading Cross-Functional Projects", desc: "Align teams with different goals.", note: "Cross-functional teams drift when goals conflict. Align everyone on one measurable project goal and make trade-offs visible." },
        { title: "Managing Stakeholders", desc: "Map who cares and who decides.", note: "For each stakeholder know: interest, influence, and what success looks like to them. Communicate with the influential and keep the interested informed." },
        { title: "Structured Problem Solving", desc: "Define before you diagnose.", note: "A good problem statement names the gap, the impact and the constraint: 'Orders fell 20% in the north region since April, with no price change.'" },
        { title: "Root Cause Analysis", desc: "Fix causes, not symptoms.", note: "Ask 'why' five times to reach the root. Fixing symptoms is cheap today and expensive forever; fixing causes is the reverse." },
        { title: "Decision Frameworks", desc: "Compare options on the same axes.", note: "Score options against agreed criteria: cost, risk, speed, fit. The framework matters more than the score — it makes the logic discussable." },
      ],
    },
    {
      title: "Professional Networking and Cross-Cultural Communication",
      short: "Network effectively and work across cultures",
      desc: "Build a professional network, handle cross-cultural differences, and communicate clearly with international teams.",
      dialogue: [
        { speaker: "Host", text: "What brings you to the conference?" },
        { speaker: "You", text: "I'm exploring partnerships in Southeast Asia." },
        { speaker: "Host", text: "Who have you met so far?" },
        { speaker: "You", text: "A logistics firm and two software companies — both promising." },
        { speaker: "Host", text: "Let me introduce you to our regional director." },
      ],
      topics: [
        { title: "Networking That Works", desc: "Give value before you ask.", note: "Great networkers ask questions, listen, and connect people. Follow up within 48 hours with a specific, useful note — not a sales pitch." },
        { title: "Conference Small Talk to Deeper Talk", desc: "Move from hello to substance.", note: "Progression: how are you finding the event, what do you do, what are you working on, and what would make this week a success for you." },
        { title: "Understanding Cultural Differences", desc: "One style is not universal.", note: "Cultures differ in directness, hierarchy, and how they handle silence and disagreement. When unsure, mirror your counterpart's style." },
        { title: "Communicating With Non-Native Speakers", desc: "Clarity is kindness.", note: "Speak a little slower, use plain words, check understanding often, and never finish someone's sentence — even when you know what they mean." },
        { title: "Working in International Teams", desc: "Time zones, trust and turn-taking.", note: "Rotate meeting times fairly, write decisions down, and make room for quieter voices — video calls reward the loudest, not the best." },
      ],
    },
  ],
};

export const level5: LevelContent = {
  name: "Advanced Business English",
  label: "Advanced",
  slug: "advanced",
  description:
    "Executive-level English: strategic conversations, complex negotiation, corporate strategy, financial analysis, legal and contract language, diplomacy and crisis communication.",
  courses: [
    {
      title: "Executive Communication",
      short: "Communicate at boardroom level",
      desc: "Speak and write with executive presence: strategic conversations, board-level updates and messages that move organizations.",
      dialogue: [
        { speaker: "Board member", text: "Walk us through the rationale for the acquisition." },
        { speaker: "You", text: "In one line: it buys us two years of market position." },
        { speaker: "Board member", text: "And the integration risk?" },
        { speaker: "You", text: "It's the main risk — so we've planned a joint integration office from day one." },
        { speaker: "Board member", text: "What could make you walk away?" },
        { speaker: "You", text: "If due diligence reveals the customer churn above fifteen percent." },
      ],
      topics: [
        { title: "Executive Presence", desc: "Calm, concise, prepared.", note: "Presence is preparation plus composure: know your numbers, pause before answering, and never fill silence with noise." },
        { title: "Board-Level Updates", desc: "The board wants risk and options.", note: "Boards prefer honest risk disclosure and clear options to perfect news. Give them the decision you need and the alternatives you considered." },
        { title: "Strategic Conversations", desc: "Talk about the game, not just the move.", note: "Strategic talk asks why we win, what changes, and what we should stop doing. Push conversations from tactics to choices." },
        { title: "Communicating Vision", desc: "Paint the future in one sentence.", note: "A vision that travels fits on a napkin: where we are going, why it matters, and what changes for customers. Repeat it until it's boring." },
        { title: "Decision Memos", desc: "One page, one recommendation.", note: "The executive memo states the recommendation, the key reasons, the risks, and the ask. If it needs two pages, cut the middle." },
      ],
    },
    {
      title: "Complex Negotiation",
      short: "Multi-party deals and difficult counterparts",
      desc: "Negotiate complex, high-stakes deals: coalitions, information advantage and long-term relationships.",
      dialogue: [
        { speaker: "Counsel", text: "The other side wants an exclusivity clause." },
        { speaker: "You", text: "Exclusivity costs us the region — trade it for volume guarantees." },
        { speaker: "Counsel", text: "They'll push back on minimum volumes." },
        { speaker: "You", text: "Then we hold the exclusivity until the guarantee is met, quarterly." },
        { speaker: "Counsel", text: "That structure works. Let's draft it." },
      ],
      topics: [
        { title: "Multi-Party Negotiation", desc: "Coalitions change the game.", note: "In multi-party deals, map who allies with whom and what each side actually needs. Your biggest risk is often a silent coalition." },
        { title: "Information Advantage", desc: "What you know shapes the deal.", note: "Prepare by learning their constraints, deadlines and alternatives. Ask questions they answer without noticing they're negotiating." },
        { title: "Negotiating With Advisers", desc: "Lawyers and consultants on both sides.", note: "When advisers dominate, move the conversation to principles: 'What outcome would your client accept if the wording changed?'" },
        { title: "Long-Term Relationships", desc: "This deal funds the next one.", note: "Reputation compounds. If a term is unfair, say so and fix it — the other side will remember when the next deal comes." },
        { title: "BATNA and ZOPA", desc: "The math behind the dance.", note: "BATNA is your best alternative if this deal fails; ZOPA is the zone where both sides gain. Strong BATNA, wide research, patient moves." },
      ],
    },
    {
      title: "Corporate Strategy and Financial Analysis",
      short: "Analyze strategy and finance at depth",
      desc: "Discuss corporate strategy, read financial analysis, and communicate about markets, value and capital.",
      dialogue: [
        { speaker: "Analyst", text: "Your margin improved, but cash conversion is weak." },
        { speaker: "You", text: "We extended payment terms to win two large accounts." },
        { speaker: "Analyst", text: "Understandable — but watch the working capital trend." },
        { speaker: "You", text: "We've tightened collections on smaller accounts to balance it." },
        { speaker: "Analyst", text: "That's a sensible trade." },
      ],
      topics: [
        { title: "Reading Financial Analysis", desc: "Margins, cash, leverage, return.", note: "Four lenses on a business: profitability (margin), liquidity (cash), leverage (debt), and efficiency (return on capital). One metric never tells the story." },
        { title: "Corporate Strategy Frameworks", desc: "Where to play, how to win.", note: "Strategy answers two questions: where we compete (markets, segments) and how we win (cost, differentiation, network effects)." },
        { title: "Capital Allocation", desc: "Where money goes is strategy.", note: "Watch where the company invests: growth projects, buybacks, debt, or dividends. Capital allocation reveals what leadership actually believes." },
        { title: "Mergers and Acquisitions Language", desc: "Due diligence, synergy, integration.", note: "Key terms: target, bid, due diligence, valuation, synergy, integration and earn-out. Most value is lost in integration, not negotiation." },
        { title: "Communicating With Analysts", desc: "Consistency and candor.", note: "Analysts reward consistent messaging and honest guidance. If you surprise them, explain the change and the new expectation clearly." },
      ],
    },
    {
      title: "Contracts and Legal Business English",
      short: "Understand and discuss contracts in English",
      desc: "Read and discuss contracts with confidence: key clauses, obligations, warranties, liability and dispute language.",
      dialogue: [
        { speaker: "Lawyer", text: "The indemnity clause is broad — it could cover their negligence." },
        { speaker: "You", text: "What's the market-standard carve-out?" },
        { speaker: "Lawyer", text: "Mutual indemnities for third-party claims, capped at the contract value." },
        { speaker: "You", text: "Let's propose that, and keep the confidentiality clause as is." },
        { speaker: "Lawyer", text: "Agreed. I'll circulate the redline today." },
      ],
      topics: [
        { title: "Contract Anatomy", desc: "Parties, term, obligations, remedies.", note: "Read a contract for: who the parties are, how long it runs, what each must do, what happens on breach, and how it ends." },
        { title: "Key Commercial Clauses", desc: "Warranty, indemnity, limitation.", note: "Warranties are promises about the product or deal; indemnities allocate losses; limitation of liability caps exposure. Know which is which." },
        { title: "Negotiating Contract Language", desc: "Change words, protect meaning.", note: "When you can't change a clause, change its qualifiers: reasonable, material, commercially reasonable — qualifiers create room to argue." },
        { title: "Dispute Resolution", desc: "Escalate before you litigate.", note: "Dispute paths: negotiation, mediation, arbitration, courts. Cheaper, faster stages come first; put the ladder in the contract." },
        { title: "Talking to Legal Counsel", desc: "Business goals to legal language.", note: "Tell your lawyer the outcome you want, not the clause you want: 'we need to exit cheaply if the pilot fails' beats 'add a termination clause.'" },
      ],
    },
    {
      title: "International Business and Diplomacy",
      short: "Global deals, etiquette and diplomatic language",
      desc: "Work across borders: international business context, diplomatic phrasing and high-stakes sensitive conversations.",
      dialogue: [
        { speaker: "Minister aide", text: "Your proposal touches a sensitive regulatory area." },
        { speaker: "You", text: "We understand, and we're prepared to align with local rules." },
        { speaker: "Minister aide", text: "The timeline may need to move." },
        { speaker: "You", text: "Flexibility is possible if the core terms hold." },
        { speaker: "Minister aide", text: "We can work with that framing." },
      ],
      topics: [
        { title: "Global Business Context", desc: "Trade, regulation and local reality.", note: "International work adds layers: tariffs, local regulation, currency and logistics. Test every plan against local reality before committing." },
        { title: "Business Etiquette Across Cultures", desc: "Small signals, big meaning.", note: "Etiquette varies: who speaks first, how decisions are made, gift norms, and how directly people say no. Observe before you act." },
        { title: "Diplomatic Language in Practice", desc: "Hard messages, soft landing.", note: "Diplomatic tools: passive voice for blame ('mistakes were made'), hedging ('that may be difficult'), and offering face ('a win for both sides')." },
        { title: "Sensitive Conversations", desc: "Prepare the words before the meeting.", note: "Write the opening sentence of a hard conversation and practice it aloud. Clarity plus warmth beats either alone." },
        { title: "Building International Partnerships", desc: "Trust travels slowly.", note: "Partnerships across borders need repeated small engagements: visits, joint pilots, honest post-mortems. Invest before you need the favor." },
      ],
    },
    {
      title: "Persuasion and Influence at Scale",
      short: "Move markets, teams and stakeholders",
      desc: "Advanced persuasion: narratives, coalitions, social proof and influencing without authority.",
      dialogue: [
        { speaker: "You", text: "I need buy-in from three departments that don't report to me." },
        { speaker: "Mentor", text: "Who benefits most if this succeeds?" },
        { speaker: "You", text: "Sales — it cuts their proposal time by half." },
        { speaker: "Mentor", text: "Then let sales champion it with their peers." },
        { speaker: "You", text: "That's stronger than me pushing from the side." },
      ],
      topics: [
        { title: "Influencing Without Authority", desc: "Trade, allies and reciprocity.", note: "You influence sideways by helping first, building allies, and making your goal their goal. Reciprocity is the oldest tool in the book." },
        { title: "Narrative and Framing", desc: "The story decides the numbers.", note: "The same plan can be 'a risk' or 'a bet we can hedge.' Frame deliberately: what is this really — a cost, an investment, or an insurance policy?" },
        { title: "Building Coalitions", desc: "Wins start before the meeting.", note: "Never enter a key meeting without knowing who supports you. Meet the skeptics first, address their concerns, and let them speak for you." },
        { title: "Social Proof and Credibility", desc: "Evidence other people trust.", note: "Name credible references, pilot results and expert opinions. 'Three teams in your industry run this process' beats 'trust us.'" },
        { title: "Resistance and Skeptics", desc: "Turn opposition into input.", note: "Ask skeptics to design the test with you. People who help build the evaluation rarely fight the result." },
      ],
    },
    {
      title: "Crisis Communication",
      short: "Lead communication when it matters most",
      desc: "Communicate in a crisis: fast, honest, controlled — and protect the organization's reputation.",
      dialogue: [
        { speaker: "You", text: "We have a service outage and customers are posting about it." },
        { speaker: "CEO", text: "What do we say, and when?" },
        { speaker: "You", text: "Acknowledge within the hour: what happened, who's affected, when we update next." },
        { speaker: "CEO", text: "Do we know the cause yet?" },
        { speaker: "You", text: "Not fully — so we say we're investigating, not that it's fixed." },
      ],
      topics: [
        { title: "Crisis Principles", desc: "Speed, honesty, control.", note: "In a crisis, the story is written in the first hours. Acknowledge fast, share what you know, and say when you'll update — then update on time." },
        { title: "The First Statement", desc: "What you say in hour one.", note: "First statements: what happened, what we're doing, when we'll speak again. Never speculate on causes you haven't confirmed." },
        { title: "Managing the Narrative", desc: "Control what you can.", note: "Lead with your message, correct misinformation calmly, and keep one consistent voice. Chaos loves many voices; crisises hate them." },
        { title: "Internal Communication in Crisis", desc: "Staff hear rumors first.", note: "Tell your own people before the press: what happened, what it means for them, and what to say to customers. Silence inside becomes panic outside." },
        { title: "Post-Crisis Recovery", desc: "Rebuild after the storm.", note: "After a crisis: publish what went wrong, what changed, and what you'll do differently. Recovery is boring — and that's the point." },
      ],
    },
    {
      title: "Advanced Business Negotiation Mastery",
      short: "The complete negotiator's toolkit",
      desc: "Master the full negotiation cycle — preparation, tactics, psychology and closing — in English, at the highest level.",
      dialogue: [
        { speaker: "You", text: "Before we discuss price, help me understand the decision process." },
        { speaker: "Counterpart", text: "I present a recommendation; the committee confirms it." },
        { speaker: "You", text: "What does the committee worry about most — price, risk, or timing?" },
        { speaker: "Counterpart", text: "Honestly? Risk. A failed rollout is career damage here." },
        { speaker: "You", text: "Then let's build the proposal around de-risking the rollout." },
      ],
      topics: [
        { title: "The Preparation System", desc: "Know more than they expect.", note: "Prepare on four fronts: their needs, their constraints, their alternatives, and their decision process. Most negotiators prepare one of four." },
        { title: "Advanced Tactics", desc: "Time, silence and small moves.", note: "Tactics include the flinch (react visibly to an offer), the nibble (a small ask after agreement), and strategic silence. Use them sparingly." },
        { title: "Psychology of Negotiation", desc: "Losses loom larger than gains.", note: "People fear losing more than they value winning. Frame your proposal to reduce their perceived risk, not just to increase your gain." },
        { title: "Negotiating in English", desc: "Precision under pressure.", note: "In a second language, slow down, confirm numbers in writing, and never agree to language you don't fully understand. 'Let me confirm my understanding' is power." },
        { title: "Closing and Contracting", desc: "From handshake to signature.", note: "Close with a written summary of every point, agreed by both sides, before the lawyers meet. Deals die in the gap between memory and contract." },
      ],
    },
  ],
};
