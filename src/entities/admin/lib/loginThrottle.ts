import "server-only"

// A bounded, per-process limit; production replicas need a shared rate limiter.
const windowMs = 5 * 60 * 1000
let attempts = 0
let resetAt = 0

export function takeLoginAttempt(now = Date.now()): boolean {
  if (now >= resetAt) {
    attempts = 0
    resetAt = now + windowMs
  }
  if (attempts >= 10) return false
  attempts += 1
  return true
}

export function clearLoginAttempts() {
  attempts = 0
  resetAt = 0
}
