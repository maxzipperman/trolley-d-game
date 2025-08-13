# Contributing

Thank you for taking the time to contribute! To keep the project accessible, please use the automated and manual checks below before submitting changes.

## Manual accessibility testing

### Keyboard-only navigation
1. Use `Tab` and `Shift+Tab` to move through all interactive elements.
2. Ensure a visible focus indicator is present and focus is never trapped.
3. Activate links or buttons with `Enter` or `Space` to confirm they work without a mouse.

### Screen reader usage
1. Start a screen reader such as VoiceOver, NVDA, or JAWS.
2. Navigate through the interface and confirm that important content is announced in a logical order.
3. Verify that headings, landmarks, and alternative text provide the necessary context.
4. Report any issues using the "Report accessibility issue" link in the footer.

## Automated checks

Run the lint and accessibility tests:

```sh
npm run lint
npm run test:a11y
```
