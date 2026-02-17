"use client"

import { Download, FileText, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArsipItem {
  id: string
  nama_file: string
  file_url: string
  ukuran_file: number
  tipe_file: string
  tanggal_upload: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getFileExtension(name: string): string {
  const ext = name.split(".").pop()?.toUpperCase() ?? "FILE"
  return ext
}

export function ArsipList({ items }: { items: ArsipItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/50 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          <FolderOpen className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">Belum ada arsip surat</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Dokumen yang diunggah akan muncul di sini.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Card key={item.id} className="border-border transition-shadow hover:shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="truncate font-medium text-card-foreground">
                {item.nama_file}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getFileExtension(item.nama_file)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(item.ukuran_file)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.tanggal_upload)}
                </span>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 gap-1.5">
              <a href={item.file_url} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Unduh</span>
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
