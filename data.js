// ==================== DOMAIN INTELLIGENCE DATASET ====================
// This file feeds domain-specific telemetry to the Academician portal.

const DOMAIN_ANALYTICS = {
    engineering: {
        syllabusAudit: {
            placeholder: "Paste syllabus text here... e.g. Core Java, OOPs, Collections...",
            warning: "Your curriculum covers traditional Java, but 78% of active SkillBridge recruiter postings in your domain require Spring Boot and Microservices.",
            suggestion: "Add a 2-credit Spring Boot module to bridge this gap immediately."
        },
        chart: {
            labels: ['System Design', 'Cloud Arch', 'Data Struct', 'CI/CD Pipelines'],
            data: [60, 45, 20, 15]
        }
    },
    ayush: {
        syllabusAudit: {
            placeholder: "Paste syllabus text here... e.g. Dravyaguna, Ayurvedic Principles, Basic Anatomy...",
            warning: "Your curriculum covers basic Dravyaguna, but 82% of active SkillBridge recruiter postings in your domain require Clinical Pharmacovigilance and HPLC Chromatographic Profiling.",
            suggestion: "Add a 3-credit module on Clinical Pharmacovigilance & Drug Safety to bridge this gap."
        },
        chart: {
            labels: ['Pharmacovigilance', 'HPLC Profiling', 'WHO-GACP', 'Clinical Trials'],
            data: [65, 50, 30, 25]
        }
    },
    management: {
        syllabusAudit: {
            placeholder: "Paste syllabus text here... e.g. Principles of Management, Business Ethics...",
            warning: "Your curriculum covers traditional Marketing, but 75% of active SkillBridge recruiter postings in your domain require Data-Driven Product Management and Agile Frameworks.",
            suggestion: "Add a 2-credit module on Agile Scrum & Product Analytics to bridge this gap."
        },
        chart: {
            labels: ['Agile Scrum', 'Product Analytics', 'Financial Modeling', 'B2B Sales'],
            data: [55, 40, 35, 10]
        }
    },
    law: {
        syllabusAudit: {
            placeholder: "Paste syllabus text here... e.g. Constitutional Law, Tort Law, Contracts...",
            warning: "Your curriculum focuses heavily on historical Tort Law, but 68% of active SkillBridge recruiter postings in your domain require Cyber Law and Tech Privacy Compliance (DPDP Act).",
            suggestion: "Add a 2-credit module on Digital Privacy & Data Protection Compliance to bridge this gap."
        },
        chart: {
            labels: ['Cyber Law', 'DPDP Act', 'IP Rights', 'Corp. Compliance'],
            data: [70, 55, 25, 20]
        }
    }
};