;; Clarity 4 Check-In Contract
;; Fee: 0.01 STX
;; Restriction: 1 check-in per ~24 hours (144 blocks)
;; Syntax: Clarity 4 (stacks-block-height)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant CHECK-IN-FEE u10000) ;; 0.01 STX (in microstacks)
(define-constant CHECK-IN-INTERVAL u144) ;; ~24 hours (10 min blocks * 144 = 1440 mins)

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-CHECKED-IN (err u102))

(define-data-var platform-fee-recipient principal tx-sender)

;; Map to track user check-ins and last block height
(define-map user-check-ins principal { count: uint, last-check-in: uint })

(define-public (check-in)
    (let (
        (caller tx-sender)
        (recipient (var-get platform-fee-recipient))
        (current-stats (default-to { count: u0, last-check-in: u0 } (map-get? user-check-ins caller)))
    )
        ;; 1. Enforce 24-hour limit (144 blocks)
        ;; Skip check for first time users (last-check-in is 0)
        (asserts! (or 
            (is-eq (get last-check-in current-stats) u0)
            (>= stacks-block-height (+ (get last-check-in current-stats) CHECK-IN-INTERVAL))
        ) ERR-ALREADY-CHECKED-IN)

        ;; 2. Transfer 0.01 STX fee from user to platform
        (try! (stx-transfer? CHECK-IN-FEE caller recipient))
        
        ;; 3. Update user stats
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
