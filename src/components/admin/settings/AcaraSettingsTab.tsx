"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Calendar, MapPin, Search, RefreshCw, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AcaraSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onResolveMaps: () => void;
  isResolvingMaps: boolean;
}

export function AcaraSettingsTab({
  formData,
  onChange,
  onResolveMaps,
  isResolvingMaps,
}: AcaraSettingsTabProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isDone: false,
  });

  useEffect(() => {
    const targetIso = formData.weddingDateIso || "2027-01-03T08:00:00+07:00";
    const targetTime = new Date(targetIso).getTime();

    const update = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isDone: true });
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      setCountdown({
        days: Math.floor(totalSec / 86400),
        hours: Math.floor((totalSec % 86400) / 3600),
        minutes: Math.floor((totalSec % 3600) / 60),
        seconds: totalSec % 60,
        isDone: false,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [formData.weddingDateIso]);

  const getDatetimeLocal = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "2027-01-03T08:00";
      const tzOffset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    } catch {
      return "2027-01-03T08:00";
    }
  };

  const handleDatetimeChange = (localVal: string) => {
    if (!localVal) return;
    try {
      const d = new Date(localVal);
      const iso = d.toISOString();
      const label = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);

      onChange("weddingDateIso", iso);
      onChange("eventDateLabel", label);
    } catch {
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Waktu Acara &amp; Target Hitung Mundur
            </CardTitle>
          </div>
          <CardDescription>
            Atur tanggal dan waktu pernikahan untuk sinkronisasi hitung mundur di halaman publik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weddingDateIso">Tanggal &amp; waktu patokan</Label>
                  <Input
                    id="weddingDateIso"
                    type="datetime-local"
                    value={getDatetimeLocal(formData.weddingDateIso)}
                    onChange={(e) => handleDatetimeChange(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Patokan awal countdown di halaman depan
                  </p>
                </div>

                <div>
                  <Label htmlFor="eventDateLabel">Label tanggal tampilan</Label>
                  <Input
                    id="eventDateLabel"
                    type="text"
                    value={formData.eventDateLabel || ""}
                    onChange={(e) => onChange("eventDateLabel", e.target.value)}
                    placeholder="Minggu, 3 Januari 2027"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Teks tanggal yang dibaca oleh tamu
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="akadTime">Waktu akad nikah</Label>
                  <Input
                    id="akadTime"
                    value={formData.akadTime || ""}
                    onChange={(e) => onChange("akadTime", e.target.value)}
                    placeholder="Pukul 08.00 – 10.00 WIB"
                  />
                </div>

                <div>
                  <Label htmlFor="resepsiTime">Waktu resepsi pernikahan</Label>
                  <Input
                    id="resepsiTime"
                    value={formData.resepsiTime || ""}
                    onChange={(e) => onChange("resepsiTime", e.target.value)}
                    placeholder="Pukul 11.00 – 14.00 WIB"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Pratinjau Hitung Mundur (Live)
                </span>

                {!countdown.isDone ? (
                  <div className="grid grid-cols-4 gap-2 text-center my-2">
                    {[
                      { label: "Hari", value: countdown.days },
                      { label: "Jam", value: countdown.hours },
                      { label: "Menit", value: countdown.minutes },
                      { label: "Detik", value: countdown.seconds },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                      >
                        <span className="font-bold text-lg sm:text-xl text-[#6B1222] font-mono tabular-nums block leading-tight">
                          <NumberFlow
                            value={item.value}
                            format={{ minimumIntegerDigits: 2 }}
                          />
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase block mt-0.5">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-600 font-medium italic">
                    Acara pernikahan telah terlaksana.
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-200/60 pt-2">
                Hitung mundur pada undangan publik akan bergerak secara otomatis sesuai pengaturan ini.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Lokasi Acara &amp; Integrasi Peta
            </CardTitle>
          </div>
          <CardDescription>
            Nama gedung, alamat lengkap, dan tautan navigasi Google Maps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venueName">Nama gedung / lokasi</Label>
              <Input
                id="venueName"
                value={formData.venueName || ""}
                onChange={(e) => onChange("venueName", e.target.value)}
                placeholder="Gedung Sasana Krida"
              />
            </div>

            <div>
              <Label htmlFor="venuePlusCode">Plus Code / Patokan</Label>
              <Input
                id="venuePlusCode"
                value={formData.venuePlusCode || ""}
                onChange={(e) => onChange("venuePlusCode", e.target.value)}
                placeholder="PGR3+8V Purwokerto"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="venueAddress">Alamat lengkap</Label>
            <Input
              id="venueAddress"
              value={formData.venueAddress || ""}
              onChange={(e) => onChange("venueAddress", e.target.value)}
              placeholder="Jl. Prof. Dr. Suharso No. 1, Arcawinangun, Purwokerto"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div>
              <Label htmlFor="googleMapsUrl">Tautan Google Maps</Label>
              <div className="flex gap-2">
                <Input
                  id="googleMapsUrl"
                  value={formData.googleMapsUrl || ""}
                  onChange={(e) => onChange("googleMapsUrl", e.target.value)}
                  placeholder="https://maps.app.goo.gl/... atau https://goo.gl/maps/..."
                  className="bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={onResolveMaps}
                  isLoading={isResolvingMaps}
                  className="shrink-0 text-xs"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Ekstrak koordinat</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <Label htmlFor="mapsLatitude" className="text-[11px] text-slate-600">
                  Latitude
                </Label>
                <Input
                  id="mapsLatitude"
                  value={formData.mapsLatitude || ""}
                  onChange={(e) => onChange("mapsLatitude", e.target.value)}
                  placeholder="-7.310076"
                  className="bg-white font-mono text-xs h-9"
                />
              </div>

              <div>
                <Label htmlFor="mapsLongitude" className="text-[11px] text-slate-600">
                  Longitude
                </Label>
                <Input
                  id="mapsLongitude"
                  value={formData.mapsLongitude || ""}
                  onChange={(e) => onChange("mapsLongitude", e.target.value)}
                  placeholder="109.296186"
                  className="bg-white font-mono text-xs h-9"
                />
              </div>
            </div>

            {formData.googleMapsEmbed && (
              <div className="pt-2">
                <Label className="text-[11px] text-slate-600 mb-1.5 block">Pratinjau peta sematan</Label>
                <div className="aspect-[16/9] max-h-[200px] w-full rounded-xl overflow-hidden border border-slate-200">
                  <iframe
                    src={formData.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Pratinjau Google Maps"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
