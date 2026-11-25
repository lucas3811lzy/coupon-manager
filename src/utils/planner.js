/**
 * Find the highest possible coupon savings within the spend budget.
 * When savings tie, prefer a plan that draws from fewer banks.
 */
export function optimize (banks, budget, state, faces, times) {
  const limit = Math.min(50000, Math.max(0, Math.floor(Number(budget) || 0)))
  if (!limit || !Number.isFinite(Number(budget)) || Number(budget) > 50000) return { saving: 0, plan: [] }

  const isBetter = (candidate, current) => {
    if (!current) return true
    if (candidate.saving !== current.saving) return candidate.saving > current.saving
    return candidate.bankCount < current.bankCount
  }

  const dp = new Array(limit + 1).fill(null)
  dp[0] = { saving: 0, plan: [], bankCount: 0 }
  for (const bank of banks) {
    // Keep plans using this bank separate until all its coupons have been considered.
    // Adding another coupon from this bank to one of those plans costs no extra bank.
    const withBank = new Array(limit + 1).fill(null)
    for (const face of faces) {
      const available = Math.max(0, state[bank][face].got - state[bank][face].used)
      const threshold = face * times
      const coupon = { bank, face, count: 1, saving: face }
      for (let count = 0; count < Math.min(available, Math.floor(limit / threshold)); count++) {
        for (let spent = limit - threshold; spent >= 0; spent--) {
          const previous = dp[spent]
          const active = withBank[spent]
          if (!previous && !active) continue

          const useActive = active && (!previous || active.bankCount <= previous.bankCount + 1)
          const base = useActive ? active : previous
          const nextSpent = spent + threshold
          const candidate = {
            saving: base.saving + face,
            plan: [...base.plan, coupon],
            bankCount: base.bankCount + (useActive ? 0 : 1)
          }
          if (isBetter(candidate, withBank[nextSpent])) withBank[nextSpent] = candidate
        }
      }
    }

    for (let spent = 0; spent <= limit; spent++) {
      if (withBank[spent] && isBetter(withBank[spent], dp[spent])) dp[spent] = withBank[spent]
    }
  }

  const { saving, plan } = dp.reduce((best, candidate) => candidate && isBetter(candidate, best) ? candidate : best, dp[0])
  return { saving, plan }
}
