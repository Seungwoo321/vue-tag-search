import './style.css'
import VueTagSearch from './components/VueTagSearch'
function install (Vue) {
  Vue.component('vue-tag-search', VueTagSearch)
}

export {
  VueTagSearch,
  install
}

export default VueTagSearch
