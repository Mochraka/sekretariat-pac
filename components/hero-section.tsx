import Link from "next/link"
import { ArrowRight, BookOpen, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-foreground" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-foreground" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center lg:px-8 lg:py-32">
        <div className="flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5">
          <span className="text-xs font-medium text-primary-foreground/90">
            Sekretariat Resmi
          </span>
        </div>

        <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          PAC IPNU IPPNU Kecamatan Taman
        </h1>

        <p className="max-w-xl text-pretty text-base text-primary-foreground/80 leading-relaxed md:text-lg">
          Pimpinan Anak Cabang Ikatan Pelajar Nahdlatul Ulama &amp; Ikatan
          Pelajar Putri Nahdlatul Ulama Kecamatan Taman. Wadah kaderisasi
          generasi muda Nahdlatul Ulama.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="gap-2 font-medium"
          >
            <Link href="/portfolio">
              <BookOpen className="h-4 w-4" />
              Lihat Portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 border-primary-foreground/30 bg-transparent font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/arsip">
              <FolderOpen className="h-4 w-4" />
              Arsip Surat
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
