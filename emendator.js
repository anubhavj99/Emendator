// the decoder for the storage json object to be converted html object
var smartInputBoxDecoder = function(contentData, postId) {
	// define all functions
	// function returns json parsed object if the string is json else the string itself
	let ifJsonParseElseReturn = function(str) {
		let retVal = new Object()
		try {
			// statements
			retVal = JSON.parse(str)
		} catch(e) {
			// statements
			// console.log(e);
			retVal = str
		}
		return retVal
	}

	let pollCreator = function(pollData, pollId) {
		let createdHtml = '\
			<div class="my-4">\
				<div class="row no-gutters">\
					<div class="offset-md-1 col-md-8 col-12">\
						<div class="pollCreate">\
							<form>\
							';
							for(let i=0; i<pollData.length; i++) {
								createdHtml += '\
								<div class="row my-2">\
									<div class="col-2 bigRadioOuterDiv">\
										<button class="bigRadio notSelected" type="button">\
											<div class="bigRadioDiv">\
											</div>\
											<input type="radio" class="bigRadio" name="' + postId + '" value="' + (i+1) + '">\
										</button>\
									</div>\
									<div class="col-10">\
										<label class="lead" for=\'[name="' + postId + '"]\'>' + pollData[i] + '</label>\
									</div>\
								</div>\
								';
							}
		createdHtml += ' 	</form>\
						</div>\
					</div>\
				</div>\
			</div>\
		';

		let pollObjEl = document.createElement('div')
		pollObjEl.innerHTML = createdHtml

		return pollObjEl
	}

	let imageElCreator = function(imgSrc) {
		let createdHtml= '\
			<div class="my-2">\
				<img src="' + imgSrc + '" class="mainColumnCardImage img-thumbnail">\
			</div>\
		';

		let imgObjEl = document.createElement('div')
		imgObjEl.innerHTML = createdHtml

		return imgObjEl
	}

	let videoElCreator = function(videoSrc) {
		let createdHtml= '\
			<div class="embed-responsive embed-responsive-16by9 my-4">\
			  <iframe class="embed-responsive-item" src="' + videoSrc + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>\
			</div>\
		';

		let imgObjEl = document.createElement('div')
		imgObjEl.innerHTML = createdHtml

		return imgObjEl
	}

	// iterate over all objects
	let formedObjectList = []
	contentData.forEach(function(el) {
		// create element for predefined functions
		if(el.type == 'defined') {
			let tagObj = document.createElement(el.tag)
			// set attributes if any
			if(el.attributes) {
				for(let attribute in el.attributes) {
					let att = document.createAttribute(attribute);
					att.value = el.attributes[attribute];
					tagObj.setAttributeNode(att);
				}
			}
			// set text value if any
			if(el.text) {
				tagObj.innerHTML = el.text
			}
			// iterate for children of the defined tag
			if(el.children) {
				let childElementSet = smartInputBoxDecoder(el.children)
				childElementSet.forEach(function(childElObj) {
					tagObj.appendChild(childElObj)
				})
			}

			// define classes and respnsiveness for table
			if(el.tag.toLowerCase() == 'table') {
				let surroundingDivEl = document.createElement('div')
				surroundingDivEl.className = 'table-responsive my-4'
				tagObj.className = 'table table-hover table-bordered'
				surroundingDivEl.appendChild(tagObj)
				tagObj = surroundingDivEl
			}
			if(el.tag.toLowerCase() == 'thead') {
				tagObj.className = 'thead-light'
			}

			// add element to the list
			formedObjectList.push(tagObj)
		}
		else if(el.type == 'text') {
			let textObj = document.createTextNode(el.text);
			formedObjectList.push(textObj)
		}
		else if(el.type == 'custom') {
			if(el.objecttype == 'image') {
				let imgObj = imageElCreator(el.objectdata)
				formedObjectList.push(imgObj)
			}
			else if(el.objecttype == 'poll') {
				let pollObj = pollCreator(ifJsonParseElseReturn(el.objectdata), postId)
				formedObjectList.push(pollObj)
			}
			else if(el.objecttype == 'video') {
				let videoObj = videoElCreator(el.objectdata)
				formedObjectList.push(videoObj)
			}
		}


	});

	return formedObjectList

}

