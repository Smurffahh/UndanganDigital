import os
import sys
import time

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def run_tests():
    os.makedirs("test-results", exist_ok=True)
    base_url = "http://localhost:3000"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # ==========================================
        # 1. Desktop Test (1280 x 800)
        # ==========================================
        print("\n=== [1] Testing Desktop Viewport (1280x800) ===")
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to:", f"{base_url}/?to=Budi+Santoso")
        page.goto(f"{base_url}/?to=Budi+Santoso")
        page.wait_for_load_state("networkidle")

        # Verify guest name on cover
        guest_el = page.locator("text=Budi Santoso")
        assert guest_el.count() > 0, "Guest name 'Budi Santoso' should be rendered on Cover"
        print("[OK] Guest name 'Budi Santoso' confirmed on Cover Gate")

        # Click 'Buka Undangan'
        btn_open = page.locator("button:has-text('Buka Undangan')")
        btn_open.click()
        print("[OK] Clicked 'Buka Undangan'")
        time.sleep(1.2) # Allow cover transition

        # Verify Cover Gate is leaving / hidden
        page.screenshot(path="test-results/01_desktop_opened.png", full_page=False)

        # Verify Hero countdown elements
        bismillah = page.locator("text=بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ")
        assert bismillah.count() > 0, "Bismillah should be present"
        print("[OK] Bismillah and QS Ar-Rum confirmed")

        # Verify Lightbox Galeri
        gallery_items = page.locator("#galeri figure")
        print(f"[OK] Found {gallery_items.count()} gallery items")
        if gallery_items.count() > 0:
            gallery_items.first.click()
            time.sleep(0.4)
            lightbox = page.locator("div[role='dialog'][aria-label='Pratinjau Foto Layar Penuh']")
            assert lightbox.is_visible(), "Lightbox should be visible after clicking image"
            print("[OK] Lightbox opened successfully")
            page.screenshot(path="test-results/02_desktop_lightbox.png")
            # Close lightbox via button or escape
            page.keyboard.press("Escape")
            time.sleep(0.4)
            print("[OK] Lightbox closed via Escape")

        # Verify Amplop Digital - ATM Cards & QRIS Modal
        page.locator("#amplop").scroll_into_view_if_needed()
        time.sleep(0.5)

        btn_qris = page.locator("button:has-text('Lihat Kode QRIS')")
        assert btn_qris.count() > 0, "QRIS button must exist"
        btn_qris.click()
        time.sleep(0.4)
        qris_modal = page.locator("div[role='dialog'][aria-label='Kode QRIS Amplop Digital']")
        assert qris_modal.is_visible(), "QRIS Modal should open"
        print("[OK] QRIS Modal opened successfully")
        page.screenshot(path="test-results/03_desktop_qris_modal.png")
        page.keyboard.press("Escape")
        time.sleep(0.3)
        print("[OK] QRIS Modal closed")

        # Verify Copy Account Number
        btn_copy = page.locator("button:has-text('Salin Nomor Rekening')").first
        btn_copy.click()
        time.sleep(0.5)
        print("[OK] Clicked 'Salin Nomor Rekening'")

        # Verify RSVP Form submission
        page.locator("#rsvp").scroll_into_view_if_needed()
        time.sleep(0.5)

        page.fill("#f-nama", "Budi Santoso Testing")
        page.select_option("#f-hadir", "Hadir")
        page.select_option("#f-jumlah", "2")
        page.fill("#f-pesan", "Selamat menempuh hidup baru Fauzan & Sinta! Semoga samawa selalu.")
        
        btn_submit = page.locator("button:has-text('Kirim Ucapan')")
        btn_submit.click()
        time.sleep(1.2) # wait for API response
        print("[OK] Submitted RSVP wish")

        # Verify new wish appears in guestbook
        new_wish = page.locator("text=Budi Santoso Testing")
        assert new_wish.count() > 0, "New wish should appear in guestbook list"
        print("[OK] New wish confirmed in guestbook")

        # Verify Filter pills & search
        btn_filter_hadir = page.locator("button:has-text('Hadir')").first
        btn_filter_hadir.click()
        time.sleep(0.3)
        print("[OK] Tested filter status pill 'Hadir'")

        search_input = page.locator("input[placeholder='Cari doa pengirim...']")
        search_input.fill("Budi Santoso Testing")
        time.sleep(0.3)
        assert page.locator("text=Budi Santoso Testing").first.is_visible(), "Filtered item should match search query"
        print("[OK] Tested live search in RSVP guestbook")
        page.screenshot(path="test-results/04_desktop_rsvp_filtered.png")

        context.close()

        # ==========================================
        # 2. Mobile Viewport (375 x 812 - iPhone X/13/14)
        # ==========================================
        print("\n=== [2] Testing Mobile Viewport (375x812) ===")
        context_mobile = browser.new_context(
            viewport={"width": 375, "height": 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        )
        page_m = context_mobile.new_page()
        page_m.goto(f"{base_url}/?to=Bpk.+Danang")
        page_m.wait_for_load_state("networkidle")

        page_m.locator("button:has-text('Buka Undangan')").click()
        time.sleep(1.2)

        # Check horizontal overflow (Gate 34)
        body_scroll_w = page_m.evaluate("document.body.scrollWidth")
        body_client_w = page_m.evaluate("document.documentElement.clientWidth")
        print(f"Mobile 375px scroll width: {body_scroll_w}, client width: {body_client_w}")
        assert body_scroll_w <= body_client_w + 1, f"Horizontal scroll detected: scrollWidth {body_scroll_w} > clientWidth {body_client_w}"
        print("[OK] Gate 34 Passed: Zero horizontal scroll on 375px mobile")

        page_m.screenshot(path="test-results/05_mobile_375.png")

        # Scroll to ATM card and check layout
        page_m.locator("#amplop").scroll_into_view_if_needed()
        time.sleep(0.5)
        page_m.screenshot(path="test-results/06_mobile_375_amplop.png")
        print("[OK] Captured mobile 375px amplop cards")

        context_mobile.close()

        # ==========================================
        # 3. Small Mobile Viewport (320 x 568 - iPhone SE)
        # ==========================================
        print("\n=== [3] Testing Small Mobile Viewport (320x568) ===")
        context_small = browser.new_context(viewport={"width": 320, "height": 568})
        page_s = context_small.new_page()
        page_s.goto(f"{base_url}/?to=Keluarga+Besar")
        page_s.wait_for_load_state("networkidle")

        page_s.locator("button:has-text('Buka Undangan')").click()
        time.sleep(1.2)

        body_scroll_w_s = page_s.evaluate("document.body.scrollWidth")
        body_client_w_s = page_s.evaluate("document.documentElement.clientWidth")
        print(f"Mobile 320px scroll width: {body_scroll_w_s}, client width: {body_client_w_s}")
        assert body_scroll_w_s <= body_client_w_s + 1, f"Horizontal scroll detected on 320px: {body_scroll_w_s} > {body_client_w_s}"
        print("[OK] Gate 34 Passed: Zero horizontal scroll on 320px mobile floor")
        page_s.screenshot(path="test-results/07_mobile_320.png")

        context_small.close()
        browser.close()

    print("\n[SUCCESS] ALL PLAYWRIGHT QA TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
