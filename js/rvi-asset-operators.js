
var Xflow = Xflow || {};
var XML3D = XML3D || {};
	
(function() {


Xflow.registerOperator("rvi.displaceY", {
    outputs: [
		{type: 'float3', name: 'position'}
	],
    params:  [
        {type: 'float3', source: 'position'},
        {type: 'float', source: 'displacement'}
    ],
    evaluate: function(out_position, in_position, displacement, info)
	{
        for (var i = 0; i < info.iterateCount; i++)
		{
            out_position[3*i  ] = in_position[3*i  ];
            out_position[3*i+1] = in_position[3*i+1] * displacement[0];
            out_position[3*i+2] = in_position[3*i+2];
        }

        return true;
    }
});

(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();

Xflow.registerOperator("rvi.colorGradient", {
    outputs: [
		{type: 'float3', name: 'result'}
	],
    params:  [
        {type: 'float3', source: 'color1'},
        {type: 'float3', source: 'color2'},
        {type: 'float', source: 'gradient'}
    ],
    evaluate: function(result, color1, color2, gradient, info)
	{
		var t = Math.clamp(gradient[0], 0.0, 1.0);
		result[0] = (1-t)*color1[0] + t*color2[0];
		result[1] = (1-t)*color1[1] + t*color2[1];
		result[2] = (1-t)*color1[2] + t*color2[2];
		// console.log(result);
        return true;
    }
});


Xflow.registerOperator("rvi.linearstep", {
    outputs: [
		{type: 'float', name: 'result'}
	],
    params:  [
        {type: 'float', source: 'edge1'},
        {type: 'float', source: 'edge2'},
        {type: 'float', source: 'x'}
    ],
    evaluate: function(result, edge1, edge2, x, info)
	{
	
        for (var i = 0; i < info.iterateCount; i++) {
			var e1 = edge1[i], e2 = edge2[i];
			var t = Math.clamp(x[i], e1, e2);
			result[i] = (t-e1)/(e2-e1);
		}
        return true;
    }
});


Xflow.registerOperator("rvi.hsv2rgb", {
    outputs: [
		{type: 'float3', name: 'rgb'}
	],
    params:  [
        {type: 'float3', source: 'hsv'}
    ],
    evaluate: function(rgb, hsv, info)
	{
		var r, g, b, i, f, p, q, t;
        for (var j = 0; j < info.iterateCount; j++)
		{
			var h = hsv[3*j], s = hsv[3*j+1], v = hsv[3*j+2];
			i = Math.floor(h * 6);
			f = h * 6 - i;
			p = v * (1 - s);
			q = v * (1 - f * s);
			t = v * (1 - (1 - f) * s);
			switch (i % 6) {
				case 0: r = v, g = t, b = p; break;
				case 1: r = q, g = v, b = p; break;
				case 2: r = p, g = v, b = t; break;
				case 3: r = p, g = q, b = v; break;
				case 4: r = t, g = p, b = v; break;
				case 5: r = v, g = p, b = q; break;
			}		
            rgb[3*j  ] = r;
            rgb[3*j+1] = g;
            rgb[3*j+2] = b;
        }
        return true;
    }
});


Xflow.registerOperator("rvi.rgb2hsv", {
    outputs: [
		{type: 'float3', name: 'hsv'}
	],
    params:  [
        {type: 'float3', source: 'rgb'}
    ],
    evaluate: function(hsv, rgb, info)
	{
        for (var i = 0; i < info.iterateCount; i++)
		{
			var r = rgb[3*i], g = rgb[3*i+1], b = rgb[3*i+2];
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, v = max;

			var d = max - min;
			s = max == 0 ? 0 : d / max;

			if (max == min) {
				h = 0; // achromatic
			} else {
				switch (max) {
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
			hsv[3*i  ] = h;
            hsv[3*i+1] = s;
            hsv[3*i+2] = v;
        }
        return true;
    }
});


})();
