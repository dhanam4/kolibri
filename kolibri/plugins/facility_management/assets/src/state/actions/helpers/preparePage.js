// on-load mutations common to all the show-page actions
export default function preparePage(commit, { name, title, isAsync = true }) {
  commit('CORE_SET_PAGE_LOADING', isAsync);
  commit('SET_PAGE_NAME', name);
  commit('CORE_SET_TITLE', title);
  commit('CORE_SET_ERROR', null);
}
