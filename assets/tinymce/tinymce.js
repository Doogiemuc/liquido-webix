/**
 * Wrapper for tinyMCE that wraps the editor in a webix.ui.view
 */
webix.protoUI({
	name:"tinymce-editor",
	defaults:{
		config:{ theme:"modern", statusbar:false },
		barHeight: 74,
		value:""
	},
	$init:function(config){
		this.$view.className += " webix_selectable";
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this.render);		
	},
	render:function(){
		this._set_inner_size();
	},
	_init_tinymce_once:function(){
		//set id for future usage
		this._mce_id = "webix_mce_"+this.config.id;
		this.$view.innerHTML = "<textarea id='"+this._mce_id+"' style='width:1px; height:1px'></textarea>";

		//path to tinymce codebase
		webix.codebase = "assets/tinymce/"
		console.log("Loading TinyMCE editor from codebase", webix.codebase)

		tinyMCEPreInit = { query:"", base: webix.codebase+"tinymce", suffix:".min" };
		webix.require("tinymce/tinymce.min.js", function(){
			if (!tinymce.dom.Event.domLoaded){
				//woraround event logic in tinymce
				tinymce.dom.Event.domLoaded = true;
				webix.html.addStyle(".mce-tinymce.mce-container{ border-width:0px !important}");
			}
			
			var config = this.config.config;

			config.mode = "exact";
			config.height = 300;
			config.elements = [this._mce_id];
			config.id = this._mce_id;

			var customsetup = config.setup;
			config.setup = webix.bind(function(editor){
				if(customsetup) customsetup(editor);
				this._mce_editor_setup(editor);
			}, this);

			tinyMCE.init(config);

		}, this);

    if (this.config.invalidMessage) {
      this.$view.innerHTML += '<div id="'+this._mce_id+'_validationMessage" class="webix_inp_bottom_label"></div>'
    }

		this._init_tinymce_once = function(){};
	},
	_mce_editor_setup:function(editor){
		editor.on("init", webix.bind(this._mce_editor_ready,this))
	},
	_mce_editor_ready:function(editor){
		this._3rd_editor = tinyMCE.get(this._mce_id);
		this._set_inner_size();
		this._waitEditor.resolve(this._3rd_editor);

		this.setValue(this.config.value);
		if (this._focus_await)
			this.focus();
	},
	_set_inner_size:function(){
		if (!this._3rd_editor || !this.$width) return;
		this._3rd_editor.theme.resizeTo(this.$width, this.$height - this.config.barHeight - (this.config.invalidMessage ? this.config.bottomPadding : 0 ) );
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._init_tinymce_once();
			this._set_inner_size();
		}
	},
	setValue:function(value){
		this.config.value = value;
		if (this._3rd_editor)
			this._3rd_editor.setContent(value);
	},
	getValue:function(){
		return this._3rd_editor?this._3rd_editor.getContent():this.config.value;
	},
	focus:function(){
		this._focus_await = true;
		if (this._3rd_editor)
			this._3rd_editor.focus();
	},
	
	//MAYBE check  webix_debug.js:  webix.ValidateData
	
	validate: function() {
	  var valid = false
	  if (this.config.validate) {
	    valid = this.config.validate(this._3rd_editor.getContent())
	  } else {
	    var str = this._3rd_editor.getContent({format: 'text'})     // plain string content, without any HTML
	    valid = (str !== null && str !== undefined && str.length > 0 && str.trim().length > 0)  
	  }
	  var validationDiv = document.getElementById(this._mce_id+'_validationMessage')
	  if (!valid && this.config.invalidMessage) {
	    webix.html.addCss(this.$view, "webix_invalid");
	    this.config.invlaid = true
	    validationDiv.innerHTML = this.config.invalidMessage
	  } else {
	    webix.html.removeCss(this.$view, "webix_invalid");
	    this.config.invlaid = false
	    validationDiv.innerHTML = ""
	  }
	  console.log("valid result of tinymce", valid)
	  return valid
	  //webix.callEvent("onAfterValidation", [valid, { "ideaDescription": valid } ]);
	},	
	getEditor:function(waitEditor){
		return waitEditor?this._waitEditor:this._3rd_editor;
	}
}, webix.ui.view);