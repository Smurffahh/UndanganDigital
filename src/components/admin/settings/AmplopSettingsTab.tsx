"use client";

import { CreditCard, Plus, Trash2, Gift, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BankItem {
  brand: string;
  type: string;
  number: string;
  holder: string;
}

interface EwalletItem {
  brand: string;
  type: string;
  number: string;
  holder: string;
}

interface GiftAddressData {
  receiver: string;
  phone: string;
  address: string;
}

interface AmplopSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function AmplopSettingsTab({ formData, onChange }: AmplopSettingsTabProps) {
  const bankAccounts: BankItem[] = Array.isArray(formData.bankAccounts)
    ? (formData.bankAccounts as unknown as BankItem[])
    : [];

  const ewallets: EwalletItem[] = Array.isArray(formData.ewallets)
    ? (formData.ewallets as unknown as EwalletItem[])
    : [];

  const giftAddress: GiftAddressData =
    formData.giftAddress && typeof formData.giftAddress === "object"
      ? (formData.giftAddress as unknown as GiftAddressData)
      : { receiver: "", phone: "", address: "" };

  const handleBankChange = (index: number, field: keyof BankItem, val: string) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: val };
    onChange("bankAccounts", updated);
  };

  const addBankAccount = () => {
    const updated = [
      ...bankAccounts,
      { brand: "Bank BCA", type: "Transfer Bank", number: "", holder: formData.brideName || "Sinta Maria Utami" },
    ];
    onChange("bankAccounts", updated);
  };

  const removeBankAccount = (index: number) => {
    const updated = bankAccounts.filter((_, i) => i !== index);
    onChange("bankAccounts", updated);
  };

  const handleEwalletChange = (index: number, field: keyof EwalletItem, val: string) => {
    const updated = [...ewallets];
    updated[index] = { ...updated[index], [field]: val };
    onChange("ewallets", updated);
  };

  const addEwallet = () => {
    const updated = [
      ...ewallets,
      { brand: "DANA", type: "E-Wallet", number: "", holder: formData.brideName || "Sinta Maria Utami" },
    ];
    onChange("ewallets", updated);
  };

  const removeEwallet = (index: number) => {
    const updated = ewallets.filter((_, i) => i !== index);
    onChange("ewallets", updated);
  };

  const handleGiftAddressChange = (field: keyof GiftAddressData, val: string) => {
    const updated = { ...giftAddress, [field]: val };
    onChange("giftAddress", updated);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#6B1222]" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Rekening Bank Penerima
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Rekening untuk transfer tanda kasih langsung dari tamu.
                </CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBankAccount}
              className="self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah rekening</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada rekening bank yang ditambahkan.
            </div>
          ) : (
            bankAccounts.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Rekening #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeBankAccount(idx)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] text-slate-600">Nama bank</Label>
                    <Input
                      value={item.brand}
                      onChange={(e) => handleBankChange(idx, "brand", e.target.value)}
                      placeholder="Bank BCA / Mandiri / BNI"
                      className="bg-white h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-600">Nomor rekening</Label>
                    <Input
                      value={item.number}
                      onChange={(e) => handleBankChange(idx, "number", e.target.value)}
                      placeholder="1234567890"
                      className="bg-white font-mono h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-600">Nama pemilik rekening</Label>
                    <Input
                      value={item.holder}
                      onChange={(e) => handleBankChange(idx, "holder", e.target.value)}
                      placeholder="Sinta Maria Utami"
                      className="bg-white h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#6B1222]" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Dompet Digital (E-Wallet)
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Akun e-wallet seperti GoPay, OVO, atau DANA.
                </CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEwallet}
              className="self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah e-wallet</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ewallets.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada e-wallet yang ditambahkan.
            </div>
          ) : (
            ewallets.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    E-Wallet #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeEwallet(idx)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] text-slate-600">Penyedia</Label>
                    <Input
                      value={item.brand}
                      onChange={(e) => handleEwalletChange(idx, "brand", e.target.value)}
                      placeholder="DANA / OVO / GoPay"
                      className="bg-white h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-600">Nomor HP akun</Label>
                    <Input
                      value={item.number}
                      onChange={(e) => handleEwalletChange(idx, "number", e.target.value)}
                      placeholder="081234567890"
                      className="bg-white font-mono h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-600">Nama pemilik akun</Label>
                    <Input
                      value={item.holder}
                      onChange={(e) => handleEwalletChange(idx, "holder", e.target.value)}
                      placeholder="Sinta Maria Utami"
                      className="bg-white h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Alamat Pengiriman Kado Fisik
            </CardTitle>
          </div>
          <CardDescription>
            Alamat rumah mempelai apabila tamu ingin mengirimkan kado atau bingkisan fisik.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="giftReceiver">Nama penerima</Label>
              <Input
                id="giftReceiver"
                value={giftAddress.receiver}
                onChange={(e) => handleGiftAddressChange("receiver", e.target.value)}
                placeholder="Fauzan / Sinta"
              />
            </div>

            <div>
              <Label htmlFor="giftPhone">Nomor kontak penerima</Label>
              <Input
                id="giftPhone"
                value={giftAddress.phone}
                onChange={(e) => handleGiftAddressChange("phone", e.target.value)}
                placeholder="081234567890"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="giftAddress">Alamat lengkap pengiriman</Label>
            <Textarea
              id="giftAddress"
              value={giftAddress.address}
              onChange={(e) => handleGiftAddressChange("address", e.target.value)}
              placeholder="Jl. Raya No. 123, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
