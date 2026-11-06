export function arrowIcon(direction = 'right') {
  const rotations = {right: 0, down: 90, left: 180, up: -90, external: -45};
  return `<svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6" transform="rotate(${rotations[direction]} 12 12)" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
