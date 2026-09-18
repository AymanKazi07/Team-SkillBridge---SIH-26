// ==================== GLOBAL NETWORK & PARALLAX ANIMATION ENGINE ====================
const GlobalBackgroundEngine = {
    canvas: null,
    ctx: null,
    nodes: [],
    mouse: { x: -1000, y: -1000, targetX: -1000, targetY: -1000 },
    maxNodes: window.innerWidth < 768 ? 14 : 28,

    init: function () {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        this.nodes = [];
        const colors = ['rgba(6, 182, 212, ', 'rgba(13, 148, 136, ', 'rgba(14, 165, 233, '];

        for (let i = 0; i < this.maxNodes; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                radius: Math.random() * 2 + 1.2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;

            const gridLayer = document.getElementById('grid-layer');
            const orb1 = document.getElementById('orb-1');
            const orb2 = document.getElementById('orb-2');
            const shape1 = document.getElementById('glass-shape-1');

            const moveX = (e.clientX / window.innerWidth - 0.5);
            const moveY = (e.clientY / window.innerHeight - 0.5);

            if (gridLayer) { gridLayer.style.transform = `translate3d(${moveX * 16}px, ${moveY * 16}px, 0)`; }
            if (orb1) { orb1.style.transform = `translate3d(${moveX * 24}px, ${moveY * 24}px, 0)`; }
            if (orb2) { orb2.style.transform = `translate3d(${moveX * -20}px, ${moveY * -20}px, 0)`; }
            if (shape1) { shape1.style.transform = `translate3d(${moveX * 30}px, ${moveY * 30}px, 0) rotate(${moveX * 15}deg)`; }
        });

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.animate();
        }
    },

    resize: function () {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    animate: function () {
        const self = GlobalBackgroundEngine;
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        self.mouse.x += (self.mouse.targetX - self.mouse.x) * 0.05;
        self.mouse.y += (self.mouse.targetY - self.mouse.y) * 0.05;

        for (let i = 0; i < self.nodes.length; i++) {
            let n = self.nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > self.canvas.width) n.vx *= -1;
            if (n.y < 0 || n.y > self.canvas.height) n.vy *= -1;

            self.ctx.beginPath();
            self.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            self.ctx.fillStyle = n.color + '0.45)';
            self.ctx.fill();

            for (let j = i + 1; j < self.nodes.length; j++) {
                let n2 = self.nodes[j];
                let dist = Math.hypot(n.x - n2.x, n.y - n2.y);

                if (dist < 160) {
                    self.ctx.beginPath();
                    self.ctx.moveTo(n.x, n.y);
                    self.ctx.lineTo(n2.x, n2.y);
                    self.ctx.strokeStyle = n.color + (0.14 * (1 - dist / 160)).toFixed(2) + ')';
                    self.ctx.lineWidth = 0.85;
                    self.ctx.stroke();
                }
            }

            let mDist = Math.hypot(n.x - self.mouse.x, n.y - self.mouse.y);
            if (mDist < 190) {
                self.ctx.beginPath();
                self.ctx.moveTo(n.x, n.y);
                self.ctx.lineTo(self.mouse.x, self.mouse.y);
                self.ctx.strokeStyle = 'rgba(6, 182, 212, ' + (0.16 * (1 - mDist / 190)).toFixed(2) + ')';
                self.ctx.lineWidth = 1;
                self.ctx.stroke();
            }
        }

        requestAnimationFrame(self.animate);
    }
};

// ==================== IN-MEMORY DATABASE ====================
const DB = {
    users: [],
    courses: [],
    internships: [],
    placements: [],
    currentUser: null,
    activeStudentTab: 'overview',
    selectedJob: null,
    isBlindHiring: false,
    aiSearchQuery: '',
    institutionalAlerts: [],

    seed: function () {
        if (this.users.length === 0) {
            this.users = [
                {
                    id: 1, name: 'Aaditya Sharma', email: 'student@demo.com', password: 'demo123',
                    role: 'student', apaarId: '8942-7712-4401', apaarVerified: true, domain: 'ayush',
                    subDomain: 'Ayurvedic Pharmacognosy & Dravyaguna', targetRole: 'Senior Clinical AYUSH Researcher',
                    matchScore: 84, skills: ['Herb Standardization', 'Clinical Trial Protocols', 'Phytochemistry', 'Clinical Pharmacovigilance'],
                    projects: ['Ayurvedic Herbal Compound Quality Database', 'Automated Prakriti Assessment AI'],
                    researchPapers: ['Standardization of Ashwagandha Withanolides (DOI: 10.1016/ayush.2025.04)'],
                    github: 'https://github.com/aaditya-ayush-research', linkedin: 'https://linkedin.com/in/aaditya-sharma',
                    profilePhoto: null, level: 'Advanced', abcCredits: 28, rejections: [], testHistory: {},
                    assessment: {
                        score: 88, level: 'Advanced (NHEQF Level 7)',
                        repoAudit: 'Clean modular codebase, automated quality control scripts, standardized test fixtures.',
                        researchWeight: 'High (Indexed in Scopus / UGC-CARE AYUSH Category)',
                        gaps: ['Ayush GCP Regulatory Compliance', 'Bioinformatics docking tools'],
                        suggestions: [
                            'Complete ICMR/AYUSH Good Clinical Practice (GCP) Module',
                            'Undertake molecular docking workflows for active phyto-compounds'
                        ],
                        roadmap: [
                            { phase: 'Phase 1 (Month 1-2)', title: 'Foundations & Pharmacopoeial Standards', desc: 'Study Ayurvedic Pharmacopoeia of India (API), PLIM monographs, and raw material validation.' },
                            { phase: 'Phase 2 (Month 3-4)', title: 'Bio-Analytical & Clinical Protocols', desc: 'Master HPLC/HPTLC fingerprinting, AYUSH GCP, and adverse drug reaction (ADR) reporting and pharmacovigilance protocols.' },
                            { phase: 'Phase 3 (Month 5-6)', title: 'Industry Integration & Clinical Trials', desc: 'Undertake real-time clinical data compilation, stability testing, and Ministry compliance audits.' }
                        ]
                    }
                },
                { id: 2, name: 'Prof. (Dr.) V. K. Joshi', email: 'academic@demo.com', password: 'demo123', role: 'academician', institution: 'National Institute of Ayurveda / All India Council', domain: 'ayush', profilePhoto: null, skills: ['Dravyaguna', 'Integrative Medicine', 'NEP 2020 Curriculum'], courses: [1, 2] },
                { id: 3, name: 'Himalaya & Dabur Health R&D', email: 'industry@demo.com', password: 'demo123', role: 'industrialist', company: 'Dabur India R&D Labs', domain: 'ayush', profilePhoto: null, skills: ['Phytomedicine R&D', 'Quality Assurance', 'HLPC Profiling'] }
            ];

            this.courses = [
                { id: 1, title: 'Pharmacovigilance & Quality Control in AYUSH Drugs', author: 'Prof. (Dr.) V. K. Joshi', domain: 'ayush', level: 'Advanced', nepCredits: 4, deadline: '2026-09-30', description: 'Comprehensive analysis of Ayurvedic formulations, TLC/HPLC methods, and WHO Good Agricultural and Collection Practices (GACP).', quiz: [{ q: 'Which statutory body regulates ASU (Ayurveda, Siddha, Unani) drugs quality in India?', options: ['Pharmacopoeia Commission for Indian Medicine (PCIM&H)', 'TRAI', 'SEBI'], answer: 0 }, { q: 'What is the minimum marker content requirement for high-potency Curcumin extracts in standard AYUSH guidelines?', options: ['95%', '40%', '10%'], answer: 0 }], certified: true },
                { id: 2, title: 'Edge AI & Cloud Telemedicine Architecture', author: 'Dr. M. S. Swaminathan Tech Cell', domain: 'engineering', level: 'Intermediate', nepCredits: 3, deadline: '2026-10-15', description: 'Design distributed architectures for remote health monitoring, IoT sensor integration, and microservices.', quiz: [{ q: 'Which protocol is most optimal for constrained bandwidth IoT vitals sensors?', options: ['MQTT', 'HTTP/1.1 Polling', 'SOAP XML'], answer: 0 }], certified: true }
            ];

            this.internships = [{ id: 1, company: 'Dabur India R&D Labs', title: 'Ayush Phytopharmacy & Formulation Intern', domain: 'ayush', skills: ['Herb Standardization', 'HPLC/GC-MS', 'AYUSH GCP'], duration: '6 Months', stipend: '₹30,000 / month', deadline: '2026-09-20', nepApproved: true, postedBy: 3, location: 'New Delhi / Hybrid', description: 'Work directly with chief formulators on standardizing herbal extracts using HPTLC and spectrophotometry. Direct mentorship under senior scientists.', requirements: ['B.Pharm / M.Pharm or relevant AYUSH background', 'Familiarity with pharmacopoeial standards', 'Analytical mindset'] }];

            this.placements = [{ id: 1, company: 'Patanjali & Himalaya Health Sciences', title: 'Senior AYUSH Regulatory & Research Associate', domain: 'ayush', skills: ['Pharmacovigilance', 'Standardization', 'Clinical Trials'], salary: '₹14.5 LPA', location: 'Haridwar / New Delhi', postedBy: 3, description: 'Lead compliance audits and clinical trial documentation for export-ready botanical formulations.', requirements: ['Post-graduate degree in AYUSH or clinical research', 'Minimum 1 year research or internship experience', 'Knowledge of Clinical Pharmacovigilance reporting'] }];
        }
    }
};

const DOMAIN_PRESETS = {
    ayush: { subDomain: "Ayurvedic Pharmacognosy & Dravyaguna", targetRole: "Senior Clinical AYUSH Researcher", skills: "Herb Standardization, Clinical Trial Protocols, Phytochemistry, Clinical Pharmacovigilance", projects: "Ayurvedic Herbal Compound Quality Database, Automated Prakriti Assessment AI", research: "Standardization of Ashwagandha Withanolides (DOI: 10.1016/ayush.2025.04)", github: "https://github.com/aaditya-ayush-research", linkedin: "https://linkedin.com/in/aaditya-ayush" },
    engineering: { subDomain: "Software Systems & Cloud Architecture", targetRole: "Senior Cloud & AI Systems Engineer", skills: "React, TypeScript, Microservices, Python, Vector DBs, Cloud Architecture", projects: "Distributed Health Telemetry Pipeline, Real-time RAG Search Engine", research: "Scalable Microservice Consensus in Modern Distributed Telemetry (DOI: 10.1109/IEEE.2025.01)", github: "https://github.com/aaditya-eng-systems", linkedin: "https://linkedin.com/in/aaditya-eng" },
    management: { subDomain: "Agile Operations & FinTech Analytics", targetRole: "Strategic Product & Operations Lead", skills: "Financial Modeling, Agile Scrum, Supply Chain Analytics, ESG Compliance", projects: "Omnichannel Supply Chain Predictor, FinTech Credit Risk Engine", research: "Decentralized ESG Governance in Global Supply Chains (DOI: 10.1016/j.mgt.2025.08)", github: "", linkedin: "https://linkedin.com/in/aaditya-mgmt" },
    law: { subDomain: "Cyber Jurisprudence & Bio-IP Compliance", targetRole: "Senior Regulatory & Technology Counsel", skills: "DPDP Act, Cyber Law, Traditional Bio-Patents, Commercial Arbitration", projects: "AI Legal Compliance Auditor, Indigenous Knowledge Patent Tracker", research: "Data Protection Principles in Genomic Diagnostics (DOI: 10.1093/law/2025.12)", github: "", linkedin: "https://linkedin.com/in/aaditya-law" }
};

const INTERVIEW_QUESTIONS_BANK = {
    ayush: ["Describe the regulatory process for submitting an ASU drug sample to PLIM.", "How do you evaluate stability testing and shelflife under Ministry of AYUSH monographs?", "How do you implement Clinical Pharmacovigilance and report Adverse Drug Reactions (ADRs) for ASU drugs?"],
    engineering: ["Explain how you design microservices for high availability under sudden traffic spikes.", "How do you optimize vector database query response time in real-time RAG pipelines?", "What strategies do you employ for end-to-end telemetry monitoring and zero-downtime CI/CD deployments?"],
    management: ["How do you assess capital allocation using Net Present Value against operational risk?", "Explain how you resolve bottlenecks in an upstream supply chain affected by the Bullwhip effect.", "What framework do you use to lead cross-functional transformation under tight regulatory deadlines?"],
    law: ["How does Article 21 incorporate data privacy precedents under Justice Puttaswamy?", "What are the strict statutory requirements for patenting traditional bio-active formulations?", "Explain how Section 66C of the IT Act penalizes identity theft using electronic credentials."]
};

const AIEngine = {
    questionBank: {
        ayush: [{ q: 'Explain the methodology of standardization of raw herbs using Pharmacopoeial laboratory standards (PLIM).', focus: 'Quality Control' }],
        engineering: [{ q: 'How would you architect a microservices system handling 100k requests/sec with low latency and high fault tolerance?', focus: 'System Design' }],
        management: [{ q: 'How do you evaluate capital budgeting tradeoffs between short-term liquidity and long-term ESG compliance?', focus: 'Strategy' }],
        law: [{ q: 'Explain the legal doctrine of non-obviousness regarding indigenous botanical compounds under Indian Patent Law.', focus: 'IP Jurisprudence' }]
    },

    evaluateSubmission: function (payload) {
        const { domain, skills, projects, research, github, targetRole } = payload;
        let score = 40;
        let repoRemarks = domain === 'engineering' ? (github && github.includes('github.com') ? "Verified Git Repo: Clean modular layout, active commit history, unit tests detected." : "No GitHub repository provided. Add a repository to earn code quality credits.") : "Domain Evaluation Completed: Academic portfolio & empirical publications verified.";
        let researchWeight = "Baseline Academic Background";

        if (skills.length > 0) score += Math.min(skills.length * 7, 25);
        if (projects.length > 0) score += Math.min(projects.length * 10, 20);
        if (domain === 'engineering' && github && github.includes('github.com')) { score += 8; } else if (domain !== 'engineering') { score += 8; }
        if (research && research.length > 5) { score += 7; researchWeight = "UGC-CARE / Scopus / AYUSH Research indexed footprint confirmed."; }

        score = Math.min(score, 98);

        let level = 'Beginner (NHEQF Level 4.5)';
        if (score >= 80) level = 'Advanced (NHEQF Level 7)';
        else if (score >= 60) level = 'Intermediate (NHEQF Level 5.5)';

        let matchScore = score;
        if (targetRole && targetRole.trim().length > 0) {
            const roleLen = targetRole.trim().length;
            matchScore = Math.min(99, Math.max(50, Math.round((score * 0.7) + (roleLen % 15) + 12)));
        }

        const gapDict = {
            ayush: ['Clinical Pharmacovigilance', 'HPLC Chromatographic Profiling', 'WHO-GACP Protocols'],
            engineering: ['Distributed Consensus (Raft/Paxos)', 'Vector DB indexing (HNSW)', 'CI/CD pipeline hardening'],
            management: ['ESG Carbon Accounting', 'Algorithmic Financial Modeling', 'Six Sigma DMAIC'],
            law: ['DPDP Act 2023 Rules', 'TRIPS Article 27 Compliance', 'ADR International Arbitration']
        };
        const currentGaps = gapDict[domain] || ['Foundational Domain Best Practices'];
        const roadmap = this.generateRoadmap(domain, level);

        return { score: score, matchScore: matchScore, level: level, repoAudit: repoRemarks, researchWeight: researchWeight, gaps: currentGaps, suggestions: [`Enroll in ${domain.toUpperCase()} NEP-accredited Capstone certification`, `Publish an open-source technical whitepaper or repository demonstrating end-to-end implementation`, `Link APAAR ID to Academic Bank of Credits (ABC) to transfer course completion points`], roadmap: roadmap };
    },

    generateRoadmap: function (domain, level) {
        if (domain === 'ayush') { return [{ phase: 'Phase 1 (Month 1-2)', title: 'Foundations & Pharmacopoeial Standards', desc: 'Study Ayurvedic Pharmacopoeia of India (API), PLIM monographs, and raw material validation.' }, { phase: 'Phase 2 (Month 3-4)', title: 'Bio-Analytical & Clinical Protocols', desc: 'Master HPLC/HPTLC fingerprinting, AYUSH GCP, and adverse drug reaction (ADR) reporting and pharmacovigilance protocols.' }, { phase: 'Phase 3 (Month 5-6)', title: 'Industry Integration & Clinical Trials', desc: 'Undertake real-time clinical data compilation, stability testing, and Ministry compliance audits.' }]; }
        if (domain === 'management') { return [{ phase: 'Phase 1 (Month 1-2)', title: 'Quantitative Valuation & Corporate Strategy', desc: 'Master DCF modeling, working capital ratios, and corporate governance frameworks.' }, { phase: 'Phase 2 (Month 3-4)', title: 'Operations & Agile Product Delivery', desc: 'Implement Lean Six Sigma DMAIC workflows and sprint analytics.' }, { phase: 'Phase 3 (Month 5-6)', title: 'Executive Placement & Capstone Audit', desc: 'Lead institutional capstone projects aligned with ESG guidelines.' }]; }
        if (domain === 'law') { return [{ phase: 'Phase 1 (Month 1-2)', title: 'Constitutional Foundations & Judicial Precedents', desc: 'Examine landmark constitutional bench rulings and fundamental rights jurisprudence.' }, { phase: 'Phase 2 (Month 3-4)', title: 'Digital Privacy & Statutory Compliance', desc: 'Master the DPDP Act 2023, cyber torts, and traditional knowledge digital library (TKDL) defenses.' }, { phase: 'Phase 3 (Month 5-6)', title: 'Litigation & Corporate Arbitration', desc: 'Draft commercial arbitration claims under UNCITRAL models.' }]; }
        return [{ phase: 'Phase 1 (Month 1-2)', title: 'Core Competency & System Mastery', desc: 'Deep dive into data structures, scalable API design, and modular repository patterns.' }, { phase: 'Phase 2 (Month 3-4)', title: 'Cloud-Native & Distributed AI', desc: 'Deploy cloud microservices, vector similarity search, and automated test pipelines.' }, { phase: 'Phase 3 (Month 5-6)', title: 'Production Capstone & Industry Placement', desc: 'Complete enterprise-grade projects with telemetry, monitoring, and live deployments.' }];
    }
};

