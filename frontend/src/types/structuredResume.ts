export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumeHeader {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: ResumeLink[];
}

export interface ResumeItem {
  heading?: string;
  subheading?: string;
  bullets?: string[];
  value?: string;
}

export interface ResumeSection {
  type: string;
  title: string;
  content?: string;
  items?: ResumeItem[];
}

export interface StructuredResume {
  header?: ResumeHeader;
  sections: ResumeSection[];
}
