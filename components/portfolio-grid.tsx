"use client"

import Image from "next/image"
import { Calendar, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PortfolioItem {
  id: string
  nama_kegiatan: string
  tahun: number
  deskripsi: string | null
  foto_url: string | null
  created_at: string
}

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/50 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          <ImageIcon className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">Belum ada kegiatan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Kegiatan yang didaftarkan akan muncul di sini.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden border-border transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {item.foto_url ? (
              <Image
                src={item.foto_url}
                alt={item.nama_kegiatan}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <CardContent className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-balance font-semibold text-card-foreground">
                {item.nama_kegiatan}
              </h3>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs shrink-0">
                <Calendar className="h-3 w-3" />
                {item.tahun}
              </Badge>
            </div>
            {item.deskripsi && (
              <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                {item.deskripsi}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
