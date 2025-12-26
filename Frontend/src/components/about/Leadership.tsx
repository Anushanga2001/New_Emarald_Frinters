import { Card, CardContent } from '@/components/ui/card'

interface Leader {
  name: string
  position: string
  image: string
}

interface LeadershipProps {
  leaders?: Leader[]
}

const defaultLeaders: Leader[] = [
  {
    name: 'Lalith Asoka',
    position: 'Chief Executive Officer',
    image: '/src/assets/putin_DP.jpg', // Update with actual image path
  },
  {
    name: 'Susantha Wijesinghe',
    position: 'Chief Operating Officer',
    image: '/src/assets/Modi_DP.jpg', // Update with actual image path
  },
  {
    name: 'Thilak Perera',
    position: 'Chief Financial Officer',
    image: '/src/assets/Fin_DP.jpg', // Update with actual image path
  },
]

export function Leadership({ leaders = defaultLeaders }: LeadershipProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {leaders.map((leader) => (
            <Card key={leader.name} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="mb-4">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-primary/20"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/200?text=' + encodeURIComponent(leader.name.charAt(0))
                    }}
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2">{leader.name}</h3>
                <p className="text-sm text-muted-foreground">{leader.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
