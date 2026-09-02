# Exam Bridge demo sandbox

## Open it

- Direct URL: `https://exam-bridge.sociobot.in/demo`
- Local URL after `npm run dev` or `npm run preview`: `/demo`
- The landing page action **Try it with sample data** opens the same route in one click.
- `/?demo=1` is also accepted for compatibility.

## Sample data

The demo opens a six-topic `GATE ECE return plan`. It includes mixed confidence
levels, selected prerequisites, attempted and pending question references, and an
unstarted topic. The sample uses question IDs only and contains no copyrighted
question text or official-source claim.

All three free starter templates can be used inside the demo. Template changes
stay in demo storage and never change a real plan.

## Isolation and reset

Demo state uses only the `demo:exam-bridge:*` local-storage namespace. Demo mode
does not read or write the real `exam-bridge:plan:v1` or theme key. **Reset demo**
deletes that namespace and restores the original sample. **Start for real**
deletes the demo namespace and opens the normal empty or previously saved planner.

The generated service worker keeps the app shell available offline. The sample
plan itself is bundled in the application, so `/demo` can reload offline after a
first online visit.
