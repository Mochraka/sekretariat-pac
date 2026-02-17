import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">
              PAC
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            IPNU IPPNU Kec. Taman
          </span>
        </div>
        <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
          Sekretariat Pimpinan Anak Cabang IPNU IPPNU Kecamatan Taman.
          Wadah kaderisasi pemuda Nahdlatul Ulama.
        </p>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Beranda
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Portfolio
          </Link>
          <Link
            href="/arsip"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Arsip Surat
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PAC IPNU IPPNU Kecamatan Taman. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  )
}
