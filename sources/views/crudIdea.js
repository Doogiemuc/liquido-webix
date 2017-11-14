/**
 * CRUD page for an idea
 */
import conf from 'liquidoConfig'
import viewUtils from 'views/viewUtils'
import areasProxy from 'apiClient/areasProxy'
import ideasProxy from 'apiClient/ideasProxy'


// Idea Title
var ideaTitleInput = {
  view: "text",
  label: "Idea Title",
  name: "ideaTitle",
  bottomPadding: 18,
	labelWidth: 120,
	required: true,
	invalidMessage: "Title must not be empty",
  placeholder: "Descripe your idea in one sentence..."
}

// Non editable combo box for idea's area
var ideaAreaSelect = {
  view: "richselect",  // == non-editable combobox
  id:   "ideaAreaSelect",
  name: "ideaArea",
  //label: "",        // no label
  gravity: 0.2,
  options: [],  // will be loaded from server
}

// dynamically load areas from server      https://docs.webix.com/desktop__advanced_combo.html#serversideoptions
areasProxy().then(areas => {
  $$('ideaAreaSelect').getList().parse(areas)     // this is the list popup inside the richselect
  if (areas[0] !== undefined) { $$('ideaAreaSelect').setValue(areas[0].id) }
})

// TinyMCE WYSIWYG editor for idea description
var ideaDescriptionEditor = { 
  view: "tinymce-editor",
  id:   "ideaDescriptionEditor", 
  name: "ideaDescription",
  invalidMessage: "You must supply a description!",
  bottomPadding: 25, // add some space below to show invalid message
  barHeight: 37,    // the webix.ui.view needs this, because we are hiding the TinyMCE-menubar
  borderless: true,
  config: {
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table contextmenu paste' // placeholder'
    ],
    toolbar: 'undo redo | insert | styleselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image charmap',
    statusbar: false
  }
}

// Called when user presses the Save button. Will validate the whole form (incl. the TinyMCE editor) and store new idea on server if user filled all fields.
var saveIdea = function(data) {
  var formIsValid = $$('ideaForm').validate()
  if (formIsValid) {
    var ideaTitle  = $$('ideaForm').elements.ideaTitle.getValue()
    var ideaAreaId = $$('ideaAreaSelect').getValue()
    var ideaDescription = $$('ideaDescriptionEditor').getValue()  
    var newIdea = {
      title: ideaTitle,
      area:  ideaAreaId,
      description: ideaDescription
    }
    console.log("newIdea", newIdea)
  } else {
    console.log("form is not valid")
  }
}

// the main webix form
var layout = {
  type: "space",
  rows: [
    { view: "template", template: '<i class="fa fa-lightbulb-o"></i> Add a new idea', type: "header" },
    {
    	view: "form",
    	id:   "ideaForm",
    	elements: [
    		{ cols: [ 
    		  ideaTitleInput,
    		  ideaAreaSelect
    		]},
    		ideaDescriptionEditor,
    		//{view: "template", template: "validation message", borderless: true, autoheight: true },
    		{ cols: [
    		   {},
    		   { view:"button", value:"Save Idea" , type:"form", click: saveIdea }
    		]}
    	],
  	  on: {
        onAfterValidation(result, value) {
          console.log("form.onAfterValidation", result, value)
        }
      }
		}
	]
}

export default layout