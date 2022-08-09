<template>
  <div id="app">
    <a href="https://github.com/seungwoo321/vue-tag-search" target="_blank" style="position: fixed; top: 1rem; right: 1rem;">
      <svg id="i-github" viewBox="0 0 64 64" width="36" height="36">
        <path stroke-width="0" fill="black" d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z"></path>
      </svg>
    </a>
    <div class="title">
      <h1>
        Vue Tag Search
      </h1>
    </div>
    <div class="main-wrapper">
      <vue-tag-search
        v-model="searchModel"
        :data="searchKeys"
        placeholder="Please select a key to search"
        @add:searchModel="addSearchModel"
        @remove:searchModel="removeSearchModel"
      >
      </vue-tag-search>
      <textarea
        style="width: 690px; height: 280px; margin: 10px"
        readonly
        :value="JSON.stringify(searchModel, null, 2)"
      >
      </textarea>
    </div>
    <footer class="footer">
      Released under the <a href="//github.com/seungwoo321/vue-tag-search/blob/master/LICENSE">MIT</a> license. <a href="//github.com/seungwoo321/vue-tag-search">View source.</a>
    </footer>
  </div>
</template>

<script>
import VueTagSearch from './'

export default {
  name: 'App',
  components: {
    VueTagSearch
  },
  data () {
    return {
      searchKeys: [
        'FirstName', 'LastName', 'Age', 'City', 'Country'
      ],
      searchModel: {
        FirstName: [],
        LastName: [],
        Age: [],
        City: ['Seoul'],
        Country: ['Korea']
      }
    }
  },
  methods: {
    addSearchModel ([key, value]) {
      this.searchModel[key].push(value)
    },
    removeSearchModel ([key, value]) {
      this.searchModel[key].splice(this.searchModel[key].indexOf(value), 1)
    }
  }
}
</script>

<style>
#app {
  /* padding-top: 20px; */
  width: 720px;
  margin: 0 auto;
}
.main-wrapper {
  display: flex;
  flex-flow: column;
}
@media screen and (min-width: 900px) {
  .main-wrapper {
    flex-flow: row;
  }
  .main-wrapper > textarea {
    width: 500px;
  }
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
h1 {
  margin-bottom: 0px;
}
footer {
  text-align: center;
  margin-top: 40px;
  line-height: 2;
}
</style>
