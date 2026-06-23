import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { homeData, pageData, siteNav } from '../data/home';

describe('site data', () => {
  it('contains the required homepage sections', () => {
    expect(homeData.hero.title).toContain('批文批号');
    expect(homeData.hero.image).toBe('/images/hero-compliance.png');
    expect(homeData.hero.cards).toHaveLength(4);
    expect(homeData.services).toHaveLength(6);
    expect(homeData.advantages).toHaveLength(4);
    expect(homeData.processSteps).toHaveLength(5);
    expect(homeData.news.length).toBeGreaterThanOrEqual(4);
    expect(homeData.cases.length).toBeGreaterThanOrEqual(4);
    expect(homeData.footer.company).toBe('北京杰东认证服务有限公司');
  });

  it('defines second-level website pages', () => {
    expect(siteNav.map((item) => item.href)).toEqual([
      '/',
      '/about',
      '/services',
      '/process',
      '/news',
      '/cases',
      '/contact'
    ]);
    expect(pageData.about.capabilities).toHaveLength(4);
    expect(pageData.services.matrix).toHaveLength(4);
    expect(pageData.process.documents).toHaveLength(3);
    expect(pageData.news.topics).toHaveLength(3);
    expect(pageData.cases.safeguards).toHaveLength(3);
    expect(pageData.contact.methods).toHaveLength(3);
  });

  it('uses local SVG icon files for every declared icon name', () => {
    const iconNames = new Set<string>();

    homeData.hero.cards.forEach((item) => iconNames.add(item.icon));
    homeData.services.forEach((item) => {
      iconNames.add(item.icon);
      item.details?.forEach(() => iconNames.add('task_alt'));
    });
    homeData.advantages.forEach((item) => iconNames.add(item.icon));
    homeData.processSteps.forEach((item) => iconNames.add(item.icon));
    ['call', 'mail', 'location_on', 'arrow_forward', 'arrow_outward', 'calendar_month', 'menu', 'close'].forEach((name) =>
      iconNames.add(name)
    );

    Object.values(pageData).forEach((page) => {
      iconNames.add(page.hero.icon);
    });
    pageData.about.capabilities.forEach((item) => iconNames.add(item.icon));
    pageData.services.matrix.forEach((item) => iconNames.add(item.icon));
    pageData.process.documents.forEach((item) => iconNames.add(item.icon));
    pageData.news.topics.forEach((item) => iconNames.add(item.icon));
    pageData.cases.safeguards.forEach((item) => iconNames.add(item.icon));
    pageData.contact.methods.forEach((item) => iconNames.add(item.icon));
    ['check_circle', 'workspace_premium'].forEach((name) => iconNames.add(name));

    for (const name of iconNames) {
      expect(existsSync(resolve(process.cwd(), `public/images/icons/${name}.svg`)), `${name}.svg`).toBe(true);
    }
  });
});
