<template>
  <div>
    <b-row class="p-2">
      <b-col md="6">
        <VueTagSearch
          ref="vue-tag-search"
          v-model="searchModel"
          class="input-group"
          :data="searchKeys"
          placeholder="Please select a key to search"
          @add:searchModel="addSearchModel"
          @add:searchModel:success="addSearchModelSuccess"
          @add:searchModel:failed="addSearchModelFailed"
        >
          <b-input-group-append slot="inputGroupAppend">
            <b-button
              variant="primary"
              @click="clickHandler"
            >
              Search
            </b-button>
          </b-input-group-append>
        </VueTagSearch>
        <div
          class="d-flex pt-2"
        >
          <b-badge
            v-for="(value, index) in searchValues"
            :key="index"
            class="mr-2"
            variant="primary"
            size="md"
          >
            <span>
              {{ value[0] }}: {{ value[1] }}
            </span>
            <span
              style="cursor: pointer"
              @click="removeSearchModel(value)"
            >
              x
            </span>
          </b-badge>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol, BInputGroupAppend, BButton, BBadge } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueTagSearch from './'
import '@/assets/style.css'
export default {
  components: {
    BRow,
    BCol,
    BInputGroupAppend,
    BButton,
    BBadge,
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
      },
      searchValues: [['City', 'Seoul'], ['Country', 'Korea']]
    }
  },
  methods: {
    addSearchModel ([key, value]) {
      this.searchModel[key].push(value)
      if (!this.searchValues.includes([key, value])) {
        this.searchValues.push([key, value])
      }
    },
    addSearchModelFailed () {
      alert('failed')
    },
    addSearchModelSuccess () {
      alert('success')
    },
    removeSearchModel ([key, value]) {
      this.searchModel[key].splice(this.searchModel[key].indexOf(value), 1)
      this.searchValues = this.searchValues.filter(values => key !== values[0] || value !== values[1])
    },
    clickHandler () {
      const vueTagSearcVm = this.$refs['vue-tag-search']
      if (vueTagSearcVm) {
        vueTagSearcVm.addSearchModel()
      }
    }
  }
}
</script>

<style scoped>
.input-group > .vue-tagsearch:not(:first-child) {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.input-group > .vue-tagsearch:not(:last-child) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
