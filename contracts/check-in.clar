;; Clarity 4 Check-In Contract
;; Fee: 0.01 STX
;; Reward: 0.001 STX
;; Syntax: Clarity 4 (stacks-block-height)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant CHECK-IN-FEE u10000) ;; 0.01 STX (in microstacks)
(define-constant USER-REWARD u1000)   ;; 0.001 STX (in microstacks)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INSUFFICIENT-FUNDS (err u101))

(define-data-var platform-fee-recipient principal tx-sender)

;; Map to track user check-ins and last block height
(define-map user-check-ins principal { count: uint, last-check-in: uint })

(define-public (check-in)
    (let (
        (caller tx-sender)
        (recipient (var-get platform-fee-recipient))
        (current-stats (default-to { count: u0, last-check-in: u0 } (map-get? user-check-ins caller)))
    )
        ;; 1. Transfer 0.01 STX fee from user to platform
        (try! (stx-transfer? CHECK-IN-FEE caller recipient))
        
        ;; 2. Attempt to transfer 0.001 STX reward from contract to user
        ;; Use match to prevent rollback if reward pool is empty
        (match (as-contract (stx-transfer? USER-REWARD (as-contract tx-sender) caller))
            success (print "Reward sent")
            failure (print "Reward pool empty or failed")
        )
        
        ;; 3. Update user stats
        (map-set user-check-ins caller {
            count: (+ (get count current-stats) u1),
            last-check-in: stacks-block-height
        })
        
        (ok true)
    )
)

;; Admin function to fund the reward pool
(define-public (fund-reward-pool (amount uint))
    (stx-transfer? amount tx-sender (as-contract tx-sender))
)

;; Read-only: Get user's check-in stats
(define-read-only (get-check-in-stats (user principal))
    (ok (map-get? user-check-ins user))
)
