export type Template = {
  name: string
  color: (color: string | number) => string
  variants: TemplateVariant[]
}

export type TemplateVariant = Omit<Template, 'variants'> & { display: string }
