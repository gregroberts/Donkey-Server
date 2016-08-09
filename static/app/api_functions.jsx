import jQuery from 'jquery';
var $ = jQuery;



function hit_api(route, data, method){
	console.log(route,data,method);
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

function hydrate_query(uuid, from_where){
		var x=hit_api('/query/load/' + uuid, {where: from_where}, 'POST').then(function(data){
			var x = data.data;
			return data.data;
		})
		return x;
}




export default {hit_api, hydrate_query};
