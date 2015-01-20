
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


})();
