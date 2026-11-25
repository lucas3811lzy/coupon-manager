import test from 'node:test'
import assert from 'node:assert/strict'
import { optimize } from '../src/utils/planner.js'

const faces = [10, 20, 50, 100, 200]
const times = 3

function inventory (entries) {
  const state = {}
  for (const [bank, coupons] of Object.entries(entries)) {
    state[bank] = Object.fromEntries(faces.map(face => [face, { got: coupons[face] || 0, used: 0 }]))
  }
  return state
}

test('prefers coupons from one bank when mixed and single-bank plans save the same amount', () => {
  const state = inventory({
    bankA: { 10: 1, 200: 1 },
    bankB: { 10: 1 }
  })

  const result = optimize(['bankA', 'bankB'], 630, state, faces, times)

  assert.equal(result.saving, 210)
  assert.deepEqual(new Set(result.plan.map(item => item.bank)), new Set(['bankA']))
  assert.deepEqual(result.plan.map(item => item.face).sort((a, b) => a - b), [10, 200])
})

test('uses multiple banks when that produces greater savings', () => {
  const state = inventory({
    bankA: { 200: 1 },
    bankB: { 10: 1 }
  })

  const result = optimize(['bankA', 'bankB'], 630, state, faces, times)

  assert.equal(result.saving, 210)
  assert.equal(new Set(result.plan.map(item => item.bank)).size, 2)
})

test('keeps both Macau Pass coupons when Bank of China is evaluated first', () => {
  const state = inventory({ boc: { 10: 1 }, macaupass: { 10: 1, 200: 1 } })

  const result = optimize(['boc', 'macaupass'], 630, state, faces, times)

  assert.equal(result.saving, 210)
  assert.equal(630 - result.saving, 420)
  assert.deepEqual(result.plan.map(({ bank, face }) => [bank, face]), [
    ['macaupass', 10],
    ['macaupass', 200]
  ])
})
