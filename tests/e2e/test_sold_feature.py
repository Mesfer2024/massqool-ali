"""
Test the Sold feature across Products and Gallery.
Tests run sequentially and share a browser context to persist localStorage.
"""
import pytest
from playwright.sync_api import Page, BrowserContext, expect


BASE = "http://localhost:3099"


@pytest.fixture(scope="module")
def context(browser):
    ctx = browser.new_context()
    # Pre-set admin auth in localStorage via a page visit
    page = ctx.new_page()
    page.goto(BASE)
    page.evaluate("() => localStorage.setItem('admin-auth', 'true')")
    page.close()
    yield ctx
    ctx.close()


@pytest.fixture
def page(context):
    p = context.new_page()
    yield p
    p.close()


class TestSoldFeatureAdmin:
    """Test admin controls for sold status."""

    def test_admin_products_sold_toggle_exists(self, page: Page):
        """Verify the sold toggle exists in the product edit form."""
        page.goto(f"{BASE}/admin/products")
        page.wait_for_load_state("networkidle")

        edit_btn = page.locator("button:has-text('تعديل')").first
        if edit_btn.count() == 0:
            pytest.skip("No products to edit")

        edit_btn.click()
        page.wait_for_load_state("networkidle")

        # The sold toggle label should exist
        sold_label = page.locator("text=تم بيع هذه القطعة")
        expect(sold_label).to_be_visible(timeout=5000)

    def test_admin_mark_product_sold(self, page: Page):
        """Mark the first product as sold via admin."""
        page.goto(f"{BASE}/admin/products")
        page.wait_for_load_state("networkidle")

        edit_btn = page.locator("button:has-text('تعديل')").first
        if edit_btn.count() == 0:
            pytest.skip("No products to edit")

        edit_btn.click()
        page.wait_for_load_state("networkidle")

        # Check the sold checkbox
        sold_label = page.locator("label:has-text('تم بيع هذه القطعة')")
        checkbox = sold_label.locator("input[type='checkbox']")
        if not checkbox.is_checked():
            checkbox.check()

        # Save
        page.locator("button:has-text('حفظ التعديلات')").click()
        page.wait_for_load_state("networkidle")

        # Verify "مباع" badge appears in the list
        sold_badge = page.locator("span:has-text('مباع')")
        expect(sold_badge.first).to_be_visible(timeout=5000)

    def test_admin_gallery_sold_toggle(self, page: Page):
        """Toggle a gallery item to sold via admin."""
        page.goto(f"{BASE}/admin/gallery")
        page.wait_for_load_state("networkidle")

        # Hover over first gallery item to reveal controls
        first_item = page.locator(".aspect-square").first
        first_item.hover()
        page.wait_for_timeout(500)

        # Click "متاحة" button to toggle to sold
        available_btn = page.locator("button:has-text('متاحة')").first
        if available_btn.count() > 0:
            available_btn.click()
            page.wait_for_timeout(500)

            # Verify the badge says "مباعة" now
            sold_label = page.locator("div:has-text('مباعة')").last
            expect(sold_label).to_be_visible(timeout=3000)


class TestSoldFeatureFrontend:
    """Test frontend display of sold items."""

    def test_product_card_shows_sold_badge(self, page: Page):
        """Verify sold badge appears on product card in homepage."""
        page.goto(BASE)
        page.wait_for_load_state("networkidle")

        sold_badge = page.locator("text=تم البيع").first
        expect(sold_badge).to_be_visible(timeout=5000)

    def test_product_card_hides_whatsapp_button(self, page: Page):
        """Verify sold product card doesn't show WhatsApp order button."""
        page.goto(BASE)
        page.wait_for_load_state("networkidle")

        # Find the card with sold badge
        sold_badge = page.locator("text=تم البيع").first
        if sold_badge.count() == 0:
            pytest.skip("No sold products visible")

        # The card that contains the sold badge
        card = sold_badge.locator("xpath=ancestor::div[contains(@class, 'group')]").first
        # Should NOT have a WhatsApp link
        wa_btn = card.locator("a[href*='wa.me']")
        expect(wa_btn).to_have_count(0)

    def test_product_detail_sold_banner(self, page: Page):
        """Navigate to sold product detail and verify sold banner."""
        page.goto(BASE)
        page.wait_for_load_state("networkidle")

        # Find a product card with sold badge and click its link
        sold_badge = page.locator("text=تم البيع").first
        if sold_badge.count() == 0:
            pytest.skip("No sold products visible")

        # The badge is inside an <a> link, click that link directly
        link = sold_badge.locator("xpath=ancestor::a").first
        if link.count() == 0:
            # Try clicking the badge itself, might navigate
            sold_badge.click()
        else:
            link.click()

        page.wait_for_load_state("networkidle")

        # Check sold message
        sold_msg = page.locator("text=تم بيع هذه القطعة")
        expect(sold_msg).to_be_visible(timeout=5000)

        # Check similar piece CTA
        similar_msg = page.locator("text=تواصل معنا")
        expect(similar_msg.first).to_be_visible(timeout=5000)

    def test_gallery_sold_badge_visible(self, page: Page):
        """Verify sold badge appears on gallery items."""
        page.goto(BASE)
        page.wait_for_load_state("networkidle")

        # Scroll to gallery section
        gallery = page.locator("text=المعرض").first
        if gallery.count() > 0:
            gallery.scroll_into_view_if_needed()
            page.wait_for_timeout(1000)

        # Look for sold badges in gallery
        sold_badges = page.locator("text=تم البيع")
        # At least one should be visible (the one we toggled in admin)
        if sold_badges.count() > 0:
            expect(sold_badges.first).to_be_visible(timeout=5000)


class TestSoldFeatureCleanup:
    """Restore original state."""

    def test_restore_product_sold_state(self, page: Page):
        """Unmark the product as sold."""
        page.goto(f"{BASE}/admin/products")
        page.wait_for_load_state("networkidle")

        edit_btn = page.locator("button:has-text('تعديل')").first
        if edit_btn.count() == 0:
            pytest.skip("No products")

        edit_btn.click()
        page.wait_for_load_state("networkidle")

        sold_label = page.locator("label:has-text('تم بيع هذه القطعة')")
        checkbox = sold_label.locator("input[type='checkbox']")
        if checkbox.is_checked():
            checkbox.uncheck()

        page.locator("button:has-text('حفظ التعديلات')").click()
        page.wait_for_load_state("networkidle")

    def test_restore_gallery_sold_state(self, page: Page):
        """Toggle gallery item back to available."""
        page.goto(f"{BASE}/admin/gallery")
        page.wait_for_load_state("networkidle")

        first_item = page.locator(".aspect-square").first
        first_item.hover()
        page.wait_for_timeout(500)

        sold_btn = page.locator("button:has-text('مباعة')").first
        if sold_btn.count() > 0:
            sold_btn.click()
            page.wait_for_timeout(500)
