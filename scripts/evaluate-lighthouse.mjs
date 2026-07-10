import fs from 'node:fs';

const reportPath = process.argv[2] || 'production-artifacts/lighthouse.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const categories = report.categories || {};
const audits = report.audits || {};

const values = {
  performance: Math.round((categories.performance?.score ?? 0) * 100),
  accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
  bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
  seo: Math.round((categories.seo?.score ?? 0) * 100),
  lcpMs: Math.round(audits['largest-contentful-paint']?.numericValue ?? Number.POSITIVE_INFINITY),
  cls: Number((audits['cumulative-layout-shift']?.numericValue ?? Number.POSITIVE_INFINITY).toFixed(3)),
  tbtMs: Math.round(audits['total-blocking-time']?.numericValue ?? Number.POSITIVE_INFINITY),
  speedIndexMs: Math.round(audits['speed-index']?.numericValue ?? Number.POSITIVE_INFINITY),
};

const thresholds = {
  performance: 70,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
  lcpMs: 4_000,
  cls: 0.25,
  tbtMs: 600,
};

const failures = [];
if (values.performance < thresholds.performance) failures.push(`Performance ${values.performance} < ${thresholds.performance}`);
if (values.accessibility < thresholds.accessibility) failures.push(`Accessibility ${values.accessibility} < ${thresholds.accessibility}`);
if (values.bestPractices < thresholds.bestPractices) failures.push(`Best Practices ${values.bestPractices} < ${thresholds.bestPractices}`);
if (values.seo < thresholds.seo) failures.push(`SEO ${values.seo} < ${thresholds.seo}`);
if (values.lcpMs > thresholds.lcpMs) failures.push(`LCP ${values.lcpMs}ms > ${thresholds.lcpMs}ms`);
if (values.cls > thresholds.cls) failures.push(`CLS ${values.cls} > ${thresholds.cls}`);
if (values.tbtMs > thresholds.tbtMs) failures.push(`TBT ${values.tbtMs}ms > ${thresholds.tbtMs}ms`);

const summary = {
  auditedAt: new Date().toISOString(),
  url: report.finalDisplayedUrl || report.finalUrl,
  values,
  thresholds,
  passed: failures.length === 0,
  failures,
};

fs.writeFileSync('production-artifacts/lighthouse-summary.json', JSON.stringify(summary, null, 2));
console.log(`LIGHTHOUSE_SUMMARY ${JSON.stringify(summary)}`);

if (failures.length > 0) {
  console.error('Production Lighthouse thresholds failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
