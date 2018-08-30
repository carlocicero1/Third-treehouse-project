const colorOptions = $('#color');
const designOptions = $('#design');

// Initial elements hidden on load
$('#name').focus();
$('#other-title').hide()
$('.total').hide();
$('#payPal').hide();
$('#bitcoin').hide();
$('.error').hide();
$('#choices').hide();
$('#color').prop('disabled', true);

//if "other" is chosen, displays text field
$('#title').on('change', () => {
	const role = $('#title').val();
	if (role === 'other' ) {
		$('#other-title').show()
	} else {
		$('#other-title').hide();
	}
});

// Hides colors not applicable for the design selected
$('#design').on('change', () => {
	const designType = $('#design').val();
	
	if (designType === 'js puns shirts' || designType === 'js heart shirts') {
		$(`#color optgroup:not([label="${designType}"])`).hide();
		$(`#color optgroup[label="${designType}"]`).show();	
		$('#color').prop('disabled', false);
	} else {
		$('#color').prop('disabled', true);
	}
	$("#color").prop("selectedIndex", 0)
});

//Disables checkboxes for those with conflicting times and calls total cost function
$('.activities input[name="activity"]').on('change', (e) => {
	const $target = $(e.currentTarget);
	const isChecked = $target.prop('checked')
	const time = $target.data('time');
	const day = $target.data('day')

	$(`.activities input[data-day="${day}"][data-time="${time}"]:not(:checked)`).prop('disabled', isChecked)

	calculateTotals();
});

//calculates total cost of events and displays them to the page
const calculateTotals = () => {
	let total = 0;
  
	$('.activities input[name="activity"]').each(function () {
  
	 	if($(this).prop('checked')) {
    	total += $(this).data('cost');
   	}
	})
  
  $('.total').text(`Total: $${total}`);
	$('.total').show()
}

//hides payment methods based on selected choice
$('#payment').on('change', (e) => {
	$target = $(e.currentTarget);

	if ( $($target).val() === 'bitcoin') {
		$('#choices').show();
		$('#bitcoin').show()
		$('#payPal').hide()
		$('#credit-card').hide()
	}
	else if ( $($target).val() === 'paypal') {
		$('#choices').show();
		$('#bitcoin').hide()
		$('#payPal').show()
		$('#credit-card').hide()
	}
	else if ( $($target).val() === 'credit card') {
		$('#choices').show();
		$('#bitcoin').hide()
		$('#payPal').hide()
		$('#credit-card').show()
	}
	else {
		$('#choices').hide();
	}
})

//checks to make sure email is valid through testing pattern
function validateEmail () {
	const email = $('#email').val();
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const isValid = regex.test(email);
	
	$('.error-email')[isValid ? 'hide' : 'show']()

	return isValid;
}

// Validation functions to make sure input parts of the page are formatted properly
function validateName () {
	const name = $('#name').val()
	const isValid = name !== '';
	
	$('.error-name')[isValid ? 'hide' : 'show']()

	return isValid;
}

function validateCheckboxes () {
	const checkboxLength = $('.activities input[name="activity"]:checked').length;
	const isValid = checkboxLength > 0;

	$('.error-activity')[isValid ? 'hide' : 'show']()

	return isValid
}

function validateCreditCard () {
	const cardNum = $('#cc-num').val();
	const zip = $('#zip').val();
	const cvv = $('#cvv').val();
	const payment = $('#payment').val()
	let isValid = true;

	if(payment === 'credit card') {
		if(cardNum.length < 13 || cardNum.length > 16) {
			$('.error-card-num').show();
			isValid = false;
		}
		if(zip.length !== 5) {
			$('.error-zip').show();
			isValid = false;
		}
		if(cvv.length !== 3) {
			$('.error-cvv').show();
			isValid = false;
		}
	} else if (payment === 'bitcoin' || payment === 'paypal'){
		isValid = true;
	} else {
		$('.error-select').show();
		isValid = false;
	}
	return isValid;
}

//Calls functions on click of submit button and displays errors accordingly.
$('#submit').on('click', (e) => {
	const validEmail = validateEmail();
	const validName = validateName();
	const validCheckbox = validateCheckboxes();
	const validCC = validateCreditCard();

	if(!validEmail || !validName || !validCheckbox || !validCC)  {
		e.preventDefault();
	}
})