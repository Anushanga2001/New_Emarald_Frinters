import { Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ceoAvatar from '@/assets/leaders/leader-ceo.svg'
import cooAvatar from '@/assets/leaders/leader-coo.svg'
import cfoAvatar from '@/assets/leaders/leader-cfo.svg'

interface Leader {
  name: string
  position: string
  quote: string
  /** Cartoon avatar illustration */
  avatar: string
}

interface LeadershipProps {
  leaders?: Leader[]
}

const defaultLeaders: Leader[] = [
  {
    name: 'Lalith Asoka',
    position: 'Chief Executive Officer',
    quote:
      'In logistics, trust is the real cargo. Every promise we make to a customer has to arrive on time, intact and exactly as agreed.',
    avatar: ceoAvatar,
  },
  {
    name: 'Susantha Wijesinghe',
    position: 'Chief Operating Officer',
    quote:
      'Great logistics is invisible. When every handover, every document and every container moves as planned, the customer never has to think about us.',
    avatar: cooAvatar,
  },
  {
    name: 'Thilak Perera',
    position: 'Chief Financial Officer',
    quote:
      'Transparent pricing is the foundation of a lasting partnership. When customers know exactly what they are paying for, there are no surprises, only confidence.',
    avatar: cfoAvatar,
  },
]

export function Leadership({ leaders = defaultLeaders }: LeadershipProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-cta mb-2">The people behind us</p>
          <h2 className="text-3xl md:text-4xl">Our Leadership</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {leaders.map((leader) => (
            <Card key={leader.name} className="flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all">
              <CardContent className="flex flex-1 flex-col pt-6">
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={leader.avatar}
                    alt={`Illustration of ${leader.name}`}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] shrink-0 rounded-full shadow-md ring-4 ring-card"
                  />
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-lg leading-tight">{leader.name}</p>
                    <p className="text-sm text-muted-foreground">{leader.position}</p>
                  </div>
                </div>
                <div className="relative flex-1 rounded-xl bg-secondary/60 p-4">
                  <Quote className="absolute -top-3 right-4 h-6 w-6 rounded-md bg-card p-1 text-primary" aria-hidden="true" />
                  <blockquote className="text-base leading-relaxed text-foreground/90">
                    “{leader.quote}”
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
