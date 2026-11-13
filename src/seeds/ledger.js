const RECENT_LIMIT = 20

/**
 * @param {object|undefined} initial
 * @returns {object}
 */
export function createSeedLedger(initial = undefined) {
  const state = {
    totalSeeds: initial?.totalSeeds ?? 0,
    awardedEventIds: [...(initial?.awardedEventIds ?? [])],
    recentAwards: [...(initial?.recentAwards ?? [])],
  }
  return bind(state)
}

/**
 * @param {{totalSeeds: number, awardedEventIds: string[], recentAwards: object[]}} state
 */
function bind(state) {
  return {
    schemaVersion: 1,
    totalSeeds: state.totalSeeds,
    awardedEventIds: state.awardedEventIds,
    recentAwards: state.recentAwards,
    /**
     * @param {{scope?: string, id?: string, outcome?: string, automatic?: boolean, at?: number}} input
     */
    award(input) {
      if (input?.automatic === true) {
        return { awarded: false, reason: 'automatic-disabled', ledger: bind(state) }
      }
      if (typeof input?.id !== 'string' || input.id === '' || typeof input.scope !== 'string' || input.scope === '') {
        return { awarded: false, reason: 'missing-id', ledger: bind(state) }
      }
      if (input.outcome !== 'completed') {
        return { awarded: false, reason: 'not-completed', ledger: bind(state) }
      }
      const key = `${input.scope}:${input.id}`
      if (state.awardedEventIds.includes(key)) {
        return { awarded: false, reason: 'duplicate', ledger: bind(state) }
      }
      const next = {
        totalSeeds: state.totalSeeds + 1,
        awardedEventIds: [...state.awardedEventIds, key],
        recentAwards: [
          { id: key, at: typeof input.at === 'number' ? input.at : Date.now() },
          ...state.recentAwards,
        ].slice(0, RECENT_LIMIT),
      }
      return { awarded: true, reason: 'awarded', ledger: bind(next) }
    },
    clear() {
      return bind({ totalSeeds: 0, awardedEventIds: [], recentAwards: [] })
    },
  }
}
