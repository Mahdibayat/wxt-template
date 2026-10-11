export interface EmailTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  subject: string;
  body: string;
  textBody: string;
  variables: {
    name: string;
    label: string;
    example: string;
  }[];
  tags: string[];
  language: string;
}
