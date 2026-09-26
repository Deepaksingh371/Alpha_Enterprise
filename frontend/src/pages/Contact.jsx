const details = [
  {
    label: 'Address',
    value: 'Plot No. PAP-IS-10, Ranjangaon MIDC, Karegaon, Taluka Shirur, Pune, Maharashtra 412220, India',
    icon: (
      <path d="M12 21s-7-6.5-7-11.5a7 7 0 1 1 14 0C19 14.5 12 21 12 21z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    ),
  },
  {
    label: 'Phone',
    value: '+91 79868 67243',
    href: 'tel:+917986867243',
    icon: <path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  },
  {
    label: 'Products & Services',
    value: 'All types of adhesive tapes, home appliance parts, and automotive child parts',
    icon: <path d="M4 7h16M4 12h16M4 17h16" />,
  },
  {
    label: 'Business Hours',
    value: 'Monday – Saturday, 8:00 AM – 6:30 PM; Sunday closed',
    icon: <path d="M12 8v4l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
  },
  {
    label: 'Business Type',
    value: 'Manufacturing plant',
    icon: <path d="M3 21V8l6 3V8l6 3V4h6v17H3z M17 8h1 M17 12h1 M17 16h1 M7 15h2 M11 15h2" />,
  },
  {
    label: 'Incorporated',
    value: 'February 10, 2026',
    icon: <path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1z" />,
  },
  // {
  //   label: 'CIN',
  //   value: 'U46909PN2026PTC251839',
  //   icon: <path d="M4 5h16v14H4z M8 9h8M8 12h8M8 15h5" />,
  // },
];

const Contact = () => (
  <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
    <div className="max-w-2xl">
      <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink">Contact Alpha Enterprise Solution</h1>
      <p className="mt-3 text-steel leading-relaxed">
        Contact our manufacturing plant for enquiries about adhesive tapes, home appliance parts, and automotive child parts.
      </p>
    </div>

    <div className="mt-12 grid lg:grid-cols-2 gap-10">
      <div>
        <div className="border border-line divide-y divide-line">
          {details.map((d) => (
            <div key={d.label} className="flex items-start gap-4 px-5 py-5">
              <svg
                className="text-signal shrink-0 mt-0.5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {d.icon}
              </svg>
              <div>
                <p className="text-xs font-medium tracking-[0.1em] text-steel uppercase">{d.label}</p>
                {d.href ? (
                  <a href={d.href} className="mt-1 block text-ink font-medium hover:text-signal transition-colors">
                    {d.value}
                  </a>
                ) : (
                  <p className="mt-1 text-ink font-medium">{d.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-mist border border-line p-5">
          <p className="text-sm text-steel leading-relaxed">
            Looking to enquire about a specific product? Visit the{' '}
            <a href="/products" className="text-ink font-medium underline underline-offset-2 hover:text-signal">
              product catalog
            </a>{' '}
            and use the "Enquire Now" button on any listing — it routes straight to our sales team
            with the product pre-filled.
          </p>
        </div>
      </div>

      {/* Google Maps embed */}
      <div className="border border-line aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px]">
        <iframe
          title="Alpha Enterprise Solution location"
          src="https://www.google.com/maps?q=Plot+No.+PAP-IS-10,+Ranjangaon+MIDC,+Karegaon,+Shirur,+Pune,+Maharashtra+412220&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(15%)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </div>
);

export default Contact;
