import p from 'prompts';
export type Template = {
  name: string;
  color: (color: string | number) => string;
  variants: TemplateVariant[];
};

export type TemplateVariant = Omit<Template, 'variants'> & { display: string };

export type Command = 'add' | 'create';

export interface SelectOption<T> extends p.Choice {
  title: string;
  value: T;
}
