import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type FormEvent,
} from 'react'

export type FormProps = Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> & {
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { onSubmit, ...props },
  ref
) {
  return (
    <form
      ref={ref}
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
    />
  )
})
