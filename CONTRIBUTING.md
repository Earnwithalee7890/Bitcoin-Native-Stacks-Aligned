# Contributing to Stacks Dashboard

Thank you for your interest in contributing to the Bitcoin-Native Stacks Aligned Dashboard! This project aims to provide a premium, high-performance interface for the Stacks ecosystem.

## Development Workflow

1.  **Branching**: Create a feature branch for your changes (e.g., `feat/new-widget`).
2.  **Linting**: Ensure your code passes linting checks. We use ESLint and Prettier.
3.  **UI/UX**: Follow the established design system (TailwindCSS + Framer Motion).
4.  **Testing**: Verify your changes locally before submitting a PR.

## Style Guidelines

-   **Components**: Use functional components with TypeScript interfaces.
-   **Animations**: Use `framer-motion` for transitions.
-   **State**: Use the `StacksProvider` for global blockchain state.
-   **Persistence**: Use the `useLocalStorage` hook for user preferences.

## Pull Request Process

1.  Submit your changes as a Pull Request to the `main` branch.
2.  Provide a clear description of the changes and screenshots of UI modifications.
3.  Await review from the maintainers.

---

Keep building on Bitcoin! 🚀
