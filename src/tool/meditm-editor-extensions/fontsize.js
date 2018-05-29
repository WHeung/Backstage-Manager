import MediumEditor from 'medium-editor'

var FontSizeForm = MediumEditor.extensions.form.extend({
  name: 'fontsize',
  action: 'fontSize',
  aria: 'increase/decrease font size',
  sizes: [
    { name: 'small', value: '2' },
    { name: 'normal', value: '3' },
    { name: 'large', value: '4' },
    { name: 'x-large', value: '5' },
    { name: 'xx-large', value: '6' }
  ],

  init () {
    MediumEditor.extensions.form.prototype.init.apply(this, arguments)
  },

  checkState (node) {
    if (MediumEditor.util.isMediumEditorElement(node)) {
      var input = this.getSelect()
      var fontSize = this.document.queryCommandValue('fontSize')
      input.value = fontSize || '3'
    }
  },

  getForm () {
    if (!this.form) {
      this.form = this.createForm()
    }
    return this.form
  },

  destroy () {
    if (!this.form) {
      return false
    }

    if (this.form.parentNode) {
      this.form.parentNode.removeChild(this.form)
    }

    delete this.form
  },

  createForm () {
    const doc = this.document
    const form = doc.createElement('div')
    const select = doc.createElement('select')
    var option

    // Font Size Form (div)
    form.className = 'medium-editor-toolbar-form1'
    form.id = 'medium-editor-toolbar-form-fontsize-' + this.getEditorId()

    // Add font sizes
    for (var i = 0; i < this.sizes.length; i++) {
      option = doc.createElement('option')
      option.innerHTML = this.sizes[i].name
      option.value = this.sizes[i].value
      select.appendChild(option)
    }
    select.value = '3'

    // Add font size select
    select.className = 'medium-editor-toolbar-select'
    form.appendChild(select)

    // Handle typing in the textbox
    this.on(select, 'change', this.handleFontSizeChange.bind(this))

    return form
  },

  getSelect () {
    return this.getForm().querySelector('select.medium-editor-toolbar-select')
  },

  handleFontSizeChange () {
    var fontSize = this.getSelect().value
    this.execAction('fontSize', { value: fontSize })
  }
})
export default FontSizeForm
