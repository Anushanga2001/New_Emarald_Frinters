import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function FAQPage() {
  const faqs = [
    {
      question: 'How do I track my shipment?',
      answer: 'You can track your shipment by entering your tracking number on our Track Shipment page. You\'ll receive real-time updates on your shipment\'s location and status. You can also sign up for email or SMS notifications.',
    },
    {
      question: 'What documents do I need for international shipping?',
      answer: 'For international shipping, you typically need a commercial invoice, packing list, and depending on the cargo, certificates of origin, import/export licenses, and insurance documents. Our team can guide you through the specific requirements for your shipment.',
    },
    {
      question: 'How are shipping costs calculated?',
      answer: 'Shipping costs depend on several factors including origin and destination, service type (sea/air/land), cargo weight and dimensions, cargo type, and any special handling requirements. Use our instant quote calculator for an estimate.',
    },
    {
      question: 'Do you provide customs clearance services?',
      answer: 'Yes, we offer comprehensive customs clearance services for both imports and exports. Our experienced team handles all documentation and liaises with customs authorities to ensure smooth clearance of your cargo.',
    },
    {
      question: 'What is the difference between FCL and LCL?',
      answer: 'FCL (Full Container Load) means you rent an entire container for your cargo, while LCL (Less than Container Load) means your cargo shares container space with other shipments. FCL is more cost-effective for larger shipments, while LCL is ideal for smaller quantities.',
    },
    {
      question: 'Do you offer insurance for shipments?',
      answer: 'Yes, we offer cargo insurance to protect your shipment against loss or damage during transit. We can arrange insurance coverage based on the value and nature of your cargo.',
    },
    {
      question: 'How long does sea freight take from major ports?',
      answer: 'Transit times vary by route: Asia (7-14 days), Middle East (10-15 days), Europe (21-35 days), North America (25-40 days). These are approximate transit times and don\'t include customs clearance time.',
    },
    {
      question: 'Can you handle special cargo like refrigerated goods?',
      answer: 'Yes, we have experience handling various types of special cargo including refrigerated goods, hazardous materials, oversized equipment, and fragile items. Special handling requirements will be reflected in the quote.',
    },
    {
      question: 'What are your payment terms?',
      answer: 'We accept various payment methods including bank transfers, credit cards, and PayHere. Payment terms can be discussed based on your shipping frequency and relationship with us. New customers typically pay in advance.',
    },
    {
      question: 'Do you provide door-to-door delivery?',
      answer: 'Yes, we offer complete door-to-door service including pickup from your location, international shipping, customs clearance, and final delivery to the destination address. This service is available for most destinations.',
    },
    {
      question: 'How do I file a claim for damaged cargo?',
      answer: 'If your cargo is damaged, notify us immediately and document the damage with photos. If you have cargo insurance, we\'ll guide you through the claims process. Claims should be filed within 7 days of delivery.',
    },
    {
      question: 'What are your operating hours?',
      answer: 'Our office is open Monday to Friday, 8:30 AM to 5:00 PM (Sri Lanka time). For urgent matters, you can reach our 24/7 customer support hotline or send us an email anytime.',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-primary/80">
              Find answers to common questions about our services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a href="/contact" className="text-primary hover:underline">
                Contact us →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