// this is the code for input box
// it is a class based code
// initialize it with constructor values and voila!
var smartInputBox = function(parentContainerId, editorDivId, toolbarDivId, inputTakerPopUpId) {

	document.execCommand('styleWithCSS', null, true)

	var _this_main = this;

	// editor tabs
	_this_main.editorButtons = {
		'undoaction': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'undo',
		},
		'redoaction': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'redo',
		},
		'printaction': {
			'isCommand': false,
			'toBeChecked': false,
			'commandName': '',
		},
		'fontStyle': {					// parameter
			'isCommand': true,
			'toBeChecked': false,
			'parameter': true,
			'toBeChecked': true,
			'commandName': 'fontName',
		},
		'fontSize': {					// parameter
			'isCommand': true,
			'toBeChecked': false,
			'parameter': true,
			'toBeChecked': true,
			'commandName': 'fontSize',
		},
		'italic': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'italic',
		},
		'bold': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'bold',
		},
		'underline': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'underline',
		},
		'highlight': {
			'isCommand': false,
			'toBeChecked': false,
			'surroundTag': true,
			'tagName': 'mark',
		},
		'subscript': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'subscript',
		},
		'superscript': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'superscript',
		},
		'addLink': {					// parameter
			'isCommand': true,
			'toBeChecked': false,
			'parameter': true,
			'upload': true,
			'commandName': 'createLink',
		},
		'addImage': {					// parameter
			'isCommand': true,
			'toBeChecked': false,
			'parameter': true,
			'upload': true,
			'commandName': 'insertImage',
		},
		'addVideo': {					// parameter
			'isCommand': false,
			'toBeChecked': false,
			'parameter': true,
			'upload': true,
		},
		'alignLeft': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'justifyLeft',
		},
		'alignCenter': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'justifyCenter',
		},
		'alignRight': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'justifyRight',
		},
		'alignJustify': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'justifyFull',
		},
		'textHeight': {
			'isCommand': false,
			'toBeChecked': false,
			'commandName': 'lineHeight',
		},
		'orderedListMaker': {
			'isCommand': true,
			'toBeChecked': false,
			'commandName': 'insertOrderedList',
		},
		'unorderedListMaker': {
			'isCommand': true,
			'toBeChecked': false,
			'commandName': 'insertUnorderedList',
		},
		'indent': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'indent',
		},
		'outdent': {
			'isCommand': true,
			'toBeChecked': true,
			'commandName': 'outdent',
		},
		'addPoll': {
			'isCommand': false,
			'toBeChecked': false,
			'parameter': true,
			'upload': true,
		},
		'createTable': {
			'isCommand': false,
			'toBeChecked': false,
			'parameter': true,
			'upload': true,
		},
		'removeFormatting': {
			'isCommand': true,
			'toBeChecked': false,
			'commandName': 'removeFormat',
		},
	};
	
	_this_main.thisParentContainerDiv = $(parentContainerId)
	_this_main.thisContentEditableDiv = $(editorDivId)
	_this_main.thisToolbarDiv = $(toolbarDivId)
	_this_main.thisInputTakerPopUpDiv = $(inputTakerPopUpId)
	_this_main.thisInputTakerTabs = new Object()
	_this_main.pollOptionsTemplate = new Object()
	_this_main.selectionObjectCreatedUser = new Object()

	// (enableObjectResizing) call command in beginning

	// put necessary properties in the basic references
	_this_main.thisParentContainerDiv.css('position', 'relative');
	_this_main.thisContentEditableDiv.attr('contenteditable', 'true');
	_this_main.thisContentEditableDiv.addClass('inputBox')
	_this_main.thisContentEditableDiv.addClass('clearfix')

	// set the tabs div reference
	for(let editorKey in _this_main.editorButtons) {

		if(_this_main.editorButtons[editorKey]['upload'])
		{
			// console.log(_this_main.thisInputTakerPopUpDiv.find('.nav-item[name="' + editorKey + '"]'))
			_this_main.thisInputTakerTabs[editorKey] = _this_main.thisInputTakerPopUpDiv.find('.nav-item[name="' + editorKey + '"]')
		}
	
	}

	_this_main.checkForEachButtonToBeActiveAndSetValues = function() {

		// let boldButtonJsRef = thisOptionSet.find('[child-function="bold"]');
		for(let propertyFunction in _this_main.editorButtons) {
			if(_this_main.editorButtons[propertyFunction]['isCommand'] && _this_main.editorButtons[propertyFunction]['toBeChecked'])
			{
				// console.log(propertyFunction, _this_main.editorButtons[propertyFunction]['commandName'], _this_main.thisToolbarDiv.find('[child-function="' + propertyFunction + '"]'))
				if(document.queryCommandState(_this_main.editorButtons[propertyFunction]['commandName']))
				{
					// console.log(propertyFunction)	
					_this_main.setActiveButton(_this_main.thisToolbarDiv.find('[child-function="' + propertyFunction + '"]'))
				}
				else
				{
					_this_main.setInactiveButton(_this_main.thisToolbarDiv.find('[child-function="' + propertyFunction + '"]'))
				}

				if(_this_main.editorButtons[propertyFunction]['parameter'] && document.queryCommandValue(_this_main.editorButtons[propertyFunction]['commandName']))
				{
					// console.log(_this_main.editorButtons[propertyFunction]['commandName'], document.queryCommandValue(_this_main.editorButtons[propertyFunction]['commandName']))
					let valueSet = document.queryCommandValue(_this_main.editorButtons[propertyFunction]['commandName'])
					_this_main.thisToolbarDiv.find('[child-function="' + propertyFunction + '"]').find('[name="getValue"]').val(valueSet)
				}
			}

		}

	}

	_this_main.setOptionValuesForEachButton = function() {

	}

	document.onselectionchange = function(event) {
		if(_this_main.thisParentContainerDiv.find(':focus').length > 0)
		{
			_this_main.checkForEachButtonToBeActiveAndSetValues()
		}
	};

	_this_main.checkForKeyPressActionsForDifferentElements = function(event) {
		if(event.keyCode == 9)
		{
			event.preventDefault();
			// console.log("sdfs")
			if(_this_main.isSelectionInsideElementTag('li'))
			{
				if(event.shiftKey)
					document.execCommand('outdent', false, null);
				else
					document.execCommand('indent', false, null);
			}
			else
			{
				document.execCommand('insertHTML', false, '&emsp;')
			}
		}
	}

	_this_main.thisContentEditableDiv.on('keydown', function(event){
		_this_main.checkForKeyPressActionsForDifferentElements(event)
	})

	_this_main.isSelectionInsideElementTag = function(tagName) {
		var sel, containerNode;
		tagName = tagName.toUpperCase();
		if (window.getSelection)
		{
			sel = window.getSelection();
			if (sel.rangeCount > 0)
			{
				containerNode = sel.getRangeAt(0).commonAncestorContainer;
			}
		}
		else if ( (sel = document.selection) && sel.type != "Control" )
		{
		    containerNode = sel.createRange().parentElement();
		}
		while (containerNode)
		{
		    if (containerNode.nodeType == 1 && containerNode.tagName == tagName)
		    {
		        return true;
		    }
		    containerNode = containerNode.parentNode;
		    if(containerNode && containerNode.getAttribute && containerNode.getAttribute('id') == _this_main.thisContentEditableDiv.attr('id'))
		    {
		    	return false;
		    }
		}
		return false;
	}

	_this_main.thisToolbarDiv.on('click', '.inputBoxOption-child', function(event) {
		event.preventDefault();
		let buttonChildRef = event.currentTarget;
		_this_main.checkAndSetActive(buttonChildRef, event);
		let buttonChildJsRef = $(event.currentTarget)
		// let eventName = "content.edit." + buttonChildJsRef.attr('child-function')
		// $('.inputBox[contenteditable-family="' + buttonChildJsRef.closest('.inputBoxOptionSet').attr('contenteditable-family') + '"]').focus()
		// buttonChildJsRef.closest('.inputBoxOptionSet').trigger()
	});

	_this_main.checkAndSetActive = function(currentButton, event, isUsingJs=false)
	{
		let clickedOptionButtonJsref = $(currentButton);
		// activate/deactivate all its functionalities
		_this_main.doActionOfReferencedButton(clickedOptionButtonJsref)

		if(clickedOptionButtonJsref.hasClass('active') && (isUsingJs || $(event.target).closest('.no-active-trigger').length == 0)) 
			_this_main.setInactiveButton(clickedOptionButtonJsref)
		else
			_this_main.setActiveButton(clickedOptionButtonJsref)
	}

	// set the button inactive in the toolbar
	_this_main.setInactiveButton = function(clickedOptionButton) {
		let clickedOptionButtonJsref = $(clickedOptionButton)
		clickedOptionButtonJsref.removeClass('active')
	}

	// set the button active in the toolbar
	_this_main.setActiveButton = function(clickedOptionButton) {
		let clickedOptionButtonJsref = $(clickedOptionButton)
		clickedOptionButtonJsref.addClass('active')
		if(clickedOptionButtonJsref.hasClass('active-no-stay'))
		{
			// console.log("active-no-stay")
			$(document).on('click', function closeOnOutOfFocus(ev){
				if($(ev.target).closest(clickedOptionButtonJsref).length == 0)
				{
					_this_main.setInactiveButton(clickedOptionButtonJsref);
					$(document).off('click', closeOnOutOfFocus)
				}
			})
		}
	}

	// execute the action of the button clicked in the option bar
	// the parameters in the editorTab array define how the execution is to be processed for each button
	_this_main.doActionOfReferencedButton = function(clickedOptionButtonJsref) {

		let actionProp = clickedOptionButtonJsref.attr('child-function')
		if(_this_main.editorButtons[actionProp]['isCommand'] && _this_main.editorButtons[actionProp]['parameter'] != true)
		{
			_this_main.thisContentEditableDiv.focus();
			// console.log(actionProp, _this_main.editorButtons[actionProp])
			document.execCommand(_this_main.editorButtons[actionProp]['commandName'], false, _this_main.editorButtons[actionProp]['parameter']);
		}
		// with parameter default command
		else if(_this_main.editorButtons[actionProp]['isCommand'])
		{
			if(_this_main.editorButtons[actionProp]['upload'])
			{
				let parameter = "";
				_this_main.selectionObjectCreatedUser = _this_main.saveSelectionObject()

				_this_main.activateInputTaker(actionProp)
				// document.execCommand(_this_main.editorButtons[actionProp]['commandName'], false, parameter);
			}
			else
			{
				clickedOptionButtonJsref.find('[name="getValue"]').on('change', function(event) {
					let parameter = $(event.target).val();
					// console.log(_this_main.editorButtons[actionProp]['commandName'], parameter)
					_this_main.thisContentEditableDiv.focus();
					document.execCommand(_this_main.editorButtons[actionProp]['commandName'], false, parameter);
				})
			}
		}
		else if(_this_main.editorButtons[actionProp]['surroundTag']) {
			_this_main.thisContentEditableDiv.focus();
			let selObj = _this_main.getSelectionObject()

			selObj.getRangeAt(0).surroundContents(document.createElement(_this_main.editorButtons[actionProp]['tagName']))

		}
		else {
			_this_main.selectionObjectCreatedUser = _this_main.saveSelectionObject()

			_this_main.activateInputTaker(actionProp)
		}
	}

	// activate input taker div and activate tab as per request
	// the tabs are of bootstrap4 and can be activated by .tab('show')
	_this_main.activateInputTaker = function(actionProp) {
		if(_this_main.editorButtons[actionProp]['upload']) {
			_this_main.thisInputTakerPopUpDiv.find('.modal-loader').removeClass('activate')
			// console.log(_this_main.thisInputTakerTabs[actionProp])
			// activate tab
			_this_main.thisInputTakerTabs[actionProp].tab('show')
			_this_main.thisInputTakerPopUpDiv.modal('show');
		}
		else {

		}
	}
	// deactivate the input taker popup
	_this_main.deactiveInputtaker = function() {
		_this_main.thisInputTakerPopUpDiv.modal('hide');
	}

	// console.log(_this_main.pollOptionsTemplate)

	// capture the forms in the upload popup commands

	// capture the adding of polls options
	// add the html on the caret position and add 2 breaks before and after it
	_this_main.thisInputTakerPopUpDiv.on('click', 'button[name="pollOptionsAdd"]', function(event) {
		let optionValueSet = []
		let addRemoveTagRef = $($(event.target).attr('bb-getFrom'))
		addRemoveTagRef.find('input').each(function(index, el) {
			optionValueSet.push($(el).val())
		});
		_this_main.deactiveInputtaker()
		_this_main.thisContentEditableDiv.focus();
		
		_this_main.pollOptionsTemplate[addRemoveTagRef.attr('name')].resetTemplateTag()

		let pollEl = '<br/><br/><div objecttype="poll" objectdata=\'' + JSON.stringify(optionValueSet) + '\' class="editorPollDiv" contenteditable="false"><form>';

		optionValueSet.forEach( function(element, index) {
			// statements
			let pollOptionEl = '\
				<div optionIndex="' + index + '" class="form-check">\
					<input type="radio" class="form-check-input" name="inputCheckPoll">\
					<label class="form-check-label">\
						' + element + '\
					</label>\
				</div>\
			';
			pollEl += pollOptionEl
		});
		pollEl += '</form></div><br/><br/>'
		// restore selection point
		_this_main.restoreSelectionObject(_this_main.selectionObjectCreatedUser)
		// add it to the editable div
		_this_main.pasteHtmlAtCaret(pollEl, true)

	})

	// capture the form submit for adding hyper link to selection
	// restore the previously captured selection and execute command on it
	_this_main.thisParentContainerDiv.on('submit', '[name="addLink-form"]', function(event) {
		event.preventDefault()
		_this_main.deactiveInputtaker()
		_this_main.thisContentEditableDiv.focus();
		let thisFormInputForLinkJsRef = $(event.target).find('[name="getLinkInput"]')
		let linkVal = thisFormInputForLinkJsRef.val()
		_this_main.restoreSelectionObject(_this_main.selectionObjectCreatedUser)
		document.execCommand('createLink', false, linkVal)
		/*let anchorEl = $('<a/>').attr('href', linkVal).get(0)
		_this_main.selectionObjectCreatedUser.getRangeAt(0).surroundContents(anchorEl)*/
	})

	// capture the submission of the image addition form for the upload popup container
	// take the image link from the link input or upload the image and generate a link for the same
	_this_main.thisParentContainerDiv.on('submit', '[name="addImage-form"]', function(event) {
		event.preventDefault()
		_this_main.deactiveInputtaker()
		_this_main.thisContentEditableDiv.focus();
		// put the caret in original position
		_this_main.restoreSelectionObject(_this_main.selectionObjectCreatedUser)

		let thisFormInputForLinkJsRef = $(event.target).find('[name="image-add-link"]')
		let thisFormInputForFileJsRef = $(event.target).find('[name="image-file-upload"]')
		if(thisFormInputForLinkJsRef.length == 1) {
			let linkVal = thisFormInputForLinkJsRef.val()
			let imageHtml = '<br/><div class="my-2" contenteditable="false" class="img-thumbnail" objecttype="image" objectdata="' + linkVal + '"><img style="width: 90%;max-width: 300px;" src="' + linkVal + '"></div><br/>'
			// console.log(imageHtml)
			_this_main.pasteHtmlAtCaret(imageHtml, true)
		}
		else if(thisFormInputForFileJsRef.length == 1){
			// add code for upload and put link
		}
	})

	// capture the submission of the video addition form for the upload popup container
	// take the video link from the link input or upload the video and generate a link for the same
	_this_main.thisParentContainerDiv.on('submit', '[name="addVideo-form"]', function(event) {
		event.preventDefault()
		_this_main.deactiveInputtaker()
		_this_main.thisContentEditableDiv.focus();

		_this_main.restoreSelectionObject(_this_main.selectionObjectCreatedUser)

		let thisFormInputForLinkJsRef = $(event.target).find('[name="video-add-link"]')
		let thisFormInputForFileJsRef = $(event.target).find('[name="video-file-upload"]')
		if(thisFormInputForLinkJsRef.length == 1) {
			let linkVal = thisFormInputForLinkJsRef.val()
			let videoHtml = '<br/>\
				<div class="my-2 d-flex justify-content-center" contenteditable="false" objecttype="video" objectdata="' + linkVal + '">\
					<iframe src="' + linkVal + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>\
				</div>\
				<br/>'
			// console.log(videoHtml)
			_this_main.pasteHtmlAtCaret(videoHtml, true)
		}
		else if(thisFormInputForFileJsRef.length == 1){
			// add code for upload and put link
		}
	})

	// capture the create table event
	// create the table with the row and column count specified
	_this_main.thisParentContainerDiv.on('submit', '[name="createTable-form"]', function(event) {
		event.preventDefault();
		_this_main.deactiveInputtaker()
		_this_main.thisContentEditableDiv.focus();
		_this_main.restoreSelectionObject(_this_main.selectionObjectCreatedUser)

		let thisFormRef = $(event.target)
		let rowCount = thisFormRef.find('[name="row"]').val()
		let columnCount = thisFormRef.find('[name="column"]').val()
		let isHeadertoBeIncluded = thisFormRef.find('[name="includeHeader"]').is(':checked')


		let createdTableHtml = '\
			<table class="table table-bordered table-editing-hover">\
		';

		createdTableHtml += '\
			<thead class="thead-light">\
				<tr>\
		';
		for(let j=0; j<columnCount; j++) {
			createdTableHtml += '<th></th>';
		}
		createdTableHtml += '\
				</tr>\
			</thead>\
		';
		
		createdTableHtml += '<tbody>'
		for(let i=0; i<rowCount; i++) {
			createdTableHtml += '<tr>';
			for(let j=0; j<columnCount; j++) {
				createdTableHtml += '<td></td>';
			}
			createdTableHtml += '</tr>';
		}
		createdTableHtml += '\
				</tbody>\
			</table>\
		';
		_this_main.pasteHtmlAtCaret(createdTableHtml, true)

	})


	// define all ui changing and initalizing functions

	// function for unqiue child selection in the option bar. eg. the alignment buttons
	_this_main.uniqueChildButtonFunction = function(event) {
		let currentButtonJsRef = $(event.currentTarget);
		let buttonGroupSet = currentButtonJsRef.siblings('[child-function]');
		buttonGroupSet.each(function(index, el) {
			_this_main.setInactiveButton(el)
		});

	}
	_this_main.thisToolbarDiv.on('click', '[child-selection="unique"] [child-function]', _this_main.uniqueChildButtonFunction);

	// initialize all add and remove tags for ui
	$('[bb-add-remove-tag]').each(function(index, el) {
		let elName = $(el).attr('name')
		_this_main.pollOptionsTemplate[elName] = new addTagTemplate('[name="' + elName + '"]', 1)
	});
	// add field on click of button
	_this_main.thisInputTakerPopUpDiv.on('click', '[name="addAnotherField"]', function (event) {
		let addToDiv = $(event.target).siblings('[bb-add-remove-tag]')
		let addToDivName = addToDiv.attr('name')
		// console.log(_this_main.pollOptionsTemplate[addToDivName])
		if(_this_main.pollOptionsTemplate[addToDivName]) {
			_this_main.pollOptionsTemplate[addToDivName].addTemplateToTag()
		}
		else {
			// console.log('404 error: please refresh the page.')
		}
	})
	// remove field on click of button
	_this_main.thisInputTakerPopUpDiv.on('click', '[name="removeLastField"]', function (event) {
		let removeFromDiv = $(event.target).siblings('[bb-add-remove-tag]')
		let removeFromDivName = removeFromDiv.attr('name')
		// console.log(_this_main.pollOptionsTemplate[removeFromDivName])
		if(_this_main.pollOptionsTemplate[removeFromDivName]) {
			_this_main.pollOptionsTemplate[removeFromDivName].removeLastTemplateFromTag()
		}
		else {
			// console.log('404 error: please refresh the page.')
		}
	})

	
	/*function createLink() {
	    // There's actually no need to save and restore the selection here. This is just an example.
	    var savedSel = saveSelectionObject();
	    var url = document.getElementById("url").value;
	    restoreSelectionObject(savedSel);
	    document.execCommand("CreateLink", false, url);
	    var links = getTagsInSelection('a');
	    for (var i = 0; i < links.length; ++i) {
	        links[i].style.fontWeight = "bold";
	    }
	}*/

	// defining all classes

	// class for adding the variable number of inputs
	// par1: the reference for where the tag is to appended
	// par2: the initialize count for the number of inputs, default: 0
	function addTagTemplate(templateParentRef, initializeCount=0) {
		this.thisTemplateParentRef = $(templateParentRef)
		this.initializeCounter = initializeCount
		this.counter = 0;
		
		this.getTemplatePreparedTemplate = function() {
			this.counter += 1
			return ' \
			<div class="input-group mb-3" bb-template-counter="' + this.counter + '"> \
				<div class="input-group-append"> \
					<span class="input-group-text">' + this.counter + '</span> \
				</div> \
				<input type="text" class="form-control" placeholder="Poll Detail" aria-label="Poll Detail"> \
			</div> \
			';
		}

		this.addTemplateToTag = function() {
			this.thisTemplateParentRef.append(this.getTemplatePreparedTemplate())
		}

		this.removeLastTemplateFromTag = function() {
			this.thisTemplateParentRef.find('[bb-template-counter="' + this.counter + '"]').remove()
			this.counter -= 1
		}

		this.resetTemplateTag = function() {
			this.thisTemplateParentRef.html('')
			this.counter = 0
			for(; this.counter<this.initializeCounter; ) {
				this.addTemplateToTag()
			}					
		}

		// reset the tab for initialization
		this.resetTemplateTag()
	}

	// define all contenteditable caret modfying code

	// par1: the html to be inserted at caret node
	// par2: is the html passed a string or html object
	_this_main.pasteHtmlAtCaret = function(html, isString) {
	    var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();

				// Range.createContextualFragment() would be useful here but is
				// non-standard and not supported in all browsers (IE9, for one)
				if(isString) {
					var el = document.createElement("div");
						el.innerHTML = html;
						var frag = document.createDocumentFragment(), node, lastNode;
						while ( (node = el.firstChild) ) {
							lastNode = frag.appendChild(node);
						}
						range.insertNode(frag);
						
						// Preserve the selection
						if (lastNode) {
							range = range.cloneRange();
							range.setStartAfter(lastNode);
							range.collapse(true);
							sel.removeAllRanges();
							sel.addRange(range);
						}
				}
				else {
					range.insertNode(html);
				}
			}
		} else if (document.selection && document.selection.type != "Control") {
		    // IE < 9
		    document.selection.createRange().pasteHTML(html);
		}
	}

	// get the selection object for the current seletion
	// gives the caret incase of no selection
	_this_main.getSelectionObject = function() {
		let textObject = new Object();
	    if (window.getSelection) {
	        textObject = window.getSelection();
	    } else if (document.selection && document.selection.createRange ) {
			textObject = document.selection.createRange();
	    }
	    return textObject;
	}

	_this_main.saveSelectionObject = function() {
		if (window.getSelection) {
			let sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				let ranges = [];
				for (let i = 0, len = sel.rangeCount; i < len; ++i) {
				 	ranges.push(sel.getRangeAt(i));
				}
				return ranges;
			}
		} else if (document.selection && document.selection.createRange) {
			return document.selection.createRange();
		}
		return null;
	}

	_this_main.restoreSelectionObject = function(savedSel) {
		if (savedSel) {
			if (window.getSelection) {
				let sel = window.getSelection();
				sel.removeAllRanges();
				for (let i = 0, len = savedSel.length; i < len; ++i) {
				 	sel.addRange(savedSel[i]);
				}
			} else if (document.selection && savedSel.select) {
				savedSel.select();
			}
		}
	}

	_this_main.getTagsInSelection = function(tagName) {
		let selectedTags = [];
		let range, containerEl, links, linkRange;
		if (window.getSelection) {
			let sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				linkRange = document.createRange();
				for (let r = 0; r < sel.rangeCount; ++r) {
					range = sel.getRangeAt(r);
					containerEl = range.commonAncestorContainer;
					if (containerEl.nodeType != 1) {
						containerEl = containerEl.parentNode;
					}
					if (containerEl.nodeName.toLowerCase() == tagName) {
						selectedTags.push(containerEl);
					}
					else {
						links = containerEl.getElementsByTagName(tagName);
						for (let i = 0; i < links.length; ++i) {
							linkRange.selectNodeContents(links[i]);
							if (linkRange.compareBoundaryPoints(range.END_TO_START, range) < 1 && linkRange.compareBoundaryPoints(range.START_TO_END, range) > -1) {
								selectedTags.push(links[i]);
							}
						}
					}
				}
				linkRange.detach();
			}
		} else if (document.selection && document.selection.type != "Control") {
			range = document.selection.createRange();
			containerEl = range.parentElement();
			if (containerEl.nodeName.toLowerCase() == tagName) {
				selectedTags.push(containerEl);
			}
			else {
				links = containerEl.getElementsByTagName(tagName);
				linkRange = document.body.createTextRange();
				for (let i = 0; i < links.length; ++i) {
					linkRange.moveToElementText(links[i]);
					if (linkRange.compareEndPoints("StartToEnd", range) > -1 && linkRange.compareEndPoints("EndToStart", range) < 1) {
						selectedTags.push(links[i]);
					} 
				}
			}
		}
		return selectedTags;
	}

	// get the compressed data for storage of the input taker
	// IMP: NO parameter is needed for this. The above parameter has been used for recursion!
	_this_main.getCompressedData = function(containerDiv=null) {
		let htmlContainerArray = []

		if(containerDiv == null) {
			containerDiv = _this_main.thisContentEditableDiv
			containerDiv = $(containerDiv)
		}
		else if(containerDiv.nodeType == 1) {
			containerDiv = $(containerDiv)
		}

		// check if the container is a custom addition
		if(containerDiv[0] && containerDiv[0].nodeType == 1 && containerDiv.attr('objecttype')) {
			let elObj = {
				'type': 'custom',
				'objecttype': containerDiv.attr('objecttype'),
				'objectdata': containerDiv.attr('objectdata'),
			}
			htmlContainerArray.push(elObj)
			return htmlContainerArray;

		}
		// check if the container is text type object
		else if(containerDiv.nodeType == 3) {
			let elObj = {
				'type': 'text',
				'text': containerDiv.data,
			}
			htmlContainerArray.push(elObj)
			return htmlContainerArray;
		}
		// check if container has no children
		else if(containerDiv.children().length == 0) {
			let containerDivAttributes = _this_main.getElementAttributesObject(containerDiv[0])

			let elObj = {
				'type': 'defined',
				'tag': containerDiv.prop('tagName').toLowerCase(),
				'text': containerDiv.text(),
				// 'style': containerDivStyle,
				'attributes': containerDivAttributes,
			}
			htmlContainerArray.push(elObj)
			return htmlContainerArray;
		}
		
		// else container has children nodes, consider every node including text nodes and elemtn nodes

		let containerDivAttributes = _this_main.getElementAttributesObject(containerDiv[0])
		let elObj = {
			'type': 'defined',
			'tag': containerDiv.prop('tagName').toLowerCase(),
			// 'style': containerDivStyle,
			'attributes': containerDivAttributes,
		}

		let containerContents = containerDiv.contents()
		containerContents.each(function(index, el) {

			if(el.nodeType == 1 || el.nodeType == 3)
			{
				let returnedElForNode = _this_main.getCompressedData(el)
				htmlContainerArray = htmlContainerArray.concat(returnedElForNode)
			}

		});
		elObj['children'] = htmlContainerArray

		return [elObj];
	}

	// pass the DOM ref of the element, NOT the jquery ref
	// returns an object of all attributes of the element
	_this_main.getElementAttributesObject = function(elObj) {
		let containerDivAttributes = {}
		// define all attributes which do not need to be included in the compressed dataset
		let notNeededAttributes = ['id', 'contenteditable', 'contenteditable-family', 'name', 'class']
		// generate attributes object
		for(let i=0; i<elObj.attributes.length; i++) {
			// console.log(elObj.attributes[i].name)
			if( notNeededAttributes.indexOf(elObj.attributes[i].name) == -1 )
				containerDivAttributes[elObj.attributes[i].name] = elObj.attributes[i].value
		}

		return containerDivAttributes
	}

}


