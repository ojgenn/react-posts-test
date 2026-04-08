import { useWatch } from 'react-hook-form'
import type {
  Control,
  FieldError,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form'
import { User, X } from 'lucide-react'
import type { LoginFormValues } from '../schemas/login-schema'

const inputBase =
  'w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2'
const inputOk = 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
const inputErr =
  'border-red-500 focus:border-red-600 focus:ring-red-500/20 aria-invalid:border-red-500'

interface LoginUsernameFieldProps {
  loginId: string
  control: Control<LoginFormValues>
  setValue: UseFormSetValue<LoginFormValues>
  loginRegistration: UseFormRegisterReturn<'login'>
  error?: FieldError
}

export function LoginUsernameField({
  loginId,
  control,
  setValue,
  loginRegistration,
  error,
}: LoginUsernameFieldProps) {
  const loginValue = useWatch({ control, name: 'login' }) ?? ''

  return (
    <div>
      <label
        htmlFor={loginId}
        className="mb-1 block text-xs font-semibold text-gray-500"
      >
        Логин
      </label>
      <div className="relative flex items-center">
        <User
          className="pointer-events-none absolute left-3 size-5 text-gray-400"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          id={loginId}
          type="text"
          autoComplete="username"
          aria-invalid={!!error}
          aria-describedby={error ? `${loginId}-error` : undefined}
          className={`${inputBase} ${error ? inputErr : inputOk}`}
          {...loginRegistration}
        />
        {loginValue.length > 0 && (
          <button
            type="button"
            className="absolute right-2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            onClick={() =>
              setValue('login', '', {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            aria-label="Очистить поле логина"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${loginId}-error`}
          className="mt-1 text-xs text-red-600"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  )
}
