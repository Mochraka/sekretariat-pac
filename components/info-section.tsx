import { Users, Target, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Users,
    title: "Kaderisasi",
    description:
      "Membentuk kader-kader muda NU yang beriman, berilmu, dan berakhlakul karimah melalui berbagai program pembinaan.",
  },
  {
    icon: Target,
    title: "Organisasi",
    description:
      "Meningkatkan kapasitas organisasi pelajar melalui pelatihan kepemimpinan, manajemen, dan keterampilan sosial.",
  },
  {
    icon: Heart,
    title: "Pengabdian",
    description:
      "Mengabdi kepada masyarakat melalui kegiatan sosial, pendidikan, dan dakwah yang bermanfaat bagi lingkungan.",
  },
]

export function InfoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-balance font-serif text-2xl font-bold text-foreground md:text-3xl">
          Pilar Organisasi
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-sm text-muted-foreground leading-relaxed">
          Tiga pilar utama yang menjadi landasan perjuangan PAC IPNU IPPNU
          Kecamatan Taman.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-border bg-card transition-shadow hover:shadow-md"
          >
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
