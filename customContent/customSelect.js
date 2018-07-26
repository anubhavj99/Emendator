$(function() {
	console.log('event.target')
	$('[custom-select="true"]').each(function(index, el){
		console.log('event.targetaasdasda')
		createCustomSelectEl(el)
	})
})


var createCustomSelectEl = function(customSelectEl) {

	customSelectEl = $(customSelectEl)
	
	let originalSelectTag = customSelectEl.find('select')
	// get the selected text
	let selectDisplayBox = $('<div/>').addClass('selectDisplayBox').html(originalSelectTag.find('option:selected').text())
	// append it to the parent element
	customSelectEl.append(selectDisplayBox)

	let selectOptionSet = []
	let selectOptionBox = $('<div/>').addClass('selectOptionBox')
	// append options to the div
	originalSelectTag.find('option').each(function(index, optionEl) {
		selectOptionBox.append($('<div/>').attr('value', optionEl.val()).html(optionEl.text()))
	});
}

$('.selectOptionBox').on('click', 'div', function(event){
	let thisOptionDiv = $(event.target)
	thisOptionDiv.closest('[custom-select]').find('select').val(thisOptionDiv.attr('value'))
})