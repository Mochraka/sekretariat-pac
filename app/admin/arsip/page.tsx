"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Trash2, FileText, FolderOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    month: "short",
    year: "numeric",
  })
}

const fetcher = async (): Promise<ArsipItem[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("arsip_surat")
    .select("*")
    .order("tanggal_upload", { ascending: false })
  if (error) throw error
  return data ?? []
}

export default function AdminArsipPage() {
  const { data: items, mutate, isLoading } = useSWR("admin-arsip", fetcher)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const file = formData.get("file") as File

      if (!file || file.size === 0) {
        toast.error("Pilih file untuk diunggah")
        setSubmitting(false)
        return
      }

      const uploadData = new FormData()
      uploadData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Upload file gagal")
      }
      const blob = await res.json()

      const supabase = createClient()
      const { error } = await supabase.from("arsip_surat").insert({
        nama_file: file.name,
        file_url: blob.url,
        ukuran_file: file.size,
        tipe_file: file.type || "application/octet-stream",
      })

      if (error) throw error

      toast.success("Arsip berhasil diunggah")
      setDialogOpen(false)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah arsip")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(item: ArsipItem) {
    try {
      // Delete file from blob
      await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.file_url }),
      })

      const supabase = createClient()
      const { error } = await supabase
        .from("arsip_surat")
        .delete()
        .eq("id", item.id)

      if (error) throw error

      toast.success("Arsip berhasil dihapus")
      mutate()
    } catch {
      toast.error("Gagal menghapus arsip")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Kelola Arsip Surat
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Unggah dan kelola dokumen arsip surat.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Unggah Arsip
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unggah Arsip Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="file">Pilih File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG
                </p>
              </div>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {submitting ? "Mengunggah..." : "Unggah"}
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
            <FolderOpen className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">Belum ada arsip</p>
          <p className="text-sm text-muted-foreground">
            Klik tombol &ldquo;Unggah Arsip&rdquo; untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.id} className="border-border">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <p className="truncate font-medium text-card-foreground">
                    {item.nama_file}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.nama_file.split(".").pop()?.toUpperCase() ?? "FILE"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(item.ukuran_file)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.tanggal_upload)}
                    </span>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Hapus arsip</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Arsip?</AlertDialogTitle>
                      <AlertDialogDescription>
                        File &ldquo;{item.nama_file}&rdquo; akan dihapus secara
                        permanen. Tindakan ini tidak dapat dibatalkan.
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
