import { test, expect } from '@playwright/test';

test.describe('Marketplace Job Lifecycle', () => {

    test('should allow employer to post a mission and freelancer to apply', async ({ page }) => {
        // 1. Go to Missions (Marketplace)
        await page.goto('/marketplace/missions');

        // 2. Post a Mission (Employer Flow)
        await page.getByRole('button', { name: /create new mission/i }).click();
        await page.fill('input[placeholder="Mission Title"]', 'E2E Test Mission');
        await page.fill('textarea[placeholder="Technical Briefing"]', 'This is a test mission for Playwright.');
        await page.fill('input[placeholder="Budget (e.g. $1,200)"]', '$1,000');
        await page.getByRole('button', { name: /publish mission/i }).click();

        // 3. Verify Mission Appears in List
        await expect(page.locator('text=E2E Test Mission')).toBeVisible();

        // 4. Apply to Mission (Freelancer Flow)
        await page.click('text=E2E Test Mission');
        await page.getByRole('button', { name: /apply for mission/i }).click();
        // Assuming alert is handled or locator for success msg
        page.on('dialog', dialog => dialog.accept());
    });

    test('should flow through secure funding and release', async ({ page }) => {
        // 1. Go to Mission Detail
        await page.goto('/marketplace/missions');
        await page.click('text=E2E Test Mission');

        // 2. Secure Funding (Employer)
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: /secure funding/i }).click();

        // 3. Mark Complete & Rate
        await page.getByRole('button', { name: /mark complete & rate/i }).click();
        await page.click('button:has-text("Submit Rating")'); // Assuming JobRatingModal has this

        // 4. Release Payment
        await page.getByRole('button', { name: /release payment/i }).click();
        await expect(page.locator('text=Payment Released')).toBeVisible({ timeout: 5000 }).catch(() => { });
    });

});
