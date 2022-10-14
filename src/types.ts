import p from 'prompts';

export type Template<T extends string = string> = {
  name: T;
  color: (color: string | number) => string;
  label: string;
};

export type Command = 'add' | 'create';

export interface SelectOption<T> extends p.Choice {
  title: string;
  value: T;
}
