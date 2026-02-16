export const state = $state({
  activeTool: null,
  files: [] as File[],
  pdfDoc: null,
  pdfPages: [],
  currentPdfUrl: null,
})

// Resets the state when switching views or completing an operation.
export function resetState() {
  state.activeTool = null;
  state.files = [];
  state.pdfDoc = null;
  state.pdfPages = [];
  state.currentPdfUrl = null;
  
}