import VueTagSearchInput from './VueTagSearchInput'
import ClickOutside from '../utils/clickoutside.js'
import Debounce from '../utils/debounce.js'
export default {
  name: 'vue-tag-search',
  model: {
    prop: 'searchModel',
    event: 'change'
  },
  props: {
    searchModel: Object,
    data: {
      default: function () {
        return []
      },
      type: Array
    },
    placeholder: String,
    valueKey: String,
    highlightedColor: {
      type: String,
      default: '#F5F7FA'
    },
    hoveredColor: {
      type: String,
      default: '#C5C7CA'
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    inputTagOptions: {
      type: Object,
      default: function () {
        return {
          tag: 'span',
          props: {
          }
        }
      }
    }
  },
  data () {
    return {
      tmpTagValues: [],
      isShow: false,
      highlightedIndex: -1,
      hoveredIndex: -1,
      clickOutside: false,
      debouncedGetData: null,
      inputValue: '',
      width: 0
    }
  },
  computed: {
    tagKeys () {
      return this.valueKey ? this.data.map(item => item[this.valueKey]) : this.data
    },
    tagValues () {
      const values = []
      this.tagKeys.forEach(key => {
        this.searchModel[key].forEach(value => {
          values.push(`${key}: ${value}`)
        })
      })
      return values
    }
  },
  mounted () {
    const selfElement = this.$refs.search
    this.clickOutside = new ClickOutside([selfElement], document, this.close)
    this.clickOutside.bind()
    this.debouncedGetData = new Debounce(200)
  },
  beforeDestroy () {
    if (this.clickOutside && this.clickOutside.unbind) {
      this.clickOutside.unbind()
    }
    this.debouncedGetData = null
  },
  methods: {
    changeValue (value) {
      this.inputValue = value
    },
    keydownHandler (event) {
      if (this.inputValue === '' && this.tagValues.length > 0 && event.key === 'Backspace') {
        const deleteItem = this.tagValues[this.tagValues.length - 1].split(': ')
        const index = this.tagValues.length - 1
        this.removeItem({ deleteItem, index })
      }
      if (this.isShow) {
        let index = this.highlightedIndex
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          index += 1
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          index -= 1
        }
        if (index < 0) {
          index = -1
        }
        if (index < this.data.length) {
          this.highlightedIndex = index
        }
        if (event.keyCode === 13) {
          if (index > -1) {
            this.changeValue(`${this.data[index][this.valueKey] || this.data[index]}: `)
          }
          this.close()
        }
        if (event.key === 'Escape') {
          this.close()
        }
      } else {
        if (event.key === 'ArrowDown') {
          this.show()
        }
        if (event.keyCode === 13 && !this.tagValues.includes(this.inputValue) && this.inputValue.split(': ')[1]) {
          if (this.tagKeys.includes(this.inputValue.split(': ')[0])) {
            this.$emit('add:searchModel', this.inputValue.split(': '))
            this.changeValue('')
          }
        }
      }
    },
    show () {
      this.$emit('open')
      this.width = this.$refs['vue-tag-search-input'].$el.getBoundingClientRect().width
      this.isShow = true
    },
    close () {
      this.$emit('close')
      this.isShow = false
    },
    getBackgroundColor (index) {
      if (index === this.highlightedIndex) {
        return this.highlightedColor
      } else if (index === this.hoveredIndex) {
        return this.hoveredColor
      } else {
        return 'transparent'
      }
    },
    onSelect (item) {
      const value = (item[this.valueKey] ? item[this.valueKey] : item) + ': '
      this.changeValue(value)
      this.close()
    },
    onMouseenter (index) {
      this.$nextTick(() => {
        this.hoveredIndex = index
      })
    },
    onMouseleave (index) {
      if (this.hoveredIndex === index) {
        this.hoveredIndex = -1
      }
    },
    focusInput () {
      if (this.$refs && this.$refs.input && this.$refs.input.focus) {
        this.$refs.input.focus()
      }
    },
    removeItem ({ deleteItem, index }) {
      this.tagValues.splice(index, 1)
      this.$emit('remove:searchModel', deleteItem)
    },
    renderSearchPanel (h) {
      return h('div', {
        staticClass: ['vue-tagsearch-panel__view'],
        style: {
          width: `${this.width - 1}px`
        }
      },
      this.data.map((item, index) => {
        return h('div', {
          staticClass: ['vue-tagsearch-panel__item'],
          class: {
            'highlight-color': index === this.highlightedIndex,
            'hover-color': index === this.hoveredIndex
          },
          on: {
            click: () => this.onSelect(item),
            mouseenter: () => this.onMouseenter(index),
            mouseleave: () => this.onMouseleave(index)
          }
        }, item[this.valueKey] ? item[this.valueKey] : item)
      }))
    }
  },
  created () {
    this.debouncedGetData = new Debounce(200)
  },
  render (h) {
    const prependSlot = this.$slots.inputGroupPrepend
    const appendSlot = this.$slots.inputGroupAppend
    return h('div', [
      prependSlot,
      h('div', {
        ref: 'search',
        staticClass: ['vue-tagsearch']
      },
      [
        h(VueTagSearchInput, {
          ref: 'vue-tag-search-input',
          props: {
            tagValues: this.tagValues,
            placeholder: this.placeholder,
            inputValue: this.inputValue,
            inputTagOptions: this.inputTagOptions
          },
          on: {
            show: this.show,
            input: this.changeValue,
            remove: this.removeItem
          },
          nativeOn: {
            keydown: this.keydownHandler
          }
        }),
        this.isShow ? this.renderSearchPanel(h) : undefined
      ]),
      appendSlot,
      !prependSlot && !appendSlot
        ? this.tagValues.map((tag, index) => {
          return h(this.inputTagOptions.tag, {
            class: {
              'vue-tagsearch-tag': this.inputTagOptions.tag === 'span'
            },
            style: {
              'margin-left': '4px'
            },
            props: this.inputTagOptions.props
          }, [
            h('a', {
              staticClass: ['vue-tagsearch-tag-remove'],
              on: {
                click: () => this.removeItem({ deleteItem: tag.split(': '), index })
              }
            }),
            tag
          ])
        })
        : undefined
    ])
  }
}
