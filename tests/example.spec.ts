import { describe, expect, it } from 'vitest'
import {
  COMPANY_CATALOG_SOURCE_KEY,
  FALLBACK_CATALOG_SOURCE_KEY,
  companyCatalogBuiltinKeys,
  companyCatalogSelected,
  resolveCompanyCatalogSource,
} from '../src/catalog.ts'
import { EXAMPLE_COMPANY_IDENTITY, name } from '../src/index.ts'
import {
  WORKSPACE_RECOMMENDED_PLUGINS,
  isRecommendedPackage,
  recommendedPluginsFor,
  summarizeInstallResults,
} from '../src/recommendations.ts'
import { en, zh } from '../src/client/locales.ts'

describe('company example plugin', () => {
  it('exposes a stable Cordis name and SSO extension point without secrets', () => {
    expect(name).toBe('company-example')
    expect(EXAMPLE_COMPANY_IDENTITY.displayName).toBe('Example Company')
    expect(EXAMPLE_COMPANY_IDENTITY.organizationId).toBeUndefined()
    expect(JSON.stringify(EXAMPLE_COMPANY_IDENTITY)).not.toMatch(/secret|token|password|api[_-]?key/iu)
  })

  it('keeps locale keys aligned', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(zh).sort())
    expect(zh.tabBuiltin).toBe('内置')
    expect(zh.tabEnterprise).toBe('企业内部')
    expect(zh.tabCurated).toBe('精选推荐')
    expect(en.tabCurated).toBe('Featured')
    expect(en.catalogBody).toContain('company-1024store')
  })

  it('prefers company catalog then falls back to public 1024Store', () => {
    expect(COMPANY_CATALOG_SOURCE_KEY).toBe('company-1024store')
    expect(FALLBACK_CATALOG_SOURCE_KEY).toBe('dsh-1024store')
    expect(companyCatalogBuiltinKeys()).toEqual(['company-1024store', 'dsh-1024store'])
    expect(companyCatalogSelected([
      { sourceRecordId: 'a', enabled: true, builtInProviderKey: 'dsh-1024store' },
    ])).toBe(true)
    expect(companyCatalogSelected([
      { sourceRecordId: 'b', enabled: true, builtInProviderKey: 'company-1024store' },
    ])).toBe(true)
    expect(companyCatalogSelected([
      { sourceRecordId: 'c', enabled: false, builtInProviderKey: 'dsh-1024store' },
    ])).toBe(false)
    expect(resolveCompanyCatalogSource([
      { sourceRecordId: 'fallback', enabled: true, builtInProviderKey: 'dsh-1024store' },
      { sourceRecordId: 'company', enabled: true, builtInProviderKey: 'company-1024store' },
    ])?.sourceRecordId).toBe('company')
  })

  it('curates workspace recommendations without making them a silent boot list', () => {
    expect(WORKSPACE_RECOMMENDED_PLUGINS.map(plugin => plugin.packageName)).toEqual([
      'dsh-better-sidebar',
      'dsh-context',
    ])
    expect(recommendedPluginsFor('office-im').map(plugin => plugin.packageName)).toEqual([
      'dsh-dingtalk-channel',
      'dsh-wecom',
    ])
    expect(isRecommendedPackage('dsh-context')).toBe(true)
    expect(isRecommendedPackage('dsh-im')).toBe(false)
    expect(summarizeInstallResults([
      { packageName: 'dsh-context', status: 'installed' },
    ])).toBe('installRestart')
  })
})
