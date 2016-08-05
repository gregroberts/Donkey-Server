function hit_api(route, data, method){
	function mkLoad(){
			$('#loader').html('<img src=/static/img/SPINNAZ.gif />');
	}
	function unLoad(){
		$('#loader').html('');
	}
	function fail(jqX, status, error){
		console.log(jqX, status, error);
		alert('API Call to route \''+route+'\' failed with error:\n\n"'+jqX.responseJSON.error+'"');
		unLoad();
	}
		return $.ajax({
			type:method,
			contentType:'application/json',
			url: route,
			data:JSON.stringify(data|| {}),
			async:true,
			beforeSend:mkLoad,
			error:fail,
		}).always(unLoad);
}

function new_query(){
	var mk_new = hit_api('/query/new/',null, 'POST');
	return mk_new;
}

function load_query(uuid, from_where){
		var d =  hit_api('/query/load/' + uuid, {where: from_where}, 'POST');
		return d;
}
