;; Clarity 4 Check-In Contract
;; Fee: 0.01 STX
;; Syntax: Clarity 4 (stacks-block-height)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant CHECK-IN-FEE u10000) ;; 0.01 STX (in microstacks)
(define-constant ERR-NOT-AUTHORIZED (err u100))

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
        
        ;; 2. Update user stats
        (map-set user-check-ins caller {
            count: (+ (get count current-stats) u1),
            last-check-in: stacks-block-height
        })
        
        (ok true)
    )
)

;; Admin function to update recipient
(define-public (set-recipient (new-recipient principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok (var-set platform-fee-recipient new-recipient))
    )
)

;; Read-only: Get user's check-in stats
(define-read-only (get-check-in-stats (user principal))
    (ok (map-get? user-check-ins user))
)
