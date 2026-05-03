import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { Ship, User, Mail, Lock, Phone, Building2, FileText, MapPin, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterForm) => {
    registerUser(data)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-3xl shadow-xl border-0">
        {/* Header */}
        <CardHeader className="py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-primary rounded-xl p-2.5 shadow-lg">
              <Ship className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-sm">
                Join New Emarald Freighter and start shipping today
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Account Details</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        placeholder="+94 77 123 4567"
                        className="pl-10"
                        {...register('phoneNumber')}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      {...register('password')}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      {...register('confirmPassword')}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Business Information</h3>
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Acme Corporation"
                      className="pl-10"
                      {...register('companyName')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium mb-1">
                    Tax ID
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="taxId"
                      placeholder="Tax identification number"
                      className="pl-10"
                      {...register('taxId')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="billingAddress" className="block text-sm font-medium mb-1">
                    Billing Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="billingAddress"
                      placeholder="123 Main St, Colombo"
                      className="pl-10"
                      {...register('billingAddress')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-medium mb-1">
                    Shipping Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="shippingAddress"
                      placeholder="456 Port Rd, Colombo"
                      className="pl-10"
                      {...register('shippingAddress')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm border border-destructive/20">
                {error instanceof Error ? error.message : 'Registration failed. Please try again.'}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/auth/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