// ==================== 20-QUESTION TEST DATASETS ====================
const TEST_BATTERY_QUESTIONS = {
    aptitude: [
        { id: 'apt-1', category: 'Quantitative Ability', q: 'A can finish a task in 12 days, and B in 18 days. If they work together for 4 days, what fraction of work remains?', options: ['1/3', '4/9', '5/9', '7/18'], answer: 1, explanation: 'Combined 1-day work = (1/12) + (1/18) = 5/36. In 4 days: 4 * (5/36) = 5/9. Remaining = 1 - 5/9 = 4/9.' },
        { id: 'apt-2', category: 'Quantitative Ability', q: 'A trader marks goods 25% above cost price and gives a 10% discount on marked price. What is his net profit %?', options: ['12.5%', '15%', '11.11%', '13.5%'], answer: 0, explanation: 'Let CP = 100. MP = 125. SP = 125 - 12.5 = 112.5. Profit = 12.5%.' },
        { id: 'apt-3', category: 'Quantitative Ability', q: 'A train 180 meters long passes an electric pole in 9 seconds. What is the speed of the train in km/h?', options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'], answer: 1, explanation: 'Speed = 180m / 9s = 20 m/s. In km/h: 20 * (18/5) = 72 km/h.' },
        { id: 'apt-4', category: 'Quantitative Ability', q: 'A bag contains 5 blue, 4 green, and 3 red balls. Two are drawn at random without replacement. What is the probability that both are green?', options: ['1/11', '2/11', '1/22', '4/33'], answer: 0, explanation: 'P(first green) = 4/12. P(second green) = 3/11. Combined P = (4/12) * (3/11) = 1/11.' },
        { id: 'apt-5', category: 'Quantitative Ability', q: 'The average weight of 8 persons increases by 2.5 kg when a new person replaces one weighing 65 kg. What is the weight of the new entrant?', options: ['80 kg', '82.5 kg', '85 kg', '90 kg'], answer: 2, explanation: 'Total weight gain = 8 * 2.5 = 20 kg. New weight = 65 + 20 = 85 kg.' },
        { id: 'apt-6', category: 'Logical Reasoning', q: 'Statements: All scientists are thinkers. No thinkers are careless. Conclusion I: No scientists are careless. Conclusion II: Some careless persons are scientists.', options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both follow', 'Neither follows'], answer: 0, explanation: 'Scientists are a subset of thinkers who are never careless. Thus, no scientist is careless.' },
        { id: 'apt-7', category: 'Logical Reasoning', q: 'Identify the next term in the sequence: 4, 9, 25, 49, 121, ?', options: ['144', '169', '196', '225'], answer: 1, explanation: 'Squares of prime numbers: 2^2, 3^2, 5^2, 7^2, 11^2. Next prime is 13, so 13^2 = 169.' },
        { id: 'apt-8', category: 'Logical Reasoning', q: 'Introducing a boy, Priya said: "He is the only son of the only daughter of my paternal grandfather." How is the boy related to Priya?', options: ['Cousin', 'Brother', 'Nephew', 'Uncle'], answer: 1, explanation: 'Paternal grandfather\'s only daughter is Priya\'s mother. Her only son is Priya\'s brother.' },
        { id: 'apt-9', category: 'Logical Reasoning', q: 'In a code language, COMPUTE is written as DPNQVSF. How is ANALYST written in that code?', options: ['BODMZTU', 'BMBNZTU', 'BOBMZTU', 'BNAMZTU'], answer: 2, explanation: 'Each letter is shifted forward by 1: A->B, N->O, A->B, L->M, Y->Z, S->T, T->U.' },
        { id: 'apt-10', category: 'Logical Reasoning', q: 'Five friends P, Q, R, S, T sit facing North. Q sits to the immediate right of S. T sits between P and S. Who is on the extreme left?', options: ['P', 'Q', 'S', 'T'], answer: 0, explanation: 'Order from left to right is P, T, S, Q, R. P is on the extreme left.' },
        { id: 'apt-11', category: 'Verbal Ability', q: 'Select the word that is most nearly OPPOSITE in meaning to "EPHEMERAL":', options: ['Evanescent', 'Perpetual', 'Transient', 'Provisional'], answer: 1, explanation: 'Ephemeral means lasting a very short time. Perpetual means permanent or everlasting.' },
        { id: 'apt-12', category: 'Verbal Ability', q: 'Identify the error: "Neither the principal (A) / nor the lecturers (B) / was present at (C) / the international summit (D)."', options: ['A', 'B', 'C', 'D'], answer: 2, explanation: 'Subject agreement with "neither... nor" uses the nearer subject ("lecturers" is plural -> "were present").' },
        { id: 'apt-13', category: 'Verbal Ability', q: 'Choose the correct meaning: "To burn the candle at both ends"', options: ['To spend recklessly', 'To work tirelessly from morning till late night', 'To be indecisive', 'To cause accidental harm'], answer: 1, explanation: 'Signifies exhausting one\'s energy through continuous strenuous work.' },
        { id: 'apt-14', category: 'Verbal Ability', q: 'Choose the most precise word: "An official reprimand or strong expression of disapproval is called a ______."', options: ['Censure', 'Censor', 'Census', 'Cessation'], answer: 0, explanation: 'Censure denotes formal reprimand or severe disapproval.' },
        { id: 'apt-15', category: 'Verbal Ability', q: 'Complete the sentence: "The empirical findings of the study were so ______ that no reviewer could refute them."', options: ['ambiguous', 'irrefutable', 'conjectural', 'specious'], answer: 1, explanation: 'Irrefutable means impossible to deny or disprove.' },
        { id: 'apt-16', category: 'Data Interpretation', q: 'A college has 1,200 students. 60% are in Engineering, 25% in Management, and 15% in Law. How many more are in Engineering than Management and Law combined?', options: ['120', '240', '180', '300'], answer: 1, explanation: 'Engineering = 60%. Combined Mgmt + Law = 40%. Difference = 20% of 1,200 = 240 students.' },
        { id: 'apt-17', category: 'Data Interpretation', q: 'Revenues grew from $40M in 2021 to $50M in 2022, and $65M in 2023. What was the percentage growth rate from 2022 to 2023?', options: ['25%', '30%', '35%', '28%'], answer: 1, explanation: 'Growth = (65 - 50) / 50 = 15 / 50 = 30%.' },
        { id: 'apt-18', category: 'Data Interpretation', q: 'In an election between two candidates, the winner obtained 56% of valid votes and won by a majority of 1,440 votes. What was total valid votes?', options: ['10,000', '12,000', '14,400', '15,000'], answer: 1, explanation: 'Winner = 56%, Loser = 44%. Difference = 12% = 1,440. Total = 1,440 / 0.12 = 12,000.' },
        { id: 'apt-19', category: 'Data Interpretation', q: 'If 40% of (A + B) = 60% of (A - B), find the ratio of A to B:', options: ['5:1', '4:1', '3:2', '2:3'], answer: 0, explanation: '0.4A + 0.4B = 0.6A - 0.6B => 1.0B = 0.2A => A / B = 5 / 1.' },
        { id: 'apt-20', category: 'Data Interpretation', q: 'A pie chart shows budget allocations: R&D 35%, Salaries 40%, Infra 15%, Misc 10%. What is the central angle for R&D?', options: ['108 deg', '126 deg', '140 deg', '135 deg'], answer: 1, explanation: 'Angle = 35% of 360 degrees = 0.35 * 360 = 126 degrees.' }
    ],

    engineering: [
        { id: 'eng-1', category: 'Data Structures', q: 'What is the amortized time complexity of inserting into a dynamic array (like std::vector or ArrayList)?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 0, explanation: 'Doubling capacity occurs infrequently, resulting in O(1) amortized cost.' },
        { id: 'eng-2', category: 'Operating Systems', q: 'Which condition is NOT one of Coffman\'s four necessary conditions for deadlock?', options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'], answer: 2, explanation: 'Deadlock requires NO preemption. If preemption is allowed, deadlock cannot occur.' },
        { id: 'eng-3', category: 'Databases', q: 'In relational database theory, which normal form eliminates transitive functional dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 2, explanation: '3NF requires that no non-prime attribute is transitively dependent on any candidate key.' },
        { id: 'eng-4', category: 'Computer Networks', q: 'Which protocol operates at the Transport Layer of the OSI Model and guarantees ordered, reliable byte stream delivery?', options: ['UDP', 'IP', 'TCP', 'ICMP'], answer: 2, explanation: 'TCP provides connection-oriented, reliable, ordered packet delivery with flow control.' },
        { id: 'eng-5', category: 'Algorithms', q: 'What is the tightest worst-case time complexity of Merge Sort on an array of n integers?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], answer: 1, explanation: 'Merge Sort consistently splits the array in half (log n depth) and merges in linear time O(n).' },
        { id: 'eng-6', category: 'System Design', q: 'In distributed systems, the CAP Theorem dictates that in the presence of a network partition, you must choose between:', options: ['Consistency and Latency', 'Availability and Consistency', 'Durability and Speed', 'Security and Availability'], answer: 1, explanation: 'When network partitions (P) occur, a system must trade off between Consistency (C) and Availability (A).' },
        { id: 'eng-7', category: 'Cloud & DevOps', q: 'Which Docker instruction is executed during image build time rather than when a container runs?', options: ['CMD', 'ENTRYPOINT', 'RUN', 'EXPOSE'], answer: 2, explanation: 'RUN executes commands and creates a new layer during image build.' },
        { id: 'eng-8', category: 'Security', q: 'Which cryptographic algorithm relies on the hardness of discrete logarithms on elliptic curves?', options: ['RSA', 'ECDSA', 'AES-256', 'SHA-3'], answer: 1, explanation: 'ECDSA relies on the elliptic curve discrete logarithm problem.' },
        { id: 'eng-9', category: 'Web Architecture', q: 'Which HTTP header provides security against cross-site scripting (XSS) attacks by restricting permitted resource origins?', options: ['Access-Control-Allow-Origin', 'Content-Security-Policy', 'X-Frame-Options', 'Strict-Transport-Security'], answer: 1, explanation: 'Content-Security-Policy (CSP) restricts sources from which scripts, images, and other assets can load.' },
        { id: 'eng-10', category: 'Software Engineering', q: 'In the SOLID design principles, what does the "L" stand for?', options: ['Lazy Loading Principle', 'Liskov Substitution Principle', 'Linear Dependency Principle', 'Logical Separation Principle'], answer: 1, explanation: 'Liskov Substitution states objects of a superclass should be replaceable with objects of subclasses.' },
        { id: 'eng-11', category: 'AI & ML', q: 'Which activation function is most prone to the "vanishing gradient" problem during deep neural network backpropagation?', options: ['ReLU', 'Leaky ReLU', 'Sigmoid', 'GELU'], answer: 2, explanation: 'Sigmoid saturates at 0 and 1 with tiny derivatives, diminishing gradients across deep layers.' },
        { id: 'eng-12', category: 'Concurrency', q: 'What mechanism prevents race conditions when multiple threads access a shared counter?', options: ['Polymorphism', 'Mutex / Lock', 'Virtual Memory', 'Garbage Collection'], answer: 1, explanation: 'A Mutex guarantees that only one thread accesses the critical section at a time.' },
        { id: 'eng-13', category: 'Microservices', q: 'Which pattern is commonly used to maintain data consistency across distributed microservice transactions?', options: ['Saga Pattern', 'Observer Pattern', 'Singleton Pattern', 'Facade Pattern'], answer: 0, explanation: 'The Saga Pattern coordinates a series of local transactions with compensating actions on failure.' },
        { id: 'eng-14', category: 'Data Structures', q: 'What is the average lookup time complexity in a balanced Hash Table?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 0, explanation: 'With a good hash function and uniform distribution, hash table key lookup is O(1) on average.' },
        { id: 'eng-15', category: 'Version Control', q: 'What does the command "git cherry-pick <commit>" do?', options: ['Deletes the specified commit', 'Applies the changes from an existing commit to your current branch', 'Reverts the commit in-place', 'Merges branches without a commit message'], answer: 1, explanation: 'Cherry-pick selects a specific commit and replays its diff onto current HEAD.' },
        { id: 'eng-16', category: 'Databases', q: 'What database property guarantees that completed transactions survive system crashes or power outages?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], answer: 3, explanation: 'Durability ensures committed transactions are permanently recorded in non-volatile storage.' },
        { id: 'eng-17', category: 'Cloud Computing', q: 'Which cloud deployment model abstracts server management entirely, executing code only in response to events?', options: ['IaaS', 'PaaS', 'Serverless / FaaS', 'Bare Metal'], answer: 2, explanation: 'Serverless executes event-driven code without persistent server provisioning.' },
        { id: 'eng-18', category: 'System Design', q: 'What caching eviction strategy discards items that have not been accessed for the longest duration?', options: ['FIFO', 'LRU (Least Recently Used)', 'LFU (Least Frequently Used)', 'Random'], answer: 1, explanation: 'LRU tracks access order and evicts the entry with the oldest last-accessed timestamp.' },
        { id: 'eng-19', category: 'Algorithms', q: 'Dijkstra\'s algorithm finds the shortest path in a weighted graph under which strict condition?', options: ['All edge weights must be non-negative', 'Graph must be bipartite', 'Graph must be a DAG', 'Graph must contain no cycles'], answer: 0, explanation: 'Dijkstra fails with negative edge weights; Bellman-Ford must be used instead.' },
        { id: 'eng-20', category: 'DevOps', q: 'What is the primary objective of Continuous Integration (CI)?', options: ['Directly billing cloud infrastructure', 'Automating build and test runs whenever code is pushed', 'Provisioning physical hardware', 'Encrypting local databases'], answer: 1, explanation: 'CI automates building and testing to catch integration bugs early.' }
    ],

    ayush: [
        { id: 'med-1', category: 'Ayurvedic Principles', q: 'According to classical Ayurveda, which Dosha governs catabolism, cellular communication, and movement?', options: ['Pitta', 'Kapha', 'Vata', 'Rakta'], answer: 2, explanation: 'Vata represents air/ether and is responsible for motor impulses and movement.' },
        { id: 'med-2', category: 'Pharmacology', q: 'The bio-active compound "Curcumin", noted for anti-inflammatory efficacy, is extracted from which rhizome?', options: ['Zingiber officinale', 'Curcuma longa', 'Withania somnifera', 'Ocimum sanctum'], answer: 1, explanation: 'Curcuma longa is Turmeric, the source of curcuminoids.' },
        { id: 'med-3', category: 'Clinical Practice', q: 'Which Panchakarma procedure is specifically indicated for vitiated Pitta dosha located in the digestive tract?', options: ['Vamana (Therapeutic emesis)', 'Virechana (Purgation)', 'Basti (Enema)', 'Nasya (Nasal instillation)'], answer: 1, explanation: 'Virechana is the classical treatment for eliminating excess Pitta.' },
        { id: 'med-4', category: 'Modern Integration', q: 'Under NEP-2020 and WHO traditional medicine guidelines, what is "Reverse Pharmacology"?', options: ['Starting drug development from clinical documented Ayurvedic usage to laboratory validation', 'Synthesizing purely artificial chemicals', 'Removing active components from herbs', 'Administering drugs in reverse chronological order'], answer: 0, explanation: 'Reverse pharmacology validates documented traditional formulations through laboratory assays.' },
        { id: 'med-5', category: 'Physiology', q: 'In human circulatory physiology, which valve prevents backflow from the left ventricle into the left atrium?', options: ['Tricuspid valve', 'Mitral (Bicuspid) valve', 'Aortic semilunar valve', 'Pulmonary semilunar valve'], answer: 1, explanation: 'The mitral (bicuspid) valve guards the left atrioventricular orifice.' },
        { id: 'med-6', category: 'Dravyaguna', q: 'Which herb is classified as a premier "Rasayana" and adaptogen, commonly known as Indian Ginseng?', options: ['Withania somnifera (Ashwagandha)', 'Bacopa monnieri', 'Tinospora cordifolia', 'Emblica officinalis'], answer: 0, explanation: 'Withania somnifera (Ashwagandha) is revered as an adaptogenic Rasayana.' },
        { id: 'med-7', category: 'Pathology', q: 'What is the classical Ayurvedic term for metabolic toxins formed due to impaired digestion (Mandagni)?', options: ['Ojas', 'Ama', 'Tejas', 'Prana'], answer: 1, explanation: 'Ama is undigested metabolic waste that clogs micro-channels (Srotas).' },
        { id: 'med-8', category: 'Biochemistry', q: 'Which enzyme synthesizes cDNA from an RNA template in molecular diagnostic assays?', options: ['DNA Polymerase I', 'Reverse Transcriptase', 'RNA Helicase', 'Topoisomerase'], answer: 1, explanation: 'Reverse Transcriptase transcribes RNA into complementary DNA (cDNA).' },
        { id: 'med-9', category: 'Medical Ethics', q: 'The principle of "Non-Maleficence" in bioethics dictates that a medical practitioner must:', options: ['Maximize profits for the hospital', 'First, do no harm (Primum non nocere)', 'Disclose patient files to third parties', 'Always prioritize invasive surgery'], answer: 1, explanation: 'Non-maleficence requires clinicians to avoid inflicting unnecessary harm.' },
        { id: 'med-10', category: 'Diagnostics', q: 'In Ayurvedic Ashtavidha Pariksha, "Nadi Pariksha" refers to assessment of:', options: ['Urine', 'Tongue', 'Radial Pulse', 'Feces'], answer: 2, explanation: 'Nadi Pariksha is the classical examination of the arterial pulse.' },
        { id: 'med-11', category: 'Pharmacognosy', q: 'Which analytical technique is standard for identifying marker compounds in herbal extracts?', options: ['X-ray Crystallography', 'High-Performance Thin-Layer Chromatography (HPTLC)', 'Flow Cytometry', 'Western Blotting'], answer: 1, explanation: 'HPTLC provides reproducible chromatographic fingerprints for herbal standardization.' },
        { id: 'med-12', category: 'Immunology', q: 'Which immunoglobulin class is primarily present in colostrum and mucosal secretions?', options: ['IgG', 'IgA', 'IgM', 'IgE'], answer: 1, explanation: 'IgA serves as the primary secretory antibody protecting mucosal barriers.' },
        { id: 'med-13', category: 'Community Health', q: 'What is the primary therapeutic aim of the AYUSH National Health Mission in India?', options: ['Replacing all allopathic hospitals', 'Integrating traditional indigenous healthcare into primary health delivery', 'Eliminating surgical units', 'Privatizing public health clinics'], answer: 1, explanation: 'It fosters integration of AYUSH facilities with mainstream healthcare.' },
        { id: 'med-14', category: 'Anatomy', q: 'The functional microscopic filtration unit of the human kidney is the:', options: ['Nephron', 'Neuron', 'Alveolus', 'Hepatocyte'], answer: 0, explanation: 'The nephron filters blood and produces urine.' },
        { id: 'med-15', category: 'Dietetics', q: 'In Ayurveda, the dietary concept of "Viruddha Ahara" refers to:', options: ['Consuming only raw foods', 'Incompatible food combinations that trigger metabolic disharmony', 'Fasting during eclipses', 'Consuming food at fixed hours'], answer: 1, explanation: 'Viruddha Ahara encompasses antagonistic food combinations.' },
        { id: 'med-16', category: 'Microbiology', q: 'Which staining method is definitive for identifying Mycobacterium tuberculosis?', options: ['Gram Stain', 'Acid-Fast (Ziehl-Neelsen) Stain', 'Giemsa Stain', 'Silver Stain'], answer: 1, explanation: 'Mycobacteria possess mycolic acid cell walls that resist acid decolorization.' },
        { id: 'med-17', category: 'Surgery', q: 'Who is revered in Indian medical history as the father of surgery and author of the surgical compendium Samhita?', options: ['Charaka', 'Sushruta', 'Vagbhata', 'Patanjali'], answer: 1, explanation: 'Sushruta authored the Sushruta Samhita, detailing plastic and ophthalmic surgery.' },
        { id: 'med-18', category: 'Pharmacovigilance', q: 'What is the primary role of the National Pharmacovigilance Programme for AYUSH drugs?', options: ['Setting market retail prices', 'Monitoring and reporting adverse reactions to herbal and mineral formulations', 'Banning exports', 'Licensing medical schools'], answer: 1, explanation: 'It systematically monitors safety signals for AYUSH remedies.' },
        { id: 'med-19', category: 'Genomics', q: 'The emerging discipline correlating human Prakriti with genetic polymorphisms is known as:', options: ['Ayurgelomics', 'Ayurgenomics', 'Pharmacogenetics only', 'Bio-Dosha mapping'], answer: 1, explanation: 'Ayurgenomics bridges traditional Tridosha classification with modern human genomics.' },
        { id: 'med-20', category: 'Preventative Health', q: 'In Ayurvedic preventive lifestyle, the regimen of daily health practices is known as:', options: ['Ritucharya', 'Dinacharya', 'Sadvritta', 'Panchakarma'], answer: 1, explanation: 'Dinacharya encompasses daily routines including hygiene, exercise, and diet.' }
    ],

    management: [
        { id: 'mgt-1', category: 'Strategy', q: 'In Porter\'s Five Forces Framework, which of the following is NOT one of the five forces?', options: ['Threat of New Entrants', 'Bargaining Power of Buyers', 'Government Taxation Rate', 'Bargaining Power of Suppliers'], answer: 2, explanation: 'The 5 forces are: Entrants, Substitutes, Buyer power, Supplier power, and Industry rivalry.' },
        { id: 'mgt-2', category: 'Finance', q: 'Which financial metric indicates whether an investment project yields a return exceeding its cost of capital?', options: ['Operating Margin', 'Net Present Value (NPV) > 0', 'Debt-to-Equity Ratio', 'Working Capital Turnover'], answer: 1, explanation: 'A positive NPV indicates discounted cash inflows exceed initial investment.' },
        { id: 'mgt-3', category: 'Marketing', q: 'The marketing mix framework popularly known as the 4 Ps comprises Product, Price, Place, and:', options: ['People', 'Promotion', 'Process', 'Positioning'], answer: 1, explanation: 'The foundational 4 Ps are Product, Price, Place, and Promotion.' },
        { id: 'mgt-4', category: 'Operations', q: 'In Lean Six Sigma methodologies, the DMAIC cycle stands for Define, Measure, Analyze, ______ and Control.', options: ['Implement', 'Improve', 'Innovate', 'Inspect'], answer: 1, explanation: 'DMAIC stands for Define, Measure, Analyze, Improve, and Control.' },
        { id: 'mgt-5', category: 'Human Resources', q: 'Which motivation theory posits that factors leading to job satisfaction (Motivators) are distinct from those preventing dissatisfaction (Hygiene factors)?', options: ['Maslow\'s Hierarchy', 'Herzberg\'s Two-Factor Theory', 'Vroom\'s Expectancy Theory', 'McGregor\'s Theory X and Y'], answer: 1, explanation: 'Herzberg identified motivators (achievement) and hygiene factors (salary, conditions).' },
        { id: 'mgt-6', category: 'Accounting', q: 'Which financial statement reports a firm\'s financial position at a single specific point in time?', options: ['Income Statement', 'Cash Flow Statement', 'Balance Sheet', 'Statement of Retained Earnings'], answer: 2, explanation: 'The Balance Sheet captures assets, liabilities, and equity at a specific calendar date.' },
        { id: 'mgt-7', category: 'Supply Chain', q: 'What term describes the amplification of demand variability as one moves upstream in a supply chain?', options: ['Bullwhip Effect', 'Bottleneck Distortion', 'JIT Delay', 'Safety Stock Drift'], answer: 0, explanation: 'The Bullwhip Effect occurs when small shifts in consumer demand cause massive upstream variations.' },
        { id: 'mgt-8', category: 'Corporate Governance', q: 'In corporate governance, the "Agency Problem" arises primarily from the separation of:', options: ['Accounting and Auditing', 'Ownership and Control', 'Marketing and Sales', 'Debt and Equity'], answer: 1, explanation: 'Agency conflict occurs when managers (agents) act contrary to shareholders\' interests.' },
        { id: 'mgt-9', category: 'Agile Leadership', q: 'In a Scrum team, who is exclusively responsible for maximizing product value and managing the Product Backlog?', options: ['Scrum Master', 'Product Owner', 'Lead Developer', 'Agile Coach'], answer: 1, explanation: 'The Product Owner owns backlog prioritization and value delivery.' },
        { id: 'mgt-10', category: 'Analytics', q: 'What metric measures the percentage of customers who stop doing business with a company over a given timeframe?', options: ['Retention Rate', 'Churn Rate', 'Conversion Rate', 'Net Promoter Score'], answer: 1, explanation: 'Churn rate calculates the proportion of lost subscribers.' },
        { id: 'mgt-11', category: 'Economics', q: 'When a 10% increase in price leads to a 25% drop in quantity demanded, the price elasticity of demand is:', options: ['Inelastic (-0.4)', 'Elastic (-2.5)', 'Unitary (-1.0)', 'Perfectively Elastic'], answer: 1, explanation: 'Elasticity = -25% / 10% = -2.5 (Elastic).' },
        { id: 'mgt-12', category: 'ESG Compliance', q: 'What does the acronym "ESG" stand for in modern corporate governance frameworks?', options: ['Economic, Social, Governance', 'Environmental, Social, and Governance', 'Enterprise, Sustainability, Growth', 'Equity, Stakeholder, Guarantee'], answer: 1, explanation: 'ESG refers to Environmental, Social, and Governance criteria.' },
        { id: 'mgt-13', category: 'Finance', q: 'What is the Debt Service Coverage Ratio (DSCR) used to measure?', options: ['Inventory turnover speed', 'A firm\'s capacity to pay current debt obligations with operating cash flow', 'Dividend payout percentages', 'Accounts receivable collection delay'], answer: 1, explanation: 'DSCR measures net operating income relative to total debt obligations.' },
        { id: 'mgt-14', category: 'Organizational Behavior', q: 'A leadership style where decision-making authority is completely delegated to team members is called:', options: ['Autocratic', 'Laissez-faire', 'Transformational', 'Bureaucratic'], answer: 1, explanation: 'Laissez-faire gives team members full operational autonomy.' },
        { id: 'mgt-15', category: 'Risk Management', q: 'Which risk mitigation strategy involves shifting the financial consequences of a loss to a third party?', options: ['Risk Avoidance', 'Risk Transfer (e.g., Insurance)', 'Risk Retention', 'Risk Reduction'], answer: 1, explanation: 'Purchasing insurance transfers financial risk to another entity.' },
        { id: 'mgt-16', category: 'Strategy', q: 'The "Blue Ocean Strategy" focuses primarily on:', options: ['Out-pricing rivals in crowded traditional markets', 'Creating uncontested market space and making competition irrelevant', 'Acquiring bankrupt competitors', 'Defending market monopolies'], answer: 1, explanation: 'Blue oceans represent untainted, newly created market spaces.' },
        { id: 'mgt-17', category: 'Product Management', q: 'What is a Minimum Viable Product (MVP)?', options: ['A finished product with zero bugs', 'A product with just enough features to validate core assumptions with early adopters', 'A conceptual slide deck', 'The cheapest version that can be manufactured'], answer: 1, explanation: 'An MVP allows rapid customer feedback with minimum development effort.' },
        { id: 'mgt-18', category: 'Marketing', q: 'Customer Lifetime Value (CLV) is calculated to determine:', options: ['The total net revenue a firm can expect from a customer over their relationship', 'The cost of acquiring one user via social ads', 'Average daily store footfall', 'The price discount needed to sell excess stock'], answer: 0, explanation: 'CLV projects the long-term economic worth of a customer relationship.' },
        { id: 'mgt-19', category: 'Change Management', q: 'In Kotter\'s 8-Step Change Model, what is the crucial initial step?', options: ['Forming a strategic vision', 'Creating a sense of urgency', 'Removing barriers to action', 'Anchoring changes in corporate culture'], answer: 1, explanation: 'Step 1 is establishing a sense of urgency to mobilize stakeholders.' },
        { id: 'mgt-20', category: 'Negotiation', q: 'In negotiation theory, BATNA stands for:', options: ['Best Alternative To a Negotiated Agreement', 'Balanced Agreement Through Neutral Arbitrators', 'Broad Assessment of Tactical Net Assets', 'Buyer Approach To New Agreements'], answer: 0, explanation: 'BATNA is the most advantageous course of action if negotiations fail.' }
    ],

    law: [
        { id: 'law-1', category: 'Constitutional Law', q: 'Under the Indian Constitution, which Article guarantees the Right to Protection of Life and Personal Liberty?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], answer: 2, explanation: 'Article 21 guarantees that no person shall be deprived of life or personal liberty except by procedure established by law.' },
        { id: 'law-2', category: 'Cyber Law', q: 'Under the Information Technology Act 2000, which section penalizes identity theft using digital signatures or passwords?', options: ['Section 43', 'Section 66C', 'Section 67', 'Section 72'], answer: 1, explanation: 'Section 66C prescribes punishment for fraudulent identity theft using electronic credentials.' },
        { id: 'law-3', category: 'Contract Law', q: 'According to Section 10 of the Indian Contract Act 1872, an agreement without which essential element is VOID ab initio?', options: ['Free Consent', 'Lawful Consideration', 'Competency of Parties', 'All of the above'], answer: 3, explanation: 'Valid contracts require free consent, competent parties, lawful consideration, and a lawful object.' },
        { id: 'law-4', category: 'Tort Law', q: 'Which doctrine established in Rylands v. Fletcher imposes liability without needing to prove negligence or wrongful intent?', options: ['Vicarious Liability', 'Strict / Absolute Liability', 'Contributory Negligence', 'Volenti Non Fit Injuria'], answer: 1, explanation: 'Strict liability holds a person responsible for hazardous escapes regardless of precautions.' },
        { id: 'law-5', category: 'Intellectual Property', q: 'In patent jurisprudence, what criterion requires an invention to NOT be obvious to a person skilled in the art?', options: ['Novelty', 'Inventive Step (Non-obviousness)', 'Industrial Applicability', 'Sufficiency of Disclosure'], answer: 1, explanation: 'Inventive step requires a technical advancement that is non-obvious to an expert.' },
        { id: 'law-6', category: 'Criminal Jurisprudence', q: 'The Latin maxim "Actus non facit reum nisi mens sit rea" translates to:', options: ['An act does not make someone guilty unless the mind is also guilty', 'Ignorance of the law is no excuse', 'The burden of proof lies with the accuser', 'No person shall be tried twice for the same offense'], answer: 0, explanation: 'A crime requires both a physical act (actus reus) and guilty intent (mens rea).' },
        { id: 'law-7', category: 'Evidence Law', q: 'Under the Indian Evidence Act, what is the status of a confession made to a police officer while in custody?', options: ['Admissible as primary evidence', 'Inadmissible under Section 25 unless leading to recovery under Section 27', 'Admissible if signed before two witnesses', 'Treated as conclusive proof'], answer: 1, explanation: 'Section 25 bars confessions to police officers, with narrow exceptions for facts discovered under Section 27.' },
        { id: 'law-8', category: 'Arbitration', q: 'The UNCITRAL Model Law forms the foundation of which Indian enactment governing alternative dispute resolution?', options: ['Civil Procedure Code', 'Arbitration and Conciliation Act 1996', 'Consumer Protection Act 2019', 'Commercial Courts Act 2015'], answer: 1, explanation: 'The Arbitration and Conciliation Act 1996 adopted the UNCITRAL framework.' },
        { id: 'law-9', category: 'Environmental Law', q: 'The "Precautionary Principle" and "Polluter Pays Principle" were explicitly integrated into Indian environmental jurisprudence in which landmark case?', options: ['Kesavananda Bharati v. State of Kerala', 'Vellore Citizens Welfare Forum v. Union of India', 'Maneka Gandhi v. Union of India', 'Vishaka v. State of Rajasthan'], answer: 1, explanation: 'The Supreme Court ruled these principles are essential features of sustainable development under Article 21.' },
        { id: 'law-10', category: 'Corporate Law', q: 'What legal principle prevents courts from second-guessing bona fide managerial decisions made with reasonable care?', options: ['Corporate Veil Doctrine', 'Business Judgment Rule', 'Ultra Vires Doctrine', 'Indoor Management Rule'], answer: 1, explanation: 'The Business Judgment Rule shields directors from personal liability for honest business decisions.' },
        { id: 'law-11', category: 'Constitutional Remedies', q: 'Which writ is issued by a High Court or Supreme Court to quash an order passed by a lower tribunal without jurisdiction?', options: ['Habeas Corpus', 'Mandamus', 'Certiorari', 'Quo Warranto'], answer: 2, explanation: 'Certiorari quashes decisions of subordinate courts or tribunals acting without jurisdiction.' },
        { id: 'law-12', category: 'Traditional Knowledge', q: 'India\'s Traditional Knowledge Digital Library (TKDL) was created specifically to:', options: ['Monopolize patent royalties in India', 'Prevent bio-piracy and fraudulent patents on indigenous medicinal knowledge abroad', 'Abolish all Ayurvedic patents', 'Replace domestic civil courts'], answer: 1, explanation: 'TKDL documents traditional remedies to defeat foreign patent claims based on lack of novelty.' },
        { id: 'law-13', category: 'Administrative Law', q: 'The principle of "Audi Alteram Partem" is an indispensable component of:', options: ['Delegated Legislation', 'Natural Justice (Hear the other side)', 'Substantive Due Process', 'Judicial Review of Statutes'], answer: 1, explanation: 'Audi alteram partem guarantees that no party should be condemned unheard.' },
        { id: 'law-14', category: 'Labor Law', q: 'Under the Code on Wages 2019, which authority is empowered to fix national floor minimum wages?', options: ['Individual District Magistrates', 'Central Government', 'Trade Unions', 'International Labour Organization'], answer: 1, explanation: 'The Central Government fixes the statutory floor wage taking into account minimum living standards.' },
        { id: 'law-15', category: 'Human Rights', q: 'The landmark Supreme Court judgment in Justice K.S. Puttaswamy (Retd.) v. Union of India established that:', options: ['The death penalty is unconstitutional', 'Right to Privacy is a Fundamental Right under Article 21', 'Internet access cannot be taxed', 'Aadhaar is entirely illegal'], answer: 1, explanation: 'A 9-judge bench unanimously held privacy is protected under Article 21.' },
        { id: 'law-16', category: 'Consumer Protection', q: 'Under the Consumer Protection Act 2019, what central authority was established to prevent unfair trade practices?', options: ['Competition Commission of India', 'Central Consumer Protection Authority (CCPA)', 'Consumer Grievance Tribunal', 'National Council of Trade Standards'], answer: 1, explanation: 'The CCPA regulates violations of consumer rights, deceptive ads, and unfair practices.' },
        { id: 'law-17', category: 'Criminal Procedure', q: 'A "cognizable offense" is legally defined as an offense in which a police officer may arrest an accused:', options: ['Only with a judicial warrant signed by a Magistrate', 'Without a warrant and initiate investigation without court orders', 'Only after seeking permission from the State Governor', 'Only if the offense occurs in public view'], answer: 1, explanation: 'In cognizable offenses, police officers can arrest without a warrant and initiate investigations directly.' },
        { id: 'law-18', category: 'International Law', q: 'Which international treaty defines the rights and responsibilities of nations regarding use of the world\'s oceans?', options: ['Geneva Conventions', 'UNCLOS (UN Convention on the Law of the Sea)', 'Kyoto Protocol', 'Paris Convention'], answer: 1, explanation: 'UNCLOS establishes maritime zones and jurisdictional limits.' },
        { id: 'law-19', category: 'Legal Drafting', q: 'In legislative drafting, the phrase "Notwithstanding anything contained in..." is known as a:', options: ['Proviso clause', 'Non-obstante clause', 'Severability clause', 'Savings clause'], answer: 1, explanation: 'A non-obstante clause gives the provision overriding effect over conflicting enactments.' },
        { id: 'law-20', category: 'Civil Procedure', q: 'The doctrine of "Res Judicata" under Section 11 of the CPC bars:', options: ['Appeals to the Supreme Court', 'Re-litigation of a matter directly and substantially in issue that has already been adjudicated', 'Arrests in execution of money decrees', 'Filing counter-claims'], answer: 1, explanation: 'Res judicata prevents parties from litigating a finalized judicial cause of action again.' }
    ]
};

// Seed-based per-user pseudo-random question & option shuffler (re-shuffles on every attempt)
function getShuffledTestQuestions(userId, testType, domain) {
    const key = testType === 'aptitude' ? 'aptitude' : (domain || 'ayush').toLowerCase();
    const baseQuestions = TEST_BATTERY_QUESTIONS[key] || TEST_BATTERY_QUESTIONS.ayush;

    let seed = 0;
    const seedStr = `${userId || 1}_${testType}_${domain}_${Date.now()}`;
    for (let i = 0; i < seedStr.length; i++) {
        seed = (seed << 5) - seed + seedStr.charCodeAt(i);
        seed |= 0;
    }

    const rng = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const shuffled = baseQuestions.map(q => ({ ...q, options: [...q.options] }));

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    shuffled.forEach(q => {
        const correctText = q.options[q.answer];
        for (let i = q.options.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
        }
        q.answer = q.options.indexOf(correctText);
    });

    return shuffled;
}

const App = {
    activeTestSession: null,
    lastTestResult: null,

    init: function () {
        DB.seed();
        DB.currentUser = null;
        DB.activeStudentTab = 'overview';
        GlobalBackgroundEngine.init();
        this.render();
    },

    render: function () {
        const app = document.getElementById('app');
        if (DB.currentUser) {
            this.renderDashboard(app);
        } else {
            this.renderLanding(app);
        }
    },

    setStudentTab: function (tabName) {
        DB.activeStudentTab = tabName;
        DB.selectedJob = null;

        const tabContainer = document.getElementById('student-tab-content');
        if (tabContainer && DB.currentUser) {
            tabContainer.classList.add('opacity-0');
            setTimeout(() => {
                tabContainer.innerHTML = this.renderCurrentStudentTabContent(DB.currentUser, tabName);
                tabContainer.classList.remove('opacity-0');
            }, 120);

            const nav = document.getElementById('student-tab-navigation');
            if (nav) {
                const btns = nav.querySelectorAll('button');
                btns.forEach(btn => {
                    const t = btn.getAttribute('data-tab');
                    if (t === tabName) {
                        btn.className = 'px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center bg-blue-600 text-white font-semibold shadow-sm';
                    } else {
                        btn.className = 'px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center bg-white/70 hover:bg-cyan-50/60 text-slate-600 font-medium border border-cyan-100/80';
                    }
                });
            }
        } else {
            this.render();
        }
    },

    showToast: function (message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        const bgColors = { success: 'bg-teal-900 border-teal-700 text-teal-100', error: 'bg-rose-900 border-rose-700 text-rose-100', info: 'bg-slate-900 border-slate-700 text-slate-100' };
        toast.className = `pointer-events-auto px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold flex items-center space-x-2 transition transform translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 10);
        setTimeout(() => { toast.classList.add('opacity-0', 'translate-y-2'); setTimeout(() => { toast.remove(); }, 300); }, 3000);
    },

    getCloseButton: function (onClickHandler = "App.render()") {
        return `<button onclick="${onClickHandler}" aria-label="Close" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shadow-sm z-20"><i class="fa-solid fa-xmark text-base"></i></button>`;
    },

    getAvatarHtml: function (user, sizeClass = 'w-14 h-14', textClass = 'text-xl', borderClass = 'border-2 border-cyan-400') {
        if (user && user.profilePhoto) { return `<img src="${user.profilePhoto}" alt="${user.name}" class="${sizeClass} rounded-full object-cover ${borderClass} shadow-sm">`; }
        const initial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
        return `<div class="${sizeClass} rounded-full bg-slate-900 text-cyan-300 flex items-center justify-center ${textClass} font-bold ${borderClass} shadow-sm">${initial}</div>`;
    },

    handleProfilePhotoUpload: function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (DB.currentUser) { DB.currentUser.profilePhoto = event.target.result; }
                const preview = document.getElementById('profilePhotoPreview');
                if (preview) { preview.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover">`; }
                this.showToast('Profile photo successfully attached!', 'success');
            };
            reader.readAsDataURL(file);
        }
    },

    getLogoHtml: function (size = 'normal', variant = 'default') {
        const iconSize = size === 'large' ? 'w-12 h-12' : 'w-10 h-10';
        const textClass = size === 'large' ? 'text-3xl' : 'text-2xl';

        let bgGradient = "from-cyan-500 via-teal-500 to-sky-400";
        let iconColor = "text-cyan-400";
        let textPrimary = "text-slate-900";
        let textAccent = "text-cyan-600";
        let subtextColor = "text-slate-500";

        if (variant === 'portal') {
            bgGradient = "from-amber-400 via-amber-500 to-emerald-500";
            iconColor = "text-amber-400";
            textPrimary = "text-white";
            textAccent = "text-amber-400";
            subtextColor = "text-amber-300/80";
        }

        return `
            <div class="flex items-center space-x-3 cursor-pointer" onclick="App.init()">
                <div class="${iconSize} bg-gradient-to-tr ${bgGradient} rounded-xl p-0.5 shadow-md flex items-center justify-center">
                    <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                        <svg class="w-6 h-6 ${iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M4 21c4-2 12-2 16 0"/>
                        </svg>
                    </div>
                </div>
                <div>
                    <span class="${textClass} font-bold tracking-tight ${textPrimary} font-brand">Skill<span class="${textAccent}">Bridge</span></span>
                    <span class="block text-[9px] uppercase tracking-widest ${subtextColor} font-semibold font-sans">National Academia-Industry Portal • NEP 2020</span>
                </div>
            </div>
        `;
    },

    renderLanding: function (app) {
        app.innerHTML = `
            <div class="min-h-screen text-slate-800 flex flex-col justify-between">
                <nav class="border-b border-cyan-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
                        ${this.getLogoHtml()}
                        <div class="flex items-center space-x-3">
                            <button onclick="App.showLogin('student')" class="text-xs font-semibold px-4 py-2 rounded-full bg-blue-600 text-white transition shadow-sm">
                                <i class="fa-solid fa-user-graduate mr-1.5"></i> Student Portal
                            </button>
                            <button onclick="App.showLogin('academician')" class="text-xs font-semibold px-4 py-2 rounded-full bg-teal-700 hover:bg-teal-800 text-white transition shadow-sm">
                                <i class="fa-solid fa-chalkboard-user mr-1.5"></i> Academician
                            </button>
                            <button onclick="App.showLogin('industrialist')" class="text-xs font-semibold px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm">
                                <i class="fa-solid fa-building mr-1.5"></i> Industry
                            </button>
                        </div>
                    </div>
                </nav>

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center z-10 relative">
                    <div class="framer-reveal stagger-1">
                        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6 text-slate-900">
                            Unified Skill Validation & <br>
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-sky-600">
                                Academic Gap Intelligence Platform
                            </span>
                        </h1>
                        
                        <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Connecting Students, Enterprises, and Educational Institutions with real-time AI skill mapping, NPTEL/AYUSH credit transfer, and official qualification records.
                        </p>

                        <div class="flex flex-wrap justify-center gap-4 mb-14">
                            <button onclick="App.showLogin('student')" class="px-7 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-full shadow-lg transition flex items-center">
                                Access Student Portal <i class="fa-solid fa-arrow-right ml-2"></i>
                            </button>
                            <button onclick="App.showLogin('industrialist')" class="px-7 py-3.5 glass-card hover:bg-white text-slate-800 border border-cyan-200/80 font-semibold text-sm rounded-full shadow-sm transition">
                                Enterprise Recruiting Portal
                            </button>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                            <div class="glass-card p-4 rounded-2xl shadow-sm text-center card-hover">
                                <div class="text-2xl font-extrabold text-cyan-600">100%</div>
                                <div class="text-xs text-slate-500 font-medium mt-1">APAAR Integrated</div>
                            </div>
                            <div class="glass-card p-4 rounded-2xl shadow-sm text-center card-hover">
                                <div class="text-2xl font-extrabold text-slate-900">AICTE</div>
                                <div class="text-xs text-slate-500 font-medium mt-1">Credit Compliant</div>
                            </div>
                            <div class="glass-card p-4 rounded-2xl shadow-sm text-center card-hover">
                                <div class="text-2xl font-extrabold text-teal-600">NAPS 2.0</div>
                                <div class="text-xs text-slate-500 font-medium mt-1">Stipend Eligible</div>
                            </div>
                            <div class="glass-card p-4 rounded-2xl shadow-sm text-center card-hover">
                                <div class="text-2xl font-extrabold text-sky-600">NCVET</div>
                                <div class="text-xs text-slate-500 font-medium mt-1">Verified Qualification</div>
                            </div>
                        </div>

                        <div class="text-xs font-bold uppercase tracking-widest text-cyan-800 mb-6">Designed for Key Stakeholders</div>

                        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left mb-16">
                            <div class="glass-card border border-cyan-100 hover:border-cyan-400 rounded-2xl p-6 card-hover flex flex-col justify-between shadow-sm">
                                <div>
                                    <div class="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 text-xl mb-4">
                                        <i class="fa-solid fa-graduation-cap"></i>
                                    </div>
                                    <h3 class="text-xl font-bold text-slate-900 mb-2">Students & Researchers</h3>
                                    <p class="text-slate-600 text-xs mb-4 leading-relaxed">
                                        Complete automated AI assessment across GitHub repos, research papers, and technical tests. Accumulate NEP 2020 APAAR credits.
                                    </p>
                                </div>
                                <button onclick="App.showLogin('student')" class="w-full py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold transition">
                                    Student Login / Register &rarr;
                                </button>
                            </div>

                            <div class="glass-card border border-cyan-100 hover:border-teal-400 rounded-2xl p-6 card-hover flex flex-col justify-between shadow-sm">
                                <div>
                                    <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 text-xl mb-4">
                                        <i class="fa-solid fa-book-medical"></i>
                                    </div>
                                    <h3 class="text-xl font-bold text-slate-900 mb-2">Academicians & Faculty</h3>
                                    <p class="text-slate-600 text-xs mb-4 leading-relaxed">
                                        Publish deadline-based certified courses, launch timed quizzes, and participate in FDPs & AYUSH clinical research.
                                    </p>
                                </div>
                                <button onclick="App.showLogin('academician')" class="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-semibold transition">
                                    Faculty Portal &rarr;
                                </button>
                            </div>

                            <div class="glass-card border border-cyan-100 hover:border-slate-400 rounded-2xl p-6 card-hover flex flex-col justify-between shadow-sm">
                                <div>
                                    <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 text-xl mb-4">
                                        <i class="fa-solid fa-briefcase"></i>
                                    </div>
                                    <h3 class="text-xl font-bold text-slate-900 mb-2">Industry & R&D Labs</h3>
                                    <p class="text-slate-600 text-xs mb-4 leading-relaxed">
                                        Post skill-mapped internships and placements. Directly review verified candidate scores and APAAR credit portfolios.
                                    </p>
                                </div>
                                <button onclick="App.showLogin('industrialist')" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-xs font-semibold transition">
                                    Industry Access &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    showLogin: function (role) {
        const app = document.getElementById('app');
        const roleConfig = {
            student: { title: 'Student & Researcher Login', icon: 'fa-user-graduate', color: 'cyan', demo: 'student@demo.com' },
            academician: { title: 'Academician & Faculty Portal', icon: 'fa-chalkboard-user', color: 'teal', demo: 'academic@demo.com' },
            industrialist: { title: 'Industry & Recruiter Gateway', icon: 'fa-building', color: 'slate', demo: 'industry@demo.com' }
        }[role];

        app.innerHTML = `
            <div class="min-h-screen flex flex-col justify-center items-center p-4 relative framer-reveal">
                <div class="mb-6">${this.getLogoHtml('large')}</div>
                <div class="glass-card rounded-2xl shadow-xl p-8 w-full max-w-md border border-cyan-200/70 z-10 relative">
                    ${this.getCloseButton('App.render()')}
                    <div class="text-center mb-6 pr-4">
                        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-2xl border border-cyan-200">
                            <i class="fa-solid ${roleConfig.icon}"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-800">${roleConfig.title}</h2>
                        <p class="text-xs text-slate-500 mt-1">Unified Sign-On with APAAR / Institutional Credentials</p>
                    </div>
                    <form onsubmit="App.handleLogin(event, '${role}')" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Email ID</label>
                            <input type="email" id="loginEmail" required class="w-full px-4 py-2.5 text-sm" placeholder="you@domain.edu.in">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Password</label>
                            <input type="password" id="loginPassword" required class="w-full px-4 py-2.5 text-sm" placeholder="••••••••">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-full text-sm transition shadow-md">
                            Authenticate & Enter Portal
                        </button>
                    </form>
                    <div class="mt-4 p-3 bg-cyan-50/60 rounded-xl border border-cyan-100 text-xs text-slate-600 flex justify-between items-center">
                        <span><strong>Demo Access:</strong> ${roleConfig.demo}</span>
                        <button onclick="document.getElementById('loginEmail').value='${roleConfig.demo}'; document.getElementById('loginPassword').value='demo123';" class="text-cyan-700 underline font-semibold">Auto-fill</button>
                    </div>
                    <div class="mt-6 flex justify-start text-xs text-slate-500">
                        <button onclick="App.showRegister('${role}')" class="text-cyan-700 font-semibold hover:underline">New here? Register</button>
                    </div>
                </div>
            </div>
        `;
    },

    showRegister: function (role) {
        const app = document.getElementById('app');
        let extraFields = '';
        if (role === 'student') {
            extraFields = `<div><label class="block text-xs font-bold uppercase text-slate-600 mb-1">APAAR / ABC ID (12 Digits)</label><input type="text" id="regApaar" required placeholder="e.g. 8942-7712-4401" class="w-full px-4 py-2 text-sm"></div>`;
        } else if (role === 'academician') {
            extraFields = `<div><label class="block text-xs font-bold uppercase text-slate-600 mb-1">Affiliated University / College</label><input type="text" id="regInstitution" required placeholder="e.g. National Institute of Ayurveda / PICT" class="w-full px-4 py-2 text-sm"></div>`;
        } else {
            extraFields = `<div><label class="block text-xs font-bold uppercase text-slate-600 mb-1">Company / R&D Facility</label><input type="text" id="regCompany" required placeholder="e.g. Dabur Healthcare Labs / TechCorp" class="w-full px-4 py-2 text-sm"></div>`;
        }
        app.innerHTML = `
            <div class="min-h-screen flex flex-col justify-center items-center p-4 relative framer-reveal">
                <div class="mb-4">${this.getLogoHtml('large')}</div>
                <div class="glass-card rounded-2xl shadow-xl p-8 w-full max-w-lg border border-cyan-200/70 z-10 relative">
                    ${this.getCloseButton('App.render()')}
                    <h2 class="text-xl font-bold text-slate-800 mb-1 pr-6">Register New Account</h2>
                    <p class="text-xs text-slate-500 mb-6">Connect to the National Collaborative Skill Database</p>
                    <form onsubmit="App.handleRegister(event, '${role}')" class="space-y-3">
                        <div><label class="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name</label><input type="text" id="regName" required class="w-full px-4 py-2 text-sm" placeholder="Dr. / Mr. / Ms. Full Name"></div>
                        <div><label class="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address</label><input type="email" id="regEmail" required class="w-full px-4 py-2 text-sm" placeholder="name@institution.ac.in"></div>
                        <div><label class="block text-xs font-bold uppercase text-slate-600 mb-1">Password</label><input type="password" id="regPassword" required minlength="6" class="w-full px-4 py-2 text-sm" placeholder="Min 6 characters"></div>
                        ${extraFields}
                        <button type="submit" class="w-full mt-2 bg-blue-600 text-white font-semibold py-2.5 rounded-full text-sm transition shadow-md">Create Profile & Proceed</button>
                    </form>
                    <div class="mt-4 text-center">
                        <button onclick="App.showLogin('${role}')" class="text-xs text-cyan-700 font-semibold hover:underline">Already registered? Log In</button>
                    </div>
                </div>
            </div>
        `;
    },

    handleLogin: function (e, role) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const user = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
        if (user) {
            DB.currentUser = user; DB.activeStudentTab = 'overview';
            this.showToast(`Welcome back, ${user.name}!`, 'success'); this.render();
        } else { this.showToast('Invalid credentials. Please verify your role and email.', 'error'); }
    },

    handleRegister: function (e, role) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        if (DB.users.some(u => u.email.toLowerCase() === email.toLowerCase())) { this.showToast('This email is already registered!', 'error'); return; }
        const newUser = { id: DB.users.length + 1, name: document.getElementById('regName').value.trim(), email, password: document.getElementById('regPassword').value, role, skills: [], projects: [], domain: '', targetRole: '', matchScore: 0, apaarId: document.getElementById('regApaar') ? document.getElementById('regApaar').value : null, apaarVerified: true, institution: document.getElementById('regInstitution') ? document.getElementById('regInstitution').value : null, company: document.getElementById('regCompany') ? document.getElementById('regCompany').value : null, abcCredits: 0, profilePhoto: null, linkedin: "", rejections: [], testHistory: {} };
        DB.users.push(newUser); DB.currentUser = newUser; DB.activeStudentTab = 'overview';
        // Sync new registration to PostgreSQL (visible in PopSQL)
        try {
            fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password || '123456',
                    role: newUser.role,
                    apaarId: newUser.apaarId || null,
                    institution: newUser.institution || null,
                    company: newUser.company || null
                })
            }).catch(err => console.warn('PopSQL sync offline:', err));
        } catch (err) { }
        this.showToast('Account successfully created!', 'success'); this.render();
    },

    logout: function () {
        DB.currentUser = null;
        this.showToast('Logged out successfully.', 'info');
        this.render();
    },

    renderDashboard: function (app) {
        const user = DB.currentUser;
        let dashboardHtml = user.role === 'student' ? this.renderStudentView(user) : (user.role === 'academician' ? this.renderAcademicianView(user) : this.renderIndustrialistView(user));

        app.innerHTML = `
            <div class="min-h-screen flex flex-col bg-transparent">
                <header class="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
                        ${this.getLogoHtml('normal', 'portal')}
                        <div class="flex items-center space-x-5 text-xs">
                            <div class="flex items-center space-x-3">
                                <div class="text-right hidden sm:block">
                                    <p class="font-bold text-slate-100">${user.name}</p>
                                    <p class="text-amber-400/90 capitalize font-medium">${user.role} ${user.domain ? '• ' + user.domain.toUpperCase() : ''}</p>
                                </div>
                                ${this.getAvatarHtml(user, 'w-9 h-9', 'text-sm', 'border-2 border-amber-400')}
                            </div>
                            <button onclick="App.logout()" class="px-3.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 rounded-full text-white font-medium transition shadow-sm"><i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> Logout</button>
                        </div>
                    </div>
                </header>
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full z-10 relative">
                    ${dashboardHtml}
                </main>
                <footer class="bg-slate-950/90 backdrop-blur-md border-t border-cyan-950/60 text-slate-400 text-xs py-4 text-center z-10">SkillBridge • Ministry of AYUSH, AICTE & NEP-2020 Academic Bank of Credits (ABC) Aligned Ecosystem</footer>
            </div>
        `;
    },

    renderStudentView: function (user) {
        if (!user.domain || !user.assessment) { return this.renderStudentOnboardingForm(user); }
        if (user.domain !== 'engineering' && DB.activeStudentTab === 'projects') { DB.activeStudentTab = 'overview'; }

        const currentTab = DB.activeStudentTab || 'overview';
        const tabBtnStyle = (tab) => currentTab === tab
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'bg-white/70 hover:bg-cyan-50/60 text-slate-600 font-medium border border-cyan-100/80';

        return `
            <div class="space-y-6">
                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-5 flex flex-wrap justify-between items-center gap-4">
                    <div class="flex items-center space-x-4">
                        ${this.getAvatarHtml(user, 'w-14 h-14', 'text-xl', 'border-2 border-cyan-400')}
                        <div>
                            <div class="flex items-center space-x-2">
                                <h2 class="text-xl font-bold text-slate-800">${user.name}</h2>
                                <span class="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                                    <i class="fa-solid fa-circle-check text-teal-600"></i> APAAR VERIFIED
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 font-mono">APAAR ID: ${user.apaarId || '8942-7712-4401'} • Domain: <strong class="text-slate-700 uppercase">${user.domain}</strong></p>
                            <p class="text-xs text-slate-600 mt-1">
                                <i class="fa-solid fa-bullseye text-cyan-600 mr-1"></i> Target Goal / Role: 
                                <strong class="text-slate-800">${user.targetRole || 'Not Specified'}</strong>
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-3">
                        <div class="bg-cyan-50/80 border border-cyan-200/80 px-3.5 py-2 rounded-xl text-center">
                            <span class="text-[10px] uppercase font-bold text-cyan-700 block">AI Match Score</span>
                            <span class="text-lg font-bold text-cyan-950">${user.matchScore || user.assessment.score}% Match</span>
                        </div>
                        <div class="bg-sky-50/80 border border-sky-200/80 px-3.5 py-2 rounded-xl text-center">
                            <span class="text-[10px] uppercase font-bold text-sky-700 block">NEP 2020 Credits</span>
                            <span class="text-lg font-bold text-sky-950">${user.abcCredits || 24} ABC Pts</span>
                        </div>
                        <div class="bg-teal-50/80 border border-teal-200/80 px-3.5 py-2 rounded-xl text-center">
                            <span class="text-[10px] uppercase font-bold text-teal-700 block">AI Competency</span>
                            <span class="text-lg font-bold text-teal-950">${user.assessment.score}% (${user.level})</span>
                        </div>
                        <button onclick="App.showRetakeAssessment()" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition self-center">
                            <i class="fa-solid fa-rotate-right mr-1"></i> Retake Assessment
                        </button>
                    </div>
                </div>

                <div id="student-tab-navigation" class="flex flex-wrap gap-2 border-b border-cyan-100 pb-3">
                    <button data-tab="overview" onclick="App.setStudentTab('overview')" class="px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center ${tabBtnStyle('overview')}">
                        <i class="fa-solid fa-chart-pie mr-2"></i> Skill & Audit Overview
                    </button>
                    <button data-tab="courses" onclick="App.setStudentTab('courses')" class="px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center ${tabBtnStyle('courses')}">
                        <i class="fa-solid fa-graduation-cap mr-2"></i> Courses & Recommendations
                    </button>
                    ${user.domain === 'engineering' ? `
                        <button data-tab="projects" onclick="App.setStudentTab('projects')" class="px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center ${tabBtnStyle('projects')}">
                            <i class="fa-brands fa-github mr-2"></i> GitHub Project Audit
                        </button>
                    ` : ''}
                    <button data-tab="interview" onclick="App.setStudentTab('interview')" class="px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center ${tabBtnStyle('interview')}">
                        <i class="fa-solid fa-video mr-2"></i> Interview Prep Room
                    </button>
                    <button data-tab="resume" onclick="App.setStudentTab('resume')" class="px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center ${tabBtnStyle('resume')}">
                        <i class="fa-solid fa-file-invoice mr-2"></i> Smart Resume & Portfolio
                    </button>
                    <button data-tab="opportunities" onclick="App.setStudentTab('opportunities')" class="px-4 py-2 text-xs rounded-full transition-all duration-200 flex items-center ${tabBtnStyle('opportunities')}">
                        <i class="fa-solid fa-briefcase mr-2"></i> Internships & Jobs
                    </button>
                </div>

                <div id="student-tab-content" class="mt-4 tab-pane-fade">
                    ${this.renderCurrentStudentTabContent(user, currentTab)}
                </div>
            </div>
        `;
    },

    renderCurrentStudentTabContent: function (user, tab) {
        switch (tab) {
            case 'courses': return this.renderStudentCoursesTab(user);
            case 'projects': return user.domain === 'engineering' ? this.renderStudentGithubTab(user) : this.renderStudentOverviewTab(user);
            case 'interview': return this.renderStudentInterviewTab(user);
            case 'resume': return this.renderStudentResumeTab(user);
            case 'opportunities': return this.renderStudentOpportunitiesTab(user);
            case 'overview':
            default:
                return this.renderStudentOverviewTab(user);
        }
    },

    renderStudentOverviewTab: function (user) {
        const rejectionsHtml = (user.rejections && user.rejections.length > 0) ? `
            <div class="lg:col-span-3 glass-card rounded-2xl shadow-sm border border-rose-200 p-6 space-y-4 mt-2 card-hover">
                <div class="flex justify-between items-center border-b border-rose-100 pb-3">
                    <h3 class="font-bold text-rose-800 flex items-center text-sm">
                        <i class="fa-solid fa-triangle-exclamation mr-2"></i> Industry Application Feedback & AI Recovery Roadmaps
                    </h3>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    ${user.rejections.map(r => `
                        <div class="bg-rose-50/60 border border-rose-100 p-4 rounded-xl text-xs space-y-2">
                            <p class="text-slate-700"><strong>Reviewing Company:</strong> ${r.company}</p>
                            <p class="text-slate-700"><strong>Reason for Rejection:</strong> Missing critical skill requirement <span class="font-bold text-rose-600">${r.skill}</span></p>
                            <p class="text-slate-500 text-[10px]">Date Logged: ${r.date}</p>
                            
                            <div class="bg-white/90 p-3 rounded-xl border border-teal-200 mt-3">
                                <p class="font-bold text-teal-800 mb-2"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> AI Generated Recovery Roadmap for ${r.skill}:</p>
                                <ul class="list-decimal list-inside space-y-1.5 text-slate-600">
                                    <li>Complete an accredited NPTEL/SWAYAM certification focusing exclusively on ${r.skill}.</li>
                                    <li>Update your portfolio with a practical implementation/case study of ${r.skill}.</li>
                                    <li>Utilize the Interview Prep Room to practice domain questions specifically targeting ${r.skill}.</li>
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        return `
            <div class="space-y-6">
                <div class="grid lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 glass-card rounded-2xl shadow-sm border border-cyan-200/70 p-6 space-y-4 card-hover">
                        <div class="flex justify-between items-center border-b border-cyan-100 pb-3">
                            <h3 class="font-bold text-slate-800 flex items-center text-sm">
                                <i class="fa-solid fa-microchip text-cyan-600 mr-2"></i> AI Skill-Gap Analysis & Telemetry Audit
                            </h3>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs font-semibold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                                    Target Match: ${user.matchScore || user.assessment.score}%
                                </span>
                                <span class="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                                    Score: ${user.assessment.score} / 100
                                </span>
                            </div>
                        </div>

                        <div class="grid sm:grid-cols-2 gap-4 text-xs">
                            <div class="p-3.5 bg-cyan-50/40 rounded-xl border border-cyan-100">
                                <span class="font-bold text-slate-700 block mb-1">
                                    <i class="fa-solid ${user.domain === 'engineering' ? 'fa-brands fa-github' : 'fa-award'} text-slate-800 mr-1"></i> 
                                    ${user.domain === 'engineering' ? 'Git Repository Telemetry:' : 'Domain Accreditation Audit:'}
                                </span>
                                <p class="text-slate-600">${user.assessment.repoAudit}</p>
                            </div>
                            <div class="p-3.5 bg-cyan-50/40 rounded-xl border border-cyan-100">
                                <span class="font-bold text-slate-700 block mb-1"><i class="fa-solid fa-file-lines text-teal-700 mr-1"></i> Research & Publications:</span>
                                <p class="text-slate-600">${user.assessment.researchWeight}</p>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-500 mb-2">Identified Skill Gaps (Requires Upskilling):</h4>
                            <div class="flex flex-wrap gap-2">
                                ${user.assessment.gaps.map(g => `<span class="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-medium"><i class="fa-solid fa-triangle-exclamation mr-1 text-rose-500"></i>${g}</span>`).join('')}
                            </div>
                        </div>

                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-500 mb-2">AI Suggested Upskilling Workflows:</h4>
                            <ul class="space-y-1.5 text-xs text-slate-700">
                                ${user.assessment.suggestions.map(s => `<li class="flex items-center"><i class="fa-solid fa-arrow-trend-up text-teal-600 mr-2"></i>${s}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between backdrop-blur-md border border-slate-800 card-dark-hover">
                        <div>
                            <h3 class="text-sm font-bold text-cyan-400 flex items-center mb-4">
                                <i class="fa-solid fa-route mr-2"></i> NEP-2020 Fresher Career Roadmap
                            </h3>
                            <div class="space-y-4">
                                ${(user.assessment.roadmap || []).map((step) => `
                                    <div class="border-l-2 border-cyan-400/60 pl-3 relative">
                                        <span class="text-[10px] font-bold text-cyan-300 block uppercase">${step.phase}</span>
                                        <h5 class="text-xs font-bold text-white">${step.title}</h5>
                                        <p class="text-[11px] text-slate-300 mt-0.5">${step.desc}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                            Aligned with National Higher Education Qualifications Framework (NHEQF Level 7).
                        </div>
                    </div>
                </div>
                ${rejectionsHtml}
            </div>
        `;
    },

    // ==================== COURSES & 20-Q ASSESSMENTS TAB ====================
    renderStudentCoursesTab: function (user) {
        const domainCourses = DB.courses.filter(c => c.domain === user.domain || c.domain === 'engineering');
        const userDomainLabel = (user.domain || 'ayush').toUpperCase();
        const aptHistory = user.testHistory ? user.testHistory['aptitude'] : null;
        const roleHistory = user.testHistory ? user.testHistory['role'] : null;

        return `
            <div class="space-y-6">
                <!-- 20-Question Mandatory Assessments Section with Retake Capability -->
                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/70 p-6 space-y-4">
                    <div class="flex flex-wrap justify-between items-center gap-2 border-b border-cyan-100 pb-3">
                        <div>
                            <h3 class="text-base font-bold text-slate-800 flex items-center">
                                <i class="fa-solid fa-clipboard-check text-cyan-600 mr-2"></i> National 20-Question Skill Assessments
                            </h3>
                            <p class="text-xs text-slate-500">Dynamic question battery with per-user randomization, downloadable score transcripts, and retake support.</p>
                        </div>
                        <span class="text-xs bg-teal-50 text-teal-800 px-3 py-1 rounded-full font-semibold border border-teal-200">
                            <i class="fa-solid fa-bolt text-teal-600 mr-1"></i> Active Domain: ${userDomainLabel}
                        </span>
                    </div>

                    <div class="grid md:grid-cols-2 gap-5">
                        <!-- Assessment 1: General Aptitude -->
                        <div class="border border-cyan-200/60 rounded-2xl p-5 card-hover bg-white/90 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Test 1 • All Streams</span>
                                    ${aptHistory ? `<span class="bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full"><i class="fa-solid fa-check mr-1"></i> Last Score: ${aptHistory.score}/20 (${aptHistory.percentage}%)</span>` : '<span class="text-cyan-700 text-xs font-bold"><i class="fa-regular fa-clock mr-1"></i> 20 Questions</span>'}
                                </div>
                                <h4 class="font-bold text-slate-900 text-sm mb-1">National General Aptitude Assessment</h4>
                                <p class="text-xs text-slate-500 mb-2">Quantitative Ability, Logical Reasoning, Verbal Aptitude & Data Interpretation.</p>
                                <p class="text-xs text-slate-600 mb-4">Evaluates general cognitive readiness, problem-solving speed, and analytical precision.</p>
                            </div>
                            ${aptHistory ? `
                                <div class="flex gap-2">
                                    <button onclick="App.launchTest('aptitude')" class="flex-1 bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-full transition shadow-sm flex items-center justify-center gap-1.5">
                                        <i class="fa-solid fa-rotate-right text-[10px]"></i> Retake Assessment
                                    </button>
                                    <button onclick="App.viewTestHistory('aptitude')" class="px-4 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold py-2.5 rounded-full border border-cyan-200 transition">
                                        View Analysis
                                    </button>
                                </div>
                            ` : `
                                <button onclick="App.launchTest('aptitude')" class="w-full bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-full transition shadow-sm flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-play text-[10px]"></i> Launch Aptitude Assessment (20 Qs)
                                </button>
                            `}
                        </div>

                        <!-- Assessment 2: Career Domain Assessment -->
                        <div class="border border-teal-200/70 rounded-2xl p-5 card-hover bg-white/90 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Test 2 • ${userDomainLabel}</span>
                                    ${roleHistory ? `<span class="bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full"><i class="fa-solid fa-check mr-1"></i> Last Score: ${roleHistory.score}/20 (${roleHistory.percentage}%)</span>` : '<span class="text-teal-700 text-xs font-bold"><i class="fa-regular fa-clock mr-1"></i> 20 Questions</span>'}
                                </div>
                                <h4 class="font-bold text-slate-900 text-sm mb-1">${userDomainLabel} Role Competency Examination</h4>
                                <p class="text-xs text-slate-500 mb-2">Customized for ${user.targetRole || user.subDomain || user.domain}.</p>
                                <p class="text-xs text-slate-600 mb-4">Rigorous domain-specific technical scenarios benchmarked against NEP-2020 standards.</p>
                            </div>
                            ${roleHistory ? `
                                <div class="flex gap-2">
                                    <button onclick="App.launchTest('role')" class="flex-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-full transition shadow-sm flex items-center justify-center gap-1.5">
                                        <i class="fa-solid fa-rotate-right text-[10px]"></i> Retake Assessment
                                    </button>
                                    <button onclick="App.viewTestHistory('role')" class="px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold py-2.5 rounded-full border border-teal-200 transition">
                                        View Analysis
                                    </button>
                                </div>
                            ` : `
                                <button onclick="App.launchTest('role')" class="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-full transition shadow-sm flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-bolt text-[10px]"></i> Launch Career Assessment (20 Qs)
                                </button>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Learning Progress Widgets -->
                <div class="grid sm:grid-cols-3 gap-4">
                    <div class="glass-card rounded-2xl p-5 border border-cyan-200/60 shadow-sm flex flex-col justify-between card-hover">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-bold uppercase text-slate-500">Course Progress</span>
                            <span class="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">83% Completed</span>
                        </div>
                        <div class="flex items-baseline space-x-2 my-1">
                            <span class="text-2xl font-extrabold text-slate-900">83%</span>
                            <span class="text-xs text-slate-500">overall mastery</span>
                        </div>
                        <div class="w-full bg-slate-200/60 rounded-full h-2 mt-2">
                            <div class="bg-cyan-500 h-2 rounded-full" style="width: 83%"></div>
                        </div>
                    </div>

                    <div class="glass-card rounded-2xl p-5 border border-cyan-200/60 shadow-sm flex flex-col justify-between card-hover">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-bold uppercase text-slate-500">Learning Streak</span>
                            <span class="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full"><i class="fa-solid fa-fire text-teal-500 mr-1"></i> 14 Days</span>
                        </div>
                        <div class="flex items-baseline space-x-2 my-1">
                            <span class="text-2xl font-extrabold text-slate-900">14 Days</span>
                            <span class="text-xs text-teal-600 font-semibold">Active Streak</span>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-2">You're on fire! Next milestone at 20 days.</p>
                    </div>

                    <div class="glass-card rounded-2xl p-5 border border-cyan-200/60 shadow-sm flex flex-col justify-between card-hover">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-bold uppercase text-slate-500">Target Daily Goal</span>
                            <span class="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">45 Mins Daily</span>
                        </div>
                        <div class="flex items-baseline space-x-2 my-1">
                            <span class="text-2xl font-extrabold text-slate-900">38 / 45m</span>
                            <span class="text-xs text-slate-500">completed today</span>
                        </div>
                        <div class="w-full bg-slate-200/60 rounded-full h-2 mt-2">
                            <div class="bg-teal-600 h-2 rounded-full" style="width: 84%"></div>
                        </div>
                    </div>
                </div>

                <!-- Existing Recommended Curriculums -->
                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-6">
                    <div class="flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <h3 class="text-base font-bold text-slate-800 flex items-center">
                                <i class="fa-solid fa-book-open text-cyan-600 mr-2"></i> Recommended & Accredited Curriculums
                            </h3>
                            <p class="text-xs text-slate-500">Earn Academic Bank of Credits (ABC) upon passing timed assessments.</p>
                        </div>
                        <span class="text-xs bg-cyan-50 text-cyan-800 px-3 py-1 rounded-full font-semibold border border-cyan-200">
                            ${domainCourses.length} Tailored Courses Available
                        </span>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        ${domainCourses.map(c => `
                            <div class="border border-cyan-200/50 rounded-2xl p-5 card-hover bg-white/80 flex flex-col justify-between">
                                <div>
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">${c.domain}</span>
                                        <span class="text-rose-600 text-xs font-bold"><i class="fa-regular fa-clock mr-1"></i> Deadline: ${c.deadline}</span>
                                    </div>
                                    <h4 class="font-bold text-slate-800 text-sm mb-1">${c.title}</h4>
                                    <p class="text-xs text-slate-500 mb-2">Instructor: ${c.author} • <strong class="text-teal-700">${c.nepCredits} NEP Credits</strong></p>
                                    <p class="text-xs text-slate-600 mb-3">${c.description}</p>
                                </div>
                                <div class="pt-3 border-t border-cyan-100 flex justify-between items-center">
                                    <span class="text-xs font-semibold text-slate-500">${c.quiz ? c.quiz.length : 0} Interactive Quiz Questions</span>
                                    <button onclick="App.startCourseQuiz(${c.id})" class="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition shadow-sm">
                                        Attempt Quiz & Certify &rarr;
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // ==================== 20-QUESTION TEST RUNTIME ENGINE ====================
    launchTest: function (testType) {
        const user = DB.currentUser;
        if (!user) return;

        const shuffledQuestions = getShuffledTestQuestions(user.id || user.email, testType, user.domain || 'ayush');
        this.activeTestSession = {
            type: testType,
            domain: user.domain || 'ayush',
            questions: shuffledQuestions,
            answers: {},
            currentIndex: 0
        };

        this.renderTestStep();
    },

    viewTestHistory: function (testType) {
        const user = DB.currentUser;
        if (user && user.testHistory && user.testHistory[testType]) {
            this.lastTestResult = user.testHistory[testType];
            this.renderTestAnalysis(user.testHistory[testType]);
        }
    },

    renderTestStep: function () {
        const session = this.activeTestSession;
        if (!session) return;

        const q = session.questions[session.currentIndex];
        const total = session.questions.length;
        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="max-w-3xl mx-auto glass-card rounded-2xl shadow-xl border border-cyan-200/70 p-8 relative my-8 framer-reveal">
                ${this.getCloseButton('App.render()')}
                
                <div class="flex items-center justify-between border-b border-cyan-100 pb-4 mb-6 pr-6">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-widest text-cyan-600">
                            ${session.type === 'aptitude' ? 'National General Aptitude Battery' : `${session.domain.toUpperCase()} Career Assessment`}
                        </span>
                        <h2 class="text-xl font-bold text-slate-800 mt-0.5">Question ${session.currentIndex + 1} of ${total}</h2>
                    </div>
                    <span class="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full">
                        Answered: <strong>${Object.keys(session.answers).length}</strong> / ${total}
                    </span>
                </div>

                <div class="mb-6">
                    <span class="text-xs font-bold text-teal-700 uppercase tracking-wide block mb-1.5">${q.category}</span>
                    <div class="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 text-sm font-semibold text-slate-800 leading-relaxed">
                        ${q.q}
                    </div>
                </div>

                <div class="space-y-3 mb-8">
                    ${q.options.map((opt, idx) => {
            const selected = session.answers[q.id] === idx;
            return `
                            <button onclick="App.selectTestAnswer('${q.id}', ${idx})" class="w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center space-x-3 ${selected ? 'bg-cyan-100/70 border-cyan-500 text-cyan-950 font-bold shadow-sm' : 'bg-white/90 border-slate-200 hover:bg-cyan-50/40 text-slate-700'}">
                                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selected ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'}">
                                    ${String.fromCharCode(65 + idx)}
                                </span>
                                <span>${opt}</span>
                            </button>
                        `;
        }).join('')}
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-cyan-100">
                    <button onclick="App.navTest(-1)" ${session.currentIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-400 rounded-full"' : 'class="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"'}>
                        &larr; Previous Question
                    </button>

                    ${session.currentIndex === total - 1 ? `
                        <button onclick="App.submitTestSession()" class="px-6 py-2.5 rounded-full text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-md transition flex items-center gap-1.5">
                            <i class="fa-solid fa-check"></i> Submit Test & View Analysis
                        </button>
                    ` : `
                        <button onclick="App.navTest(1)" class="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-full transition shadow-sm flex items-center gap-1.5">
                            Next Question &rarr;
                        </button>
                    `}
                </div>
            </div>
        `;
    },

    selectTestAnswer: function (qId, optIdx) {
        if (!this.activeTestSession) return;
        this.activeTestSession.answers[qId] = optIdx;
        this.renderTestStep();
    },

    navTest: function (delta) {
        if (!this.activeTestSession) return;
        const newIdx = this.activeTestSession.currentIndex + delta;
        if (newIdx >= 0 && newIdx < this.activeTestSession.questions.length) {
            this.activeTestSession.currentIndex = newIdx;
            this.renderTestStep();
        }
    },

    submitTestSession: function () {
        const session = this.activeTestSession;
        if (!session) return;

        let correct = 0;
        const catStats = {};
        const review = [];

        session.questions.forEach(q => {
            const userChoice = session.answers[q.id];
            const isCorrect = userChoice === q.answer;
            if (isCorrect) correct++;

            if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 };
            catStats[q.category].total++;
            if (isCorrect) catStats[q.category].correct++;

            review.push({
                question: q.q,
                category: q.category,
                userChoiceText: userChoice !== undefined ? q.options[userChoice] : 'Not Answered',
                correctChoiceText: q.options[q.answer],
                isCorrect: isCorrect,
                explanation: q.explanation
            });
        });

        const total = session.questions.length;
        const percentage = Math.round((correct / total) * 100);

        const strengths = [];
        const weaknesses = [];
        for (const [cat, data] of Object.entries(catStats)) {
            const pct = Math.round((data.correct / data.total) * 100);
            if (pct >= 75) {
                strengths.push({ category: cat, percentage: pct });
            } else {
                weaknesses.push({ category: cat, percentage: pct });
            }
        }

        const testResult = {
            testType: session.type,
            domain: session.domain,
            score: correct,
            total: total,
            percentage: percentage,
            strengths: strengths,
            weaknesses: weaknesses,
            review: review
        };

        this.lastTestResult = testResult;

        // Persist in user session history
        const user = DB.currentUser;
        if (user) {
            if (!user.testHistory) user.testHistory = {};
            user.testHistory[session.type] = testResult;
        }

        this.renderTestAnalysis(testResult);
        this.showToast('Test successfully submitted! Review your score analysis below.', 'success');
    },

    downloadScoreReport: function () {
        const res = this.lastTestResult;
        if (!res) return;
        const user = DB.currentUser || { name: "Student", apaarId: "N/A" };

        let content = `========================================================================\n`;
        content += `      SKILLBRIDGE NATIONAL ASSESSMENT & SCORE DIAGNOSTIC REPORT         \n`;
        content += `         Aligned with Ministry of Education & NEP-2020 Framework        \n`;
        content += `========================================================================\n\n`;
        content += `Candidate Name     : ${user.name}\n`;
        content += `APAAR / ABC ID     : ${user.apaarId || '8942-7712-4401'}\n`;
        content += `Assessment Type    : ${res.testType === 'aptitude' ? 'National General Aptitude Test' : res.domain.toUpperCase() + ' Role Competency Examination'}\n`;
        content += `Date Completed     : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
        content += `Status             : COMPLETED & SUBMITTED\n\n`;
        content += `------------------------------------------------------------------------\n`;
        content += `SCORE SUMMARY\n`;
        content += `------------------------------------------------------------------------\n`;
        content += `Total Score        : ${res.score} / ${res.total} (${res.percentage}%)\n`;
        content += `Competency Tier    : ${res.percentage >= 75 ? 'Proficient (NHEQF Level 7)' : (res.percentage >= 50 ? 'Intermediate (NHEQF Level 5.5)' : 'Foundational (NHEQF Level 4.5)')}\n`;
        content += `NEP Credits Status : ${res.percentage >= 60 ? 'ELIGIBLE (+4 Credits)' : 'REQUIRES UPSKILLING'}\n\n`;
        content += `------------------------------------------------------------------------\n`;
        content += `WHERE YOU ARE GOOD (STRENGTHS >= 75%)\n`;
        content += `------------------------------------------------------------------------\n`;
        if (res.strengths.length > 0) {
            res.strengths.forEach(s => { content += `• ${s.category}: ${s.percentage}%\n`; });
        } else {
            content += `• No categories scored >= 75%. Comprehensive review recommended.\n`;
        }
        content += `\n------------------------------------------------------------------------\n`;
        content += `AREAS NEEDING IMPROVEMENT (GAPS < 75%)\n`;
        content += `------------------------------------------------------------------------\n`;
        if (res.weaknesses.length > 0) {
            res.weaknesses.forEach(w => { content += `• ${w.category}: ${w.percentage}% [ACTION: Focus study on this competency]\n`; });
        } else {
            content += `• Outstanding! Zero topic gaps identified.\n`;
        }
        content += `\n------------------------------------------------------------------------\n`;
        content += `QUESTION-BY-QUESTION BREAKDOWN\n`;
        content += `------------------------------------------------------------------------\n`;
        res.review.forEach((item, idx) => {
            content += `\nQ${idx + 1}: ${item.question}\n`;
            content += `Your Answer   : ${item.userChoiceText} [${item.isCorrect ? 'CORRECT' : 'INCORRECT'}]\n`;
            content += `Correct Answer: ${item.correctChoiceText}\n`;
            content += `Rationale     : ${item.explanation}\n`;
        });
        content += `\n========================================================================\n`;
        content += `End of Verified SkillBridge Diagnostic Report.\n`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SkillBridge_${res.testType}_ScoreReport_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.showToast('Score Report downloaded successfully!', 'success');
    },

    renderTestAnalysis: function (results) {
        this.lastTestResult = results;
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="max-w-4xl mx-auto glass-card rounded-2xl shadow-xl border border-cyan-200/70 p-8 relative my-8 framer-reveal">
                ${this.getCloseButton('App.render()')}
                
                <!-- Submission Header -->
                <div class="border-b border-cyan-100 pb-5 mb-6 pr-6">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-2">
                        <i class="fa-solid fa-circle-check text-teal-600"></i> Test Completed & Submitted
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900">
                        ${results.testType === 'aptitude' ? 'National General Aptitude' : results.domain.toUpperCase() + ' Competency'} Score & Diagnostic Analysis
                    </h2>
                    <p class="text-xs text-slate-500 mt-1">Detailed evaluation of analytical proficiencies and targeted areas requiring academic improvement.</p>
                </div>

                <!-- Score Summary Cards -->
                <div class="grid sm:grid-cols-3 gap-4 mb-6">
                    <div class="p-4 bg-white/90 rounded-2xl border border-cyan-100 text-center shadow-sm">
                        <span class="text-xs font-bold text-slate-500 uppercase block mb-1">Final Score</span>
                        <span class="text-3xl font-extrabold text-cyan-700">${results.score} / ${results.total}</span>
                        <span class="text-[11px] text-slate-500 block mt-1">${results.percentage}% Aggregate</span>
                    </div>

                    <div class="p-4 bg-white/90 rounded-2xl border border-cyan-100 text-center shadow-sm">
                        <span class="text-xs font-bold text-slate-500 uppercase block mb-1">Competency Level</span>
                        <span class="text-3xl font-extrabold ${results.percentage >= 75 ? 'text-teal-700' : (results.percentage >= 50 ? 'text-amber-600' : 'text-rose-600')}">
                            ${results.percentage >= 75 ? 'Proficient' : (results.percentage >= 50 ? 'Intermediate' : 'Foundational')}
                        </span>
                        <span class="text-[11px] text-slate-500 block mt-1">NHEQF Level Aligned</span>
                    </div>

                    <div class="p-4 bg-white/90 rounded-2xl border border-cyan-100 text-center shadow-sm">
                        <span class="text-xs font-bold text-slate-500 uppercase block mb-1">APAAR Credit Standing</span>
                        <span class="text-3xl font-extrabold text-slate-800">${results.percentage >= 60 ? '+4 Credits' : 'Review Req.'}</span>
                        <span class="text-[11px] text-slate-500 block mt-1">${results.percentage >= 60 ? 'Eligible for ABC Record' : 'Upskilling Required'}</span>
                    </div>
                </div>

                <!-- Strengths vs Gap Areas (Where good vs lacking) -->
                <div class="grid md:grid-cols-2 gap-5 mb-8">
                    <!-- Where they are good -->
                    <div class="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-5 shadow-sm">
                        <h4 class="text-xs font-bold text-teal-900 uppercase tracking-wide mb-3 flex items-center">
                            <i class="fa-solid fa-circle-check text-teal-600 mr-2 text-sm"></i> Where You Are Good (Score &ge; 75%)
                        </h4>
                        ${results.strengths.length > 0 ? `
                            <div class="space-y-2">
                                ${results.strengths.map(s => `
                                    <div class="flex justify-between items-center bg-white/90 p-2.5 rounded-xl border border-teal-100 text-xs">
                                        <span class="font-semibold text-slate-800">${s.category}</span>
                                        <span class="font-extrabold text-teal-700">${s.percentage}%</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="text-xs text-slate-500 italic">No individual topic scored &ge; 75%. Comprehensive review advised.</p>'}
                    </div>

                    <!-- Where they are lacking -->
                    <div class="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 shadow-sm">
                        <h4 class="text-xs font-bold text-rose-900 uppercase tracking-wide mb-3 flex items-center">
                            <i class="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-sm"></i> Areas Needing Improvement (Score &lt; 75%)
                        </h4>
                        ${results.weaknesses.length > 0 ? `
                            <div class="space-y-2">
                                ${results.weaknesses.map(w => `
                                    <div class="flex justify-between items-center bg-white/90 p-2.5 rounded-xl border border-rose-100 text-xs">
                                        <span class="font-semibold text-slate-800">${w.category}</span>
                                        <span class="font-extrabold text-rose-600">${w.percentage}% (Focus Here)</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="text-xs text-teal-700 font-semibold">Flawless performance! Zero topic deficiencies identified.</p>'}
                    </div>
                </div>

                <!-- Detailed Question Review & Rationales -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-slate-900 flex items-center">
                        <i class="fa-solid fa-list-check text-cyan-600 mr-2"></i> Comprehensive Question Review & Rationales
                    </h4>
                    <div class="space-y-3">
                        ${results.review.map((item, idx) => `
                            <div class="p-4 rounded-xl border ${item.isCorrect ? 'border-teal-200 bg-white/80' : 'border-rose-200 bg-rose-50/30'}">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-bold text-slate-800">Q${idx + 1}. ${item.question}</span>
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isCorrect ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}">
                                        ${item.isCorrect ? 'CORRECT' : 'INCORRECT'}
                                    </span>
                                </div>
                                <div class="grid sm:grid-cols-2 gap-2 text-xs mb-2 text-slate-600">
                                    <div>Your Answer: <strong class="${item.isCorrect ? 'text-teal-700' : 'text-rose-600'}">${item.userChoiceText}</strong></div>
                                    <div>Correct Answer: <strong class="text-teal-700">${item.correctChoiceText}</strong></div>
                                </div>
                                <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                                    <strong class="text-slate-800">Rationale:</strong> ${item.explanation}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer Action Buttons: Back, Download Report, and Retake -->
                <div class="mt-8 pt-5 border-t border-cyan-100 flex flex-wrap items-center justify-between gap-3">
                    <button onclick="App.render()" class="px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                        &larr; Back to Courses
                    </button>
                    
                    <div class="flex flex-wrap gap-2.5">
                        <button onclick="App.downloadScoreReport()" class="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition flex items-center gap-1.5">
                            <i class="fa-solid fa-download"></i> Download Score Report
                        </button>
                        <button onclick="App.launchTest('${results.testType}')" class="px-5 py-2.5 rounded-full text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-md transition flex items-center gap-1.5">
                            <i class="fa-solid fa-rotate-right"></i> Retake Assessment (New Questions)
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderStudentGithubTab: function (user) {
        return `
            <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-6">
                <div class="flex justify-between items-center border-b border-cyan-100 pb-4">
                    <div>
                        <h3 class="text-base font-bold text-slate-800 flex items-center">
                            <i class="fa-brands fa-github text-slate-900 mr-2"></i> Live GitHub Code Quality Engine
                        </h3>
                        <p class="text-xs text-slate-500">Automated evaluation of commit velocity, test coverage, and modular code structures.</p>
                    </div>
                    <button onclick="App.verifyGithubRepo()" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm">
                        <i class="fa-solid fa-arrows-rotate mr-1"></i> Trigger Deep Scan
                    </button>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 text-center card-hover">
                        <span class="text-xs font-bold text-slate-500 uppercase block">Linked Repository</span>
                        <a href="${user.github || '#'}" target="_blank" class="text-xs font-bold text-cyan-600 underline truncate block mt-1">
                            ${user.github || 'No Link Added'}
                        </a>
                    </div>
                    <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 text-center card-hover">
                        <span class="text-xs font-bold text-slate-500 uppercase block">Git Audit Status</span>
                        <span class="text-xs font-bold text-teal-600 block mt-1"><i class="fa-solid fa-circle-check"></i> Verified Modular</span>
                    </div>
                    <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 text-center card-hover">
                        <span class="text-xs font-bold text-slate-500 uppercase block">Code Audit Score</span>
                        <span class="text-xs font-bold text-slate-800 block mt-1">+8 Pts Earned</span>
                    </div>
                </div>

                <div class="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs space-y-2">
                    <div class="text-cyan-400 font-bold">$ git-audit --target=${user.github || 'user-repo'} --deep-scan</div>
                    <div class="text-slate-400">> Fetching repository AST and metadata...</div>
                    <div class="text-teal-400">> 0 Syntax Errors | 0 Security Vulnerabilities Found</div>
                    <div class="text-slate-300">> Test suite coverage estimated at ~84.5%</div>
                    <div class="text-cyan-300">> Summary: ${user.assessment.repoAudit}</div>
                </div>
            </div>
        `;
    },

    renderStudentInterviewTab: function (user) {
        const domainQuestions = INTERVIEW_QUESTIONS_BANK[user.domain] || INTERVIEW_QUESTIONS_BANK.ayush;

        return `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden border border-cyan-900/50">
                    <div class="relative z-10 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <div class="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full text-[11px] font-semibold mb-2">
                                <i class="fa-solid fa-bolt text-cyan-400"></i>
                                <span>Powered by PICT.live & AI Mock Framework</span>
                            </div>
                            <h2 class="text-2xl font-bold tracking-tight">The Interview Prep Room & Success Stories</h2>
                            <p class="text-xs text-slate-300 max-w-2xl mt-1">
                                Experience live AI mock evaluations, speech pace diagnostics, and get inspired by verified placement success stories from top national institutions.
                            </p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button onclick="App.showToast('Launching live peer room sync...', 'success')" class="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-md flex items-center">
                                <i class="fa-solid fa-video mr-2"></i> Join Live Room
                            </button>
                        </div>
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-slate-800 flex items-center">
                            <i class="fa-solid fa-star text-cyan-500 mr-2"></i> Candidate Success Stories & Placements
                        </h3>
                        <span class="text-xs text-slate-500 font-medium">Verified by National Placement Cell</span>
                    </div>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-white/80 border border-cyan-100 rounded-2xl p-4 card-hover relative">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-sm">AS</div>
                                <div>
                                    <h4 class="text-xs font-bold text-slate-900">Ananya Sen</h4>
                                    <p class="text-[10px] text-teal-700 font-semibold">Placed at Microsoft • ₹45 LPA</p>
                                </div>
                            </div>
                            <p class="text-xs text-slate-600 italic">
                                "The AI mock interview practice and technical questionnaire simulations on SkillBridge gave me the exact confidence needed to crack system design rounds!"
                            </p>
                            <div class="mt-3 pt-2 border-t border-cyan-50 flex justify-between text-[10px] text-slate-400">
                                <span>APAAR Verified</span>
                                <span>Batch 2026</span>
                            </div>
                        </div>

                        <div class="bg-white/80 border border-cyan-100 rounded-2xl p-4 card-hover relative">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">RK</div>
                                <div>
                                    <h4 class="text-xs font-bold text-slate-900">Rohan Kulkarni</h4>
                                    <p class="text-[10px] text-teal-700 font-semibold">Placed at Dabur R&D • ₹14 LPA</p>
                                </div>
                            </div>
                            <p class="text-xs text-slate-600 italic">
                                "Practicing AYUSH clinical standardization inquiries and answering via the prep room simulated real board evaluations flawlessly."
                            </p>
                            <div class="mt-3 pt-2 border-t border-cyan-50 flex justify-between text-[10px] text-slate-400">
                                <span>APAAR Verified</span>
                                <span>Batch 2026</span>
                            </div>
                        </div>

                        <div class="bg-white/80 border border-cyan-100 rounded-2xl p-4 card-hover relative">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm">NP</div>
                                <div>
                                    <h4 class="text-xs font-bold text-slate-900">Neha Patil</h4>
                                    <p class="text-[10px] text-teal-700 font-semibold">Placed at Amazon • ₹38 LPA</p>
                                </div>
                            </div>
                            <p class="text-xs text-slate-600 italic">
                                "The resume optimization and live peer feedback rooms are game changers for campus recruitment."
                            </p>
                            <div class="mt-3 pt-2 border-t border-cyan-50 flex justify-between text-[10px] text-slate-400">
                                <span>APAAR Verified</span>
                                <span>Batch 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-6">
                    <div class="flex flex-wrap justify-between items-center border-b border-cyan-100 pb-4 gap-2">
                        <div>
                            <h3 class="text-base font-bold text-slate-800 flex items-center">
                                <i class="fa-solid fa-video text-rose-600 mr-2"></i> AI Simulated Interview Room & Speech Diagnostics
                            </h3>
                            <p class="text-xs text-slate-500">Domain-tailored technical inquiries for target goal: <strong class="text-slate-700">${user.targetRole || 'Selected Domain'}</strong>.</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <span class="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200">
                                <i class="fa-solid fa-bolt text-cyan-600 mr-1"></i> AI Stand-Out Match: ${user.matchScore || 88}%
                            </span>
                            <span class="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                                <span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse mr-2"></span> AI Active Session
                            </span>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-6">
                        <div class="bg-slate-900 rounded-2xl p-4 text-white flex flex-col justify-between h-72 relative overflow-hidden shadow-inner border border-slate-800">
                            <div class="flex justify-between items-center z-10">
                                <span class="bg-rose-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white tracking-wide">Camera Ready</span>
                                <span class="text-xs text-slate-400 font-mono">HD 1080p • Audio Active</span>
                            </div>

                            <div class="my-auto text-center z-10">
                                <div class="w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-400 mx-auto flex items-center justify-center text-2xl text-cyan-400 mb-2 shadow-lg animate-pulse">
                                    <i class="fa-solid fa-user-tie"></i>
                                </div>
                                <p class="text-xs text-slate-300 font-medium">AI Mock Interviewer Listening...</p>
                            </div>

                            <div class="flex justify-center space-x-3 z-10">
                                <button onclick="App.showToast('Microphone toggled', 'info')" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs text-slate-200 transition">
                                    <i class="fa-solid fa-microphone"></i>
                                </button>
                                <button onclick="App.showToast('Camera toggled', 'info')" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs text-slate-200 transition">
                                    <i class="fa-solid fa-video"></i>
                                </button>
                                <button onclick="App.showToast('Recording AI session...', 'success')" class="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white transition flex items-center">
                                    <i class="fa-solid fa-circle mr-1.5 text-[8px] animate-ping"></i> Record Answer
                                </button>
                            </div>
                        </div>

                        <div class="lg:col-span-2 space-y-4">
                            <div class="flex justify-between items-center">
                                <h4 class="text-xs font-bold uppercase text-slate-500">Domain Technical Inquiries (${user.domain.toUpperCase()})</h4>
                                <button onclick="App.showPopupAiStandout()" class="text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200 transition">
                                    <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> AI Tips to Stand Out
                                </button>
                            </div>
                            <div class="space-y-3">
                                ${domainQuestions.map((q, idx) => `
                                    <div class="p-3.5 bg-white/80 rounded-2xl border border-cyan-100 space-y-2 card-hover">
                                        <div class="flex justify-between items-start">
                                            <span class="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full">Question ${idx + 1}</span>
                                            <button onclick="App.showToast('Generating AI feedback for Q${idx + 1} (Match score: ${user.matchScore || 88}%)...', 'info')" class="text-[11px] font-bold text-teal-700 hover:underline">
                                                <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> AI Feedback (${user.matchScore || 88}% Match)
                                            </button>
                                        </div>
                                        <p class="text-xs font-semibold text-slate-800">${q}</p>
                                        <textarea rows="2" placeholder="Type or speak your answer here to simulate interview room evaluation..." class="w-full text-xs p-2.5 rounded-xl"></textarea>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    showPopupAiStandout: function () {
        this.showToast('AI Tip: Use STAR method and cite your APAAR verified credentials to stand out by 35%!', 'success');
    },

    renderStudentResumeTab: function (user) {
        const linkedInHtml = user.linkedin ? ` | <a href="${user.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-600 transition inline-flex items-center"><i class="fa-brands fa-linkedin mx-1"></i> LinkedIn</a>` : '';

        return `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-wrap justify-between items-center gap-4 border border-cyan-900/40">
                    <div>
                        <div class="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3 py-1 rounded-full text-[11px] font-semibold mb-2">
                            <i class="fa-solid fa-sparkles text-cyan-400"></i>
                            <span>SIH-2026 Coral AI Resume Engine Active</span>
                        </div>
                        <h2 class="text-2xl font-bold tracking-tight">Smart Resume & AI Optimization Hub</h2>
                        <p class="text-xs text-slate-300 max-w-xl mt-1">
                            Upload your existing resume to run instant ATS scoring, AI-suggested bullet improvements, and automatic structural formatting.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <label class="cursor-pointer bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-md flex items-center">
                            <i class="fa-solid fa-upload mr-2"></i> Upload Full Resume (PDF/DOCX)
                            <input type="file" onchange="App.handleResumeUpload(event)" class="hidden" accept=".pdf,.docx,.txt">
                        </label>
                        <button onclick="App.runAiResumeAudit()" class="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-md flex items-center">
                            <i class="fa-solid fa-wand-magic-sparkles mr-2"></i> AI-Suggest Changes
                        </button>
                        <button onclick="App.runAiMakeChanges()" class="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-md flex items-center">
                            <i class="fa-solid fa-bolt mr-2"></i> AI-Make Changes Instantly
                        </button>
                    </div>
                </div>

                <div id="ai-resume-feedback-box" class="hidden glass-card rounded-2xl shadow-sm border border-teal-300/80 p-6 space-y-4 bg-teal-50/20">
                    <div class="flex justify-between items-center border-b border-teal-200/60 pb-3">
                        <h3 class="text-sm font-bold text-teal-900 flex items-center">
                            <i class="fa-solid fa-circle-check text-teal-600 mr-2"></i> AI Resume Audit & Suggested Improvements (SIH-2026 Coral Engine)
                        </h3>
                        <span class="bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full">ATS Score: 92/100</span>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4 text-xs text-slate-700">
                        <div class="bg-white/90 p-4 rounded-2xl border border-teal-200/60 space-y-2">
                            <h4 class="font-bold text-slate-900 flex items-center"><i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1.5"></i> Suggested Enhancements:</h4>
                            <ul class="list-disc list-inside space-y-1 text-slate-600">
                                <li>Quantify impact metrics in project bullet points (e.g., "Improved API response time by 40%").</li>
                                <li>Add missing keywords: <em>APAAR Verified, Microservices, CI/CD Pipeline</em>.</li>
                                <li>Ensure standard single-column chronological format for government portal parsers.</li>
                            </ul>
                        </div>
                        <div class="bg-white/90 p-4 rounded-2xl border border-teal-200/60 space-y-2">
                            <h4 class="font-bold text-slate-900 flex items-center"><i class="fa-solid fa-check text-teal-600 mr-1.5"></i> Automatically Applied Fixes:</h4>
                            <ul class="list-disc list-inside space-y-1 text-slate-600">
                                <li>Header updated with verified APAAR ID badge <code>${user.apaarId || '8942-7712-4401'}</code>.</li>
                                <li>Active skill tags aligned with target role <strong class="text-slate-800">${user.targetRole || 'Professional'}</strong>.</li>
                                <li>Academic credit summary integrated at top-right.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-6">
                    <div class="flex justify-between items-center border-b border-cyan-100 pb-4">
                        <div>
                            <h3 class="text-base font-bold text-slate-800 flex items-center">
                                <i class="fa-solid fa-file-invoice text-teal-600 mr-2"></i> Verified NEP Smart Resume & Portfolio Preview
                            </h3>
                            <p class="text-xs text-slate-500">Government-verified digital credentials linked with APAAR ID.</p>
                        </div>
                        <button onclick="window.print()" class="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm">
                            <i class="fa-solid fa-print mr-1"></i> Export / Print Resume
                        </button>
                    </div>

                    <div class="bg-white p-6 rounded-2xl border border-cyan-100 shadow-sm space-y-5">
                        <div class="flex justify-between items-start border-b border-slate-200 pb-4">
                            <div class="flex items-center space-x-4">
                                ${this.getAvatarHtml(user, 'w-16 h-16', 'text-2xl')}
                                <div>
                                    <h2 class="text-2xl font-bold text-slate-900">${user.name}</h2>
                                    <p class="text-xs font-semibold text-cyan-700 uppercase">${user.subDomain || user.domain}</p>
                                    <p class="text-xs text-slate-600 font-medium mt-0.5">Target Goal: <strong class="text-slate-800">${user.targetRole || 'Not Specified'}</strong> (${user.matchScore || user.assessment.score}% Match)</p>
                                    <p class="text-xs text-slate-500 mt-1">
                                        <i class="fa-solid fa-envelope mr-1"></i> ${user.email} 
                                        ${user.domain === 'engineering' ? '| <i class="fa-brands fa-github mr-1"></i> ' + (user.github || 'N/A') : ''}
                                        ${linkedInHtml}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="inline-block bg-teal-50 text-teal-800 text-[11px] font-bold px-3 py-1 rounded-full border border-teal-200">
                                    APAAR Verified: ${user.apaarId || '8942-7712-4401'}
                                </span>
                                <p class="text-xs font-bold text-slate-700 mt-1">${user.abcCredits || 24} ABC Credits Accumulated</p>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2">Verified Technical Skills</h4>
                            <div class="flex flex-wrap gap-1.5">
                                ${(user.skills || []).map(s => `<span class="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-full border border-slate-200">${s}</span>`).join('')}
                            </div>
                        </div>

                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2">Validated Academic Projects</h4>
                            <ul class="list-disc list-inside text-xs text-slate-700 space-y-1">
                                ${(user.projects || []).map(p => `<li><strong>${p}</strong></li>`).join('')}
                            </ul>
                        </div>

                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2">Publications & Research Papers</h4>
                            <ul class="list-disc list-inside text-xs text-slate-700 space-y-1">
                                ${(user.researchPapers || ['None listed']).map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    handleResumeUpload: function (e) {
        const file = e.target.files[0];
        if (file) {
            this.showToast(`Successfully uploaded "${file.name}"! AI parsing initiated.`, 'success');
            setTimeout(() => {
                const feedbackBox = document.getElementById('ai-resume-feedback-box');
                if (feedbackBox) feedbackBox.classList.remove('hidden');
                this.showToast('AI resume parse & keyword extraction completed!', 'success');
            }, 1000);
        }
    },

    runAiResumeAudit: function () {
        this.showToast('Running AI keyword & ATS compatibility analysis...', 'info');
        setTimeout(() => {
            const feedbackBox = document.getElementById('ai-resume-feedback-box');
            if (feedbackBox) feedbackBox.classList.remove('hidden');
            this.showToast('AI suggestions generated successfully!', 'success');
        }, 800);
    },

    runAiMakeChanges: function () {
        this.showToast('Applying AI structural enhancements and formatting fixes...', 'info');
        setTimeout(() => {
            const feedbackBox = document.getElementById('ai-resume-feedback-box');
            if (feedbackBox) feedbackBox.classList.remove('hidden');
            this.showToast('Resume successfully optimized by SIH-2026 Coral Engine!', 'success');
        }, 1000);
    },

    renderStudentOpportunitiesTab: function (user) {
        const domainInternships = DB.internships.filter(i => i.domain === user.domain || i.domain === 'engineering');
        const domainPlacements = DB.placements.filter(p => p.domain === user.domain || p.domain === 'engineering');
        const selectedJob = DB.selectedJob;

        return `
            <div class="space-y-6">
                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-6">
                    <div class="flex justify-between items-center border-b border-cyan-100 pb-3">
                        <div>
                            <h3 class="text-base font-bold text-slate-800 flex items-center">
                                <i class="fa-solid fa-briefcase text-cyan-600 mr-2"></i> Skill-Matched Internships & Placements
                            </h3>
                            <p class="text-xs text-slate-500">Click on any job or internship card to view full AI match breakdown, required skills, and APAAR quick application features.</p>
                        </div>
                        <span class="text-xs bg-cyan-50 text-cyan-800 px-3 py-1 rounded-full font-semibold border border-cyan-200">
                            ${domainInternships.length + domainPlacements.length} Active Postings
                        </span>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-700 mb-3 flex items-center">
                                <i class="fa-solid fa-laptop-code text-cyan-600 mr-2"></i> Internships
                            </h4>
                            <div class="space-y-3">
                                ${domainInternships.map(i => `
                                    <div onclick="App.selectJob('internship', ${i.id})" class="border border-cyan-100/80 rounded-2xl p-4 bg-white/80 card-hover cursor-pointer transition ${selectedJob && selectedJob.type === 'internship' && selectedJob.id === i.id ? 'ring-2 ring-cyan-500 bg-cyan-50/50' : ''}">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h5 class="font-bold text-slate-900 text-sm">${i.title}</h5>
                                                <p class="text-xs text-slate-500">${i.company} • ${i.location}</p>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 block">${i.stipend}</span>
                                                <span class="text-[10px] text-teal-700 font-bold mt-1 inline-block"><i class="fa-solid fa-bolt"></i> ${user.matchScore || 84}% Match</span>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-1.5 my-2.5">
                                            ${i.skills.map(s => `<span class="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full">${s}</span>`).join('')}
                                        </div>
                                        <div class="flex justify-between items-center text-xs pt-2 border-t border-cyan-50">
                                            <span class="text-slate-500">Duration: ${i.duration}</span>
                                            <span class="text-cyan-700 font-bold hover:underline">Popup Details &rarr;</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-700 mb-3 flex items-center">
                                <i class="fa-solid fa-award text-teal-600 mr-2"></i> Placements & Full-Time Jobs
                            </h4>
                            <div class="space-y-3">
                                ${domainPlacements.map(p => `
                                    <div onclick="App.selectJob('placement', ${p.id})" class="border border-cyan-100/80 rounded-2xl p-4 bg-white/80 card-hover cursor-pointer transition ${selectedJob && selectedJob.type === 'placement' && selectedJob.id === p.id ? 'ring-2 ring-teal-500 bg-teal-50/50' : ''}">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h5 class="font-bold text-slate-900 text-sm">${p.title}</h5>
                                                <p class="text-xs text-slate-500">${p.company} • ${p.location}</p>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 block">${p.salary}</span>
                                                <span class="text-[10px] text-teal-700 font-bold mt-1 inline-block"><i class="fa-solid fa-bolt"></i> ${user.matchScore || 88}% Match</span>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-1.5 my-2.5">
                                            ${p.skills.map(s => `<span class="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full">${s}</span>`).join('')}
                                        </div>
                                        <div class="flex justify-between items-center text-xs pt-2 border-t border-cyan-50">
                                            <span class="text-teal-700 font-semibold">Auto-Shortlist Eligible</span>
                                            <span class="text-teal-700 font-bold hover:underline">Popup Details &rarr;</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                ${selectedJob ? this.renderJobDetailModal(selectedJob, user) : ''}
            </div>
        `;
    },

    selectJob: function (type, id) {
        const list = type === 'internship' ? DB.internships : DB.placements;
        const job = list.find(item => item.id === id);
        if (job) {
            DB.selectedJob = { type, ...job };
            this.showToast(`Popped up details for ${job.title}`, 'info');

            const tabContainer = document.getElementById('student-tab-content');
            if (tabContainer && DB.currentUser) {
                tabContainer.innerHTML = this.renderCurrentStudentTabContent(DB.currentUser, 'opportunities');
            } else {
                this.render();
            }
        }
    },

    renderJobDetailModal: function (job, user) {
        const matchPct = user.matchScore || 88;
        return `
            <div class="glass-card rounded-2xl shadow-2xl border-2 border-cyan-500 p-6 space-y-6 relative animate-fadeIn framer-reveal">
                <button onclick="DB.selectedJob = null; App.setStudentTab('opportunities');" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                
                <div class="flex flex-wrap justify-between items-start gap-4 pr-10 border-b border-cyan-100 pb-4">
                    <div>
                        <span class="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">${job.type === 'internship' ? 'Internship Posting' : 'Full-Time Placement'}</span>
                        <h3 class="text-xl font-bold text-slate-900 mt-1">${job.title}</h3>
                        <p class="text-xs text-slate-600 font-medium mt-0.5">${job.company} • <i class="fa-solid fa-location-dot text-rose-600 ml-1 mr-0.5"></i> ${job.location}</p>
                    </div>
                    <div class="text-right flex flex-col items-end">
                        <span class="text-lg font-extrabold text-teal-700 block">${job.stipend || job.salary}</span>
                        <span class="inline-block mt-1 bg-cyan-100 text-cyan-900 text-xs font-extrabold px-3 py-1 rounded-full border border-cyan-300">
                            <i class="fa-solid fa-bolt text-cyan-600 mr-1"></i> AI Match: ${matchPct}%
                        </span>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-white/90 p-4 rounded-2xl border border-cyan-100 space-y-2">
                        <h4 class="text-xs font-bold uppercase text-slate-700 flex items-center"><i class="fa-solid fa-bullseye text-cyan-600 mr-1.5"></i> Role Description</h4>
                        <p class="text-xs text-slate-600 leading-relaxed">${job.description || 'Enterprise grade research and engineering position aligned with national quality frameworks.'}</p>
                    </div>
                    <div class="bg-white/90 p-4 rounded-2xl border border-cyan-100 space-y-2">
                        <h4 class="text-xs font-bold uppercase text-slate-700 flex items-center"><i class="fa-solid fa-list-check text-teal-600 mr-1.5"></i> Candidate Requirements</h4>
                        <ul class="list-disc list-inside text-xs text-slate-600 space-y-1">
                            ${(job.requirements || ['Relevant domain degree', 'Verified APAAR competency score > 75%', 'Strong collaborative portfolio']).map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-3 flex flex-col justify-between border border-slate-800">
                        <div>
                            <h4 class="text-xs font-bold uppercase text-cyan-400 flex items-center"><i class="fa-solid fa-wand-magic-sparkles mr-1.5"></i> AI Insights to Stand Out</h4>
                            <p class="text-[11px] text-slate-300 mt-1">
                                To stand out among applicants, highlight your experience with <strong>${job.skills[0] || 'Core Skills'}</strong> and attach your APAAR verified research badge.
                            </p>
                        </div>
                        <button onclick="App.applyOpportunity('${job.type === 'internship' ? 'Internship' : 'Placement'}', '${job.title}')" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-full text-xs transition shadow-md">
                            Apply with 1-Click APAAR &rarr;
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    applyOpportunity: function (type, title) {
        this.showToast(`Successfully applied to ${title} using APAAR profile!`, 'success');
        DB.selectedJob = null;
        this.setStudentTab('opportunities');
    },

    verifyGithubRepo: function () {
        this.showToast('Triggering GitHub AST inspection engine...', 'info');
        setTimeout(() => {
            this.showToast('Git audit completed! Repository static analysis verified.', 'success');
        }, 1200);
    },

    renderStudentOnboardingForm: function (user) {
        const currentDomain = user.domain || 'ayush';
        const preset = DOMAIN_PRESETS[currentDomain] || DOMAIN_PRESETS.ayush;

        return `
            <div class="max-w-3xl mx-auto glass-card rounded-2xl shadow-xl border border-cyan-200/70 p-8 relative mt-10 mb-10 framer-reveal">
                ${this.getCloseButton('App.logout()')}
                <div class="text-center mb-6 pr-6">
                    <span class="text-xs font-bold uppercase tracking-widest text-cyan-700">Step 1 of 1: Skill Profiling & National Verification</span>
                    <h2 class="text-2xl font-bold text-slate-800 mt-1">Complete Student Profile</h2>
                    <p class="text-xs text-slate-500 mt-1">Select your specialized discipline, link your APAAR credentials, research papers, and target career goal for automated AI evaluation.</p>
                </div>

                <form onsubmit="App.saveStudentProfile(event)" class="space-y-4">
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Academic / Medical Domain</label>
                            <select id="formDomain" required onchange="App.handleDomainChange(this.value)" class="w-full px-3.5 py-2 text-sm">
                                <option value="ayush" ${currentDomain === 'ayush' ? 'selected' : ''}>Medical (AYUSH)</option>
                                <option value="engineering" ${currentDomain === 'engineering' ? 'selected' : ''}>Engineering</option>
                                <option value="management" ${currentDomain === 'management' ? 'selected' : ''}>Management</option>
                                <option value="law" ${currentDomain === 'law' ? 'selected' : ''}>Law</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Specialization / Sub-field</label>
                            <input type="text" id="formSubDomain" required placeholder="e.g. Dravyaguna & Clinical Trials" value="${user.subDomain || preset.subDomain}" class="w-full px-3.5 py-2 text-sm">
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4 items-center">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Target Career Role / Goal</label>
                            <input type="text" id="formTargetRole" required placeholder="e.g. Senior Clinical AYUSH Researcher" value="${user.targetRole || preset.targetRole}" class="w-full px-3.5 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Profile Photo (Optional)</label>
                            <div class="flex items-center space-x-3">
                                <div id="profilePhotoPreview" class="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                                    ${user.profilePhoto ? `<img src="${user.profilePhoto}" class="w-full h-full object-cover">` : `<i class="fa-solid fa-user text-slate-400"></i>`}
                                </div>
                                <label class="cursor-pointer bg-white/90 px-3.5 py-1.5 border border-cyan-200 rounded-full text-[11px] font-semibold text-slate-700 hover:bg-cyan-50 transition shadow-sm">
                                    Upload Image
                                    <input type="file" class="hidden" accept="image/*" onchange="App.handleProfilePhotoUpload(event)">
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">APAAR / ABC Student ID</label>
                            <input type="text" id="formApaar" required value="${user.apaarId || '8942-7712-4401'}" placeholder="XXXX-XXXX-XXXX" class="w-full px-3.5 py-2 text-sm font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">GitHub URL (Optional for Non-Eng)</label>
                            <input type="url" id="formGithub" value="${user.github !== undefined ? user.github : preset.github}" placeholder="https://github.com/your-username" class="w-full px-3.5 py-2 text-sm">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-600 mb-1">LinkedIn Profile URL (Optional)</label>
                        <input type="text" id="formLinkedin" value="${user.linkedin !== undefined ? user.linkedin : (preset.linkedin || '')}" placeholder="https://linkedin.com/in/username" class="w-full px-3.5 py-2 text-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Research Publications / DOI (Comma Separated)</label>
                        <input type="text" id="formResearch" value="${(user.researchPapers && user.researchPapers.length > 0) ? user.researchPapers.join(', ') : preset.research}" placeholder="e.g. Phytochemical Analysis of Ashwagandha (DOI: 10.1016/ayush.2025)" class="w-full px-3.5 py-2 text-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Verified Technical Skills (Comma Separated)</label>
                        <input type="text" id="formSkills" required value="${(user.skills && user.skills.length > 0) ? user.skills.join(', ') : preset.skills}" placeholder="e.g. Herb Standardization, HPLC, Python, React" class="w-full px-3.5 py-2 text-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Key Live Projects (Comma Separated)</label>
                        <input type="text" id="formProjects" required value="${(user.projects && user.projects.length > 0) ? user.projects.join(', ') : preset.projects}" placeholder="e.g. Automated Herbal Extraction QA Pipeline" class="w-full px-3.5 py-2 text-sm">
                    </div>

                    <div class="p-4 bg-cyan-50/50 border border-cyan-200/80 rounded-2xl space-y-3" id="dynamicQuestionContainer">
                        <h4 class="text-xs font-bold uppercase text-slate-700 flex items-center">
                            <i class="fa-solid fa-robot text-cyan-600 mr-1.5"></i> AI Adaptive Technical Inquiry:
                        </h4>
                        <p class="text-xs text-slate-600 italic" id="dynamicQuestionText">
                            ${this.getQuestionHtmlForDomain(currentDomain)}
                        </p>
                        <textarea id="formAnswer" rows="2" placeholder="Provide your technical rationale..." class="w-full p-2.5 text-xs rounded-xl"></textarea>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-full text-sm transition shadow-lg">
                        Run Full AI Assessment & Map Target Match Score &rarr;
                    </button>
                </form>
            </div>
        `;
    },

    getQuestionHtmlForDomain: function (domain) {
        const questions = AIEngine.questionBank[domain] || AIEngine.questionBank.ayush;
        return questions[0].q;
    },

    handleDomainChange: function (domain) {
        const preset = DOMAIN_PRESETS[domain] || DOMAIN_PRESETS.ayush;
        document.getElementById('formSubDomain').value = preset.subDomain;
        document.getElementById('formTargetRole').value = preset.targetRole;
        document.getElementById('formGithub').value = preset.github;
        document.getElementById('formResearch').value = preset.research;
        document.getElementById('formSkills').value = preset.skills;
        document.getElementById('formProjects').value = preset.projects;
        document.getElementById('dynamicQuestionText').innerText = this.getQuestionHtmlForDomain(domain);

        if (document.getElementById('formLinkedin')) {
            document.getElementById('formLinkedin').value = preset.linkedin || '';
        }
    },

    saveStudentProfile: function (e) {
        e.preventDefault();
        const user = DB.currentUser;

        let linkedinInput = document.getElementById('formLinkedin') ? document.getElementById('formLinkedin').value.trim() : '';
        if (linkedinInput) {
            if (!linkedinInput.startsWith('http')) {
                linkedinInput = 'https://' + linkedinInput;
            }
            const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
            if (!linkedinRegex.test(linkedinInput)) {
                this.showToast('Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)', 'error');
                return;
            }
        }

        user.domain = document.getElementById('formDomain').value;
        user.subDomain = document.getElementById('formSubDomain').value;
        user.targetRole = document.getElementById('formTargetRole').value;
        user.apaarId = document.getElementById('formApaar').value;
        user.github = document.getElementById('formGithub').value;
        user.linkedin = linkedinInput;
        user.researchPapers = document.getElementById('formResearch').value.split(',').map(s => s.trim()).filter(Boolean);
        user.skills = document.getElementById('formSkills').value.split(',').map(s => s.trim()).filter(Boolean);
        user.projects = document.getElementById('formProjects').value.split(',').map(s => s.trim()).filter(Boolean);

        const evaluation = AIEngine.evaluateSubmission({
            domain: user.domain,
            skills: user.skills,
            projects: user.projects,
            research: document.getElementById('formResearch').value,
            github: user.github,
            targetRole: user.targetRole
        });

        user.assessment = evaluation;
        user.matchScore = evaluation.matchScore;
        user.level = evaluation.level;

        this.showToast('AI assessment successfully completed & saved!', 'success');
        this.render();
    },

    showRetakeAssessment: function () {
        DB.currentUser.assessment = null;
        this.render();
    },

    startCourseQuiz: function (courseId) {
        const course = DB.courses.find(c => c.id === courseId);
        if (!course || !course.quiz) return;

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="max-w-2xl mx-auto glass-card rounded-2xl shadow-xl border border-cyan-200/70 p-8 relative my-12 framer-reveal">
                ${this.getCloseButton('App.render()')}
                <div class="mb-6 pr-6">
                    <span class="text-xs font-bold uppercase tracking-widest text-cyan-600">NEP 2020 Accredited Certification Quiz</span>
                    <h2 class="text-xl font-bold text-slate-800 mt-1">${course.title}</h2>
                    <p class="text-xs text-slate-500 mt-1">Passing score unlocks <strong class="text-teal-700">${course.nepCredits} Academic Bank of Credits (ABC)</strong>.</p>
                </div>

                <form onsubmit="App.submitCourseQuiz(event, ${courseId})" class="space-y-6">
                    ${course.quiz.map((q, idx) => `
                        <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 space-y-3">
                            <p class="text-xs font-bold text-slate-800">Q${idx + 1}: ${q.q}</p>
                            <div class="space-y-2">
                                ${q.options.map((opt, optIdx) => `
                                    <label class="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer p-2.5 rounded-xl hover:bg-cyan-50/50 border border-transparent hover:border-cyan-100">
                                        <input type="radio" name="q${idx}" value="${optIdx}" ${optIdx === 0 ? 'required' : ''} class="text-cyan-600 focus:ring-cyan-500">
                                        <span>${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                    <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-full text-sm transition shadow-md">
                        Submit Quiz & Claim Credits &rarr;
                    </button>
                </form>
            </div>
        `;
    },

    submitCourseQuiz: function (e, courseId) {
        e.preventDefault();
        const course = DB.courses.find(c => c.id === courseId);
        DB.currentUser.abcCredits = (DB.currentUser.abcCredits || 24) + course.nepCredits;
        this.showToast(`Congratulations! Quiz passed. +${course.nepCredits} ABC credits added to your APAAR passport!`, 'success');
        this.render();
    },

    showPublishCourseForm: function () {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen flex flex-col justify-center items-center p-4 relative framer-reveal">
                <div class="glass-card rounded-2xl shadow-xl p-8 w-full max-w-lg border border-cyan-200/70 z-10 relative">
                    ${this.getCloseButton('App.render()')}
                    <h2 class="text-xl font-bold text-slate-800 mb-4">Publish New Curriculum</h2>
                    <form onsubmit="App.handlePublishCourse(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Course Title</label>
                            <input type="text" id="courseTitle" required class="w-full px-4 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Domain</label>
                            <input type="text" id="courseDomain" required placeholder="e.g. engineering, ayush" class="w-full px-4 py-2 text-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold uppercase text-slate-600 mb-1">NEP Credits</label>
                                <input type="number" id="courseCredits" required class="w-full px-4 py-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Deadline</label>
                                <input type="date" id="courseDeadline" required class="w-full px-4 py-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                            <textarea id="courseDesc" required class="w-full px-4 py-2 text-sm"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-full text-sm transition">Publish Course</button>
                    </form>
                </div>
            </div>
        `;
    },

    handlePublishCourse: function (e) {
        e.preventDefault();
        const newCourse = {
            id: DB.courses.length + 1,
            title: document.getElementById('courseTitle').value,
            domain: document.getElementById('courseDomain').value.toLowerCase(),
            nepCredits: parseInt(document.getElementById('courseCredits').value),
            deadline: document.getElementById('courseDeadline').value,
            description: document.getElementById('courseDesc').value,
            author: DB.currentUser.name,
            quiz: [
                { q: 'Sample assessment question for ' + document.getElementById('courseTitle').value, options: ['Option A', 'Option B'], answer: 0 }
            ],
            certified: true
        };
        DB.courses.push(newCourse);
        this.showToast('Course published successfully!', 'success');
        this.render();
    },

    runSyllabusAudit: function () {
        this.showToast('AI Syllabus Engine analyzing industry trends...', 'info');
        setTimeout(() => {
            const domainKey = DB.currentUser.domain || 'engineering';
            const analytics = DOMAIN_ANALYTICS[domainKey] || DOMAIN_ANALYTICS['engineering'];

            const reportDiv = document.getElementById('syllabusAuditReport');
            reportDiv.classList.remove('hidden');
            reportDiv.innerHTML = `
                <div class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs space-y-2">
                    <p><strong><i class="fa-solid fa-triangle-exclamation mr-1"></i> Industry Alignment Warning:</strong> ${analytics.syllabusAudit.warning}</p>
                    <p class="text-teal-700 font-semibold"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Suggestion: ${analytics.syllabusAudit.suggestion}</p>
                </div>
            `;
            this.showToast('Curriculum alignment gap detected.', 'success');
        }, 1500);
    },

    mintAbcCredits: function (studentId) {
        this.showToast(`<i class="fa-solid fa-link"></i> Securing via Blockchain Hash: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}...`, 'info');
        setTimeout(() => {
            this.showToast('Credits successfully minted and pushed to Government Academic Bank of Credits (ABC)!', 'success');
        }, 1200);
    },

    renderInstitutionalChart: function () {
        const ctx = document.getElementById('skillGapChart');
        if (!ctx) return;

        const domainKey = DB.currentUser.domain || 'engineering';
        const analytics = DOMAIN_ANALYTICS[domainKey] || DOMAIN_ANALYTICS['engineering'];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: analytics.chart.labels,
                datasets: [{
                    label: '% of Students Failing AI Mock Interviews',
                    data: analytics.chart.data,
                    backgroundColor: ['#f43f5e', '#06b6d4', '#0d9488', '#0284c7'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    },

    renderAcademicianView: function (user) {
        const myCourses = DB.courses.filter(c => c.author === user.name);
        const otherCourses = DB.courses.filter(c => c.author !== user.name);

        const domainKey = user.domain || 'engineering';
        const analytics = DOMAIN_ANALYTICS[domainKey] || DOMAIN_ANALYTICS['engineering'];

        setTimeout(() => App.renderInstitutionalChart(), 50);

        return `
            <div class="space-y-6">
                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 flex justify-between items-center card-hover">
                    <div class="flex items-center space-x-4">
                        ${this.getAvatarHtml(user, 'w-12 h-12', 'text-lg', 'border-2 border-teal-400')}
                        <div>
                            <span class="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Faculty Portal</span>
                            <h2 class="text-2xl font-bold text-slate-900 mt-1">${user.name}</h2>
                            <p class="text-xs text-slate-500">${user.institution} • Domain: <strong class="uppercase">${user.domain}</strong></p>
                        </div>
                    </div>
                    <button onclick="App.showPublishCourseForm()" class="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-sm">
                        <i class="fa-solid fa-plus mr-1"></i> Publish New Curriculum / Course
                    </button>
                </div>

                ${DB.institutionalAlerts.length > 0 ? `
                    <div class="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm space-y-2">
                        <h3 class="text-sm font-bold text-rose-800"><i class="fa-solid fa-bell mr-2"></i> Recruiter Feedback Alerts (Action Required)</h3>
                        <div class="space-y-2">
                            ${DB.institutionalAlerts.map(alert => `
                                <div class="bg-white p-3 rounded-xl border border-rose-100 text-xs text-slate-700">
                                    <strong>${alert.company}</strong> noted that candidates from your institution lack: <span class="font-bold text-rose-600">${alert.skill}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="grid lg:grid-cols-2 gap-6">
                    <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4 card-hover">
                        <h3 class="text-base font-bold text-slate-800 flex items-center">
                            <i class="fa-solid fa-wand-magic-sparkles text-teal-600 mr-2"></i> AI Syllabus Auditor
                        </h3>
                        <p class="text-xs text-slate-500">Paste your course syllabus below to identify gaps against active recruiter demands.</p>
                        <textarea rows="4" class="w-full px-3 py-2 text-xs" placeholder="${analytics.syllabusAudit.placeholder}"></textarea>
                        <button onclick="App.runSyllabusAudit()" class="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-full transition shadow-sm">
                            Audit against Industry Demands
                        </button>
                        <div id="syllabusAuditReport" class="hidden mt-4"></div>
                    </div>

                    <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4 card-hover">
                        <h3 class="text-base font-bold text-slate-800 flex items-center">
                            <i class="fa-solid fa-chart-bar text-cyan-600 mr-2"></i> Institutional Skill-Gap Analytics
                        </h3>
                        <p class="text-xs text-slate-500">Macro-view telemetry based on PICT students failing AI mock interviews.</p>
                        <canvas id="skillGapChart" class="w-full h-40"></canvas>
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4">
                    <h3 class="text-base font-bold text-slate-800 flex items-center">
                        <i class="fa-solid fa-users text-teal-700 mr-2"></i> Enrolled Students & APAAR Sync
                    </h3>
                    <div class="space-y-3">
                        ${DB.users.filter(u => u.role === 'student').map(s => `
                            <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 flex flex-wrap justify-between items-center gap-4 card-hover">
                                <div class="flex items-center space-x-3">
                                    ${this.getAvatarHtml(s, 'w-8 h-8', 'text-[10px]', 'border border-slate-300')}
                                    <div>
                                        <h4 class="font-bold text-slate-900 text-sm">${s.name}</h4>
                                        <p class="text-xs text-slate-500 font-mono">APAAR ID: ${s.apaarId || '8942-7712-4401'}</p>
                                    </div>
                                </div>
                                <button onclick="App.mintAbcCredits(${s.id})" class="bg-blue-600 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full transition shadow-sm flex items-center">
                                    <i class="fa-solid fa-coins mr-1.5"></i> Mint & Push Credits to APAAR
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4">
                    <h3 class="text-base font-bold text-slate-800 flex items-center">
                        <i class="fa-solid fa-chalkboard-user text-teal-700 mr-2"></i> My Published Courses
                    </h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${myCourses.length > 0 ? myCourses.map(c => `
                            <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 space-y-2 card-hover">
                                <div class="flex justify-between items-start">
                                    <span class="text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full uppercase">${c.domain}</span>
                                    <span class="text-xs font-bold text-teal-700">${c.nepCredits} NEP Credits</span>
                                </div>
                                <h4 class="font-bold text-slate-900 text-sm">${c.title}</h4>
                                <p class="text-xs text-slate-600">${c.description}</p>
                                <div class="pt-2 border-t border-cyan-50 flex justify-between text-xs text-slate-500">
                                    <span>Deadline: ${c.deadline}</span>
                                    <span class="text-teal-700 font-semibold">142 Students Enrolled</span>
                                </div>
                            </div>
                        `).join('') : '<p class="text-xs text-slate-500 italic">You have not published any courses yet.</p>'}
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4">
                    <h3 class="text-base font-bold text-slate-800 flex items-center">
                        <i class="fa-solid fa-globe text-teal-700 mr-2"></i> Courses Published by Other Faculty
                    </h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${otherCourses.length > 0 ? otherCourses.map(c => `
                            <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 space-y-2 card-hover">
                                <div class="flex justify-between items-start">
                                    <span class="text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full uppercase">${c.domain}</span>
                                    <span class="text-xs font-bold text-teal-700">${c.nepCredits} NEP Credits</span>
                                </div>
                                <h4 class="font-bold text-slate-900 text-sm">${c.title}</h4>
                                <p class="text-xs text-slate-600">${c.description}</p>
                                <div class="pt-2 border-t border-cyan-50 flex justify-between text-xs text-slate-500">
                                    <span>Author: ${c.author}</span>
                                    <span>Deadline: ${c.deadline}</span>
                                </div>
                            </div>
                        `).join('') : '<p class="text-xs text-slate-500 italic">No courses available.</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    toggleNapsCard: function () {
        const checkbox = document.getElementById('napsCompliant');
        const card = document.getElementById('napsCalcCard');
        if (!checkbox || !card) return;

        if (checkbox.checked) {
            card.classList.remove('hidden');
            const salaryInput = document.getElementById('jobSalary').value;
            const amount = parseInt(salaryInput.replace(/[^0-9]/g, '')) || 10000;
            const govtShare = (amount * 0.25).toLocaleString();
            document.getElementById('napsGovtShare').innerText = `₹${govtShare}`;
        } else {
            card.classList.add('hidden');
        }
    },

    toggleBlindHiring: function () {
        DB.isBlindHiring = !DB.isBlindHiring;
        this.render();
        this.showToast(DB.isBlindHiring ? 'Blind Hiring Mode Enabled: Names hidden to prevent bias.' : 'Blind Hiring Mode Disabled.', 'info');
    },

    filterCandidates: function () {
        const query = document.getElementById('aiCandidateSearch').value.toLowerCase();
        DB.aiSearchQuery = query;
        this.render();
        this.showToast('AI Filter Applied to Candidate Pool', 'success');
    },

    logMissingSkill: function (studentId) {
        const skill = prompt("Enter the critical skill this candidate lacked (e.g., Cloud Architecture, Pharmacovigilance):");
        if (skill && skill.trim() !== "") {
            const student = DB.users.find(u => u.id === studentId);
            if (student) {
                student.rejections = student.rejections || [];
                student.rejections.push({
                    company: DB.currentUser.company,
                    skill: skill,
                    date: new Date().toLocaleDateString()
                });

                if (student.assessment) {
                    if (student.assessment.gaps && !student.assessment.gaps.includes(skill)) {
                        student.assessment.gaps.push(skill);
                    } else if (!student.assessment.gaps) {
                        student.assessment.gaps = [skill];
                    }

                    if (!student.assessment.suggestions) student.assessment.suggestions = [];
                    student.assessment.suggestions.push(`Enroll in NEP-accredited module for ${skill} (Based on Industry Feedback)`);

                    if (!student.assessment.roadmap) student.assessment.roadmap = [];
                    student.assessment.roadmap.push({
                        phase: 'Industry Feedback Recovery',
                        title: `Master ${skill}`,
                        desc: `A customized AI learning path to acquire ${skill} based on recent recruiter rejection feedback from ${DB.currentUser.company}.`
                    });
                }

                DB.institutionalAlerts.push({
                    company: DB.currentUser.company,
                    skill: skill
                });

                this.showToast(`Skill gap logged! Candidate removed from your pool and data routed to student & institutional faculty dashboards.`, 'success');
                this.render();
            }
        }
    },

    showPostJobForm: function () {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen flex flex-col justify-center items-center p-4 relative framer-reveal">
                <div class="glass-card rounded-2xl shadow-xl p-8 w-full max-w-lg border border-cyan-200/70 z-10 relative">
                    ${this.getCloseButton('App.render()')}
                    <h2 class="text-xl font-bold text-slate-800 mb-4">Post Internship / Placement</h2>
                    <form onsubmit="App.handlePostJob(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Type</label>
                            <select id="jobType" class="w-full px-4 py-2 text-sm">
                                <option value="internship">Internship</option>
                                <option value="placement">Full-Time Placement</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Job Title</label>
                            <input type="text" id="jobTitle" required class="w-full px-4 py-2 text-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Domain</label>
                                <input type="text" id="jobDomain" required class="w-full px-4 py-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Location</label>
                                <input type="text" id="jobLocation" required class="w-full px-4 py-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Stipend / Salary (Numeric format e.g. 20000)</label>
                            <input type="text" id="jobSalary" required onkeyup="App.toggleNapsCard()" class="w-full px-4 py-2 text-sm">
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="napsCompliant" onchange="App.toggleNapsCard()" class="w-4 h-4 text-teal-600">
                            <label class="text-xs font-bold text-slate-700">NAPS 2.0 Compliant (Govt Apprenticeship)</label>
                        </div>
                        <div id="napsCalcCard" class="hidden bg-teal-50 border border-teal-200 p-3 rounded-2xl text-xs text-teal-800">
                            <i class="fa-solid fa-building-columns mr-1"></i> Under the National Apprenticeship Promotion Scheme, the Government of India will share 25% of this stipend (up to ₹1500).
                            <br><strong>Estimated Govt Coverage: <span id="napsGovtShare" class="text-teal-900 font-black">₹0</span></strong>
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                            <textarea id="jobDesc" required class="w-full px-4 py-2 text-sm"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-full text-sm transition">Post Opportunity</button>
                    </form>
                </div>
            </div>
        `;
    },

    handlePostJob: function (e) {
        e.preventDefault();
        const type = document.getElementById('jobType').value;
        const newJob = {
            id: (type === 'internship' ? DB.internships.length : DB.placements.length) + 1,
            title: document.getElementById('jobTitle').value,
            domain: document.getElementById('jobDomain').value.toLowerCase(),
            location: document.getElementById('jobLocation').value,
            salary: document.getElementById('jobSalary').value,
            stipend: document.getElementById('jobSalary').value,
            description: document.getElementById('jobDesc').value,
            company: DB.currentUser.company,
            skills: ['Relevant Competency'],
            requirements: ['Validated APAAR Record']
        };
        if (type === 'internship') {
            newJob.duration = "To be discussed";
            DB.internships.push(newJob);
        } else {
            DB.placements.push(newJob);
        }
        this.showToast('Opportunity successfully posted!', 'success');
        this.render();
    },

    deleteJob: function (type, id) {
        if (confirm("Are you sure you want to delete this opportunity?")) {
            if (type === 'internship') {
                DB.internships = DB.internships.filter(job => job.id !== id);
            } else {
                DB.placements = DB.placements.filter(job => job.id !== id);
            }
            this.showToast('Opportunity deleted successfully.', 'info');
            this.render();
        }
    },

    renderIndustrialistView: function (user) {
        const myInternships = DB.internships.filter(i => i.company === user.company);
        const myPlacements = DB.placements.filter(p => p.company === user.company);

        let candidatePool = DB.users.filter(u => {
            if (u.role !== 'student') return false;
            if (!u.rejections) return true;
            return !u.rejections.some(r => r.company === user.company);
        });

        if (DB.aiSearchQuery) {
            candidatePool = candidatePool.filter(u =>
                (u.skills && u.skills.join(' ').toLowerCase().includes(DB.aiSearchQuery)) ||
                (u.domain && u.domain.toLowerCase().includes(DB.aiSearchQuery))
            );
        }

        return `
            <div class="space-y-6">
                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 flex justify-between items-center card-hover">
                    <div class="flex items-center space-x-4">
                        ${this.getAvatarHtml(user, 'w-12 h-12', 'text-lg', 'border-2 border-slate-400')}
                        <div>
                            <span class="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Recruiter & R&D Portal</span>
                            <h2 class="text-2xl font-bold text-slate-900 mt-1">${user.name}</h2>
                            <p class="text-xs text-slate-500">${user.company} • Domain: <strong class="uppercase">${user.domain}</strong></p>
                        </div>
                    </div>
                    <button onclick="App.showPostJobForm()" class="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-sm">
                        <i class="fa-solid fa-plus mr-1"></i> Post Internship / Placement
                    </button>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4">
                    <h3 class="text-base font-bold text-slate-800 flex items-center">
                        <i class="fa-solid fa-clipboard-list text-cyan-600 mr-2"></i> My Posted Opportunities
                    </h3>
                    <div class="space-y-3">
                        ${myInternships.length > 0 || myPlacements.length > 0 ? `
                            ${myInternships.map(i => `
                                <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 flex flex-wrap justify-between items-center gap-4 card-hover">
                                    <div>
                                        <span class="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Internship</span>
                                        <h4 class="font-bold text-slate-900 text-sm mt-1">${i.title}</h4>
                                        <p class="text-xs text-slate-500">${i.location} • ${i.stipend}</p>
                                    </div>
                                    <button onclick="App.deleteJob('internship', ${i.id})" class="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-1.5 rounded-full transition font-semibold flex items-center border border-rose-200">
                                        <i class="fa-solid fa-trash mr-1"></i> Delete
                                    </button>
                                </div>
                            `).join('')}
                            ${myPlacements.map(p => `
                                <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 flex flex-wrap justify-between items-center gap-4 card-hover">
                                    <div>
                                        <span class="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Placement</span>
                                        <h4 class="font-bold text-slate-900 text-sm mt-1">${p.title}</h4>
                                        <p class="text-xs text-slate-500">${p.location} • ${p.salary}</p>
                                    </div>
                                    <button onclick="App.deleteJob('placement', ${p.id})" class="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-1.5 rounded-full transition font-semibold flex items-center border border-rose-200">
                                        <i class="fa-solid fa-trash mr-1"></i> Delete
                                    </button>
                                </div>
                            `).join('')}
                        ` : '<p class="text-xs text-slate-500 italic">You have not posted any opportunities yet.</p>'}
                    </div>
                </div>

                <div class="glass-card rounded-2xl shadow-sm border border-cyan-200/60 p-6 space-y-4">
                    <div class="flex flex-wrap justify-between items-center gap-4">
                        <h3 class="text-base font-bold text-slate-800 flex items-center">
                            <i class="fa-solid fa-users text-cyan-600 mr-2"></i> Verified Candidate Pool & Applications
                        </h3>
                        
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-bold text-slate-600">Enable Unbiased (Blind) Hiring:</span>
                            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" id="toggleBlind" onchange="App.toggleBlindHiring()" ${DB.isBlindHiring ? 'checked' : ''} class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style="top: 2px; ${DB.isBlindHiring ? 'right: 0; border-color: #06B6D4;' : 'left: 0; border-color: #CBD5E1;'} z-index:10;"/>
                                <label for="toggleBlind" class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer" style="${DB.isBlindHiring ? 'background-color: #06B6D4;' : ''}"></label>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2 mb-4">
                        <input type="text" id="aiCandidateSearch" value="${DB.aiSearchQuery}" placeholder="e.g. Find me students with ABC credits in AYUSH who know Pharmacovigilance..." class="w-full px-4 py-2.5 text-sm">
                        <button onclick="App.filterCandidates()" class="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm whitespace-nowrap transition">
                            <i class="fa-solid fa-magnifying-glass mr-1"></i> AI Filter
                        </button>
                    </div>

                    <div class="space-y-3">
                        ${candidatePool.map(s => `
                            <div class="p-4 bg-white/80 rounded-2xl border border-cyan-100 flex flex-wrap justify-between items-center gap-4 card-hover">
                                <div class="flex items-center space-x-4">
                                    <div class="${DB.isBlindHiring ? 'hidden' : 'block'}">
                                        ${this.getAvatarHtml(s, 'w-10 h-10', 'text-sm', 'border border-slate-300')}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-slate-900 text-sm ${DB.isBlindHiring ? 'blur-text' : ''}">${s.name}</h4>
                                        <p class="text-xs text-slate-500 font-mono">
                                            Target: ${s.targetRole || 'Not Specified'} 
                                            ${DB.isBlindHiring ? `| <strong class="text-teal-700 ml-1">APAAR ID: ${s.apaarId}</strong>` : ''}
                                        </p>
                                        <div class="flex gap-1.5 mt-2">
                                            ${(s.skills || []).map(sk => `<span class="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full">${sk}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end space-y-2">
                                    <div class="text-right">
                                        <span class="text-sm font-bold text-cyan-800">${s.matchScore || s.assessment?.score || 85}% Match</span>
                                        <span class="block text-[10px] text-teal-700 font-semibold">APAAR Verified</span>
                                    </div>
                                    <button onclick="App.logMissingSkill(${s.id})" class="text-[10px] border border-rose-300 text-rose-700 hover:bg-rose-50 px-3 py-1 rounded-full font-bold transition shadow-sm">
                                        <i class="fa-solid fa-xmark mr-1"></i> Reject & Log Skill Gap
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                        ${candidatePool.length === 0 ? '<p class="text-xs text-slate-500 italic">No candidates match your AI query or they have been removed from your pipeline.</p>' : ''}
                    </div>
                </div>
            </div>
        `;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});