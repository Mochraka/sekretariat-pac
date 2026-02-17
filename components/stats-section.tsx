const stats = [
  { value: "", label: "" },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-accent/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4 lg:px-8 lg:py-16">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1.5 text-center">
            <span className="font-serif text-3xl font-bold text-primary md:text-4xl">
              {stat.value}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
