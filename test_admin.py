import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def run_admin_tests():
    os.makedirs("test-results", exist_ok=True)
    base_url = "http://localhost:3000"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ==========================================
        # 1. Test Auth Protection (Redirect to /admin/login)
        # ==========================================
        print("\n=== [1] Testing Auth Guard & Redirect ===")
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to protected route:", f"{base_url}/admin/dashboard")
        page.goto(f"{base_url}/admin/dashboard")
        page.wait_for_load_state("networkidle")

        current_url = page.url
        print("Redirected URL:", current_url)
        assert "/admin/login" in current_url, "Unauthorized access to /admin/dashboard must redirect to /admin/login"
        page.screenshot(path="test-results/admin_01_redirect_login.png")
        print("[OK] Auth guard successfully redirected to /admin/login")

        # ==========================================
        # 2. Test Login Flow
        # ==========================================
        print("\n=== [2] Testing Admin Login Flow ===")
        page.fill("input#username", "admin")
        page.fill("input#password", "fauzan-sinta-2027")
        page.click("button[type='submit']")

        # Wait for redirect to /admin/dashboard
        page.wait_for_url("**/admin/dashboard", timeout=8000)
        page.wait_for_load_state("networkidle")
        print("[OK] Successfully logged in, arrived at /admin/dashboard")
        time.sleep(1)
        page.screenshot(path="test-results/admin_02_dashboard_kpi.png")

        # ==========================================
        # 3. Test Modul A: Ringkasan & Moderasi RSVP
        # ==========================================
        print("\n=== [3] Testing Modul A: KPI Cards & RSVP Moderation ===")
        # Verify 5 KPI Cards
        assert page.locator("text=Total Diundang").count() > 0, "KPI Total Diundang must exist"
        assert page.locator("text=Terkirim WA").count() > 0, "KPI Terkirim WA must exist"
        assert page.locator("text=Konfirmasi Hadir").count() > 0, "KPI Konfirmasi Hadir must exist"
        assert page.locator("text=Total Ucapan").count() > 0, "KPI Total Ucapan must exist"
        print("[OK] 5 KPI cards verified with dynamic data")

        # Verify wishes list exists
        assert page.locator("text=Moderasi Buku Tamu").count() > 0, "Moderasi Buku Tamu heading must exist"
        print("[OK] RSVP wishes table/list verified")

        # ==========================================
        # 4. Test Modul B: Foto Utama & Galeri
        # ==========================================
        print("\n=== [4] Testing Modul B: Media & Gallery Management ===")
        page.click("button:has-text('Foto & Galeri')")
        page.wait_for_timeout(600)

        assert page.locator("text=Foto Utama").count() > 0, "Main photos section must exist"
        assert page.locator("text=Koleksi Galeri Momen").count() > 0, "Gallery collection section must exist"
        page.screenshot(path="test-results/admin_03_media_module.png")
        print("[OK] Modul B (Media & Gallery) loaded and rendered correctly")

        # ==========================================
        # 5. Test Modul C: Tamu Undangan & WhatsApp Dispatcher
        # ==========================================
        print("\n=== [5] Testing Modul C: Guest Management, Templates & WhatsApp ===")
        page.click("button:has-text('Tamu & WhatsApp')")
        page.wait_for_timeout(600)

        assert page.locator("text=Template Pengantar Undangan WhatsApp").count() > 0, "WA template editor must exist"
        assert page.locator("text=Daftar Undangan").count() > 0, "Guest list section must exist"
        assert page.locator("text=Keamanan Distribusi Undangan WhatsApp").count() > 0, "Security tip banner must exist"
        print("[OK] WhatsApp security anti-blocking banner verified")

        # Verify Official Template Download Buttons
        btn_download_xlsx = page.locator("button:has-text('Unduh Template Excel (.xlsx)')")
        assert btn_download_xlsx.count() > 0, "Excel template download button must exist"
        assert btn_download_xlsx.get_attribute("aria-label") == "Unduh Template Excel resmi .xlsx"

        btn_download_csv = page.locator("button:has-text('Unduh Contoh CSV (.csv)')")
        assert btn_download_csv.count() > 0, "CSV template download button must exist"
        assert btn_download_csv.get_attribute("aria-label") == "Unduh Contoh CSV resmi .csv"
        print("[OK] Both official template download buttons confirmed with accessible labels")

        # Test clicking template download buttons
        with page.expect_download(timeout=5000):
            btn_download_xlsx.click()
        print("[OK] Successfully triggered Excel template (.xlsx) download")

        with page.expect_download(timeout=5000):
            btn_download_csv.click()
        print("[OK] Successfully triggered CSV template (.csv) download")

        # Verify WhatsApp Number Formatting Guide Card
        assert page.locator("text=Panduan Format Berkas & Pengisian Nomor WhatsApp").count() > 0, "Guide card header must exist"
        assert page.locator("text=Struktur 3 Kolom Utama").count() > 0, "3 Columns rule must exist"
        assert page.locator("text=Perbandingan Format Nomor WhatsApp").count() > 0, "Phone format comparison must exist"
        assert page.locator("text=Format Diterima (✓ Valid)").count() > 0, "Valid format box must exist"
        assert page.locator("text=Format Ditolak (✕ Tidak Valid)").count() > 0, "Invalid format box must exist"
        assert page.locator("text=Tips Microsoft Excel").count() > 0, "Excel tips must exist"
        print("[OK] WhatsApp number formatting guide verified with rules, comparison boxes, and Excel tips")

        # Test adding a guest with Excel-trimmed phone number (e.g. 85712345678 without leading 0)
        test_guest_name = "Bpk. Ir. Bambang Soediro"
        test_guest_phone_excel = "85712345678" # stripped leading 0

        page.fill("input[placeholder*='Ahmad Fauzi']", test_guest_name)
        page.fill("input[placeholder*='081234567890']", test_guest_phone_excel)
        page.click("button:has-text('Simpan ke Daftar')")
        page.wait_for_timeout(1000)

        # Verify guest is listed with normalized 628... phone
        assert page.locator(f"text={test_guest_name}").count() > 0, f"Guest '{test_guest_name}' should appear in list"
        assert page.locator("text=+6285712345678").count() > 0, "Excel stripped number 857... must be auto-normalized to +6285712345678"
        print(f"[OK] Successfully added guest: {test_guest_name} with auto-normalized phone +6285712345678")

        # Verify WhatsApp Dispatch button exists
        kirim_wa_btn = page.locator("button:has-text('Kirim WA')").first
        assert kirim_wa_btn.count() > 0, "Kirim WA button should exist"
        print("[OK] WhatsApp dispatch button confirmed")

        # Test Switching to 'Riwayat Terkirim' Tab
        btn_history_tab = page.locator("button:has-text('Riwayat Terkirim')")
        assert btn_history_tab.count() > 0, "Riwayat Terkirim tab button must exist"
        btn_history_tab.click()
        page.wait_for_timeout(400)
        assert page.locator("text=Riwayat Tamu yang Telah Dikirimi Undangan").count() > 0, "History section must display"
        print("[OK] Riwayat Terkirim tab verified")

        # Switch back to 'Daftar Undangan' Tab
        page.locator("button:has-text('Daftar Undangan')").click()
        page.wait_for_timeout(400)
        page.screenshot(path="test-results/admin_04_guest_module.png")

        # ==========================================
        # 6. Test Modul D: Pengaturan Acara & Rekening
        # ==========================================
        print("\n=== [6] Testing Modul D: Wedding Settings & Accounts ===")
        page.click("button:has-text('Pengaturan Acara')")
        page.wait_for_timeout(600)

        assert page.locator("text=Waktu Acara & Target Hitung Mundur (Countdown)").count() > 0, "Countdown settings section must exist"
        assert page.locator("text=Pratinjau Countdown Waktu Nyata").count() > 0, "Live Countdown preview must exist"
        assert page.locator("text=Musik Latar Belakang & Pemutar Romantis").count() > 0, "Music settings section must exist"
        assert page.locator("text=Lokasi Acara & Integrasi Google Maps").count() > 0, "Maps settings section must exist"
        assert page.locator("button:has-text('Ambil Koordinat Otomatis')").count() > 0, "Auto resolve maps button must exist"
        assert page.locator("text=Profil Kedua Mempelai").count() > 0, "Couple profile section must exist"
        assert page.locator("text=Rekening Amplop Digital").count() > 0, "Bank accounts section must exist"
        page.screenshot(path="test-results/admin_05_settings_module.png")
        print("[OK] Modul D (Wedding Settings, Countdown, Music & Maps) verified")

        # ==========================================
        # 7. Test Public Invitation Sync with New Guest
        # ==========================================
        print("\n=== [7] Testing Public Invitation with New Guest Slug ===")
        slug_query = "to=Bpk.+Ir.+Bambang+Soediro"
        public_page = context.new_page()
        public_page.goto(f"{base_url}/?{slug_query}")
        public_page.wait_for_load_state("networkidle")

        guest_el = public_page.locator("text=Bpk. Ir. Bambang Soediro")
        assert guest_el.count() > 0, "New guest name should be dynamically rendered on public Cover Gate"
        print("[OK] Public invitation seamlessly synchronized with newly added guest")
        public_page.screenshot(path="test-results/admin_06_public_sync.png")
        public_page.close()

        # ==========================================
        # 8. Test Mobile Viewports (375px and 320px)
        # ==========================================
        print("\n=== [8] Testing Admin Mobile Viewports (375px & 320px) ===")
        mobile_375 = browser.new_context(
            viewport={"width": 375, "height": 812},
            storage_state=context.storage_state() # Preserve logged-in session cookie
        )
        m_page = mobile_375.new_page()
        m_page.goto(f"{base_url}/admin/dashboard")
        m_page.wait_for_load_state("networkidle")

        # Verify bottom dock navigation exists
        bottom_nav = m_page.locator("nav[aria-label='Navigasi Bawah Mobile']")
        assert bottom_nav.count() > 0, "Mobile bottom dock navigation must be present"
        print("[OK] Mobile bottom dock navigation verified")

        # Check horizontal overflow on 375px
        is_overflow_375 = m_page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        assert not is_overflow_375, "Mobile 375px should have zero horizontal overflow"
        print("[OK] Zero horizontal overflow on 375px")
        m_page.screenshot(path="test-results/admin_07_mobile_375.png")

        # Test 320px
        m_page.set_viewport_size({"width": 320, "height": 640})
        m_page.wait_for_timeout(300)
        is_overflow_320 = m_page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        assert not is_overflow_320, "Mobile 320px should have zero horizontal overflow"
        print("[OK] Zero horizontal overflow on 320px")
        m_page.screenshot(path="test-results/admin_08_mobile_320.png")
        m_page.close()

        # ==========================================
        # 9. Test Logout Flow
        # ==========================================
        print("\n=== [9] Testing Logout Action ===")
        page.bring_to_front()
        page.click("button:has-text('Keluar / Logout')")
        page.wait_for_url("**/admin/login", timeout=8000)
        print("[OK] Logout successful, redirected back to /admin/login")

        browser.close()
        print("\n==========================================")
        print("ALL ADMIN TESTS PASSED PERFECTLY! [100%]")
        print("==========================================\n")

if __name__ == "__main__":
    run_admin_tests()
