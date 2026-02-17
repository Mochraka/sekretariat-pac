import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Images, FolderOpen } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: portfolioCount }, { count: arsipCount }] = await Promise.all([
    supabase.from("portfolio").select("*", { count: "exact", head: true }),
    supabase.from("arsip_surat").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      label: "Kegiatan Portfolio",
      count: portfolioCount ?? 0,
      icon: Images,
      href: "/admin/portfolio",
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Arsip Surat",
      count: arsipCount ?? 0,
      icon: FolderOpen,
      href: "/admin/arsip",
      color: "bg-chart-2/10 text-chart-2",
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Selamat datang di panel admin sekretariat.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="border-border transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {stat.count}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
