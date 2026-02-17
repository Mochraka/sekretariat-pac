-- Create portfolio table
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kegiatan TEXT NOT NULL,
  tahun INTEGER NOT NULL,
  deskripsi TEXT,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create arsip_surat table
CREATE TABLE IF NOT EXISTS public.arsip_surat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_file TEXT NOT NULL,
  file_url TEXT NOT NULL,
  ukuran_file BIGINT NOT NULL DEFAULT 0,
  tipe_file TEXT NOT NULL DEFAULT 'application/pdf',
  tanggal_upload TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arsip_surat ENABLE ROW LEVEL SECURITY;

-- Portfolio: everyone can read
CREATE POLICY "portfolio_select_all" ON public.portfolio FOR SELECT USING (true);
-- Portfolio: only authenticated users can insert
CREATE POLICY "portfolio_insert_auth" ON public.portfolio FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Portfolio: only authenticated users can update
CREATE POLICY "portfolio_update_auth" ON public.portfolio FOR UPDATE USING (auth.role() = 'authenticated');
-- Portfolio: only authenticated users can delete
CREATE POLICY "portfolio_delete_auth" ON public.portfolio FOR DELETE USING (auth.role() = 'authenticated');

-- Arsip Surat: everyone can read
CREATE POLICY "arsip_select_all" ON public.arsip_surat FOR SELECT USING (true);
-- Arsip Surat: only authenticated users can insert
CREATE POLICY "arsip_insert_auth" ON public.arsip_surat FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Arsip Surat: only authenticated users can delete
CREATE POLICY "arsip_delete_auth" ON public.arsip_surat FOR DELETE USING (auth.role() = 'authenticated');
