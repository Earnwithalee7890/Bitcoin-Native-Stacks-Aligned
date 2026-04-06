;; Easy Engagement Contract - V1
;; No internal platform fees
;; Tracks on-chain pulses for community interaction

(define-data-var total-pulses uint u0)
(define-map user-pulses principal uint)
(define-map last-pulse-height principal uint)

;; Public function: pulse
;; Minimal, zero-platform-fee on-chain ping
(define-public (pulse)
    (let (
        (caller tx-sender)
        (current-pulses (default-to u0 (map-get? user-pulses caller)))
    )
        ;; Increment global counter
        (var-set total-pulses (+ (var-get total-pulses) u1))
        
        ;; Update user stats
        (map-set user-pulses caller (+ current-pulses u1))
        (map-set last-pulse-height caller stacks-block-height)
        
        (print { event: "pulse", user: caller, count: (+ current-pulses u1) })
        (ok true)
    )
)

;; Read-only: Total interactions
(define-read-only (get-total-pulses)
    (ok (var-get total-pulses))
)

;; Read-only: User pulse count
(define-read-only (get-user-pulses (user principal))
    (ok (default-to u0 (map-get? user-pulses user)))
)

;; Read-only: Last pulse height (for cooldowns if needed later)
(define-read-only (get-last-pulse-height (user principal))
    (ok (default-to u0 (map-get? last-pulse-height user)))
)
