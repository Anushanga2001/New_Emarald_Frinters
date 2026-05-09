import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, User, Calendar, MessageSquare, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

interface ContactFormDetail {
  contactFormId: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  createdAt: string
}

export function ContactMessagePage() {
  const { id } = useParams<{ id: string }>()
  const [contactForm, setContactForm] = useState<ContactFormDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContactForm() {
      try {
        const response = await api.get(`/contact/${id}`)
        setContactForm(response.data)
      } catch {
        setError('Failed to load contact message.')
      } finally {
        setLoading(false)
      }
    }
    fetchContactForm()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !contactForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-muted-foreground">{error || 'Contact message not found.'}</p>
        <Link to="/admin/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/admin/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{contactForm.subject}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact Message #{contactForm.contactFormId}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Sender Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{contactForm.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a href={`mailto:${contactForm.email}`} className="font-medium text-primary hover:underline">
                    {contactForm.email}
                  </a>
                </div>
              </div>
              {contactForm.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a href={`tel:${contactForm.phone}`} className="font-medium text-primary hover:underline">
                      {contactForm.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="font-medium">
                    {new Date(contactForm.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Message</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{contactForm.message}</p>
              </div>
            </div>

            {/* Reply action */}
            <div className="border-t pt-4">
              <a href={`mailto:${contactForm.email}?subject=Re: ${contactForm.subject}`}>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
