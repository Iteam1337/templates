export type Template = {
  name: string
  color: any
  variants: TemplateVariant[]
}

export type TemplateVariant = Omit<Template, 'variants'> & { display: string }
