// The dashboard implementation and the insight cards it exports live in
// dashboard-view.tsx. A route file may only export the page, so keeping the
// shared card components here would fail Next's generated route type check.
export { default } from './dashboard-view';