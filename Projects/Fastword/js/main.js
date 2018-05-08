$('document').ready(function(){
	
	var startLength = '8';	
	$('#passLength').val(startLength);
	

	
	$('#rangeLabel').html(startLength);
	
	var clipboard = new ClipboardJS('.passwordOutput');
	clipboard.on('success', function(e){ 
		e.clearSelection();
	});
	
	$('.passwordOptions').on('input', function () {
		Generate(GetSettings());
		$('#rangeLabel').html($('#passLength').val());
	});
	
	$('#newPassword').on('click', function(){Generate(GetSettings());});
	
	$('.passwordOutput').on('click', function() {
				
		$('#prompt').html("Copied!");
		$('#password').animate({ paddingBottom: "20px", marginTop: "-20px" }, 180 )
               .animate({ paddingBottom: "-20px", marginTop: "20px" }, 180 ).addClass("text-primary");
			   

	});

	$('.passwordOptions').trigger('input');

});

function GetSettings() {

	return {
		length: $('#passLength').val(),
		upper: $('#isUpperCase:checked').val(),
		numeric: $('#isNumeric:checked').val(),
		symbol: $('#isSymbol:checked').val()
	};
}

var password;
var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var upper = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var num = ['0','1','2','3','4','5','6','7','8','9'];
var sym = ['*','!','?','(','[',')',']','.','@','$','%'];
	
function Generate(settings) {
	console.log(settings);
	
	var isUpper = isNum = isSym = false;	
	var chars = alpha;
	
	if(settings.upper !== undefined) {
		chars = chars.concat(upper);
		isUpper = true;
	}
	
	if(settings.numeric !== undefined) {
		chars = chars.concat(num);
		isNum = true;
	}
	
	if(settings.symbol !== undefined) {
		chars = chars.concat(sym);
		isSym = true;
	}

	do {
		password = "";
		for (var i=0; i < settings.length; i++){
			password = password + chars[Math.floor(Math.random()*chars.length)];
		}
	} while (!isValid(isUpper, isNum, isSym));
	
	setPassword(password);
}

function isValid(isUpper, isNum, isSym) {
	console.log('checking');
	if (isUpper && !upper.some(function(v) { return password.indexOf(v) >= 0; })){
		console.log('no upper');
		return false;
	}
	
	if (isNum && !num.some(function(v) { return password.indexOf(v) >= 0; })){
		console.log('no num');
		return false;
	}
	
	if (isSym && !sym.some(function(v) { return password.indexOf(v) >= 0; })){
		console.log('no sym');
		return false;
	}
	console.log('valid');
	return true;
}

function setPassword(password) {
		$('#prompt').html("Click to Copy");
		$('#password').removeClass("text-primary").html(password);
}