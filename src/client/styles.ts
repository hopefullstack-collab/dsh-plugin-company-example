const STYLE_ID = 'dsh-plugin-company-example/client'

/** Market-matched chrome for the Example Company Settings hub. */
const css = `
.dshCompanyRoot {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  min-height: 460px;
  color: var(--dsw-alias-label-primary);
}

.dshCompanyHeader,
.dshCompanyViewBar,
.dshCompanySectionHead,
.dshCompanyToolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dshCompanyHeader,
.dshCompanySectionHead {
  align-items: flex-start;
}

.dshCompanyHeaderTitle,
.dshCompanySectionHead > div {
  min-width: 0;
  flex: 1;
}

.dshCompanyHeaderTitle h2,
.dshCompanySectionHead h2 {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.dshCompanyHeaderTitle p,
.dshCompanySectionHead p {
  margin: 3px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}

.dshCompanyViewBar {
  justify-content: space-between;
  flex-wrap: wrap;
}

.dshCompanyViewSwitch {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.dshCompanyPill {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}

.dshCompanyPill[data-active="true"],
.dshCompanyPill[aria-pressed="true"] {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dshCompanyPill:hover {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2));
}

.dshCompanyPill:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, var(--dsw-alias-border-l4));
  outline-offset: 2px;
}

.dshCompanyPillStatic {
  cursor: default;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyVersionChip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyVersionChip strong {
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dshCompanyContent {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dshCompanySection {
  min-width: 0;
}

.dshCompanySectionHead {
  margin-bottom: 12px;
}

.dshCompanyToolbar {
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.dshCompanyBanner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
}

.dshCompanyBanner[data-tone="error"] {
  color: var(--dsw-alias-label-danger, #c43c3c);
}

.dshCompanyBanner[data-tone="ok"] {
  color: var(--dsw-alias-label-secondary);
}

.dshCompanyGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 680px) {
  .dshCompanyGrid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.dshCompanyCard {
  appearance: none;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 150px;
  padding: 15px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-3);
  color: inherit;
  font: inherit;
  text-align: left;
}

.dshCompanyCardInteractive {
  cursor: pointer;
}

.dshCompanyCardInteractive:hover:not(:disabled) {
  border-color: var(--dsw-alias-border-l3);
  background: var(--dsw-alias-interactive-bg-hover);
  box-shadow: var(--dsw-shadow-lv1);
}

.dshCompanyCard:disabled {
  cursor: not-allowed;
  opacity: 0.62;
  box-shadow: none;
}

.dshCompanyCardTop {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.dshCompanyGlyph {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--dsw-alias-state-business-tertiary, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-state-business-primary, var(--dsw-alias-label-primary));
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.dshCompanyCardName {
  min-width: 0;
  flex: 1;
}

.dshCompanyCardName strong,
.dshCompanyCardName span {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dshCompanyCardName strong {
  font-size: 14px;
  line-height: 20px;
}

.dshCompanyCardName span {
  margin-top: 2px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 17px;
}

.dshCompanySummary {
  display: -webkit-box;
  margin: 12px 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 19px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.dshCompanyTags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: auto;
  overflow: hidden;
}

.dshCompanyTag {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 1px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyTagAction {
  appearance: none;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}

.dshCompanyTagAction:hover:not(:disabled) {
  border-color: var(--dsw-alias-border-l3);
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2));
}

.dshCompanyTagAction:disabled {
  opacity: 0.55;
  cursor: default;
}

.dshCompanyButton {
  appearance: none;
  min-height: 32px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--dsw-alias-bg-brand, var(--dsw-alias-label-primary));
  color: var(--dsw-alias-label-on-brand, #fff);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}

.dshCompanyButton:disabled {
  opacity: 0.55;
  cursor: default;
}

.dshCompanyButtonSecondary {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-primary);
}

.dshCompanyFacts {
  margin: 0;
  padding: 0 0 0 18px;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 22px;
}

.dshCompanyFacts code {
  font-family: var(--ds-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 12px;
}

.dshCompanyGroup {
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px 16px;
}

.dshCompanyRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dshCompanyRow:last-child {
  border-bottom: none;
}

.dshCompanyRowText {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.dshCompanyRowTitle {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 20px;
}

.dshCompanyRowDesc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyRowValue {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
}
`

/** Install company settings stylesheet. */
export function installCompanyStyles(): () => void {
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) return () => { existing.remove() }
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = css
  document.head.appendChild(style)
  return () => { style.remove() }
}