/*function gatherAndStoreTextObjectForTheContentEditable(event) {

	let textObject = new Object();

    if (window.getSelection) {
        textObject = window.getSelection();
    } else if (document.selection && document.selection.createRange ) {
		textObject = document.selection.createRange();
    }

    selectedTextObjectSet[$(event.currentTarget).attr('contenteditable-family')] = textObject;

}

function getSelectionObject() {
	let textObject = new Object();
    if (window.getSelection) {
        textObject = window.getSelection();
    } else if (document.selection && document.selection.createRange ) {
		textObject = document.selection.createRange();
    }
    return textObject;
}

function activateActionOfButton(clickedOptionButtonJsref) {
	let textObject = getSelectionObject()
    if(textObject.type == 'Caret') {
		console.log(textObject.getRangeAt(0))
		let rangeCaretObj = textObject.getRangeAt(0);

		let rangeSet = document.createRange()
		// rangeSet.setStart(rangeCaretObj.startContainer, rangeCaretObj.startOffset);
		$('<span/>').html("wer").appendTo(rangeCaretObj.startContainer)
		// rangeSet.selectNode(el)

    } else {

	    let nodeRanges = getSafeRanges(textObject.getRangeAt(0))
	    console.log(nodeRanges)
		if(clickedOptionButtonJsref.attr('child-function') == "bold") {

			for( let i=0; i<nodeRanges.length; i++) {

				let boldEl = document.createElement('span')
				$(boldEl).css('font-weight', '600');
				nodeRanges[i].surroundContents(boldEl);
			}
		}
		
    }

}

// $('.inputBox').on('keydown', function(event) {
// 	console.log(event.keyCode)

// })

function getSafeRanges(dangerous) {
    var a = dangerous.commonAncestorContainer;
    // Starts -- Work inward from the start, selecting the largest safe range
    var s = new Array(0), rs = new Array(0);
    if (dangerous.startContainer != a) 
    {
        for(var i = dangerous.startContainer; i != a; i = i.parentNode) 
        {
            s.push(i)
        }
    }
    if (0 < s.length) for(var i = 0; i < s.length; i++) {
        var xs = document.createRange();
        if (i) {
            xs.setStartAfter(s[i-1]);
            xs.setEndAfter(s[i].lastChild);
        }
        else {
			xs.setStart(s[i], dangerous.startOffset);
			xs.setEndAfter( (s[i].nodeType == Node.TEXT_NODE) ? s[i] : s[i].lastChild);
        }
        rs.push(xs);
    }

    // Ends -- basically the same code reversed
    var e = new Array(0), re = new Array(0);
    if (dangerous.endContainer != a)
        for(var i = dangerous.endContainer; i != a; i = i.parentNode)
            e.push(i);
    if (0 < e.length) for(var i = 0; i < e.length; i++) {
        var xe = document.createRange();
        if (i) {
            xe.setStartBefore(e[i].firstChild);
            xe.setEndBefore(e[i-1]);
        }
        else {
			xe.setStartBefore( (e[i].nodeType == Node.TEXT_NODE) ? e[i] : e[i].firstChild );
			xe.setEnd(e[i], dangerous.endOffset);
        }
        re.unshift(xe);
    }

    // Middle -- the uncaptured middle
    if ((0 < s.length) && (0 < e.length)) {
        var xm = document.createRange();
        xm.setStartAfter(s[s.length - 1]);
        xm.setEndBefore(e[e.length - 1]);
    }
    else {
        return [dangerous];
    }

    // Concat
    rs.push(xm);
    response = rs.concat(re);    

    // Send to Console
    return response;
}*/