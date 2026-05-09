import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notify } from '@/lib/toast'
import { getErrorMessage } from '@/lib/errors'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, User, Save, Mail, Phone, Building2, Calendar, RefreshCw, AlertCircle } from 'lucide-react'
import { profileApi, type UpdateProfileRequest } from '@/services/profileApi'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]*$/.test(val),
      'Phone can only contain digits, spaces, dashes, parentheses, and +'
    ),
  companyName: z.string().max(200, 'Company name must not exceed 200 characters').optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export function ProfilePage() {
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        notify.success(response.message)
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
      } else {
        notify.error(response.message)
      }
    },
    onError: (err) => {
      notify.error(getErrorMessage(err, 'Failed to update profile'))
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      companyName: '',
    },
    values: profile
      ? {
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          companyName: profile.companyName || '',
        }
      : undefined,
  })

  const onSubmit = (data: ProfileForm) => {
    updateMutation.mutate({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      companyName: data.companyName || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive">Failed to load profile. Please try again later.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['profile'] })} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile?.name || 'My Profile'}</h1>
            <p className="text-muted-foreground">Manage your personal details and contact information</p>
          </div>
        </div>

        {/* Account Info Banner */}
        {profile?.createdAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 rounded-lg px-4 py-3 mb-6 border">
            <Calendar className="h-4 w-4" />
            Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        )}

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Personal Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Personal Details</h3>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                      {...register('name')}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+94 77 123 4567"
                        className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Business Information</h3>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Acme Corporation"
                      className={`pl-10 ${errors.companyName ? 'border-destructive' : ''}`}
                      {...register('companyName')}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={!isDirty || updateMutation.isPending}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
