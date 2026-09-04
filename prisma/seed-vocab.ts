// ---------------------------------------------------------------------------
// Vocabulary banks for Levels 2–5 — 6 words per course (course order matches
// the seed-levels file). Each bank is attached to every lesson of its course,
// so flashcard decks never come up empty. Level 1 vocabulary is authored per
// topic inside seed-level1.ts.
// Format: [word, partOfSpeech, thaiMeaning, englishDefinition, example, businessExample]
// ---------------------------------------------------------------------------

export type VocabTuple = [
  string,
  string,
  string,
  string,
  string,
  string,
];

const w = (
  word: string,
  pos: string,
  thai: string,
  def: string,
  ex: string,
  biz: string
): VocabTuple => [word, pos, thai, def, ex, biz];

/** vocabByLevel[levelNumber] → per-course banks of 6 words. */
export const vocabByLevel: Record<number, VocabTuple[][]> = {
  // ============================================================ LEVEL 2
  2: [
    // Course 1 — Daily Work Activities
    [
      w("routine", "noun", "กิจวัตรประจำวัน", "The things you do regularly", "My morning routine starts with checking email.", "I follow the same routine every workday."),
      w("assign", "verb", "มอบหมาย", "To give someone a task", "The manager assigns tasks each morning.", "She assigned me the monthly report."),
      w("handle", "verb", "จัดการ ดูแล", "To deal with something", "I handle customer calls in the afternoon.", "Our team handles orders for the whole region."),
      w("workload", "noun", "ภาระงาน", "The amount of work you have", "My workload increased this month.", "Share the workload fairly across the team."),
      w("efficient", "adjective", "มีประสิทธิภาพ", "Working well without waste", "She is very efficient with her time.", "An efficient process saves both time and money."),
      w("prioritize", "verb", "จัดลำดับความสำคัญ", "To decide what matters most", "Prioritize urgent tasks first.", "We prioritize safety over speed."),
    ],
    // Course 2 — Talking About Jobs and Responsibilities
    [
      w("responsibility", "noun", "ความรับผิดชอบ", "Something you must do as part of your job", "Training new staff is part of my responsibility.", "She has responsibility for the regional accounts."),
      w("report to", "phrasal verb", "รายงานตรงต่อ", "To have someone as your manager", "I report to the operations manager.", "All branch staff report to the area director."),
      w("duty", "noun", "หน้าที่", "A task you are expected to do", "Answering emails is one of my daily duties.", "His duties include preparing the payroll."),
      w("in charge of", "phrase", "รับผิดชอบดูแล", "Responsible for a whole area or team", "He is in charge of logistics.", "She is in charge of the Bangkok office."),
      w("supervise", "verb", "ควบคุมดูแล", "To watch and direct work", "A senior engineer supervises the interns.", "She supervises a team of twelve."),
      w("qualification", "noun", "คุณสมบัติ วุฒิการศึกษา", "A skill or certificate needed for a job", "This role requires a finance qualification.", "List your qualifications on the application form."),
    ],
    // Course 3 — Appointments and Scheduling
    [
      w("appointment", "noun", "การนัดหมาย", "A planned meeting at a fixed time", "I have a dentist appointment at 4 p.m.", "Please arrive ten minutes before your appointment."),
      w("schedule", "noun/verb", "ตารางเวลา / กำหนดเวลา", "A plan of times for activities", "My schedule is full tomorrow.", "Let's schedule the review for Friday morning."),
      w("confirm", "verb", "ยืนยัน", "To make something certain", "Please confirm your attendance.", "I will confirm the booking by email."),
      w("reschedule", "verb", "เลื่อนนัดหมาย", "To change the time of an appointment", "I need to reschedule our meeting.", "We had to reschedule the delivery to Monday."),
      w("available", "adjective", "ว่าง มีเวลา", "Free to meet or use", "I am available after 3 p.m.", "The meeting room is available all afternoon."),
      w("slot", "noun", "ช่วงเวลา", "A period set aside for something", "The only slot left is 2 p.m.", "Book a slot in the training calendar."),
    ],
    // Course 4 — Telephone and Customer Service
    [
      w("enquiry", "noun", "การสอบถาม", "A question asking for information", "We received an enquiry about our prices.", "Please direct enquiries to the support line."),
      w("hold", "verb", "ถือสายรอ", "To wait on the phone", "Please hold while I check.", "Customers hate waiting on hold for long."),
      w("transfer", "verb", "โอนสาย / โอน", "To pass a call to someone else", "I will transfer you to the manager.", "The call was transferred to the billing team."),
      w("complaint", "noun", "ข้อร้องเรียน", "A statement that something is wrong", "The customer filed a complaint.", "We take every complaint seriously."),
      w("resolve", "verb", "แก้ไขให้เรียบร้อย", "To find a solution to a problem", "Support resolved my issue quickly.", "We aim to resolve complaints within 24 hours."),
      w("polite", "adjective", "สุภาพ", "Showing good manners", "Always be polite on the phone.", "Keep a polite tone even with difficult customers."),
    ],
    // Course 5 — Products, Prices and Orders
    [
      w("quotation", "noun", "ใบเสนอราคา", "A formal statement of a price", "We sent a quotation for the new equipment.", "The quotation is valid for 30 days."),
      w("discount", "noun", "ส่วนลด", "A reduction in price", "They offered a 10% discount.", "Ask for a discount on bulk orders."),
      w("invoice", "noun", "ใบแจ้งหนี้", "A bill for goods or services", "The invoice was paid yesterday.", "Send the invoice after delivery."),
      w("delivery", "noun", "การจัดส่ง", "The act of bringing goods to a place", "Delivery takes three working days.", "Free delivery applies to orders over 1,000 baht."),
      w("refund", "noun/verb", "เงินคืน / คืนเงิน", "Money returned to a customer", "We issued a full refund.", "The customer asked for a refund."),
      w("stock", "noun", "สต็อก สินค้าคงคลัง", "Goods available to sell", "This item is out of stock.", "We keep spare parts in stock."),
    ],
    // Course 6 — Simple Presentations
    [
      w("agenda", "noun", "วาระการประชุม", "A list of things to discuss", "The agenda has five items.", "The agenda was sent before the meeting."),
      w("audience", "noun", "ผู้ฟัง", "The people who listen to you", "Keep your slides simple for the audience.", "Our audience is mostly sales managers."),
      w("overview", "noun", "ภาพรวม", "A short general summary", "Start with an overview of the project.", "The report opens with an overview."),
      w("highlight", "verb", "เน้นย้ำ", "To draw attention to the best part", "Highlight the main achievements.", "The chart highlights the sales growth."),
      w("summary", "noun", "บทสรุป", "A short statement of main points", "End your talk with a summary.", "Send a summary of the presentation to the team."),
      w("confident", "adjective", "มั่นใจ", "Sure of yourself", "Practice until you feel confident.", "Speak slowly to sound confident."),
    ],
    // Course 7 — Business Travel and Social English
    [
      w("itinerary", "noun", "กำหนดการเดินทาง", "A plan of a trip", "Check the itinerary for your flight times.", "I will email the full itinerary tonight."),
      w("accommodation", "noun", "ที่พัก", "A place to stay", "Our accommodation is near the station.", "The company pays for accommodation on trips."),
      w("departure", "noun", "การออกเดินทาง", "The act of leaving", "The departure time is 8:30.", "Please check in two hours before departure."),
      w("meet up", "phrasal verb", "นัดพบปะ", "To meet someone socially", "Shall we meet up for coffee?", "We met up with the client after the fair."),
      w("small talk", "noun", "การพูดคุยทั่วๆ ไป", "Light conversation about everyday things", "Small talk helps build relationships.", "Start the call with some small talk."),
      w("exchange", "noun", "การแลกเปลี่ยน", "Giving something and receiving something", "We had a good exchange of ideas.", "The visit was an exchange of best practices."),
    ],
    // Course 8 — Workplace Problems and Giving Instructions
    [
      w("procedure", "noun", "ขั้นตอน ระเบียบปฏิบัติ", "The official way to do something", "Follow the safety procedure.", "New staff must learn the procedures."),
      w("guideline", "noun", "แนวทาง", "A rule or advice about how to do things", "Read the guidelines before starting.", "The manager shared guidelines for remote work."),
      w("troubleshoot", "verb", "แก้ไขปัญหา", "To find and fix problems", "IT can troubleshoot the network issue.", "She troubleshoots software problems all day."),
      w("report", "verb", "รายงาน แจ้ง", "To tell someone about a problem", "Report any issue to your supervisor.", "Please report the fault to the helpdesk."),
      w("solution", "noun", "วิธีแก้ปัญหา", "A way to solve a problem", "We found a solution to the delay.", "The best solution is to replace the part."),
      w("step-by-step", "adjective", "ทีละขั้นตอน", "Done in clear stages", "Follow the step-by-step instructions.", "Use step-by-step guides for new tasks."),
    ],
  ],

  // ============================================================ LEVEL 3
  3: [
    // Course 1 — Business Meetings
    [
      w("minutes", "noun", "บันทึกการประชุม", "Official notes of a meeting", "She took the minutes of the meeting.", "Share the minutes with everyone who attended."),
      w("item", "noun", "หัวข้อ (วาระ)", "One point on an agenda", "The first item is the budget.", "Let's move to the next item."),
      w("attendee", "noun", "ผู้เข้าร่วม", "A person at a meeting or event", "There were twelve attendees.", "Send the link to all attendees."),
      w("consensus", "noun", "มติร่วมกัน", "Agreement by the whole group", "We reached a consensus on the plan.", "The team failed to find a consensus."),
      w("chair", "verb/noun", "เป็นประธาน / ประธาน", "To lead a meeting", "Maria will chair the meeting.", "The chair opened the discussion."),
      w("outcome", "noun", "ผลลัพธ์", "The final result of a meeting or process", "What was the outcome of the talks?", "The main outcome is a new delivery schedule."),
    ],
    // Course 2 — Negotiation Basics
    [
      w("negotiate", "verb", "เจรจาต่อรอง", "To discuss to reach an agreement", "We negotiated a better price.", "She is negotiating with the supplier."),
      w("concession", "noun", "การยอมผ่อนผัน", "Something you give up in a deal", "Price was our only concession.", "Make small concessions slowly."),
      w("counteroffer", "noun", "ข้อเสนอโต้กลับ", "An offer made in reply to another", "They made a counteroffer.", "We rejected the counteroffer."),
      w("deadline", "noun", "กำหนดเส้นตาย", "The time by which something must be done", "The deadline is Friday.", "We agreed on a strict deadline."),
      w("term", "noun", "เงื่อนไข", "A condition in an agreement", "Check the payment terms.", "The terms include a one-year warranty."),
      w("mutual", "adjective", "ซึ่งกันและกัน", "Shared by both sides", "We reached a mutual agreement.", "A good deal brings mutual benefit."),
    ],
    // Course 3 — Presentations and Reports
    [
      w("draft", "noun/verb", "ร่าง", "An early version of a document", "Send me the first draft.", "She drafted the quarterly report."),
      w("figure", "noun", "ตัวเลข", "A number or statistic", "The figures show strong growth.", "Check the figures before publishing."),
      w("trend", "noun", "แนวโน้ม", "The general direction of change", "There is a clear upward trend.", "The trend in costs is worrying."),
      w("conclusion", "noun", "ข้อสรุป", "A final judgement based on evidence", "The conclusion is that we should expand.", "Present your conclusion clearly."),
      w("visual", "noun", "สื่อภาพ", "A chart, graph or slide", "Use visuals to support your points.", "The visuals made the data easy to follow."),
      w("stakeholder", "noun", "ผู้มีส่วนได้ส่วนเสีย", "A person affected by a project", "Keep stakeholders informed.", "The report goes to all key stakeholders."),
    ],
    // Course 4 — Business Emails and Customer Complaints
    [
      w("acknowledge", "verb", "รับทราบ", "To confirm you have received something", "Please acknowledge this email.", "We acknowledged the complaint within an hour."),
      w("attachment", "noun", "ไฟล์แนบ", "A file sent with an email", "Please find the report in the attachment.", "The attachment could not be opened."),
      w("apologize", "verb", "ขอโทษ", "To say sorry", "We apologize for the delay.", "Apologize sincerely and offer a solution."),
      w("escalate", "verb", "ส่งเรื่องต่อระดับสูงขึ้น", "To pass an issue to a higher level", "I will escalate this to my manager.", "The complaint was escalated to head office."),
      w("compensation", "noun", "ค่าชดเชย", "Something given to make up for a loss", "They offered compensation for the damage.", "We gave a discount as compensation."),
      w("follow up", "phrasal verb", "ติดตามผล", "To check progress on something", "I will follow up next week.", "She followed up on the customer's issue."),
    ],
    // Course 5 — Problem Solving and Project Management
    [
      w("milestone", "noun", "เป้าหมายย่อยของโครงการ", "An important stage in a project", "The first milestone was reached early.", "Track each milestone on the timeline."),
      w("budget", "noun", "งบประมาณ", "Money planned for a purpose", "The project is under budget.", "We overspent the marketing budget."),
      w("scope", "noun", "ขอบเขตงาน", "The extent of a project", "The scope has grown since March.", "Keep the scope realistic."),
      w("resource", "noun", "ทรัพยากร", "People, money or materials for a task", "We lack the resources to finish early.", "Allocate resources across the two projects."),
      w("delay", "noun/verb", "ความล่าช้า", "Making something late", "The delay was caused by the supplier.", "Bad weather delayed the shipment."),
      w("contingency", "noun", "แผนสำรอง", "A plan for possible problems", "Keep a contingency for unexpected costs.", "Our contingency plan covers staff illness."),
    ],
    // Course 6 — Sales and Marketing
    [
      w("target", "noun", "เป้าหมาย", "A goal to reach", "We hit our sales target.", "The target audience is young professionals."),
      w("campaign", "noun", "แคมเปญ", "A planned series of marketing actions", "The campaign ran for six weeks.", "Launch the campaign before the holiday season."),
      w("brand", "noun", "แบรนด์ ตราสินค้า", "The name and image of a product or company", "Our brand stands for quality.", "They are building brand awareness online."),
      w("prospect", "noun", "ลูกค้าเป้าหมาย", "A possible future customer", "The sales team called twenty prospects.", "Turn prospects into loyal customers."),
      w("pitch", "noun/verb", "การนำเสนอขาย", "A persuasive sales presentation", "Their pitch impressed the client.", "She pitched the product to retailers."),
      w("loyalty", "noun", "ความภักดี", "Customers staying with a brand", "Loyalty grows through good service.", "The loyalty program increased repeat sales."),
    ],
    // Course 7 — Finance and HR Vocabulary
    [
      w("revenue", "noun", "รายได้", "Money a company receives", "Revenue rose by 15% last year.", "Advertising revenue is growing."),
      w("expense", "noun", "ค่าใช้จ่าย", "Money spent by a business", "Travel expenses must be approved.", "Cut unnecessary expenses this quarter."),
      w("profit", "noun", "กำไร", "Money earned after costs", "The company made a healthy profit.", "Profit margins are under pressure."),
      w("salary", "noun", "เงินเดือน", "Regular pay for work", "The salary is paid monthly.", "The job offers a competitive salary."),
      w("recruit", "verb", "สรรหาพนักงาน", "To find new employees", "We are recruiting two engineers.", "HR recruits staff through several channels."),
      w("benefit", "noun", "สวัสดิการ", "An extra advantage of a job", "The benefits include health insurance.", "Staff benefits are part of the package."),
    ],
    // Course 8 — Management and Team Communication
    [
      w("delegate", "verb", "มอบหมายงาน", "To give work to someone else", "A good manager delegates wisely.", "Delegate routine tasks to junior staff."),
      w("feedback", "noun", "คำติชม", "Opinions about someone's work", "Ask for feedback after the project.", "Give feedback in private, praise in public."),
      w("morale", "noun", "ขวัญกำลังใจ", "How positive a group feels", "Team morale is high this month.", "Recognition improves staff morale."),
      w("transparent", "adjective", "โปร่งใส", "Open and clear", "Keep the process transparent.", "Transparent communication builds trust."),
      w("collaborate", "verb", "ทำงานร่วมกัน", "To work together", "The teams collaborated on the launch.", "We collaborate with partners overseas."),
      w("empower", "verb", "เสริมสร้างศักยภาพ", "To give people confidence and authority", "Empower staff to make decisions.", "The new system empowers branch managers."),
    ],
  ],

  // ============================================================ LEVEL 4
  4: [
    // Course 1 — Advanced Meetings and Negotiation
    [
      w("leverage", "noun/verb", "อำนาจต่อรอง / ใช้ประโยชน์", "Advantage in a negotiation; to use something well", "We have strong leverage in the talks.", "Leverage your experience in the negotiation."),
      w("impasse", "noun", "ภาวะชะงักงัน", "A point where no progress is possible", "The talks reached an impasse.", "We broke the impasse by offering training."),
      w("precedent", "noun", "แบบอย่างก่อนหน้า", "An earlier example used for comparison", "This sets a precedent for future deals.", "The discount created an awkward precedent."),
      w("concession", "noun", "การยอมผ่อนผัน", "Something given up to reach agreement", "Each side made small concessions.", "List your concessions before the meeting."),
      w("agenda", "noun", "วาระ", "The list of items to discuss", "The agenda covers pricing and delivery.", "Keep the agenda to three items."),
      w("viable", "adjective", "เป็นไปได้", "Able to work successfully", "The offer is not financially viable.", "We need a viable alternative plan."),
    ],
    // Course 2 — Leadership and Conflict Resolution
    [
      w("mediate", "verb", "ไกล่เกลี่ย", "To help two sides reach agreement", "HR mediated the dispute.", "A neutral manager mediated the conflict."),
      w("friction", "noun", "ความขัดแย้ง", "Disagreement between people", "There is friction between the teams.", "Clear roles reduce friction."),
      w("stance", "noun", "จุดยืน", "A position on an issue", "The union took a firm stance.", "Explain your stance with evidence."),
      w("accountability", "noun", "ความรับผิดชอบต่อผล", "Being responsible for results", "Accountability improves performance.", "Ownership and accountability go together."),
      w("compromise", "noun/verb", "การประนีประนอม", "An agreement where each side gives something", "Both sides accepted a compromise.", "We compromised on the delivery date."),
      w("empathy", "noun", "ความเข้าอกเข้าใจ", "Understanding others' feelings", "Listen with empathy during conflicts.", "Leaders show empathy without losing focus."),
    ],
    // Course 3 — Business Strategy
    [
      w("strategy", "noun", "กลยุทธ์", "A long-term plan to reach goals", "The strategy focuses on Asia.", "Every decision supports the strategy."),
      w("competitive", "adjective", "แข่งขันได้", "Able to compete successfully", "Our prices are competitive.", "The industry is highly competitive."),
      w("positioning", "noun", "การวางตำแหน่งทางการตลาด", "How a brand is seen in the market", "Positioning targets the premium segment.", "Their positioning is built on quality."),
      w("portfolio", "noun", "พอร์ตโฟลิโอ", "A range of products or investments", "The portfolio includes five brands.", "We are reviewing the product portfolio."),
      w("diversify", "verb", "กระจายความเสี่ยง", "To spread into different areas", "The firm diversified into services.", "Diversify your revenue streams."),
      w("outlook", "noun", "แนวโน้มอนาคต", "A forecast of future conditions", "The outlook for next year is positive.", "The market outlook remains uncertain."),
    ],
    // Course 4 — Financial Discussions and Performance Reviews
    [
      w("margin", "noun", "อัตรากำไร", "Profit as a percentage of sales", "Gross margin improved this quarter.", "Rising costs are squeezing margins."),
      w("appraisal", "noun", "การประเมินผลงาน", "A formal review of performance", "The annual appraisal is in December.", "Prepare evidence for your appraisal."),
      w("criteria", "noun", "เกณฑ์", "Standards used to judge something", "The criteria include punctuality.", "Set clear criteria before the review."),
      w("attainable", "adjective", "บรรลุได้", "Possible to achieve", "Set attainable goals for the year.", "The sales target is ambitious but attainable."),
      w("underperform", "verb", "ผลงานต่ำกว่าเกณฑ์", "To perform worse than expected", "The region underperformed last year.", "Two products underperformed in Q3."),
      w("turnover", "noun", "อัตราการลาออก / ยอดขาย", "Staff leaving rate, or total sales", "Staff turnover is low this year.", "The store has high daily turnover."),
    ],
    // Course 5 — Persuasion and Formal Communication
    [
      w("persuade", "verb", "โน้มน้าว", "To make someone agree with you", "She persuaded the board to invest.", "Persuade with data, not opinions."),
      w("credibility", "noun", "ความน่าเชื่อถือ", "Being trusted and believed", "Accuracy builds credibility.", "The error damaged our credibility."),
      w("compelling", "adjective", "น่าสนใจ ชักจูงใจ", "Very convincing", "The evidence is compelling.", "Make a compelling case for the budget."),
      w("objection", "noun", "ข้อโต้แย้ง", "A reason against an idea", "The main objection was the cost.", "Answer objections before they are raised."),
      w("assert", "verb", "ยืนยันอย่างหนักแน่น", "To state firmly", "She asserted that the plan is safe.", "Assert your position calmly."),
      w("articulate", "verb", "สื่อสารอย่างชัดเจน", "To express ideas clearly", "He articulated the vision well.", "Articulate the benefits in simple terms."),
    ],
    // Course 6 — Sales Negotiation and Marketing Strategy
    [
      w("bargain", "noun/verb", "ต่อรอง", "To negotiate a better deal", "We bargained for a lower rate.", "The final price was a real bargain."),
      w("clause", "noun", "ข้อกำหนด", "A section of a contract", "Read clause seven carefully.", "The penalty clause worries the supplier."),
      w("volume", "noun", "ปริมาณ", "The amount of goods or sales", "Volume discounts apply over 1,000 units.", "Sales volume doubled in Asia."),
      w("retention", "noun", "การรักษาลูกค้า", "Keeping customers over time", "Retention is cheaper than acquisition.", "The retention rate is 92%."),
      w("penetration", "noun", "การเจาะตลาด", "Entering and gaining share of a market", "Market penetration is still low.", "Low prices helped penetration."),
      w("incentive", "noun", "สิ่งจูงใจ", "Something that motivates action", "Bonuses are a strong incentive.", "Offer incentives for early orders."),
    ],
    // Course 7 — Project Leadership and Business Problem Solving
    [
      w("stakeholder", "noun", "ผู้มีส่วนได้ส่วนเสีย", "Anyone affected by the project", "Map all stakeholders early.", "The report went to every stakeholder."),
      w("scope creep", "noun", "การขยายขอบเขตงานเกินกำหนด", "A project growing beyond its original scope", "Scope creep delayed the launch.", "Change requests caused scope creep."),
      w("bottleneck", "noun", "คอขวด", "A point where work slows down", "Approval is the main bottleneck.", "Remove bottlenecks to speed delivery."),
      w("oversight", "noun", "การกำกับดูแล", "Supervision of a project", "The steering group provides oversight.", "Lack of oversight caused the error."),
      w("rollout", "noun", "การขยายการใช้งาน", "Introducing something to users gradually", "The rollout begins in April.", "Train staff before the rollout."),
      w("retrospective", "noun", "การประชุมทบทวนหลังงาน", "A review after a project ends", "The retrospective found two lessons.", "Hold a retrospective after each sprint."),
    ],
    // Course 8 — Networking and Cross-Cultural Communication
    [
      w("networking", "noun", "การสร้างเครือข่าย", "Meeting people to build contacts", "Networking opens new opportunities.", "Attend the conference for networking."),
      w("etiquette", "noun", "มารยาททางสังคม", "The rules of polite behaviour", "Learn local business etiquette.", "Email etiquette matters in every culture."),
      w("hierarchy", "noun", "ลำดับชั้น", "A system of levels of authority", "Respect the hierarchy when emailing.", "Some cultures have a flat hierarchy."),
      w("nuance", "noun", "ความหมายแฝง ข้อปลีกย่อย", "A small, subtle difference", "Tone carries many nuances.", "Understand the nuances of the request."),
      w("diplomatic", "adjective", "มีชั้นเชิง", "Tactful in dealing with people", "Give diplomatic feedback to partners.", "A diplomatic reply keeps the deal alive."),
      w("rapport", "noun", "ความสัมพันธ์ที่ดี", "A friendly relationship", "Build rapport before discussing business.", "The dinner built strong rapport."),
    ],
  ],

  // ============================================================ LEVEL 5
  5: [
    // Course 1 — Executive Communication
    [
      w("concise", "adjective", "กระชับ", "Short and clear", "Keep the memo concise.", "Executives value concise updates."),
      w("agile", "adjective", "คล่องตัว", "Able to adapt quickly", "Agile teams respond to change fast.", "We need an agile response to the crisis."),
      w("oversight", "noun", "การกำกับดูแล", "Careful supervision", "Board oversight protects shareholders.", "The committee has oversight of risk."),
      w("mandate", "noun", "อำนาจที่ได้รับมอบหมาย", "Official authority to act", "The CEO has a clear mandate.", "Our mandate is to cut costs."),
      w("foresight", "noun", "วิสัยทัศน์前瞻", "The ability to plan for the future", "The merger showed real foresight.", "Foresight saved us from the downturn."),
      w("benchmark", "noun/verb", "เกณฑ์มาตรฐาน", "A standard to compare against", "Benchmark us against global leaders.", "Set a benchmark for delivery times."),
    ],
    // Course 2 — Complex Negotiation
    [
      w("concessionary", "adjective", "แบบผ่อนผัน", "Giving ground in a deal", "A concessionary price closed the deal.", "Make concessionary moves one at a time."),
      w("deadlock", "noun", "ภาวะตายตัว", "A situation with no possible agreement", "The talks ended in deadlock.", "We broke the deadlock with a new proposal."),
      w("quid pro quo", "noun", "การแลกเปลี่ยนผลประโยชน์", "Something given in return for something", "Training was the quid pro quo for the discount.", "Frame it as a quid pro quo, not a gift."),
      w("contingent", "adjective", "ขึ้นอยู่กับเงื่อนไข", "Dependent on something else", "The offer is contingent on board approval.", "Payment is contingent on delivery."),
      w("recalibrate", "verb", "ปรับเปลี่ยนจุดยืนใหม่", "To adjust your position", "Recalibrate your targets before round two.", "The counteroffer forced us to recalibrate."),
      w("ultimatum", "noun", "คำขาด", "A final demand with a threat", "Avoid issuing ultimatums early.", "The ultimatum ended the negotiation."),
    ],
    // Course 3 — Corporate Strategy and Financial Analysis
    [
      w("acquisition", "noun", "การเข้าซื้อกิจการ", "Buying another company", "The acquisition doubled our capacity.", "The acquisition closes in Q3."),
      w("valuation", "noun", "การประเมินมูลค่า", "An estimate of what a company is worth", "The valuation was higher than expected.", "We hired advisors for the valuation."),
      w("synergy", "noun", "การประสานพลัง", "Extra value from combining businesses", "The merger created real synergies.", "Projected synergies were overstated."),
      w("dividend", "noun", "เงินปันผล", "A share of profits paid to shareholders", "The board raised the dividend.", "Dividends were cut during the crisis."),
      w("solvent", "adjective", "มีสภาพคล่องเพียงพอ", "Able to pay debts", "The bank remains solvent.", "Check whether the partner is solvent."),
      w("hedge", "verb", "ป้องกันความเสี่ยง", "To protect against financial risk", "We hedge against currency swings.", "Hedging reduced the exchange loss."),
    ],
    // Course 4 — Contracts and Legal Business English
    [
      w("breach", "noun/verb", "การผิดสัญญา", "Breaking a contract or rule", "Late payment is a breach of contract.", "The supplier breached the delivery clause."),
      w("liability", "noun", "ความรับผิดทางกฎหมาย", "Legal responsibility", "The contract limits our liability.", "Check the liability clause carefully."),
      w("indemnity", "noun", "การชดใช้ความเสียหาย", "Protection against loss or damage", "The indemnity covers legal costs.", "Demand an indemnity for the delay."),
      w("jurisdiction", "noun", "เขตอำนาจศาล", "The legal authority of a court", "The contract falls under Thai jurisdiction.", "Choose a neutral jurisdiction."),
      w("enforceable", "adjective", "บังคับใช้ได้", "Legally valid and effective", "The verbal promise is not enforceable.", "Make every change enforceable in writing."),
      w("arbitration", "noun", "การอนุญาโตตุลาการ", "Settling disputes outside court", "Disputes go to arbitration.", "Arbitration is faster than litigation."),
    ],
    // Course 5 — International Business and Diplomacy
    [
      w("tariff", "noun", "ภาษีศุลกากร", "A tax on imported goods", "Tariffs raised our import costs.", "New tariffs hit the electronics sector."),
      w("embargo", "noun", "การห้ามค้าขาย", "An official ban on trade", "The embargo limited exports.", "The embargo was lifted in March."),
      w("protocol", "noun", "ระเบียบปฏิบัติ", "Official rules of behaviour", "Follow the diplomatic protocol.", "The visit followed strict protocol."),
      w("sanction", "noun", "มาตรการคว่ำบาตร", "A penalty against a country or firm", "Sanctions disrupted supply chains.", "The sanctions affect two clients."),
      w("sovereign", "adjective", "อธิปไตย", "Independent as a country or authority", "Sovereign risk is low in that region.", "Respect each country's sovereign rules."),
      w("concession", "noun", "สัมปทาน / การยอมให้", "A right granted, or a giving of ground", "The firm won a port concession.", "Make the concession part of the package."),
    ],
    // Course 6 — Persuasion and Influence at Scale
    [
      w("coalition", "noun", "แนวร่วม", "A group joining for a common goal", "Build a coalition of supporters.", "The coalition backed the reform."),
      w("narrative", "noun", "เรื่องเล่า กรอบการเล่าเรื่อง", "The story used to frame an idea", "The narrative shifted to growth.", "Control the narrative before critics do."),
      w("social proof", "noun", "หลักฐานทางสังคม", "Evidence that others approve", "Case studies provide social proof.", "Use social proof in the sales pitch."),
      w("reciprocity", "noun", "การตอบแทนซึ่งกันและกัน", "Giving back what you receive", "Reciprocity builds long-term trust.", "A free trial triggers reciprocity."),
      w("skeptic", "noun", "ผู้สงสัย", "A person who doubts claims", "Answer the skeptics with data.", "Turn skeptics into your reviewers."),
      w("influence", "noun/verb", "อิทธิพล โน้มน้าว", "The power to change decisions", "Opinion leaders influence buyers.", "Influence without authority is a skill."),
    ],
    // Course 7 — Crisis Communication
    [
      w("outage", "noun", "ระบบขัดข้อง", "A period when a service is down", "The outage lasted four hours.", "Customers were notified during the outage."),
      w("transparency", "noun", "ความโปร่งใส", "Openness in communication", "Transparency calms public fear.", "Honesty and transparency protect reputation."),
      w("reputation", "noun", "ชื่อเสียง", "What people think of a company", "The scandal damaged our reputation.", "Crisis response defends reputation."),
      w("containment", "noun", "การควบคุมสถานการณ์", "Stopping a problem from spreading", "Containment was the first priority.", "The containment plan limited the damage."),
      w("stakeholder", "noun", "ผู้มีส่วนได้ส่วนเสีย", "Anyone affected by the crisis", "Contact key stakeholders first.", "Employees are the first stakeholders."),
      w("reassure", "verb", "ให้ความมั่นใจ", "To make someone feel safe", "Reassure customers about their data.", "The CEO reassured the market."),
    ],
    // Course 8 — Advanced Business Negotiation Mastery
    [
      w("trade-off", "noun", "การแลกเปลี่ยนระหว่างข้อดีข้อเสีย", "Accepting one thing to gain another", "Speed is the trade-off for lower cost.", "Every term involves a trade-off."),
      w("win-win", "adjective", "ได้ประโยชน์ทั้งสองฝ่าย", "Good for both sides", "Look for a win-win outcome.", "The agreement was genuinely win-win."),
      w("posture", "noun", "ท่าที", "A stance or attitude in talks", "Their posture was tough from the start.", "Change your posture to change the mood."),
      w("concession pattern", "noun", "รูปแบบการยอมผ่อนผัน", "How concessions are made over time", "Watch their concession pattern.", "A steady concession pattern signals flexibility."),
      w("anchoring", "noun", "การวางจุดยึดราคา", "Using the first number to shape the deal", "Their opening price was pure anchoring.", "Counter the anchor with market data."),
      w("principled", "adjective", "ยึดหลักการ", "Based on fair principles, not pressure", "Keep the negotiation principled.", "A principled stance earns respect."),
    ],
  ],
};
