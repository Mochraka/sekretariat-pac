import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { PortfolioGrid } from "@/components/portfolio-grid"

export const metadata: Metadata = {
  title: "Portfolio Kegiatan",
  description:
    "Dokumentasi kegiatan PAC IPNU IPPNU Kecamatan Taman.",
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("portfolio")
    .select("*")
    .order("tahun", { ascending: false })

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="mb-10">
        <h1 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
          Portfolio Kegiatan
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Dokumentasi kegiatan dan program kerja PAC IPNU IPPNU Kecamatan Taman.
        </p>
      </div>

      <PortfolioGrid items={items ?? []} />
    </section>
  )
}
