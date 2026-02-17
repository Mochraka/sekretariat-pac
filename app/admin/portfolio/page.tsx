"use client"

import { useState, useTransition } from "react"
import useSWR from "swr"
import { Plus, Trash2, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

interface PortfolioItem {
  id: string
  nama_kegiatan: string
  tahun: number
  deskripsi: string | null
  foto_url: string | null
  created_at: string
}

const fetcher = async (): Promise<PortfolioItem[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("tahun", { ascending: false })
  if (error) throw error
  return data ?? []
}

export default function AdminPortfolioPage() {
  const { data: items, mutate, isLoading } = useSWR("admin-portfolio", fetcher)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const namaKegiatan = formData.get("nama_kegiatan") as string
        const tahun = Number(formData.get("tahun"))
        const deskripsi = (formData.get("deskripsi") as string) || null
        const fotoFile = formData.get("foto") as File

        if (!namaKegiatan || !tahun) {
          toast.error("Nama kegiatan dan tahun wajib diisi")
          return
        }

        let fotoUrl: string | null = null

        if (fotoFile && fotoFile.size > 0) {
          setUploading(true)
          const uploadData = new FormData()
          uploadData.append("file", fotoFile)
          const res = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          })
          if (!res.ok) throw new Error("Upload foto gagal")
          const blob = await res.json()
          fotoUrl = blob.url
          setUploading(false)
        }

        const supabase = createClient()
        const { error } = await supabase.from("portfolio").insert({
          nama_kegiatan: namaKegiatan,
          tahun,
          deskripsi,
          foto_url: fotoUrl,
        })

        if (error) throw error

        toast.success("Kegiatan berhasil ditambahkan")
        setDialogOpen(false)
        mutate()
      } catch (err) {
        setUploading(false)
        toast.error(err instanceof Error ? err.message : "Gagal menambahkan kegiatan")
      }
    })
  }

  async function handleDelete(item: PortfolioItem) {
    try {
      // Delete photo from blob if exists
      if (item.foto_url) {
        await fetch("/api/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.foto_url }),
        })
      }

      const supabase = createClient()
      const { error } = await supabase
        .from("portfolio")
        .delete()
        .eq("id", item.id)

      if (error) throw error

      toast.success("Kegiatan berhasil dihapus")
      mutate()
    } catch {
      toast.error("Gagal menghapus kegiatan")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Kelola Portfolio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tambah dan kelola kegiatan organisasi.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nama_kegiatan">Nama Kegiatan</Label>
                <Input
                  id="nama_kegiatan"
                  name="nama_kegiatan"
                  placeholder="Contoh: Makesta 2025"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="tahun">Tahun</Label>
                <Input
                  id="tahun"
                  name="tahun"
                  type="number"
                  placeholder="2025"
                  min={2000}
                  max={2100}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  name="deskripsi"
                  placeholder="Deskripsi kegiatan..."
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="foto">Foto Kegiatan</Label>
                <Input
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                />
              </div>
              <Button type="submit" disabled={isPending || uploading} className="gap-2">
                {(isPending || uploading) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {uploading ? "Mengunggah..." : isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/50 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <ImageIcon className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">Belum ada kegiatan</p>
          <p className="text-sm text-muted-foreground">
            Klik tombol &ldquo;Tambah Kegiatan&rdquo; untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border">
              <div className="relative aspect-video bg-muted">
                {item.foto_url ? (
                  <Image
                    src={item.foto_url}
                    alt={item.nama_kegiatan}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="truncate font-semibold text-card-foreground">
                    {item.nama_kegiatan}
                  </h3>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {item.tahun}
                  </Badge>
                  {item.deskripsi && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Hapus kegiatan</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Kegiatan &ldquo;{item.nama_kegiatan}&rdquo; akan dihapus
                        secara permanen. Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
