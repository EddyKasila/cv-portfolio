export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  photo: string;
  location: string;
  address: string;
  email: string;
  phone: string;
  resumeUrl: string;
  social: SocialLink[];
  interests: {
    p1: string;
    p2: string;
  };
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  tasks: string[];
}

export interface Project {
  name: string;
  role: string;
  period: string;
  tag: string;
  image: string;
  url: string;
  summary: string;
  highlights: string[];
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  period: string;
  type: 'degree' | 'certification' | 'diploma';
}

export interface Skill {
  name: string;
  icon: string;
  category: string;
}

export interface Skills {
  programming: Skill[];
  professional: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
  description: string;
}

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: string;
  tags: string[];
}

export interface ContactField {
  label: string;
  required: boolean;
}

export interface Contact {
  formspreeId: string;
  recipientEmail: string;
  successMessage: string;
  fields: Record<string, ContactField>;
}

export interface Settings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  copyright: string;
  showContactForm: boolean;
  emailNotifications: boolean;
}

export interface SeoEntry {
  page: string;
  title: string;
  description: string;
  ogImage?: string;
}

export type ContentType = keyof ContentMap;

export interface ContentMap {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  articles: Article[];
  contact: Contact;
  settings: Settings;
  seo: SeoEntry[];
}
