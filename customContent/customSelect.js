var createCustomElementCreatorJs = function () {
	let customElementJsList = {}
	let closeAllOther = function(elObj) {
		if(elObj == null) return null;
		
		let thisCustomSel = $(elObj)
		$('[custom-select]').each(function(index, el) {
			let elRef = $(el)
			if(elRef != thisCustomSel) {
				elRef.removeClass('select-active');
			}
		});
	}
	customElementJsList['[custom-select]'] = function(customSelectEl) {

		customSelectEl = $(customSelectEl)
		
		let originalSelectTag = customSelectEl.find('select')
		// get the selected text
		let selectDisplayBox = $('<div/>').addClass('selectDisplayBox').html(originalSelectTag.find('option:selected').text())
		// append it to the parent element
		customSelectEl.append(selectDisplayBox)
		selectDisplayBox.on('click', function(event){
			event.stopPropagation()
			closeAllOther(event.target);
			$(event.target).toggleClass('select-active');
		})

		let selectOptionSet = []
		let selectOptionBox = $('<div/>').addClass('selectOptionBox')
		// append options to the div
		originalSelectTag.find('option').each(function(index, optionEl) {
			optionEl = $(optionEl)
			selectOptionBox.append($('<div/>').attr('value', optionEl.attr('value')).html(optionEl.text()))
		});
		customSelectEl.append(selectOptionBox)
		selectOptionBox.on('click', 'div', function(event){
			let thisOptionDiv = $(event.target)
			thisOptionDiv.closest('[custom-select]').find('select').val(thisOptionDiv.attr('value'))
		})
		$(document).on('click', function(event){
			closeAllOther(null)
		})
	}
	console.log(customElementJsList)
	return customElementJsList

}
if(initializerParamSet.customElement)
{
	_this_main.customElementCreatorJsList = createCustomElementCreatorJs()
	for(let customElCreatorJs in _this_main.customElementCreatorJsList) {
		toolBarAddedElement.find(customElCreatorJs).each(function(index, el) {
			_this_main.customElementCreatorJsList[customElCreatorJs](el)
		});
	}
}