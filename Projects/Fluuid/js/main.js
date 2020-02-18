$('document').ready(function(){
	
	Generate();

	var clipboard = new ClipboardJS('.guidOutput');
	clipboard.on('success', function(e){ 
		e.clearSelection();
	});
	
	$('#newGuid').on('click', function(){Generate();});
	
	$('.guidOutput').on('click', function() {
				
		$('#prompt').html("Copied!");
		$('#guid').animate({ paddingBottom: "20px", marginTop: "-20px" }, 180 )
               .animate({ paddingBottom: "-20px", marginTop: "20px" }, 180 ).addClass("text-success");			   
	});

	$('.guidOptions').trigger('input');

});

function Generate(settings) {
	var guid =  ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	  );
	
	setGuid(guid);
}

function setGuid(guid) {
	$('#prompt').html("Click to Copy");
	$('#guid').removeClass("text-success").html(guid);
}


