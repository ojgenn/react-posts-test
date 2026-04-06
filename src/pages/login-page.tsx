import { useId, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Check, Eye, EyeOff, Lock, User, X } from 'lucide-react'
import { Form } from '../components/form'
import {
  loginSchema,
  type LoginFormValues,
} from '../schemas/login-schema'

function LogoMark() {
  const heights = [10, 18, 14, 22, 12]
  return (
    <div className="mb-6 flex h-7 items-end justify-center gap-1" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-sm bg-gray-900"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2'
const inputOk = 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
const inputErr =
  'border-red-500 focus:border-red-600 focus:ring-red-500/20 aria-invalid:border-red-500'

export function LoginPage() {
  const loginId = useId()
  const passwordId = useId()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      login: 'test',
      password: '',
      remember: false,
    },
  })

  const loginValue = useWatch({ control, name: 'login' }) ?? ''

  const onValid = (data: LoginFormValues) => {
    void data
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gray-50 p-4 text-left font-sans antialiased">
      <div className="w-full max-w-[400px] rounded-3xl bg-white p-10 shadow-xl">
        <LogoMark />
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Добро пожаловать!
        </h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          Пожалуйста, авторизируйтесь
        </p>

        <Form className="space-y-5" onSubmit={handleSubmit(onValid)}>
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
                aria-invalid={!!errors.login}
                aria-describedby={errors.login ? `${loginId}-error` : undefined}
                className={`${inputBase} ${errors.login ? inputErr : inputOk}`}
                {...register('login')}
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
            {errors.login && (
              <p
                id={`${loginId}-error`}
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {errors.login.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="mb-1 block text-xs font-semibold text-gray-500"
            >
              Пароль
            </label>
            <div className="relative flex items-center">
              <Lock
                className="pointer-events-none absolute left-3 size-5 text-gray-400"
                strokeWidth={1.75}
                aria-hidden
              />
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? `${passwordId}-error` : undefined
                }
                className={`${inputBase} ${errors.password ? inputErr : inputOk}`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? 'Скрыть пароль' : 'Показать пароль'
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" strokeWidth={2} />
                ) : (
                  <Eye className="size-4" strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id={`${passwordId}-error`}
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register('remember')}
            />
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 peer-focus-visible:ring-offset-2 peer-checked:border-blue-600 peer-checked:bg-blue-600 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              aria-hidden
            >
              <Check className="size-3 text-white" strokeWidth={3} />
            </span>
            <span className="text-xs text-gray-500">Запомнить данные</span>
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Войти
          </button>
        </Form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">или</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Нет аккаунта?{' '}
          <a
            href="#"
            className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
            onClick={(e) => e.preventDefault()}
          >
            Создать
          </a>
        </p>
      </div>
    </div>
  )
}
