
var XML3D = XML3D || {};

(function() {


var poi_components = ['fw_core', 'fw_xml3d', 'fw_rvi'];

var poi_data = {};
var poi_elem = {};

function json_path(data, path, default_value)
{
	var obj = data;
	var parts = path.split('.');
	//console.log(obj);
	//console.log(parts);

	while (parts.length > 0)
	{
		var prop = parts.shift();
		obj = obj[prop];
		if (typeof(obj) === 'undefined')
			return default_value;
	}
	return obj;
}

function update_poi(elem, data)
{
	var xml3d_config_map = json_path(data, 'fw_xml3d.config.map');
	if (typeof(xml3d_config_map) === 'undefined')
		return;

	var ad = elem.find("assetdata");
	//console.log(ad);

	for (var attr_name in xml3d_config_map) {
		var attr_path = xml3d_config_map[attr_name];
		var attr_value = json_path(data, attr_path, 0);
		
		var at = ad.children("float[name='"+attr_name+"']");
		if (at.length == 0) {
			at = $("<float>").attr("name", attr_name);
			ad.append(at);
		}
		console.log(attr_name);
		console.log(attr_value);

		at.text(attr_value);
	}
}

function add_poi(data)
{
	var xml3d_asset = json_path(data, 'fw_xml3d.asset');
	
	var m = $("<model>")
		.attr("src", xml3d_asset);

	var ad = $("<assetdata>")
		.attr("name", "config");
	m.append(ad);
	
	return m;
}

function resolve_poi_references(data)
{
	for (var comp_name in data) {
		if (!comp_name in poi_components)
			continue;
			
		var comp_data = data[comp_name];
		if (typeof(comp_data) !== 'object') {
			// TODO: validate uri
			var comp_uri = comp_data;
			console.log('Lazy load ' + comp_uri);
			$.getJSON(comp_uri).done(function(ref_data) {
				var comp_data = ref_data[comp_name];
				if (comp_data === 'undefined') return;
				data[comp_name] = comp_data;
			});
		}
	}
}

XML3D.load_poi = function (uri, group)
{
	var req = $.getJSON(uri);

	req.done(function( data ) {
		//console.log(data);
		resolve_poi_references(data);
		node = add_poi(data);
		poi_data[uri] = data;
		poi_elem[uri] = node;
		//console.log(node);
		group.append(node);
	});
}

XML3D.update_poi_data = function ()
{
	console.log("update poi data ...");
	for (var uri in poi_data) {
		var elem = poi_elem[uri];
		var data = poi_data[uri];
		var rvi_uri = json_path(data, 'fw_rvi.source.self');
		
		$.getJSON(rvi_uri).done(function(ref_data) {
			data['fw_rvi'] = ref_data['fw_rvi'];
			poi_data[uri] = data;
			update_poi(elem, data);
		});
	}
};


})();
