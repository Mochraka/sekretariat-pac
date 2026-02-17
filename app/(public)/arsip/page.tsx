import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ArsipList } from "@/components/arsip-list"

export const metadata: Metadata = {
  title: "Arsip Surat",
  description:
    "Arsip surat dan dokumen resmi PAC IPNU IPPNU Kecamatan Taman.",
}

export default async function ArsipPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("arsip_surat")
    .select("*")
    .order("tanggal_upload", { ascending: false })

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="mb-10">
        <h1 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
          Arsip Surat
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Dokumen resmi dan arsip surat PAC IPNU IPPNU Kecamatan Taman yang
          tersedia untuk diunduh.
        </p>
      </div>

      <ArsipList items={items ?? []} />
    </section>
  )
}
