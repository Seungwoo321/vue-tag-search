
export default {
  name: 'vue-tag-search-input',
  props: {
    tagValues: Array,
    placeholder: String,
    inputValue: [String, Number],
    inputTagOptions: Object
  },
  data () {
    return {
      hovering: false,
      highlightedIndex: -1
    }
  },
  methods: {
    inputHandler (event) {
      this.$emit('input', event.target.value)
    },
    onClick () {
      this.focusInput()
      this.$emit('show')
    },
    focusInput () {
      if (this.$refs && this.$refs.input && this.$refs.input.focus) {
        this.$refs.input.focus()
      }
    }
  },
  watch: {
    inputValue (value) {
      this.focusInput()
    }
  },
  render (h) {
    return h('div', {
      staticClass: ['vue-tagsearch-wrap'],
      on: {
        mouseenter: () => { this.hovering = true },
        mouseleave: () => { this.hovering = false },
        click: this.onClick
      }
    },
    [
      this.tagValues.map((tag, index) => {
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
              click: () => this.$emit('remove', { deleteItem: tag.split(': '), index })
            }
          }),
          tag
        ])
      }),
      h('input', {
        staticClass: ['vue-tagsearch-input'],
        ref: 'input',
        domProps: {
          value: this.inputValue
        },
        attrs: {
          type: 'text',
          placeholder: this.placeholder
        },
        on: {
          input: this.inputHandler
        }
      })
    ])
  }
}
